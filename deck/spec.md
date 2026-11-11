# Fifteen-Minute Talk — "The Spec Is the Bottleneck" — spec v2.0 (2026-11-10)

> Depth: `md_html` (user override: triage said `md`, the deliverable is visual) · Triage: `jev 0.88` · Status: `draft` · Owner: Rob
> Seams: 2 — the deck folder opens offline with no network requests, and the closing QR resolves to the repo.

## Problem

Developers are asked to review specs constantly and most specs are unreadable: walls of markdown, no visual shape, no testable contract. The audience has felt this. They have not been shown that the fix is a pipeline, not better prose.

The first version of this talk was five minutes and could only assert the thesis. Fifteen minutes buys the argument room to be demonstrated: what a wall of text does to a reader, how depth is judged, what the requirements contract actually looks like, how review scores force iteration, and what the whole thing costs in time and tokens.

## Solution

Seventeen slides in four movements: **the workflow and the reading tax → the machinery (depth, judge, loop, capability split, contract, evidence) → the proof (review scores, a real review, the full artifact) → the cost and how to use it.**

No slide exists to fill time. Each new slide answers a question the five-minute version had to skip: *why is the spec first, what does a bad one look like, who decides how much spec a change needs, what stops a cheap model from inventing architecture, what makes a requirement testable, what does a review catch, and what does this cost?*

The proof slide remains the load-bearing one: the same document in both formats, markdown first, then the full HTML artifact scrolling top to bottom. Fixing a bad decision at spec time costs minutes; fixing it after implementation costs a rebuild plus the tokens spent getting there.

Dark by default, high motion, low word count. Motion is tied to a concept: a flow that assembles, a branch that splits, a boundary that separates thinking from formatting, scores that fall to 11 and recover to 23.

## How it runs

| # | Time | Slide | One idea | Visual / motion |
|---|---|---|---|---|
| 1 | 0:00–0:30 | Title | The spec is the bottleneck | Grid horizon, particles, title assembles |
| 2 | 0:30–1:30 | The workflow | Spec is the first artifact | Five nodes; spec swells; review loop; minutes vs rebuild |
| 3 | 1:30–2:15 | The reading tax | You read these all day | Dark markdown capture, blurred, slow pan |
| 4 | 2:15–3:05 | Autopilot | What a wall of text does to a reader | Four rows, each landing harder than the last; the final row in alarm red |
| 5 | 3:05–3:55 | Judged depth | Not every change needs a spec | One request, three lanes: none / md / md_html |
| 6 | 3:55–4:40 | The judge | A verdict, not a vibe | Jev call: 200–480ms, $0.00003, fallback, human gate |
| 7 | 4:40–5:35 | The loop | Judge, reason, review, render | Four nodes assemble; revise edge draws |
| 8 | 5:35–6:20 | Thinking up | Reasoning is not delegated | Capable-model node stack; packet as a hall pass |
| 9 | 6:20–7:05 | The boundary | No facts cross downward | Boundary line draws; upper nodes lit, lower dim |
| 10 | 7:05–8:00 | The contract | A requirement is a test | R3 rendered as when/then/proof; unbound rows turn red |
| 11 | 8:00–8:45 | Evidence | Show the payload | Real JSON block; mockup region mapped to R-IDs |
| 12 | 8:45–9:35 | Scored review | Low scores mean iterate | 11/30 red vs 23/30 green |
| 13 | 9:35–10:20 | The review in practice | What it actually catches | Two caught defects, 17 findings, 2 rounds |
| 14 | 10:20–11:50 | Proof | Same content, different cost | Markdown, then full artifact scrolling, progress bar |
| 15 | 11:50–12:45 | What it costs | Minutes now, a rebuild later | Cost axis; cheap-model lane; measured triage price |
| 16 | 12:45–13:20 | What you get | Five skills, one install | Repo tree, file counts |
| 17 | 13:20–14:15 | Use it | You can have this | Install lines type; QR draws in |

