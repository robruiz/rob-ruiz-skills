# Render packet — Fifteen-Minute Talk (deck spec v2)

Source: `~/Projects/rob-ruiz-skills/deck/spec.md`
Template: `~/.config/opencode/spec-templates/spec.html`
Output: `~/Projects/rob-ruiz-skills/deck/spec.html`

Hard rule: md is the only source. Do not add facts or slides.

## Header

- Title: "The Spec Is the Bottleneck — deck spec"
- v2.0 · 2026-11-10 · Owner Rob · Status `draft`
- Chips: `depth: md_html (user override)`, `triage: jev 0.88`, `seams: 2`, `review: 24/30 REVISE`
- Sub: "A fifteen-minute argument in eighteen slides: the document is the bottleneck, and the fix is a pipeline."

## Triad

- What this solves: "Specs are unreadable and untested, and the people who review them spend their day skimming documents that were never built to be read."
- How it solves it: "Eighteen slides in four movements — the workflow, the machinery, the proof, and the cost — with every mechanism shown rather than asserted."
- How we prove it: "A timed rehearsal at 875s, a QR that resolves, the deck opening offline, and two dark captures of this very document."

## 30-second read

1. Eighteen slides, 875s of content, 25s of slack; slide 14 gets 75s.
2. The spec is the first artifact: prompt → spec → plan → implement → review/test.
3. Depth is judged, reasoning stays on the capable model, markup goes to a cheap one.
4. Requirements are bound to proof; reviews are scored, and low scores block.
5. The proof slide scrolls the entire HTML artifact; the limits slide says what still breaks.

## Sections, in this order

1. **Problem** — verbatim. Takeaway: "Unreadable specs are not a taste problem; they are a missing pipeline."
2. **Solution** — verbatim. Takeaway: "Four movements, eighteen slides, no filler."
3. **Timeline diagram** — 18 blocks across 15:00; slide 14 widest. Takeaway: "Nine ideas in three hundred seconds became eighteen in eight hundred seventy-five."
4. **Slide table** — all 18 rows. Takeaway: "Every slide earns its seconds."
5. **Copy table** — 18 verbatim lines. Takeaway: "Every slide says one thing."
6. **Sources** — four bullets. Takeaway: "The numbers are traceable, not rhetorical."
7. **Component shape** — list. Takeaway: "One folder that runs offline."
8. **Requirements** — 16 rows. Takeaway: "Sixteen promises; three are seams, the rest are craft."
9. **Review** — scorecard 24/30 REVISE, findings collapsed. Takeaway: "The spec for the talk was reviewed the same way the talk says to review specs."
10. **Decisions** — 12 cards.
11. **Open questions** — 6, all checked.
12. **Out of scope** — 6 refusals.
13. **Risks** — 4 callouts.

## Diagram 1 — fifteen-minute timeline

Caption: "Eighteen ideas in 875 seconds; the proof gets the largest slot."
Boundary: `hard stop at 15:30 — leave room for questions`.

Blocks: s1 0:00–0:30, s2 0:30–1:30, s3 1:30–2:15, s4 2:15–3:05, s5 3:05–3:55, s6 3:55–4:40, s7 4:40–5:35, s8 5:35–6:20, s9 6:20–7:05, s10 7:05–8:00, s11 8:00–8:45, s12 8:45–9:35, s13 9:35–10:20, s14 10:20–11:35 (accent, widest), s15 11:35–12:25, s16 12:25–13:10, s17 13:10–13:45, s18 13:45–14:35.

## Diagram 2 — the four movements

Caption: "Four movements, one argument: see it, understand it, believe it, use it."
Boundary: `the proof slide is the hinge`.

Four labelled bands left to right: `Workflow` (slides 1-3), `Machinery` (4-11), `Proof` (12-14), `Cost & use` (15-18). Each band a rounded rect with its slide numbers beneath.

## Data examples

Panel A — `TIME BUDGET`: `Total 875s of content · 25s slack · slide 14 = 75s · 18 slides`.
Panel B — `REVIEW RESULT`: `Round 1 17/30 BLOCK · Round 2 23/30 REVISE · this deck 24/30`.

## Review payload

Context 4, testability 4, readiness 4, implementation confidence 4, risk 3, traceability 5 → 24/30 REVISE.

## Open questions

All six resolved; render checked. Q6 lists the new topics.

## Badges

R1-R16. R4 next to slide 14. R15 next to slide 12. R16 next to the copy table.

## Language

Developer audience; "agent", "skill", "spec" allowed.
