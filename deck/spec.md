# Five-Minute Talk — "The Spec Is the Bottleneck" — spec v1.0 (2026-11-10)

> Depth: `md_html` (user override: triage said `md`, the deliverable is visual) · Triage: `jev 0.88` · Status: `draft` · Owner: Rob
> Seams: 2 — the deck folder opens offline with no network requests, and the closing QR resolves to the repo.

## Problem

Developers are asked to review specs constantly and most specs are unreadable: walls of markdown, no visual shape, no testable contract. The audience has felt this. They have not been shown that the fix is a pipeline, not better prose.

Tonight's constraint is brutal: five minutes, one speaker, no time to explain a system slowly. If the deck explains process instead of demonstrating cost, the talk fails even with perfect content.

## Solution

Nine slides, each carrying one idea and one visual. The argument is: **the workflow → the loop that fixes it → three mechanisms → proof you can see → what to do about it.** Slide 2 sets the stage: modern agentic development runs prompt → spec → plan → implement → review/test, and the spec is the first artifact that constrains everything after it. A PRD states what to build for a stakeholder; a spec records the decisions that make it buildable, which is why it is the artifact worth making legible.

The proof slide is the load-bearing one: the same document in both formats, the markdown first, then the full HTML artifact scrolling top to bottom so the room sees all of it. Fixing a bad decision at spec time costs minutes; fixing it after implementation costs a rebuild, plus the tokens spent getting there.

Dark by default, high motion, low word count. Every animation is tied to a concept rather than decoration, so the eye candy does explanatory work: a flow that assembles, a boundary line that separates thinking from formatting, scores that fall to 11 and recover to 23.

## How it runs

| # | Time | Slide | One idea | Visual / motion |
|---|---|---|---|---|
| 1 | 0:00–0:20 | Title | The spec is the bottleneck | Grid horizon + drifting particles; title letters assemble from noise |
| 2 | 0:20–1:00 | The workflow | Prompt → spec → plan → implement → review | Five nodes assemble; the spec node swells, then turns red when context is missing |
| 3 | 1:00–1:30 | The reading tax | A dev reads dozens of these a day | Markdown screenshot scrolls past, blurred at 60% opacity, wall of text |
| 4 | 1:30–2:15 | The loop | Judge → reason → review → render | Four nodes assemble left to right, packets travel along edges |
| 5 | 2:15–2:50 | Judged depth | Not every change needs a spec | One input branches into three lanes: none / md / md_html; branches pulse on cue |
| 6 | 2:50–3:25 | Capability split | Thinking up, formatting down | Horizontal boundary line draws across; nodes above glow, nodes below are dimmer |
| 7 | 3:25–3:45 | Scored review | Low scores mean iterate | Two panels: 11/30 in red with "missing context", arrow, 23/30 in green |
| 8 | 3:45–4:35 | Proof | Same content, different cost | Full-width frame: markdown first, then the whole HTML artifact scrolling top to bottom with a progress bar |
| 9 | 4:35–5:00 | Use it | You can have this | Install command types itself; QR draws in module by module |

Slide 8 is non-negotiable: the markdown capture appears first, then the HTML artifact takes over and **scrolls slowly through the entire document**, top to bottom, at a readable pace. Both captures come from the current `deck/spec.md` and `deck/spec.html`, at the same width, and the HTML one is rendered in dark mode. A progress bar shows how much of the document remains.

## Slide copy (verbatim, ≤25 visible words per slide)

1. **Specs are the bottleneck.** Not your code. Not your model. The document you build from.
2. **The spec comes first.** A PRD argues what to build. A spec decides how.
3. **You read these all day.** This is one spec. Imagine twelve.
4. **Judge. Reason. Review. Render.** Four steps. One canonical file.
5. **Not every change needs a spec.** Quick fix: none. Feature: one file. System: one file, one artifact.
6. **Think up here. Format down there.** Research and decisions stay on the capable model. Markup goes to a cheap one.
7. **Readiness is a number.** A blocked 11/30. A shipped 23/30. Iterate before you build.
8. **Same content. Different cost.** The markdown is the source. The HTML is the view.
9. **Take it.** Clone, install, restart. Scan the code.

## Sources for the numbers

- Slide 2: the workflow is the standard agentic loop; the PRD/spec distinction is stated in one line on the slide, not argued.
- Slide 7: scores from the spec-authoring-system spec's own review, rounds 1 and 2, 2026-11-10 (17/30 BLOCK → 23/30 REVISE). The scorecard is in that spec and is reproduced in this deck's `spec.html` review section.
- Slide 7 (alarm state): the 11/30 example is illustrative of a blocked spec, labeled as such, not a historical run.

