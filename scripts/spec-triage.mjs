#!/usr/bin/env node
/**
 * spec-triage — decide how much spec a request actually needs, and where new
 * skills/specs belong (harness level vs project level).
 *
 * Contract (stdout, JSON):
 *   { depth: "none" | "md" | "md_html", runtime, research, confidence,
 *     why, source: "jev" | "fallback", override? }
 *   --scope → { scope: "harness" | "project", confidence, why, source, home }
 *
 * depth none    → quick fix, no spec file
 * depth md      → one markdown decision record
 * depth md_html → md plus a human-facing HTML artifact (spec-author + spec-html)
 *
 * scope harness → applies to every project: global agent config, reusable skill,
 *                 template, harness script, routing policy
 * scope project → tied to one codebase/product/stack. The default when unclear.
 *
 * Usage:
 *   node spec-triage.mjs "the request text"
 *   node spec-triage.mjs --file notes.txt --json
 *   node spec-triage.mjs --scope "a skill that reviews database migrations"
 *
 * Never blocks, never throws on Jev failure: falls back to a deterministic
 * heuristic and flags source:"fallback" so the caller can override.
 */

import { readFile } from "node:fs/promises";
import { homedir } from "node:os";
import { join } from "node:path";

const DECISIONS_ENDPOINT = "https://openrouter.ai/api/alpha/decisions";
const MODEL = "typesafe/jev-1.13";
const TIMEOUT_MS = 5000;
const MAX_STATE = 8000;

const AUTH = join(homedir(), ".local/share/opencode/auth.json");

const CRITERIA = {
  depth: {
    none: "A quick fix, rename, version bump, typo, or a change small enough that one session and one sentence of intent cover it. No design decisions worth recording.",
    md: "Real work with a handful of decisions, but a single session can hold it: no cross-module data flow, no multi-phase sequencing, no migration, no heavy architectural context. A markdown decision record is enough.",
    md_html:
      "Needs a human-facing artifact: cross-module or cross-service data flows, integration contracts, state machines, multi-phase sequencing, large refactors, migrations, or context too dense for prose. A reader must be able to understand the shape before reading details.",
  },
  runtime: {
    single_file: "One file or one component changes. No new boundaries.",
    multi_module: "Several modules change and their interfaces must agree.",
    cross_system: "Work crosses a process, service, API, or trust boundary.",
    migration: "Data, schema, config, or dependencies move from one shape to another.",
  },
};

const SCOPE_CRITERIA = {
  harness:
    "Applies to every project on this machine: global agent instructions, a reusable skill, a template, a harness script, or routing policy. It exists because the rule should hold everywhere, not because one repo needs it.",
  project:
    "Tied to one codebase, product, client, stack, or one-off workflow. It may become reusable later, but nothing about it requires applying everywhere. This is the default when the description does not clearly establish a cross-project concern.",
};

const HARNESS_MARKERS = [
  "every project",
  "all projects",
  "cross-project",
  "across projects",
  "global agent",
  "global skill",
  "opencode config",
  "harness",
  "agent instructions",
  "routing policy",
];

const PROJECT_MARKERS = [
  "this repo",
  "this project",
  "our stack",
  "for the app",
  "this codebase",
  "client",
  "one-off",
  "prototype",
];

function parseArgs(argv) {
  const out = { text: "", file: null, json: false, log: false, selfTest: false, heuristic: false, simulate: null, scope: null };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--json") out.json = true;
    else if (a === "--log") out.log = true;
    else if (a === "--self-test") out.selfTest = true;
    else if (a === "--heuristic") out.heuristic = true;
    else if (a === "--simulate") out.simulate = argv[++i];
    else if (a === "--file") out.file = argv[++i];
    else if (a === "--scope") out.scope = argv[++i] ?? "";
    else if (!a.startsWith("--")) out.text += (out.text ? " " : "") + a;
  }
  return out;
}

