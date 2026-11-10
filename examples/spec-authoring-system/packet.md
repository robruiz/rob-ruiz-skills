# Render packet — Spec Authoring System (v1.0, round 2)

Source of truth: `~/.config/opencode/specs/spec-authoring-system/spec.md`
Template: `~/.config/opencode/spec-templates/spec.html`
Output: `~/.config/opencode/specs/spec-authoring-system/spec.html`

Hard rule: the md is the only source. Do not add facts, sections, numbers, paths, opinions, or requirements. If something
below is insufficient, stop and say what is missing. This packet exists because the last render omitted Problem and
Solution and invented nothing where it should have asked; every section now has a takeaway line and an explicit slot.

## Header

- Title: `Spec Authoring System`
- v1.0 · 2026-11-10 · Owner Rob · Status `draft`
- Chips: `depth: md_html`, `triage: jev 0.91`, `seams: 3`, `review: 23/30 REVISE`
- Sub: "How this machine decides what a spec needs, who is allowed to think, and who is only allowed to lay out pages."

## Intro triad (verbatim from md)

- What this solves: "Specs had three part-owners and no lifecycle, so most of them carried no testable contract and the rest drifted between markdown and HTML."
- How it solves it: "One spine judges how much spec a request needs, keeps the reasoning on a capable model, and delegates only markup to a cheap one, with markdown as the single source of truth."
- How we prove it: "Four triage fixtures, one ID set compared across md, HTML and eval, and this document rendered through the very pipeline it describes."

## 30-second read (from md Solution + Decisions; keep to 5 bullets)

1. Depth is judged per request in three values, not assumed: `none`, `md`, `md_html`.
2. Jev decides depth in ~200-480ms for about $0.00003; a heuristic takes over if it fails, and any fallback forces a human confirmation.
3. Judgment, research, and diagram semantics stay on the capable model. A written packet is the boundary; the renderer may only lay out.
4. Markdown is canonical. The HTML is a disposable view, and any fact that exists only in the HTML is a defect.
5. Four format rules close the comprehension gap: a checked question list, real data examples, embedded mockup regions, and a scored adversarial review before code.

## Coverage strip

R1 R2 R3 R4 R5 R6 R7 R8 R9 R10 R11 R12 R13 R14 R15 R16 R17 R18 — all covered in the md; R11 is visual (this artifact), R12 is this run, R15 is declared not-applicable because no mockup exists.

---

## Sections, in this order

Render in exactly this order. Every section gets the takeaway line given here, verbatim.

1. **Problem** — md section verbatim. Takeaway: "Three part-owners, no lifecycle, and a 13% requirement adoption rate were the measurable symptoms."
2. **Solution** — md section verbatim. Takeaway: "One spine, one canonical format, one scored review gate."
3. **Diagram 1** (inside "How it runs") — see below. Takeaway: "Judgment happens above the line; only markup happens below it, and the packet is the only way through."
4. **Component map** — the md table, all 15 rows. Takeaway: "Every piece has one home and one owner."
5. **Proof formats** — md table, 5 rows. Takeaway: "An unsigned review is a FAIL, not a PASS."
6. **Render packet schema** — md code block. Takeaway: "A renderer cannot be verified against an unspecified input."
7. **Tuning constants** — md table, 5 rows. Takeaway: "Every threshold has a stated reason, so it can be argued with."
8. **Diagram 2** (inside "Skill dependencies") — see below. Takeaway: "Every arrow is a load or a write; no skill writes another skill's artifact."
9. **Artifacts inform skills** — md prose, two paragraphs. Takeaway: "The loop back from artifacts to skills is the weak direction, and it is the one that keeps the system honest."
10. **Diagram 3** (inside the same section) — see below. Takeaway: "One loop corrects the spec; the other corrects the system."
11. **Requirements** — table, 18 rows: ID chip, promise, proof method. Full when/if/then text in a `<details>` per R. Takeaway: "18 promises, 16 of them must, 2 should; each names its proof."
12. **Data examples** — two panels, verbatim payloads below. Takeaway: "The verdict is one of three values, carries its own evidence, and cannot be forced upward by framing."
13. **Mockups** — one line only: "None exist for this document; R15 is unexercised here and says so." Takeaway: "A requirement that only applies when a mockup exists is satisfied by declaring there is none."
14. **Decisions** — 14 cards, title + the decision sentence from the md. Chosen/rejected treatment only where the md states both. Takeaway: "Fourteen decisions, each with the alternative it beat and the cost it accepted."
15. **Out of scope** — 7 items, refusal treatment. Takeaway: "The refusals protect the spec from growing."
16. **Open questions** — checklist, 6 items, all six checked with their resolution inline. Takeaway: "All six are settled; the defaults were accepted and are now decisions."
17. **Review** — scorecard with round 1 and round 2 columns, verdict REVISE, then findings F1-F17 collapsed in `<details>`. Takeaway: "17/30 BLOCK became 23/30 REVISE after 17 findings were answered."
18. **Risks** — 8 callouts. Takeaway: "The three that matter: the renderer is unproven, scores can inflate, and scope promotion is manual."

Skill dependencies table: 17 rows (the 15 from v3 plus `skill-author` → `spec-triage.mjs --scope` and `skill-author` → `AGENTS.md`). Diagram 2 also gets the `skill-author` → `AGENTS.md` edge.

The md's skill-dependencies table (from→to→kind, 15 rows plus the "not loaded" paragraph) is rendered inside Item 8 with Diagram 2 — the diagram shows shape, the table carries the exact arrows. Footer: no prev/next links in this folder; state only the md path and the "edit the md, not this file" line.

---

## Diagram 1 — pipeline and the capability boundary

