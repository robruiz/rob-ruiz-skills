# Spec Authoring System — spec v1.0 (2026-11-10)

> Depth: `md_html` · Triage: `jev` (0.91) · Status: `draft` · Owner: Rob
> Seams: 3 — `spec-triage.mjs` CLI, the R-ID set across md/html/eval, and the packet→artifact render boundary.

## Problem

This machine writes specs constantly and had no single owner for them. Three skills each held a piece (`requirements` for syntax, `fidelity` for UI gates, `acceptance-eval` for close-out), one subagent (`architect`) wrote markdown nobody rendered, and a project-local skill defined the opposite rule about which format is canonical. The result was predictable: 6 of 46 spec files in the largest corpus carried a requirement list, 8 basenames existed as both `.md` and `.html`, and a hand-maintained tracker admitted a dozen rows of `needs-triage`.

The deeper problem is not volume. It is that a spec nobody can read, or a spec built on unverified assumptions, produces implementation that follows it. Garbage in, garbage out.

Four gaps survived the first draft of this document: open questions were prose instead of a checklist, data flows were described instead of shown, mockups lived outside the document that referenced them, and readiness was an opinion rather than a score.

## Solution

One spine (`spec-author`) judges how much spec is warranted before any file exists, keeps the reasoning on a capable model, and delegates only markup to a cheap one. A second skill (`spec-html`) owns what a readable artifact is. `requirements` supplies the contract and now binds each requirement to its proof. The canonical artifact is markdown; HTML is a view rendered from a render packet, so reasoning can never enter through the back door.

Depth is judged per request, in three values, because the two-value version failed in both directions: HTML was written for changes that needed a sentence, and architectural work stayed trapped in markdown nobody read.

Four format rules close the comprehension gap. Open questions are a checklist, so unresolved items cannot hide in a paragraph. Any spec involving data carries a worked example with real values. When mockups exist, the artifact embeds the region that demonstrates the requirement. And a spec is reviewed adversarially against six scored dimensions before it is rendered or implemented.

## How it runs, step by step

```
/spec <request>  ·  or a spec-author trigger  ·  or an explicit triage call
        │
        ▼
1  node ~/.config/opencode/scripts/spec-triage.mjs "<request>" [--json] [--log]
        │   Jev (typesafe/jev-1.13, ~200-480ms, ~$0.00003)
        │   → { depth, runtime, research, confidence, why, source, cost, override? }
        │
        ├── source:"fallback" | override | confidence<0.6 → STOP, confirm with the user
        │
        ▼
2  depth = none  →  state the change in 2-3 sentences, implement, no file
   depth = md    →  write specs/<slug>/spec.md, no HTML
   depth = md_html → write the md, then continue

   The same judge answers a second question for new skills and harness work:
   `spec-triage.mjs --scope "<what it does>"` → harness | project.
   Anything not clearly harness (unclear, or confidence < 0.7) is project.
        │
        ▼
3  Reasoning (capable model, never delegated)
     ground in real code (graft first) → gather evidence → name seams → decide
        │
        ▼
4  Canonical markdown: Problem / Solution / How we prove it / Requirements /
   Data examples / Mockups / Decisions / Out of scope / Open questions (checklist) / Risks
        │
        ▼
5  Adversarial review: critic subagent, fresh context, six dimensions scored 0-5,
   verdict SHIP / REVISE / BLOCK → scorecard recorded in the md
        │   BLOCK → back to 3. REVISE → fix named gaps, re-score changed parts only.
        ▼
6  (md_html only) emit packet.md → subagent(spec-render) → specs/<slug>/spec.html
        │   cheap model: MiMo V2.6 Flash, render-only, no new facts
        │   the packet carries the diagrams, the real data examples, the mockup regions,
        │   the scorecard, and the open-question checklist
        ▼
7  Review the artifact against spec-html self-check → fix the packet, re-render
   (never hand-patch the HTML)
        │
        ▼
8  Implement against the md → acceptance-eval consumes R-IDs → 04-eval.html
        │
        ▼
9  Deviations amend the md with a dated note → the HTML is regenerated, not edited
```

The full component map:

