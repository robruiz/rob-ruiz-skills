---
name: spec-review
description: Use when a spec, brief, or plan is drafted and needs adversarial review before implementation — scores context completeness, requirement testability, readiness, implementation confidence, risk coverage, and decision traceability, then returns a ship/revise/block verdict. Trigger keywords: review the spec, spec review, is this spec ready, spec score, readiness review, adversarial review of the spec.
---

# Spec review — scored, adversarial, before code

A spec that has not been attacked is a draft. This review is the cheapest place to find out that a fresh session cannot build from the document, and it produces numbers rather than "looks good".

Run before implementation, not after. `acceptance-eval` proves the build; this proves the document.

## Who reviews

- Delegate to the `critic` subagent with the spec md and nothing else — no session memory, no conversation history. That is the point: if the critic needs chat context, the spec is incomplete.
- For a high-stakes spec (`security`, data loss, migrations, publish/push, trust boundaries), run `critic` and then `advisor` on the same document. Two independent passes, scores recorded separately.
- Never score your own draft in the same context that wrote it. A primary-thread review is allowed only for `md` depth, low stakes, and must say so.

## The rubric (six dimensions, 0-5 each)

Score every dimension. Every score cites the evidence, positive or negative, from the document. No score without a citation.

| Dimension | 5 means | 0 means |
|---|---|---|
| **Context completeness** | A reader with repo access needs nothing else: problem, constraints, prior art, boundary | The reader must ask what the problem is |
| **Requirement testability** | Every R is observable and bound to a method + evidence target | Requirements are adjectives |
| **Readiness** | A fresh session can implement start to finish without a clarifying question | Implementation stalls in the first hour |
| **Implementation confidence** | The shape is decided, seams are named, the risky part has an approach | The hard part is hand-waved |
| **Risk coverage** | Unhappy paths, rollback, unknowns stated plainly | Only the happy path appears |
| **Decision traceability** | Every decision shows the alternative and the reason, grounded | Decisions asserted, alternatives missing |

Derived: `total = sum` out of 30.

| Total | Verdict |
|---|---|
| 25-30 | **SHIP** — build from it |
| 18-24 | **REVISE** — name the gaps, fix the md, re-score only the changed parts |
| 0-17 | **BLOCK** — the spec is not the artifact yet; return to reasoning |

A single dimension at ≤2 blocks SHIP regardless of total. That rule exists because a spec with excellent context and untestable requirements fails in the same way every time.

## Anchors (use these, not instinct)

| Dimension | 0 | 2 | 4 |
|---|---|---|---|
| Context completeness | reader cannot tell what the problem is | problem clear, constraints and prior art missing | problem, constraints, prior art, boundary all present; only a target metric missing |
| Requirement testability | adjectives only | some requirements have methods, several are unobservable | every R observable and bound; one vague edge proves the gap |
| Readiness | implementation stalls immediately | one named question blocks a fresh session | builds start to finish; only cosmetic ambiguity remains |
| Implementation confidence | hard part unaddressed | approach named, risk not de-risked | shape decided, seams chosen, risky part has a concrete plan |
| Risk coverage | happy path only | one unhappy path, no rollback | unhappy paths and rollback covered; one unknown unstated |
| Decision traceability | decisions asserted | alternatives missing for some | every decision carries alternative + grounded reason + consequence |

5 is reserved for anchors met with evidence a reviewer can point at. 3 is "between 2 and 4", never a default.

## Loop bound

- Maximum 2 review rounds per spec. Round 2 re-scores only the sections named in findings.
- A second BLOCK stops the loop: escalate to `advisor` or the user, and do not render or implement.
- If `critic` cannot run (provider error, privacy block), mark the spec `unreviewed`, say so in the md, and require the user's explicit word before any `md_html` render. Never self-certify to end the loop.

## Output — the scorecard

Append to the spec md, immediately after the requirements section:

```markdown
## Review

| Dimension | Score | Evidence |
|---|---|---|
| Context completeness | 4/5 | `<what is present / what is missing>` |
| Requirement testability | 5/5 | `<every R names a method and target>` |
| Readiness | 3/5 | `<the specific question a builder would still ask>` |
| Implementation confidence | 4/5 | `<which risky part is de-risked>` |
| Risk coverage | 2/5 | `<which unhappy path is absent>` |
| Decision traceability | 4/5 | `<alternatives present for D1-D6>` |
| **Total** | **22/30** | Verdict: **REVISE** |

Reviewed by: critic · 2026-01-01 · round 1
Findings: F1 `<severity>` `<finding>` → fixed / dismissed (`<reason>`)
```

Then re-render the HTML so the scorecard appears in the artifact.

## Findings discipline

- Number findings `F1..Fn`, each with severity (`blocker` / `major` / `minor`).
- Every finding is answered in writing: fixed, or dismissed with a reason. Silence is not an answer.
- Findings are about the document, not the prose: missing context, an untestable requirement, an unstated alternative, a missing unhappy path.
- Cap: 2 rounds. Round 2 re-scores only the sections named in findings; a second BLOCK stops the loop and escalates.

## What this review must never do

- Score generously to end the loop. A blocked spec caught here costs minutes; the same gap caught in `acceptance-eval` costs a rebuild.
- Review the implementation instead of the document.
- Add sections to the spec itself. It reports gaps; the author fixes them.