## Component shape

One folder: `deck/index.html` plus local assets. No build step, no dependencies, no external fonts, no network. 16:9 stage scaled to the viewport with a `transform: scale()` wrapper so 1280×720 and 1920×1080 both show the same composition; on 16:10 or 4:3 projectors the stage letterboxes rather than crops.

- **Engine:** ~60 lines of JS — slide array, arrow/space/Home/End nav, hash sync (`#8`), progress rail.
- **Motion:** CSS transitions and keyframes for entrance and state changes; one `requestAnimationFrame` canvas for the ambient field, paused when the tab is hidden. Animation libraries are permitted (`Q1: as needed`) but must be vendored inline so the offline rule holds; none are required for these effects.
- **Diagrams:** inline SVG with `stroke-dasharray`/`stroke-dashoffset` draw-on, per-node stagger via `--i` custom properties.
- **Proof images:** `assets/spec-md.png` and `assets/spec-html.png`, captured headless at 1440 px wide, referenced relatively.
- **QR:** static inline SVG generated offline (no network call, works with the laptop in airplane mode).
- **Palette:** near-black `#080a0d`, panel `#101418`, ink `#e8eef4`, accent `#35e0c0`, warn `#ffb545`, mono `#8b98a5`.

## Requirements (when/if/then)

```
R1 [must] — Dark by default
  When any slide renders
  Then background is the near-black palette and no slide flashes white during transitions
  Proof: vision — screenshot of slides 1, 4, 8

R2 [must] — The talk fits five minutes
  When the speaker advances at a steady pace
  Then the nine slides complete in 300s ± 15s, with slide 8 receiving ≥ 45s
  Proof: walkthrough — timed rehearsal, per-slide timestamps

R3 [must] — One idea, one visual, few words
  When a slide is on screen
  Then it shows at most 25 visible words (counted from the rendered DOM, not the script) and at least one visual element that carries the idea
  Proof: command — extract visible text per slide, count; review against the slide-copy table

R4 [must] — The comparison is real, full-width, and complete
  When slide 8 appears
  Then it shows the markdown capture, then the HTML capture scrolling slowly through the entire document (≥18s top to bottom, progress bar visible), both at equal width and captioned with the active filename; captures are regenerated after the final md edit
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
  Proof: command — toggle the OS setting or emulate via devtools

R8 [must] — Navigation cannot strand the speaker
  When the speaker presses right/left/space/Home/End
  Then slides advance, the hash updates, and a progress rail shows position
  Proof: walkthrough — full forward and backward pass

R9 [should] — Readable at 1280×720
  When projected or viewed at 1280×720
  Then no text below 18 px effective size, no horizontal overflow, diagrams legible
  Proof: vision — 1280×720 screenshot set

R10 [should] — Every animation explains something
  When any slide animates
  Then the motion maps to one named item in the slide's visual column (assembly, branching, boundary, alarm, full scroll), and no ambient loop runs behind the proof slide
  Proof: review — animation inventory matches the build, one mapping per slide

R11 [should] — Honest limits slide — WITHDRAWN
  Decision 2026-11-10: cut for time; the limits live in the spec and the repo, not on stage
  Proof: n/a — withdrawn by the owner

R12 [could] — Speaker notes — WITHDRAWN
  Decision 2026-11-10: no speaker notes for a five-minute talk; the slide copy is the script
  Proof: n/a — withdrawn by the owner

R13 [must] — There is a fallback recording
  When the venue machine or browser fails
  Then a screen recording of the rehearsed pass can play in its place, with the QR still scannable from a phone
  Proof: command — file exists and plays offline; duration under 5:10

R14 [must] — The captured artifact is dark
  When the HTML spec is captured for slide 8
  Then it renders with the dark theme applied and the capture is regenerated from the current spec.md
  Proof: vision — asset background is near-black; mtime newer than spec.md

R15 [must] — Missing context and poor scores are alarming
  When a spec has unresolved questions, a low dimension score, or a poor total
  Then those states render in alarming color (red family), never as neutral gray, in both the artifact and slide 7
  Proof: vision — unresolved checklist items and any dimension at 2 or below are visibly red
```

## Decisions