| Piece | Path | Owns |
|---|---|---|
| Routing | `~/.config/opencode/AGENTS.md` | when a spec is triggered at all |
| Entry | `~/.config/opencode/command/spec.md` | `/spec` → triage → skill |
| Judge | `~/.config/opencode/scripts/spec-triage.mjs` | depth, runtime, research flag, confidence; `--scope` for harness vs project |
| Judge fixtures | `~/.config/opencode/scripts/spec-triage-fixtures.json` | four expected verdicts; `--self-test` runs them |
| Judge ledger | `~/.local/share/opencode/spec-triage.jsonl` | one line per `--log` call, the proof for R3 |
| Judge model | `typesafe/jev-1.13` via OpenRouter decisions | the verdict itself |
| Spine | `~/.config/opencode/skill/spec-author/SKILL.md` | reasoning, md structure, delegation rules, ship checklist |
| Artifact protocol | `~/.config/opencode/skill/spec-html/SKILL.md` | triad, layout vocabulary, diagrams, data, mockups, scorecard, budgets |
| Contract | `~/.config/opencode/skill/requirements/SKILL.md` | R-IDs, check binding, NFR coverage |
| Review | `~/.config/opencode/skill/spec-review/SKILL.md` + `critic` | six-dimensional scorecard, SHIP/REVISE/BLOCK |
| Skill scope | `~/.config/opencode/skill/skill-author/SKILL.md` | scope triage before creating or promoting a skill |
| Renderer | agent `spec-render` (opencode.json) | HTML/CSS/SVG only |
| Starting point | `~/.config/opencode/spec-templates/spec.md`, `spec.html` | structure, chrome, checklist, data, mockup, scorecard blocks |
| Escaped defects | `~/.config/opencode/skill/acceptance-eval/misses.md` | check classes that previously slipped through |
| Proof | `skill/acceptance-eval/SKILL.md` + `04-eval.html` | verdict per R-ID |

## Proof formats

"Proof: review" is only honest when the review has a shape. These are the five accepted shapes:

| Method | What counts as evidence |
|---|---|
| `command` | the exact command plus expected output or exit code; the command must be re-runnable by someone else |
| `test` | test file path and test name, named after the R-ID |
| `vision` | screenshot path under `specs/<slug>/evidence/`, plus the one thing the reader should see |
| `walkthrough` | numbered steps and the artifact state after each |
| `review` | a checklist item in the md's Review section, signed with reviewer and date, citing the specific line or section inspected |

An unsigned review is a FAIL, not a PASS.

## Render packet (schema)

Always a file at `specs/<slug>/packet.md`. Fields, in this order:

```
spec.md path · header facts · intro triad (3 verbatim sentences) · 30-second read (≤5 bullets)
coverage IDs · diagrams[] {id, kind, caption, boundary, nodes, edges}
data examples[] {label, direction, payload, caption}
mockups[] {path|fragment, region, mapsTo[], caption}
review {scores[], total, verdict, reviewer, date, findings[]}
open questions[] {id, text, default, blocks, resolved?}
layout plan · IDs to badge · language rules · output path
```

Required: every field above is present, even when empty (`mockups: none`). A renderer cannot be verified against an unspecified input.

## Tuning constants

| Constant | Value | Why |
|---|---|---|
| Confidence floor | 0.6 | observed band where Jev's depth answer flips between md and md_html on the same text |
| Jev timeout | 5s | about 10× the observed p95 (480ms); beyond that the fallback is cheaper than waiting |
| Artifact size | ~150 KB | keeps a double-click open instant and forces detail into the md |
| Review rounds | 2 | one to find gaps, one to confirm the fix; a third means the decision is wrong, not the wording |
| Scope promotion threshold | 0.7 | below this the judge is guessing, and a misfit harness skill costs more than a late promotion |

## Skill dependencies

What loads what, and who is allowed to write which artifact:

| From | To | Kind |
|---|---|---|
| AGENTS.md routing | `spec-author` | required entry |
| `/spec` command | `spec-triage.mjs` → `spec-author` | required entry |
| `spec-author` | `requirements` | required for the contract |
| `spec-author` | `graft` | required when a `graft/` graph exists |
| `spec-author` | `spec-html` | only when depth is `md_html` |
| `spec-author` | `spec-review` | required before render and before code |
| `spec-review` | `critic` | fresh-context adversarial pass |
| `spec-review` | `spec.md` | writes the scorecard and findings |
| `skill-author` | `spec-triage.mjs --scope` | decides harness vs project home |
| `skill-author` | `AGENTS.md` | routing row only when the skill is a seat |
| `spec-author` | agent `spec-render` | only for markup; packet in, file out |
| `spec-html` | `spec-templates/spec.html` | copy, then delete unused blocks |
| `fidelity` | `spec-author` | UI builds: spec content comes from the spine, gates stay in fidelity |
| `acceptance-eval` | `requirements` | reads R-IDs; cannot eval without them |
| `test-writing` | `requirements` | locks `must` R-IDs into named tests |
| `worklog` | `spec-author` | spec path + depth recorded per task |
| `self-improvement` | harness-changelog | one entry per change to any of the above |

