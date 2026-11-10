# Render packet — Five-Minute Talk (deck spec)

Source: `~/Projects/rob-ruiz-skills/deck/spec.md`
Template: `~/.config/opencode/spec-templates/spec.html`
Output: `~/Projects/rob-ruiz-skills/deck/spec.html`

Hard rule: md is the only source. Do not add facts, slides, numbers, or requirements.

## Header

- Title: "The Spec Is the Bottleneck — deck spec"
- v1.0 · 2026-11-10 · Owner Rob · Status `draft`
- Chips: `depth: md_html (user override)`, `triage: jev 0.88`, `seams: 2`, `review: 24/30 REVISE`
- Sub: "A five-minute argument in ten slides: the document is the bottleneck, and the fix is a pipeline rather than better prose."

## Triad

- What this solves: "Specs are unreadable and untested, and the people who must review them have five minutes of patience for a document that takes thirty."
- How it solves it: "Ten slides, one idea each, every animation carrying a concept, and a proof slide built from two real screenshots of this very document."
- How we prove it: "A timed rehearsal under 5:15, a QR that resolves, the deck opening offline from one file, and two captures taken after the last edit."

## 30-second read

1. Ten slides, fixed time boxes, 300s total; slide 8 gets 45s.
2. The proof slide is the point: one full-width frame, markdown wipes into the HTML twin at equal scale.
3. Motion is tied to meaning: assembly, branching, boundary, score, wipe. No ambient loop behind the proof or limits slides.
4. One file, no dependencies, dark by default, letterboxed on non-16:9 projectors.
5. There is a fallback recording and a printed URL under the QR.

## Layout plan

1. Header, triad, 30-second read (cards + highlighted block)
2. **Timeline diagram** — 10 slides across 5:00, slide 8 widest. Takeaway: "Ten ideas in three hundred seconds; the proof gets the biggest slot."
3. **Slide table** — the md table, 10 rows. Takeaway: "Every slide earns its seconds."
4. **Copy table** — the ten verbatim lines, one row per slide. Takeaway: "Every slide says one thing, and nothing is invented live."
5. **Sources** — two bullets (the four counts, the two scores). Takeaway: "The numbers are traceable, not rhetorical."
6. **Component shape** — short list (engine, motion, diagrams, assets, QR, palette). Takeaway: "A single file that runs offline."
7. **Loop diagram** — judge → reason → review → render, with the packet on the render edge. Takeaway: "The talk is the system; the spec describes the talk the same way."
8. **Depth diagram** — one input branching to none / md / md_html. Takeaway: "Most changes should not generate a document."
9. **Requirements** — 13 rows, IDs R1-R13. Takeaway: "Thirteen promises; two are seams, the rest are craft."
10. **Review** — scorecard 24/30 REVISE, findings F1-F8 collapsed in details. Takeaway: "The spec for the talk was reviewed the same way the talk says to review specs."
11. **Decisions** — 7 compact cards.
12. **Open questions** — checklist, Q1-Q3 checked, Q4-Q5 open.
13. **Out of scope** — 6 refusals.
14. **Risks** — 4 callouts.

---

## Diagram 1 — five-minute timeline

Place after the triad. Caption: "Ten ideas in three hundred seconds; the proof gets the biggest slot."
Boundary label: `hard stop at 5:15 — the room loses interest at six`.

Horizontal rail 0:00 → 5:00. Ten blocks, widths proportional to their time boxes, labels = slide numbers, one-line names under the rail. Slide 8 (3:40–4:25) visually widest and accent-filled; slides 9-10 muted. A moving playhead marker at 0:00.

Nodes: s1 0:00-0:20, s2 0:20-1:00, s3 1:00-1:30, s4 1:30-2:15, s5 2:15-2:50, s6 2:50-3:25, s7 3:25-3:40, s8 3:40-4:25, s9 4:25-4:40, s10 4:40-5:00.

## Diagram 2 — the loop the talk describes

Place before Requirements. Caption: "Judge, reason, review, render — the deck argues for the same loop it was built with."
Boundary: `nothing reaches the renderer without a decided packet`.

Nodes in a row: `request` → `judge` → `reason` → `review` → `packet` → `render`.
Edge labels: "Jev" (request→judge), "capable model" (judge→reason), "critic, scored" (reason→review), "SHIP only" (review→packet), "cheap model" (packet→render).
One dashed back edge from `review` to `reason`, label "REVISE".

## Diagram 3 — judged depth

Place in Requirements section header area or after Diagram 2. Caption: "Most changes should not generate a document."
Boundary: `only structural work crosses the line`.

One input node `request` branching to three: `none` (small, "3 sentences"), `md` (medium, "decision record"), `md_html` (large, "record + artifact"). Accent the `md` branch as the common case; the `md_html` branch slightly larger and labeled "flows, refactors, migrations".

---

## Data examples

Two panels, verbatim from md:

Panel A — label `TIME BUDGET`, caption "What this proves: the proof slide owns the largest single slot."
```
Total        300s (hard stop 5:15)
Slide 8      45s   (3:40 - 4:25)
Largest text 25 words visible
```

Panel B — label `REVIEW RESULT`, caption "What this proves: readiness is a number, and it moved."
```
Round 1   17/30   BLOCK
Round 2   23/30   REVISE   (spec-authoring-system spec)
This deck 24/30   REVISE   (round 1)
```

## Mockups

None for this document. The proof slide's images are captures of this spec, which are taken after the final edit and stored at `deck/assets/spec-md.png` and `deck/assets/spec-html.png`.

## Review

Scorecard: context 4, testability 4, readiness 4, implementation confidence 4, risk 3, traceability 5 → 24/30 REVISE. Findings F1-F8 answered, collapsed in details.

## Open questions

- Q1 checked — "Live HTML or video?" → live HTML, single file
- Q2 checked — "Which images?" → this spec's own md and html, equal width
- Q3 checked — "QR fallback?" → printed URL under it
- Q4 unchecked — "Live demo segment?" default: no · blocks: no
- Q5 unchecked — "Speaker notes in v1?" default: no · blocks: no

## Badges

R1-R13 on requirement rows. R4 next to the proof row in the slide table. R5 next to the QR mention. R13 next to the risks section.

## Language rules

Developer audience: "agent", "skill", "spec" are fine. No tier names.