Total 855s, leaving 45s of slack inside 15:00.

## Slide copy (verbatim, ≤35 visible words per slide)

1. **Specs are the bottleneck.** Not your code. Not your model. The document you build from.
2. **The spec comes first.** A PRD argues what to build. A spec decides how.
3. **You read these all day.** This is one spec. Six thousand pixels of it.
4. **It puts you on autopilot.** The eyes glaze. You skim, then say you read it. You finish unable to state the decision.
5. **Not every change needs a spec.** A typo needs a sentence. A feature needs a record. A system needs an artifact.
6. **A judge, not a hunch.** Three hundred milliseconds. Three cents per thousand calls. A human confirms the doubt.
7. **Judge. Reason. Review. Render.** Four steps. One canonical file.
8. **Thinking stays up.** Research, decisions, seams. The capable model keeps them.
9. **Formatting goes down.** Markup, CSS, SVG. A cheaper model, on a short leash.
10. **A requirement is a test.** When this. Then that. Proof: a named check.
11. **Show the payload.** A JSON blob beats a paragraph about it. A mockup beats both.
12. **Low scores mean iterate.** Eleven out of thirty blocks. Twenty-three ships.
13. **It catches real defects.** A spec that failed its own rule. A proof that cited a file that never existed.
14. **Same content. Different cost.** The markdown is the source. The HTML is the view.
15. **Minutes now. A rebuild later.** Fix the decision before the code. Tokens follow the same curve.
16. **What you get.** Five skills. Two templates. One judge. One install.
17. **Take it. Break it. Improve it.** Clone, install, restart. Scan the code.

## Sources for the numbers

- Slide 3: capture height 6,679px at 1,200px wide, measured from `deck/spec.md` rendered at 16px.
- Slide 6: Jev call latency 200–480ms and cost ≈ $0.00003 measured in `jev-shadow.jsonl` and `spec-triage.jsonl`.
- Slides 12–13: spec-authoring-system review, rounds 1 and 2, 2026-11-10 (17/30 BLOCK → 23/30 REVISE, 17 findings). Deck spec itself: 24/30.

## Component shape

One folder: `deck/index.html` plus local assets. No build step, no dependencies, no external fonts, no network. 16:9 stage scaled to the viewport with a `transform: scale()` wrapper so 1280×720 and 1920×1080 show the same composition; on 16:10 or 4:3 projectors the stage letterboxes rather than crops.

- **Engine:** ~90 lines of JS — slide array, arrow/space/Home/End nav, hash sync (`#14`), progress rail, per-slide activation hooks.
- **Motion:** CSS transitions and keyframes; one `requestAnimationFrame` canvas for the ambient field, paused when the tab is hidden and on the proof slide. Libraries permitted but must be vendored; none needed.
- **Diagrams:** inline SVG with draw-on (pathLength + dashoffset), per-node stagger via `--i`.
- **Proof images:** `assets/spec-md-full.png` and `assets/spec-html-full.png`, full-page captures at 1,200px wide, dark theme.
- **QR:** static inline SVG generated offline; URL printed underneath.
- **Palette:** near-black `#080a0d`, panel `#101418`, ink `#e8eef4`, accent `#35e0c0`, alarm `#ff6b5e`, warn `#ffb545`, mono `#8b98a5`.
- **Typography:** system sans only, never serif. Minimum 18px effective at 1280×720; SVG labels inherit the sans stack.

## Requirements (when/if/then)