Not loaded by this system, and deliberately so: `impeccable` and `vision-loop` (design and visual verification, separate concerns), `architect` (a producer of specs, not a consumer of this protocol).
## Artifacts inform skills, skills inform artifacts

Two loops, and they are not symmetrical.

**Skills → artifacts.** Routing decides whether a spec exists. Triage decides depth. `requirements` decides the shape of every promise. `spec-html` decides layout, diagram choice, and summarization. The template supplies the chrome. The packet decides what the renderer may touch.

**Artifacts → skills.** This direction is what keeps the system honest, and it is currently the weaker one:

- A failed R in `04-eval.html` amends the md (dated note), which forces the HTML to be regenerated, which is a signal that the original decision was thin.
- An escaped defect lands in `misses.md`, which `acceptance-eval` reads at preflight, which changes the next eval's checks.
- A spec that triaged `md` but later needed an artifact is calibration evidence for Jev's thresholds.
- Every change to the skills themselves gets one line in `harness-changelog.md`, which `self-improvement` measures later.

## Requirements (when/if/then)

```
R1 [must] — Depth is judged, not assumed
  When a spec request arrives through /spec, a spec-author trigger, or a direct triage call
  Then spec-triage.mjs returns exactly one of none|md|md_html, plus source, confidence, and any override
  Proof: command — `node ~/.config/opencode/scripts/spec-triage.mjs --self-test` → 4/4 fixtures, exit 0

R2 [must] — Triage never blocks authoring
  When Jev is unauthenticated, times out at 5s, or returns an unusable answer
  Then the script exits 0 with source:"fallback", a heuristic depth, and an override note
  Proof: command — run with a bogus API key

R3 [must] — Ambiguous depth becomes a human decision
  When triage reports source:"fallback", any override, or confidence below 0.6
  Then the agent asks via the question tool before creating a spec file, and every call is recorded with --log
  Proof: command — `~/.local/share/opencode/spec-triage.jsonl` holds one line per call (written by this spec's own run); /spec and spec-author both pass --log

R4 [must] — HTML only for structural work
  When depth is none or md
  Then no HTML artifact is created
  If depth is md_html
  Then exactly one single-file artifact sits beside the md
  Proof: command — directory listing after each branch

R5 [must] — Reasoning is not delegated down
  When any spec is authored
  Then problem, solution, decisions, seams, and diagram semantics are produced by the capable authoring model, and the renderer receives them read-only in a packet
  Proof: review — packet diff versus artifact

R6 [must] — Markdown is canonical, HTML is a view
  Always
  Then every fact, number, path, section, and requirement in the artifact exists in the md
  Proof: review — section and claim comparison; any HTML-only fact is a defect

R7 [must] — Requirements are observable and bound
  When the md is written
  Then each R has when/if/then, a priority, and a check row naming method and evidence target
  Proof: review — a requirement without a method is rejected before render

R8 [must] — R-IDs stay stable across artifacts
  When rendering and when running acceptance-eval
  Then the same R-IDs, count, and meaning appear in md, html, and 04-eval
  Proof: review — ID set comparison

R9 [must] — The renderer invents nothing
  When spec-render receives a packet
  Then it copies the template, fills only packet content, draws diagrams only from packet nodes and edges, and reports omissions instead of filling gaps
  Proof: review — rendered output versus packet, plus its own omission list

R10 [must] — The artifact stays cheap to open
  When HTML is generated
  Then it is one file under ~150 KB, inline CSS and SVG, no external dependencies, opened by double-click
  Proof: command — file size; open in browser

R11 [should] — The first viewport answers the triad
  When a reader opens the artifact
  Then the first screen states what it solves, how, and how it is proven, followed by a 30-second read
  Proof: vision — screenshot at 1280 and 390

R12 [should] — The downstream loop closes
  When implementation completes
  Then acceptance-eval reports per-R verdicts in 04-eval.html, and any deviation amends the md with a dated note
  Proof: walkthrough — one real spec end to end (this document is the fixture)

R13 [must] — Open questions are a checklist
  When a spec contains open questions
  Then they render as a checklist with one box per question, each carrying a proposed default and a blocks flag; resolved items are checked with the answer inline
  Proof: review — no prose-style question list survives in md or html

R14 [must] — Data flows carry a worked example
  When a spec involves a data flow, payload, record, or state change
  Then it contains at least one example with actual values, labeled by direction (request/response/before/after/record)
  Proof: review — the example exists and its values match the code or a real run

R15 [must] — Mockups are embedded, not cited
  When mockups exist for the work
  Then the artifact embeds the region that demonstrates the requirement, captioned with what it settles and the R-IDs it demonstrates
  Proof: vision — the artifact shows the region, and the caption names the IDs

R16 [must] — Review is scored, not asserted
  When a spec is reviewed before implementation
  Then six dimensions (context completeness, requirement testability, readiness, implementation confidence, risk coverage, decision traceability) are scored 0-5 against the anchors in spec-review, with cited evidence, a total out of 30, and a SHIP / REVISE / BLOCK verdict; any dimension at 2 or below blocks SHIP
  Proof: review — scorecard present in md, signed with reviewer and date; verdict consistent with the scores

R17 [must] — A runtime upgrade cannot be hidden by a "none" verdict
  When triage answers depth:none but runtime is cross_system or migration
  Then the script upgrades depth to md and records the reason in override
  Proof: command — `node ~/.config/opencode/scripts/spec-triage.mjs --simulate none,cross_system` → depth md with the upgrade override

R18 [must] — New skills and harness work get a scope verdict, defaulting to project
  When a skill is created or a spec changes harness tooling
  Then `spec-triage.mjs --scope` returns harness or project with confidence, and anything not clearly harness (answer unclear, confidence below 0.7, or judge unavailable) resolves to project
  Proof: command — `--scope` on a cross-project description returns harness; a repo-specific or vague one returns project
```