/** Heuristic scope: project unless a cross-project concern is explicit. */
export function heuristicScope(description) {
  const lower = String(description ?? "").toLowerCase();
  const harness = HARNESS_MARKERS.filter((m) => lower.includes(m));
  const project = PROJECT_MARKERS.filter((m) => lower.includes(m));
  const clearlyGlobal = harness.length >= 2 && project.length === 0;
  return {
    scope: clearlyGlobal ? "harness" : "project",
    confidence: clearlyGlobal ? 0.6 : 0.4,
    why: clearlyGlobal
      ? `Cross-project markers: ${harness.join(", ")}.`
      : `No clear cross-project concern${project.length ? ` (project markers: ${project.join(", ")})` : ""}.`,
    source: "fallback",
    home: clearlyGlobal ? "~/.config/opencode" : "<project>/.opencode",
    override: "Jev unavailable — defaulted to project. Confirm before installing anything globally.",
  };
}

/** The one rule that outranks the judge: a structural runtime cannot be "none". */
function applyRuntimeUpgrade(result) {
  if (result.depth === "none" && ["cross_system", "migration"].includes(result.runtime)) {
    result.depth = "md";
    result.override = "Runtime shape outranks the depth answer: upgraded none → md.";
  }
  return result;
}

async function openRouterKey() {
  if (process.env.OPENROUTER_API_KEY) return process.env.OPENROUTER_API_KEY;
  try {
    const raw = await readFile(AUTH, "utf8");
    return JSON.parse(raw)?.openrouter?.key;
  } catch {
    return undefined;
  }
}

function clampState(state) {
  let s = JSON.stringify(state);
  if (s.length <= MAX_STATE) return s;
  // Drop the cheapest context first, never the request itself.
  const trimmed = { ...state };
  delete trimmed.existingSpecs;
  s = JSON.stringify(trimmed);
  if (s.length <= MAX_STATE) return s;
  return JSON.stringify({
    ...trimmed,
    request: String(state.request ?? "").slice(0, 3500),
    context: String(state.context ?? "").slice(0, 1500),
  });
}

/** Deterministic fallback. Deliberately conservative: never invents an artifact. */
export function heuristic(request) {
  const text = String(request ?? "");
  const lower = text.toLowerCase();
  const len = text.trim().length;

  const quick = /\b(typo|one[- ]liner|rename|bump (the )?version|quick fix|small tweak|copy change|revert)\b/.test(lower);
  const heavySignals = [
    "refactor",
    "migration",
    "migrate",
    "data flow",
    "pipeline",
    "integration",
    "end-to-end",
    "state machine",
    "sequence",
    "across",
    "multi-phase",
    "multi phase",
    "architecture",
    "api contract",
    "schema",
    "plugin",
    "harness",
    "cross-system",
    "workflow",
    "orchestrat",
    "spec system",
    "redesign",
  ];
  const hits = heavySignals.filter((s) => lower.includes(s));

  let depth = "md";
  if (quick && hits.length === 0 && len < 600) depth = "none";
  else if (hits.length >= 2 || (hits.length === 1 && len > 400)) depth = "md_html";

  const runtime = /migrat|schema|data/.test(lower)
    ? "migration"
    : /api|service|server|boundary|integration|plugin/.test(lower)
      ? "cross_system"
      : hits.length >= 1
        ? "multi_module"
        : "single_file";

  return {
    depth,
    runtime,
    research: hits.length > 0 || len > 800,
    confidence: 0.5,
    why: hits.length
      ? `Matched: ${hits.slice(0, 4).join(", ")}. Length ${len}.`
      : `No structural signals; length ${len}.`,
    source: "fallback",
    override: "Jev unavailable or low confidence — confirm depth with the user before authoring.",
  };
}

async function askJev(key, state) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(DECISIONS_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: MODEL,
        state,
        questions: {
          depth: {
            type: "choice",
            instructions: "How much spec does this request actually need before implementation?",
            criteria: CRITERIA.depth,
          },
          runtime: {
            type: "choice",
            instructions: "What kind of runtime shape does the change have?",
            criteria: CRITERIA.runtime,
          },
          research: {
            type: "noul",
            instructions:
              "Does authoring this spec require reading existing code, docs, or external references before any decision can be made?",
            criteria: {
              false: "The request is self-contained; decisions can be made from the request alone.",
              true: "Decisions depend on facts not yet in hand: current code shape, existing conventions, library behavior, or prior art.",
            },
          },
        },
      }),
      signal: controller.signal,
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json?.error?.message ?? `HTTP ${res.status}`);
    return json;
  } finally {
    clearTimeout(timer);
  }
}

