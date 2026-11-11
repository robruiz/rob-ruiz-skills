---
name: spec-author
description: Use when writing or updating a spec, brief, feature plan, architecture doc, refactor plan, or decision record — for any non-trivial change. Judges how much spec is warranted (Jev triage), does the reasoning with a capable model, then delegates HTML rendering to a cheap model. Trigger keywords: spec, write a spec, brief, feature spec, plan this, architecture doc, decision record, refactor plan, spec update.
---

# Spec author — judge depth, reason expensively, render cheaply

A spec is a **decision record**, not a writing exercise. Its job: let a fresh session (or a human next week) build the thing without re-deriving the reasoning. Every rule below exists to stop garbage-in.

Load `requirements` for the R-ID syntax, and `spec-html` whenever the depth is `md_html`.

## Step 0 — Judge depth before writing anything (mandatory)

Never assume a spec needs an HTML twin. Run triage:

```bash
node ~/.config/opencode/scripts/spec-triage.mjs --log "<the request, plus any context you already have>"
```

Read the output:

| `depth` | Do |
|---|---|
| `none` | No spec file. State the change in 2-3 sentences, then implement. Say out loud that triage chose no spec. |
| `md` | One markdown decision record (`specs/<slug>/spec.md` or `docs/specs/<SLUG>_SPEC.md`). No HTML. |
| `md_html` | Markdown decision record **plus** an HTML artifact, authored per `spec-html`. |

Rules:
- `source: fallback` or any `override` line → confirm depth with the user via the `question` tool before authoring. Never silently upgrade or downgrade.
- The user's instruction beats triage. Triage only decides the default; say which one you followed.
- **`md_html` is for comprehension, not for agents.** It is warranted when the reader must see shape: data flows, integration contracts, state machines, multi-phase sequencing, large refactors, migrations, dense architectural context. It is *not* a reward for a long spec.

## Step 1 — Reason with a capable model, before any prose

This step must not be delegated to a cheaper model. Its opinions are for critique, not authorship of the reasoning.

Do, in this order:

1. **Ground it.** Read the real code, conventions, and adjacent modules. If the repo provides a code graph or index, use it instead of grep. Read prior specs in the area so you do not duplicate or contradict.
2. **Collect evidence for every claim a decision rests on.** External library behavior, current file shape, existing pattern, prior attempt. Unverified claims become **open questions**, never assertions.
3. **Name the seams before the prose.** Where will this be tested? Prefer existing seams; use the highest one; the ideal count is one. Write them down and confirm with the user when they are not obvious. TDD and review both key off these later.
4. **Decide, then record.** Opinions formed while writing belong in open questions, not silently in the decisions list.

**If the research cannot be done** (repo unreadable, docs unavailable), say so inside the spec as a named risk. A spec that pretends to know is worse than none.

## Step 2 — Write the canonical markdown
Structure, in this order. Keep each section short; specification quality is not length.

```markdown
# <Title> — spec v<n> (<date>)

## Problem
What the user/system actually lacks, from the user's point of view. No solution language.

## Solution
The approach in 3-5 sentences: the shape, the boundary, why this shape.

## How we prove it
Seams + check plan, agreed before code. Table of R-ID → method (test/command/walkthrough/vision/review) → evidence target.

## Requirements (when/if/then)
Per the `requirements` skill. R-IDs are stable forever.

## Data examples
Only when a data flow, payload, record shape, or state is involved. Show the real thing, not a description of it:
one worked example, actual values, labeled request → transformation → result, or before → after. Fixtures that
already exist in the repo beat invented ones; mark invented values as illustrative.

## Mockups
Only when mockups exist. Reference them by path, say which region maps to which requirement, and note what the
mockup settles versus what the spec still decides.

## Decisions
Numbered. Context → options considered → decision → consequence. "We chose X over Y because Z."
Do not include file paths or code snippets; they go stale. Exception: a prototype snippet that encodes a
decision better than prose (state machine, schema, type shape) — trimmed to the decision-rich lines.

## Out of scope
Real refusals, not a vibe. This is usually the most valuable section in the document.

## Open questions
A checklist, always — never prose. An unchecked box is an unresolved question; a checked box has its answer inline.
- [ ] Q1 `<question>` — proposed default: `<default>` · blocks: `<yes|no>`
- [x] Q2 `<question>` — resolved: `<answer, date>`

## Review
Scorecard from `spec-review` (six dimensions, verdict, findings). Omit only if the spec has not been reviewed yet.

## Risks
Including "we could not verify X", stated plainly.
```