1. **Single-file HTML over rendered video.** Chose CSS/SVG/Canvas in a local folder over a Remotion MP4. Because the deck must be editable tonight between rehearsals, and a video cannot be fixed thirty seconds before a talk. Consequence: no export path; if the venue needs a file, screen-record it.
2. **Nine slides, fixed time boxes.** Chose nine over a variable deck. Because 30s per idea is the fastest a room can absorb a diagram. Consequence: anything that does not fit is cut, not compressed.
3. **Proof by screenshot, not by claim.** Chose two real captures over a rendered mock. Because the audience already discounts assertions, and this is the one slide that has to land. Consequence: the captures must be taken from the real files at equal width, and redone if the spec changes.
4. **Motion tied to meaning.** Chose purposeful animation over ambient spectacle. Because a deck that loops particles behind text reads as a template, not an argument. Consequence: the ambient field is low-contrast and pauses on the proof slide.
5. **Static QR, generated offline.** Chose an inline SVG QR over a live generator. Because conference wifi is a rumor. Consequence: the repo URL is frozen in the asset; re-print if the repo moves.
6. **Two seams only.** Chose file-opens-offline and QR-resolves as the acceptance seams. Because a deck's real failure modes are a broken asset and a dead link, not a missing animation.
7. **One full-width frame, not two half-width captures.** Chose a single frame that switches from markdown to the scrolling artifact over side-by-side. Because at 1920 px a half-width column is illegible, and legibility is the entire point of the slide. Consequence: the audience sees one file at a time, so the caption must name it.
8. **Libraries allowed, but inlined.** Chose permission with a constraint over a dependency list. Because a five-minute talk cannot debug a missing CDN, and file:// must not make network calls. Consequence: any library used must be vendored locally; none is currently needed.
9. **The artifact asset is dark, like the deck.** Chose a dark render of the HTML spec over the template's light default. Because the room is dark, the projector is bright, and a white page at full screen is a flashbang; developers also read dark by preference. Consequence: the capture is not the template's default look, so the spec must record that the dark theme is applied for the asset.
10. **Show the whole document, not the top of it.** Chose a slow full scroll over a static crop. Because the difference being demonstrated is structural across the entire document, and a top crop can be dismissed as a hero image. Consequence: slide 8 needs 20+ seconds and a tall capture.
11. **Alarm styling, not neutral styling.** Chose red for unresolved questions and low scores over uniform gray. Because a neutral checklist lets a spec with three open questions look finished, which is the exact failure the talk is about. Consequence: the artifact must support a warning state, and both the artifact and the deck share it.

## Review

| Dimension | Score | Evidence |
|---|---|---|
| Context completeness | 4/5 | problem, time constraint, out-of-scope, prior art; room and projector aspect unstated |
| Requirement testability | 4/5 | R1-R9, R12, R13 name method and target; R3/R10 needed a rubric, now added |
| Readiness | 4/5 | palette, engine, asset paths, QR policy decided; slide copy now exists verbatim |
| Implementation confidence | 4/5 | seams named, risky slide de-risked with a full scroll and a crop fallback |
| Risk coverage | 3/5 | four risks with mitigations; fallback recording added as R13 |
| Decision traceability | 5/5 | D1-D7 carry alternative, reason, consequence |
| **Total** | **24/30** | **REVISE** |

Reviewed by critic · 2026-11-10 · round 1. Findings F1-F8 answered: F1 slide copy added; F2 sources added; F3 fallback recording (R13); F4 recapture rule in R4; F5 R12 marked deferred; F6 rubrics added; F7 letterbox behavior; F8 this section.

## Out of scope

- **Video export / Remotion.** Not built; the deck is live HTML.
- **Presenter view across two displays.** No second window; `#hash` navigation only.
- **Audience interaction, polls, live demo.** The five minutes are scripted time.
- **Speaker script word-for-word.** The deck carries beats, not a transcript.
- **Mobile layout.** Projection only; 390 px is explicitly not a target.
- **Brand system.** A one-off palette, not a reusable theme.

## Open questions

- [x] Q1 Live HTML or rendered video? — resolved: live HTML, local folder, no network
- [x] Q2 Which two images prove the point? — resolved: this spec's own md and html, same width
- [x] Q3 Does the QR need a fallback? — resolved: yes, print the URL under it
- [x] Q4 Is there a live demo segment, or is the deck the whole talk? — resolved: no live demo; talking over the slides is the whole five minutes
- [x] Q5 Do we keep speaker notes in v1? — resolved: no; R12 withdrawn, the slide copy is the script

## Risks

- **The proof slide depends on screenshots that may look too similar at projection distance.** Mitigation: equal-scale images plus a legibility spotlight on the HTML side; if it still reads flat, crop the markdown to its densest paragraph.
- **Ambient motion on a projector can stutter or wash out.** Mitigation: canvas capped at 24fps, low contrast, paused on text-heavy slides.
- **Five minutes is easy to overrun.** Mitigation: the per-slide budget is in the spec; rehearse twice with a timer.
- **A venue machine may not have the right fonts.** Mitigation: system font stack only, no webfonts.