async function askJevScope(key, description) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(DECISIONS_ENDPOINT, {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: MODEL,
        state: { description: String(description).slice(0, 4000), cwd: process.cwd() },
        questions: {
          scope: {
            type: "choice",
            instructions:
              "Should this new skill or spec live at harness level (applies to every project) or project level (one codebase)? When it is not clear, it is project level.",
            criteria: { ...SCOPE_CRITERIA, unclear: "The description does not establish a cross-project concern." },
          },
        },
      }),
      signal: controller.signal,
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json?.error?.message ?? `HTTP ${res.status}`);
    return json;
  } finally {
    clearTimeout(timer);
  }
}

function fromJevScope(json, description) {
  const a = json?.answers ?? {};
  const answer = a?.scope?.choice;
  if (!["harness", "project", "unclear"].includes(answer)) throw new Error("unusable scope answer");
  const rawConf = a?.scope?.confidence ?? a?.scope?.probabilities?.[answer];
  const confidence = Number.isFinite(Number(rawConf)) ? Number(Number(rawConf).toFixed(2)) : null;

  let scope = answer === "harness" ? "harness" : "project";
  let override;
  if (answer === "unclear") override = "Judge was not sure — defaulted to project.";
  else if (answer === "harness" && confidence != null && confidence < 0.7)
    override = `Harness at only ${confidence} confidence — defaulted to project; promote it later if it earns it.`;

  return {
    scope,
    confidence,
    why: `Jev: scope=${answer}${confidence != null ? ` (conf ${confidence})` : ""}`,
    source: "jev",
    home: scope === "harness" ? "~/.config/opencode" : "<project>/.opencode",
    cost: json?.usage?.cost ?? null,
    ...(override ? { override } : {}),
  };
}

function fromJev(json, request) {
  const a = json?.answers ?? {};
  const depth = a?.depth?.choice;
  // Confidence comes from the answer itself; a separate score question is redundant.
  const rawConf = a?.depth?.confidence ?? a?.depth?.probabilities?.[depth];
  const confidence = Number(rawConf);
  const valid = ["none", "md", "md_html"];
  if (!valid.includes(depth)) throw new Error("unusable depth answer");

  const result = {
    depth,
    runtime: a?.runtime?.choice ?? "single_file",
    research: Boolean(a?.research?.noul),
    confidence: Number.isFinite(confidence) ? Number(confidence.toFixed(2)) : null,
    why: `Jev: depth=${depth} (${((a?.depth?.probabilities?.[depth] ?? 0) * 100).toFixed(0)}%${
      a?.depth?.confidence != null ? `, conf ${Number(a.depth.confidence).toFixed(2)}` : ""
    }), runtime=${a?.runtime?.choice ?? "?"}`,
    source: "jev",
    cost: json?.usage?.cost ?? null,
  };

  // Low confidence is a signal to slow down, not to guess.
  if (result.confidence != null && result.confidence < 0.6) {
    result.override = "Low Jev confidence — confirm depth with the user before authoring.";
  }
  if (!request?.trim()) result.override = "Empty request — ask what is being specified.";
  return applyRuntimeUpgrade(result);
}

const LEDGER = join(homedir(), ".local/share/opencode/spec-triage.jsonl");
// Keep fixtures next to the script so the tool works from any install location.
const FIXTURES = join(new URL(".", import.meta.url).pathname, "spec-triage-fixtures.json");

async function appendLedger(result) {
  try {
    const { appendFile, mkdir } = await import("node:fs/promises");
    await mkdir(join(homedir(), ".local/share/opencode"), { recursive: true });
    await appendFile(
      LEDGER,
      `${JSON.stringify({ ts: Date.now(), cwd: process.cwd(), ...result })}\n`
    );
  } catch {
    // logging must never break triage
  }
}