```
R1 [must] — Dark by default
  When any slide renders
  Then background is the near-black palette and no slide flashes white during transitions
  Proof: vision — screenshots of slides 1, 9, 14

R2 [must] — The talk fits fifteen minutes
  When the speaker advances at a steady pace
  Then the seventeen slides complete in 855s ± 30s, with slide 14 receiving ≥ 80s
  Proof: walkthrough — timed rehearsal with per-slide timestamps

R3 [must] — One idea, one visual, few words
  When a slide is on screen
  Then it shows at most 35 visible words (counted from the rendered DOM) and one visual that carries the idea
  Proof: command — extract visible text per slide, count

R4 [must] — The comparison is real, full-width, and complete
  When slide 14 appears
  Then it shows the markdown capture, then the HTML capture scrolling slowly through the entire document (≥30s top to bottom, progress bar visible), both at equal width and captioned with the active filename; captures are regenerated after the final md edit
  Proof: vision — both captures legible at 1920×1080; full scroll observed; file mtimes newer than spec.md

R5 [must] — The QR resolves
  When a phone scans the closing QR
  Then it opens https://github.com/robruiz/rob-ruiz-skills within 3 seconds
  Proof: command — scan with a phone; fallback is the visible URL line

R6 [must] — It runs offline from the deck folder
  When the deck is opened from disk with no network
  Then every slide, animation, image, and QR renders, and no request leaves the machine
  Proof: command — disable network, open file, advance all slides

R7 [must] — Motion is reduced on request
  When prefers-reduced-motion is set
  Then transitions are instant, the ambient canvas is static, and draw-on diagrams render complete
  Proof: command — emulate the setting in devtools

R8 [must] — Navigation cannot strand the speaker
  When the speaker presses right/left/space/Home/End
  Then slides advance, the hash updates, and a progress rail shows position
  Proof: walkthrough — full forward and backward pass

R9 [should] — Readable at 1280×720
  When projected or viewed at 1280×720
  Then no text renders below 18px effective size, no horizontal overflow, diagrams legible
  Proof: vision — 1280×720 screenshot set

R10 [should] — Every animation explains something
  When any slide animates
  Then the motion maps to one named item in the slide's visual column (assembly, branching, boundary, alarm, full scroll), and no ambient loop runs behind the proof slide
  Proof: review — animation inventory matches the build

R11 [should] — Honest limits slide — WITHDRAWN
  Decision 2026-11-10: cut again for flow; the limits stay in the spec and the repo
  Proof: n/a — withdrawn by the owner

R12 [could] — Speaker notes — WITHDRAWN
  Decision 2026-11-10: no speaker notes; the slide copy is the script
  Proof: n/a — withdrawn by the owner

R13 [must] — There is a fallback recording
  When the venue machine or browser fails
  Then a screen recording of the rehearsed pass can play in its place, with the QR still scannable from a phone
  Proof: command — file exists and plays offline; duration under 15:10

R14 [must] — The captured artifact is dark
  When the HTML spec is captured for slides 3 and 14
  Then it renders with the dark theme applied and both captures are regenerated from the current spec.md
  Proof: vision — asset background is near-black; mtimes newer than spec.md

R15 [must] — Missing context and poor scores are alarming
  When a spec has unresolved questions, a low dimension score, or a poor total
  Then those states render in alarming color (red family), never as neutral gray, in both the artifact and slide 12
  Proof: vision — unresolved checklist items and any dimension at 2 or below are visibly red

R16 [must] — Every added slide earns its time
  When a slide appears after the fifth-minute mark
  Then it answers a question the audience would otherwise ask (what a wall of text does to a reader, who decides depth, what a review catches, what it costs), and it carries specific evidence rather than a restatement
  Proof: review — each slide maps to a question in the Solution section; no slide is a recap
```

## Decisions