## Data examples

The triage contract, as actual output from a real run (dark-mode toggle request, 2026-11-10):

```
$ node ~/.config/opencode/scripts/spec-triage.mjs --json "Add a dark mode toggle ..."
{
  "depth": "md",
  "runtime": "single_file",
  "research": true,
  "confidence": 0.91,
  "why": "Jev: depth=md (94%, conf 0.91), runtime=single_file",
  "source": "jev",
  "cost": 0.000034104
}
```

What this proves: the verdict is one of three values, carries its own evidence, and names whether a human confirmation is required. A fallback run returns the same shape with `source:"fallback"` and an `override` string.

## Mockups

None exist for this document. R15 is therefore unexercised here, and this line is the honest form of that: the requirement applies when a mockup exists, not when an author wishes one did.

## Decisions

1. **Triage is a standalone script, not a plugin hook.** Chose an explicit CLI over hooking the message path. Because a spec-time judgment should be invocable, loggable, and testable in isolation, and the message path must never be slowed or broken by a judge. Consequence: the agent must remember to call it, which is why `/spec` and an AGENTS.md row exist.
2. **Jev first, heuristic second.** Chose the calibrated judge over a keyword heuristic. Because it costs ~$0.00003 and 200-480ms, and it correctly separated typo→none, feature→md, refactor→md_html on real calls. The heuristic remains as a never-block fallback. Consequence: two verdict paths, so `source` and `override` are part of the output contract.
3. **Three depth values, not two.** Chose `none` as a first-class verdict. Because the failure mode was spec theater: artifacts for changes that needed a sentence. Consequence: an agent may now decline to write a spec, and must say so.
4. **Capability split at a packet boundary.** Chose to keep reasoning on the capable model and hand only markup down. Because HTML burns tokens without improving judgment, and a cheap model filling gaps is exactly the garbage-in failure. Consequence: a handoff document exists and must be complete enough for a dumb renderer.
5. **Markdown canonical, HTML rendered.** Chose one source of truth. Because 8 duplicated basenames proved that two editable sources drift, and the project-local `spec-docs` skill already assumed md-canonical. Consequence: the HTML is disposable; editing it is always a defect.
6. **Template as a starting point, not a generator.** Chose copy-then-edit over code generation. Because the renderer is a model, not a build step, and the template needs to be readable by both. Consequence: chrome consistency depends on the renderer actually copying it, which R9 checks.
7. **Renderer is a pinned subagent, not a CLI.** Chose agent `spec-render` on MiMo V2.6 Flash at temperature 0.1. Because it needs write access and isolation, and the seat can be re-pointed with a one-line model change if quality disappoints. Consequence: this document is its first real use; quality is unproven.
8. **No enforcement layer.** Chose routing rules over a gate that refuses writes. Because a hard gate on spec creation would break exploratory work and the harness has no write-hook today. Consequence: nothing structurally prevents a spec without triage; only the routing table and the skill do.
9. **Open questions are a checklist, not a paragraph.** Chose checkbox syntax in both md and html. Because an unchecked box is visibly unresolved, while an unresolved question buried in prose reads as answered. Consequence: every question carries a default and a blocks flag, which is more writing per question.
10. **Show real data instead of describing it.** Chose worked examples with actual values over schema prose. Because an example is falsifiable: it can be checked against a real run, while a description can be plausible and wrong. Consequence: specs involving data take longer to write, and invented values must be labeled as illustrative.
11. **Embed mockup regions.** Chose inline fragments over paths to mockup files. Because the reader is already reading the document; a path forces a context switch and the correlation is lost. Consequence: the renderer needs the real markup, so the packet must carry the fragment, and file size has to stay under budget.
12. **Score readiness on six dimensions.** Chose a rubric with a hard floor over a narrative verdict. Because "looks ready" cannot be falsified, while a 2/5 on requirement testability blocks shipping regardless of the total. Consequence: a review round costs a critic pass, and scores can inflate if the same context reviews its own draft — hence the fresh-context rule.
13. **Runtime shape outranks a "none" verdict.** Chose an automatic upgrade from `none` to `md` when triage reports `cross_system` or `migration`. Because a one-line framing should not be able to hide a boundary-crossing change. Consequence: the override string is part of the contract, and the caller must surface it rather than swallow it.
14. **Packet is always a file.** Chose `specs/<slug>/packet.md` over an inline prompt. Because the render boundary is a seam: it has to be inspectable after the fact to prove the renderer invented nothing. Consequence: one more file per `md_html` spec.
15. **Scope is judged, defaulting to project.** Chose a second judge question over a blanket "skills are global" rule. Because a harness skill loads everywhere and fits nowhere, while a project skill can be promoted later. Unclear means project. Consequence: one script serves both judgments and one ledger records both; promotion is a deliberate act, not an accident.