async function selfTest(useHeuristic) {
  const raw = await readFile(FIXTURES, "utf8");
  const cases = JSON.parse(raw);
  const key = useHeuristic ? undefined : await openRouterKey();
  let pass = 0;
  for (const c of cases) {
    const expected = useHeuristic ? (c.heuristicExpect ?? c.expect) : c.expect;
    let got;
    try {
      got = key
        ? fromJev(await askJev(key, JSON.parse(clampState({ request: c.request }))), c.request)
        : heuristic(c.request);
    } catch (err) {
      got = heuristic(c.request);
      got.why += ` (Jev: ${String(err?.message ?? err).slice(0, 80)})`;
    }
    const ok = got.depth === expected;
    if (ok) pass++;
    process.stdout.write(
      `${ok ? "PASS" : "FAIL"}  ${c.id.padEnd(4)} expect=${expected.padEnd(8)} got=${String(got.depth).padEnd(8)} ${got.why.slice(0, 70)}\n`
    );
  }
  process.stdout.write(`\n${pass}/${cases.length} fixtures matched${useHeuristic ? " (heuristic)" : ""}\n`);
  process.exitCode = pass === cases.length ? 0 : 1;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  if (args.selfTest) {
    await selfTest(args.heuristic);
    return;
  }

  if (args.simulate) {
    // Deterministic proof for R17: exercise the upgrade rule without the judge.
    const [depth, runtime] = String(args.simulate).split(",");
    const simulated = applyRuntimeUpgrade({
      depth: depth?.trim() || "none",
      runtime: runtime?.trim() || "single_file",
      research: false,
      confidence: null,
      why: "simulated",
      source: "simulate",
    });
    process.stdout.write(`${JSON.stringify(simulated, null, args.json ? 2 : 0)}\n`);
    return;
  }

  if (args.scope !== null) {
    const description = String(args.scope || args.text || "").trim();
    let result;
    const key = await openRouterKey();
    if (!key) {
      result = heuristicScope(description);
    } else {
      try {
        result = fromJevScope(await askJevScope(key, description), description);
      } catch (err) {
        result = heuristicScope(description);
        result.why += ` (Jev: ${String(err?.message ?? err).slice(0, 120)})`;
      }
    }
    if (!description) result.override = "Empty description — ask what the skill or spec covers.";

    if (args.log) await appendLedger({ kind: "scope", ...result });
    if (args.json) {
      process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
      return;
    }
    const lines = [
      `scope      ${result.scope}${result.override ? "   ⚠ confirm" : ""}`,
      `home       ${result.home}`,
      `source     ${result.source}${result.confidence != null ? ` · confidence ${result.confidence}` : ""}`,
      `why        ${result.why}`,
    ];
    if (result.override) lines.push(`override   ${result.override}`);
    process.stdout.write(`${lines.join("\n")}\n`);
    return;
  }

  let text = args.text;
  if (args.file) {
    try {
      text += `\n\n${await readFile(args.file, "utf8")}`;
    } catch (err) {
      text += `\n\n(file unreadable: ${err.message})`;
    }
  }

  const state = JSON.parse(
    clampState({
      request: text.slice(0, 4000),
      cwd: process.cwd(),
      note: "Decide how much spec is warranted. Bias toward md over md_html; never invent work.",
    })
  );

  let result;
  const key = await openRouterKey();
  if (!key) {
    result = heuristic(text);
  } else {
    try {
      result = fromJev(await askJev(key, state), text);
    } catch (err) {
      result = heuristic(text);
      result.why += ` (Jev: ${String(err?.message ?? err).slice(0, 120)})`;
    }
  }

  if (args.log) await appendLedger(result);

  if (args.json) {
    process.stdout.write(`${JSON.stringify(result, null, 2)}\n`);
    return;
  }

  const lines = [
    `depth      ${result.depth}${result.override ? "   ⚠ confirm" : ""}`,
    `runtime    ${result.runtime} · research ${result.research ? "yes" : "no"}`,
    `source     ${result.source}${result.confidence != null ? ` · confidence ${result.confidence}` : ""}`,
    `why        ${result.why}`,
  ];
  if (result.override) lines.push(`override   ${result.override}`);
  process.stdout.write(`${lines.join("\n")}\n`);
}

main().catch((err) => {
  // Last-resort: never fail the caller.
  process.stdout.write(
    `${JSON.stringify({
      depth: "md",
      runtime: "single_file",
      research: false,
      confidence: null,
      why: `triage crashed: ${String(err?.message ?? err).slice(0, 200)}`,
      source: "fallback",
      override: "Triage crashed — default to md and confirm depth with the user.",
    })}\n`
  );
});