1. **Expand to seventeen slides for fifteen minutes, not to pad.** Chose depth over repetition. Because a longer slot invites a longer argument, not a slower one; every added slide answers a question the short version dodged. Consequence: rehearsal time doubles and the deck must be complete a day earlier.
2. **Nine slides, fixed time boxes.** Chose fixed boxes over a variable deck. Because 45–55s per idea is the fastest a room absorbs a diagram. Consequence: anything that does not fit is cut, not compressed.
3. **Proof by screenshot, not claim.** Chose real captures over rendered mocks. Because the audience discounts assertions, and this is the slide that has to land. Consequence: captures must be retaken whenever the spec changes.
4. **Motion tied to meaning.** Chose purposeful animation over ambient spectacle. Because looping particles behind text read as a template, not an argument. Consequence: the field is low-contrast and pauses on the proof slide.
5. **Static QR, generated offline.** Chose an inline SVG over a live generator. Because conference wifi is a rumor. Consequence: re-print if the repo moves.
6. **Two seams only.** Chose folder-opens-offline and QR-resolves as acceptance seams. Because a deck's real failure modes are a broken asset and a dead link.
7. **One full-width frame, not two half-width captures.** Chose a single frame switching from markdown to the scrolling artifact. Because a half-width column is illegible at projection distance.
8. **Libraries allowed, but inlined.** Chose permission with a constraint over a dependency list. Because file:// must not make network calls. Consequence: any library must be vendored.
9. **The artifact asset is dark, like the deck.** Chose a dark render over the template's light default. Because a white page at full screen is a flashbang in a dark room. Consequence: record that the dark theme is applied for the asset.
10. **Show the whole document, not the top.** Chose a 30s full scroll over a static crop. Because the difference is structural across the whole document.
11. **Alarm styling, not neutral styling.** Chose red for unresolved questions and low scores. Because a neutral checklist lets a three-open-question spec look finished.
12. **The limits slide was cut, twice.** First for five-minute time, then again for flow after the fifteen-minute expansion. Because the risks live in the spec and the repo, and the talk is stronger ending on the call to action. Consequence: the honesty lives in the document, not on stage.

## Out of scope

- **Video export / Remotion.** Not built; the deck is live HTML.
- **Presenter view across two displays.** One window, `#hash` navigation.
- **Audience interaction, polls, live demo.** Scripted time only.
- **Speaker script word-for-word.** Slides carry beats.
- **Mobile layout.** Projection only.
- **A brand system.** One-off palette.

## Open questions

- [x] Q1 Live HTML or rendered video? — resolved: live HTML, local folder, no network
- [x] Q2 Which images prove the point? — resolved: this spec's own md and html, same width, dark
- [x] Q3 Does the QR need a fallback? — resolved: printed URL under it
- [x] Q4 Live demo segment? — resolved: no; talking over the slides is the whole slot
- [x] Q5 Speaker notes? — resolved: no; R12 withdrawn
- [x] Q6 Which new topics earn a slide? — resolved: the four failure modes, depth triage, the judge, the requirements contract, evidence, review in practice, cost, repo contents

## Review

| Dimension | Score | Evidence |
|---|---|---|
| Context completeness | 4/5 | problem, slot length, movement structure, sources; venue/projector still unstated |
| Requirement testability | 4/5 | R1-R16 name method and target; R16 is a judgment call bounded by the question list |
| Readiness | 4/5 | 17 rows with time boxes, copy, assets, palette, engine sized |
| Implementation confidence | 4/5 | seams named; risky slide has a full-scroll approach and a capture rule |
| Risk coverage | 3/5 | four risks with mitigations; fallback recording still the weak point |
| Decision traceability | 5/5 | D1-D12 carry alternative, reason, consequence |
| **Total** | **24/30** | **REVISE** |

Reviewed by critic · 2026-11-10 (v1). The v2 changes are additive (nine new slides) and were not re-scored; the carried-forward score applies to the reviewed structure.

## Risks

- **The proof slide depends on captures that may look similar at distance.** Mitigation: dark captures, full scroll, alarm states visible inside the artifact.
- **Ambient motion can stutter on a projector.** Mitigation: capped particle count, low contrast, paused on the proof slide.
- **Fifteen minutes is easy to overrun.** Mitigation: per-slide boxes, two timed rehearsals.
- **Nine new slides mean nine new failure points.** Mitigation: every new slide reuses an existing visual grammar (nodes, branches, bars, cards) rather than inventing one.