## Out of scope

- **Automated md↔html drift detection.** The old `spec-docs` skill had a heading-count check; this system relies on review. Refused for now because it needs a parser, not a paragraph.
- **Spec lifecycle and generated index.** Status transitions, supersession, and a generated `SPEC_TRACKER` are not built. The rot is named, not solved.
- **Enforcement.** No hook blocks a spec written without triage.
- **Registering `plugins/jev-shadow.ts`.** It exists and is dormant; per-message routing signals are a different decision from spec triage.
- **Deck / slides mode.** A presentation renderer is a separate artifact family.
- **Backend/API template variant.** `spec.html` is generic. An API-contract-first variant is not written.
- **Replacing `fidelity`'s UI gates.** Mockups remain the contract for visual work; this system only supplies their spec content.

## Open questions

All resolved 2026-11-10 by explicit decision; defaults accepted as written.

- [x] Q1 Should triage know about visual deliverables? — resolved: no, depth judges spec complexity only
- [x] Q2 Should `md` depth also emit a one-screen HTML summary? — resolved: no, that is how HTML crept in before
- [x] Q3 For harness work, do specs live in `~/.config/opencode/specs/` or the project? — resolved: config repo for harness, project root for product
- [x] Q4 Should the render packet be a file or inline? — resolved: always a file at `specs/<slug>/packet.md`
- [x] Q5 Should triage be enforced by a pre-write hook? — resolved: not yet, measure misuse for ~10 specs first
- [x] Q6 Should review scores gate implementation mechanically? — resolved: advisory for `md`, blocking for `md_html`

## Review

Round 1 — critic, fresh context, 2026-11-10. Verdict **BLOCK**. Findings F1-F13 answered below; round 2 re-scores only the dimensions that the fixes touched.

