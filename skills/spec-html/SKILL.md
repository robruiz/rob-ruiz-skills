---
name: spec-html
description: Use when rendering a spec, brief, architected plan, or refactor document as a human-facing HTML artifact — the layout, diagram, summarization, and self-check protocol. Only applies after spec-author triage says md_html. Trigger keywords: spec html, html artifact, spec doc, render spec, visual spec, architecture diagram, spec page.
---

# Spec HTML — a document a human can actually read

The artifact exists for comprehension. If a reader needs a second pass to find the point, the artifact failed, even when every fact is present. Agent-readable density belongs in the markdown; the HTML is the summary a human gets first.

## The ordering rule

**Summary before detail, always.** Every section opens with a one-sentence takeaway in larger type. Detail lives underneath, and anything longer than a screen goes inside `<details>`.

## First viewport — the triad, in this order

1. **What this solves** — 1-2 sentences. The problem, in the reader's language.
2. **How it solves it** — 1-2 sentences. The shape of the approach.
3. **How we prove it** — 1-2 sentences. The seams and the check that proves the promise.

Then a `30-second read` block: 3-5 bullets, the only things a reader who stops here must know. Then the requirement table. Nothing else above the fold.

## Layout vocabulary — pick by content, not by habit

One format per idea. Never render everything as cards.

| Content | Format |
|---|---|
| Flow across modules/services (the main reason this artifact exists) | horizontal flow diagram with labeled arrows and one boundary marker |
| Order of operations, phases, handoffs | numbered timeline, vertical, with per-phase done-criteria |
| Data flow, payload, record, or state | worked example panel with the actual values: request → result, or before → after, in labeled monospace |
| Existing mockup or prototype | inline fragment of the real markup, framed and cropped to the region that maps to requirement IDs, with a caption saying what it settles |
| Decisions and their alternatives | 2-column cards: chosen / rejected-with-reason |
| API, event, or config contracts | table, one row per field, with type + required + meaning |
| State machine | small inline SVG or CSS grid with every transition labeled |
| Before/after of a refactor | two-column diff panel, old shape left, new shape right, shared axis |
| Risks, unknowns, blockers | callout blocks, severity chip, named owner |
| Open questions | checklist, one box per question, with proposed default and whether it blocks |
| Review scores | scorecard: one row per dimension, small bar, total, verdict, reviewer and date |
| Anything dense or secondary | `<details>` with a plain-language summary line |

Diagram rules:
- Every diagram has a caption stating **what it proves**, not what it depicts.
- Label the boundary: where the diagram stops and reality continues.
- Inline SVG or CSS only. No libraries, no scripts, no external fonts.
- If the semantics were not in the render packet, the diagram does not go in.

## Language rules

- Plain English. No internal vocabulary: no "harness", "subagent", "RAG", "token", "tier", "gate" in a sentence a stakeholder reads.
- Define a domain term on first use, in parentheses, once.
- Active voice, present tense. "The importer writes one record per row", not "records are written".
- State the decision, not the deliberation. Deliberation belongs in the md's Decisions section.
- Numbers are concrete or absent. No "improves performance" — name the budget or omit it.
- No code block over ~12 lines, no file tree over ~10 lines, no pasted terminal output longer than 3 lines.

## Working examples and mockups

A described data shape is an opinion; a worked example is evidence. When the spec involves data, the artifact carries at least one real payload, and when a mockup exists, the artifact carries the relevant part of it.

- **Data examples:** label them (`Request`, `Response`, `Before` → `After`, `Record`), keep the actual values from the spec md, and caption what the example proves. Trim to the fields that matter, but never replace a real value with `"..."` unless the length is what matters.
- **Mockups:** embed a fragment of the real markup inside a bordered figure, scaled to fit, cropped to the region that corresponds to requirement IDs. Add a caption naming what it settles. If only a screenshot exists, place it at its natural size and link the full file; never stretch it.
- **Correlation is the point:** each embedded mockup or data example names the requirement IDs it demonstrates. A reader should be able to move from R3 to the exact pixel or payload that satisfies it.
- **Never fabricate either one.** If the md has no example and no mockup, the artifact says so in one line rather than inventing a plausible panel.

## Review scorecard

When the spec has been reviewed (`spec-review`), render the scorecard near the top, after the 30-second read:

- One row per dimension, score out of 5, and a two-to-six word evidence note.
- A filled bar or dot row per dimension, plus the total out of 30 and the verdict chip (`SHIP` / `REVISE` / `BLOCK`).
- Reviewer, date, and round must be visible. Findings collapse into `<details>`.
- The renderer copies scores verbatim. It never re-scores, rounds, or softens a `BLOCK`.

## Requirement coverage

- Every requirement gets an `R<n>` chip, on the diagram or section that satisfies it.
- A "Coverage" strip near the top: chips for all R-IDs, lit where the artifact has evidence, hollow where it does not.
- This is the bridge to the close-out acceptance check: the same IDs, same meaning, no renumbering.

## Chrome (consistent across every spec artifact)

- Header: title, version, date, owner, status (`draft` / `review` / `approved` / `implementing` / `done`), depth reason in one line.
- Phase rail when the work is staged: chips for each phase, current one highlighted.
- Footer: prev / next artifact links, path to the canonical md, and "this is a generated view — edit the md, not this file".
- One inlined token block at the top of `<style>`. Same structural chrome every time; theme may follow the project.

## Budgets

- Single file, inline CSS/SVG, opens by double-click, no build step.
- Start from `~/.config/opencode/spec-templates/spec.html` (copy, then delete unused blocks). The template already carries the triad, coverage strip, decision cards, timeline, diagram slot, and footer chrome.
- Under ~150 KB. Evidence images live in `specs/<slug>/evidence/` and are referenced by path with a thumbnail, never base64.
- No more than 3 diagrams per artifact. More means the spec is too big and should be split.

## Self-check before delivery

1. Read only the first viewport: can you say what it solves, how, and how it is proven? If not, fix the triad.
2. Does every section start with a sentence, or does it start with a table/code?
3. Does each diagram have a caption saying what it proves?
4. Are all facts present in the md? Anything only in the HTML is a defect — move it to the md.
5. Scan for internal vocabulary and unglossed terms. Remove or define.
6. At 390 px wide: no horizontal scroll, every chip and table legible.

## Anti-patterns

- A wall of bordered cards with no hierarchy.
- Agent-brained detail: exhaustive edge-case tables a human cannot skim.
- Decorative diagrams that assert nothing.
- Base64 screenshots inflating the file past a megabyte.
- HTML that quietly becomes the source of truth because it is nicer to edit.