Hard rules:
- **Invent nothing.** If it is not in the request, the code, or a cited source, it does not belong in Decisions.
- **No agent vocabulary** in prose a human reads: no "harness", "RAG", "subagent", "token budget". Say what happened in plain terms.
- **Amend, don't rewrite.** When reality changes, append `(amended <date>: <why>)` to the affected decision. Never silently delete a requirement.
- **Open questions are a checklist**, not prose. Unchecked = unresolved; checked = answered inline.
- **Show data, don't describe it.** Any spec with a data flow, payload, record, or state carries at least one worked example with real values.
- **Embed the mockup, don't cite it** — when a mockup exists, the artifact must contain the relevant region, not just a path.
- 5-15 requirements per feature. Over ~20 means the scope is two specs.

## Step 2.5 — Adversarial review before anything is rendered

Load `spec-review` and send the md to a fresh-context reviewer subagent with no session context. It scores six dimensions and returns SHIP / REVISE / BLOCK. Record the scorecard under `## Review` in the md.

- **BLOCK** → do not render, do not implement. Return to Step 1; the reasoning is thin.
- **REVISE** → fix the named gaps in the md, re-score the changed parts only.
- **SHIP** → continue.
- Skip this step only for `depth: none`, or an explicitly low-stakes `md` spec with the user's word. Say when you skip it.

Do not let the author and reviewer be the same context. A self-scored spec is a formality.

## Step 3 — HTML branch: delegate authoring, keep the thinking

Only when depth is `md_html`. The rule is fixed:

| Work | Who |
|---|---|
| Research, framing, decisions, requirement list, seam choice, diagram semantics | **You** (capable model). Never delegated down. |
| HTML/CSS/SVG implementation from your content and diagram spec | **a cheap-model render subagent** (markup/layout only). Escalate to a more capable model only if two render attempts come back broken. |

Emit a render packet, then hand it to the cheap render subagent:

```
Render packet
- spec.md: <path> (verbatim source of truth; do not add, soften, or invent content)
- intro triad: problem=<1 sentence>, approach=<1 sentence>, proof=<1 sentence>
- diagrams: [{ id, kind: flow|sequence|graph|before-after|state,
               caption: <what it proves>,
               nodes: [...], edges: [...], boundary: <where it stops> }]
- data examples: [{ label, direction: request|response|before-after|record,
                    payload: <actual values from the md>, caption: <what it shows> }]
- mockups: [{ path or fragment, region, mapsTo: [R-IDs], caption: <what it settles> }]
- review: { scores: [{dimension, score, evidence}], total, verdict, reviewer, date, findings: [...] }
- open questions: [{ id, text, default, blocks, resolved? }]   (rendered as a checklist)
- layout plan: which section uses cards | table | timeline | callout | details
- requirement IDs to badge and where
- output: specs/<slug>/spec.html, single file, inline CSS/SVG, no deps
```

Constraints on the delegate:
- **No new facts, no new decisions, no sections.** If the packet is thin, it asks; it does not fill gaps.
- It may only restructure for comprehension (group, summarize, move detail into `<details>`).
- It must not write paths, code, numbers, or payload values that are absent from the packet.
- It renders data examples verbatim, mockup regions as given, and the scorecard exactly as scored. It never adjusts a score.

Then review the result yourself against `spec-html`'s self-check list. Fix content errors in the packet and re-delegate; do not hand-patch prose into the HTML, or the two sources drift.

## Step 4 — Ship checklist

- [ ] Triage depth recorded (and override confirmed if flagged).
- [ ] Every Decision traces to the request, the code, or a cited source.
- [ ] Every requirement is observable and bound to a check method.
- [ ] Seams named; one is ideal.
- [ ] Out of scope contains at least one real refusal.
- [ ] 3-sentence read-back: a human can say what this solves, how, and how it is proven.
- [ ] If HTML exists: headings match the md, no facts exist only in the HTML, `spec-html` self-check passed.
- [ ] Progress-note line: spec path, depth, verdict.

## Anti-patterns (each one has bitten a real project)

- Writing HTML for a 20-line change because the template is fun. Triage exists for this.
- A capable model writing 900 lines of CSS. Delegate the markup; spend the tokens on the reasoning.
- A cheap model inventing a diagram that asserts a flow nobody verified. Diagram semantics come from the packet.
- Requirements written after implementation, to match what shipped.
- Spec as a transcript of the conversation: keep decisions, drop deliberation.