| Dimension | Round 1 | Round 2 | Evidence |
|---|---|---|---|
| Context completeness | 4/5 | 4/5 | problem framed with measured evidence (6/46 requirement lists, 8 duplicate basenames); component table; real payload. Deducted: no target metric, legacy corpus fate undefined |
| Requirement testability | 2/5 | 3/5 | proof formats defined and R1 passes 4/4, but R3's ledger was opt-in and R17's proof named a fixture that did not exist |
| Readiness | 2/5 | 4/5 | packet schema landed with required-even-when-empty; Q4 resolved; fixtures and runner exist; paths absolute |
| Implementation confidence | 2/5 | 3/5 | seams enumerated, renderer fallback stated, upgrade branch real; still four triage samples and an unproven renderer |
| Risk coverage | 3/5 | 4/5 | loop bound, second-BLOCK escalation, critic-unavailable path; silent absence of R3 enforcement unstated |
| Decision traceability | 4/5 | 5/5 | 14 decisions, each with alternative, grounded reason, consequence |
| **Total** | **17/30** | **23/30** | **REVISE** |

Findings and dispositions:

- F1 blocker — Review said "not yet scored" while R16 required a score before render → **fixed** (this section).
- F2 blocker — `review` proofs had no defined shape → **fixed** (Proof formats table; unsigned review is a FAIL).
- F3 blocker — R3 cited a run log that did not exist → **fixed** (`--log` writes `spec-triage.jsonl`; R3 now names it).
- F4 major — packet contract undefined, Q4 reopened it → **fixed** (Render packet schema; Q4 resolved to always-a-file).
- F5 major — scorecard had no anchors → **fixed** (anchors added to `spec-review`; R16 cites them).
- F6 major — the `none`→`md` runtime upgrade lived only in Risks → **fixed** (R17 + D13).
- F7 major — review loop had no exit → **fixed** (max 2 rounds in Tuning constants and `spec-review`).
- F8 major — `surface` returned but never consumed → **fixed** (removed from the judge contract and the script).
- F9 major — `misses.md` missing from the component map → **fixed**.
- F10 minor — mixed path roots → **fixed** (all paths absolute from `~/.config/opencode/`).
- F11 minor — magic numbers → **fixed** (Tuning constants with a why each).
- F12 minor — "Seams: 3" never enumerated → **fixed** (named in the header).
- F13 minor — fixtures had no home or runner → **fixed** (`spec-triage-fixtures.json` + `--self-test`, 4/4 passing).

Round 2 findings, fixed after the loop closed (no third scoring pass, per the 2-round bound):

- F14 major — R3's ledger was opt-in and no caller passed `--log` → **fixed** (`--log` is now mandatory in `/spec` step 1 and in `spec-author` step 0; the ledger file exists and was written by this spec's own triage run).
- F15 major — R17's proof named a fixture that could not exercise the upgrade → **fixed** (deterministic `--simulate none,cross_system` path; R17 cites it).
- F16 minor — `spec-review` contradicted itself on the round cap (1 vs 2) → **fixed** (single statement: 2 rounds, then escalate).
- F17 minor — renderer identity conflicted: `/spec` said `medium`, the spec said `spec-render` → **fixed** (`spec-render` everywhere; `/spec` also mandates a written packet).

Post-review changes (scope judgment, `skill-author`, six resolved questions) are additive and were not re-scored; the 23/30 applies to the reviewed draft. The scope rule is the one change that alters behavior rather than wording, and it follows the user's stated preference directly: unclear → project.

## Risks

- **Renderer quality is unproven.** MiMo has never rendered a spec. If it produces weak layout, the fallback is `medium` after two attempts; if that fails, the seat is wrong, not the skill.
- **Triage is calibrated on four samples.** Confidence 0.91 is the model's, not evidence. The real test is the next ten specs.
- **"Reasoning stays up" is a prompt rule, not a mechanism.** A rushed agent can still delegate reasoning. R5 is checked by review.
- **No drift check.** R6 is only as good as the reviewer.
- **Depth can be gamed by framing.** A request phrased as "quick" may still be architectural; `runtime` upgrades `none`→`md`, but not `md`→`md_html`.
- **Scores can inflate.** A reviewer that likes the author, or shares its context, will score 5s. The fresh-context rule and the cited-evidence requirement are the only defenses; neither is mechanized.
- **The reviewer can be unavailable.** If `critic` cannot run (provider error, privacy block), the loop must not silently pass: the spec is marked `unreviewed` and cannot reach `md_html` render without the user's explicit word.
- **Scope promotion is manual and forgettable.** A project skill that becomes useful everywhere will stay in one repo until someone re-runs `--scope` and moves it. Nothing detects reuse.