Caption: "Judgment happens above the line; only markup happens below it."

Boundary: `capability boundary — below this line, no new facts may be authored`

Lanes: A `capable model — judgment` (top), B `cheap model — markup` (bottom).

Nodes/edges, left to right:
- `request` (pill) → `triage` (box, A) — label "Jev"
- `triage` → `none` (small box, A) — label "2-3 sentences"
- `triage` → `reason` (box, A) — label "md"
- `reason` → `spec.md` (document, A)
- `triage` → `reason2` (box, A) — label "md_html"; `reason2` → `spec.md`
- `spec.md` → `review` (box, A) — label "critic · scored"
- `review` → `reason` — dashed back edge — label "BLOCK / REVISE"
- `review` → `packet.md` (document, A) — label "packet"
- `packet.md` → `spec-render` (box, B) — crosses the boundary — label "no new facts"
- `spec-render` → `spec.html` (document, B)
- `spec.html` → `check` (box, A) — label "self-check"
- `check` → `packet.md` — dashed — label "fix packet, re-render"
- `spec.md` → `implement` → `04-eval` → back to `spec.md` (dashed, label "deviation → dated amend")

## Diagram 2 — skill and artifact dependencies

Caption: "Every arrow is a load or a write; no skill writes another skill's artifact."

Boundary: `outside this map: impeccable, vision-loop, architect`

Layers:
- Entry: `AGENTS.md` → `spec-author`; `/spec` → `triage` → `spec-author`
- Spine: `spec-author` → `requirements`; → `graft`; → `spec-review`; → `spec-html`; → `spec-render`
- Scope: `skill-author` → `spec-triage.mjs --scope` → `harness home | project home`; `skill-author` → `AGENTS.md` (only when the skill is a seat)
- Review: `spec-review` → `critic`; `spec-review` → `spec.md`
- Artifacts: `spec-author` → `spec.md`; `spec.md` → `packet.md` → `spec-render` → `spec.html`; `spec-html` → `template`
- Proof: `acceptance-eval` → `requirements` (reads IDs); `acceptance-eval` → `04-eval.html`; `test-writing` → `requirements`
- Memory: `spec-author` → `worklog`; every skill change → `harness-changelog`; `04-eval.html` → `misses.md` → `acceptance-eval`

Thick arrow = writes. Thin = reads/loads.

## Diagram 3 — the feedback loop

Caption: "One loop corrects the spec; the other corrects the system."

Boundary: `all of this is review-enforced today; only triage is automatic`

Cycle, 7 nodes clockwise: `spec.md` → `review` → `spec.html` → `04-eval.html` → `misses.md` → `harness-changelog.md` → `skills` → back to `spec.md`.

Edge labels:
- `spec.md` → `review`: "critic, scored"
- `review` → `spec.html`: "packet, render"
- `spec.html` → `04-eval.html`: "R-IDs verified"
- `04-eval.html` → `spec.md`: "deviation → dated amend" (dashed inner loop)
- `04-eval.html` → `misses.md`: "FAIL that should have been caught"
- `misses.md` → `harness-changelog.md`: "new check, one line"
- `harness-changelog.md` → `skills`: "measured change, one lever"
- `skills` → `spec.md`: "template, vocabulary, thresholds" (dashed outer loop)

---

## Data examples (verbatim, two panels)

Panel 1 — label `TRIAGE RESULT · depth=md`, caption "What this proves: the verdict is one of three values and names its own evidence."

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

Panel 2 — label `RUNTIME UPGRADE · depth none → md`, caption "What this proves: a structural runtime cannot be hidden behind a one-line framing."

```
$ node ~/.config/opencode/scripts/spec-triage.mjs --simulate none,cross_system
{"depth":"md","runtime":"cross_system","research":false,"confidence":null,
 "why":"simulated","source":"simulate",
 "override":"Runtime shape outranks the depth answer: upgraded none → md."}
```

## Review scorecard payload

| Dimension | Round 1 | Round 2 |
|---|---|---|
| Context completeness | 4/5 | 4/5 |
| Requirement testability | 2/5 | 3/5 |
| Readiness | 2/5 | 4/5 |
| Implementation confidence | 2/5 | 3/5 |
| Risk coverage | 3/5 | 4/5 |
| Decision traceability | 4/5 | 5/5 |
| **Total** | **17/30 BLOCK** | **23/30 REVISE** |

Reviewer: critic · 2026-11-10 · round 2. Round-1 findings F1-F13 and round-2 findings F14-F17 all fixed; no third pass, per the 2-round bound. Additive changes after the loop (scope judgment, skill-author, six resolved questions) were not re-scored; state that in one line under the scorecard.

## Open questions (checklist payload)

All six resolved. Render every item checked, with the resolution text as its meta line.

- Q1 resolved — "Visual deliverables in triage?" → no; depth judges spec complexity only
- Q2 resolved — "One-screen HTML summary for md?" → no; that is how HTML crept in before
- Q3 resolved — "Harness specs in config repo or project?" → config repo for harness, project root for product
- Q4 resolved — "Packet file or inline?" → always a file at `specs/<slug>/packet.md`
- Q5 resolved — "Enforce triage with a pre-write hook?" → not yet; measure misuse over ~10 specs
- Q6 resolved — "Should scores gate implementation?" → advisory for md, blocking for md_html

## Badges

`R1`-`R17` on requirement rows. `R6` next to 30-second-read bullet 4. `R9` next to the `spec-render` node. `R16` next to the scorecard total. `R15` next to the mockups line.

## Language rules

- No "harness", "subagent", "token", "RAG", "tier", "gate" in user-facing sentences. "Agent" and "skill" are allowed.
- Keep the triad, the 30-second read, and every takeaway line verbatim.
