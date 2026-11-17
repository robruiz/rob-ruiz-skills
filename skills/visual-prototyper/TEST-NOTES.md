# visual-prototyper — test notes

Experiment record: skill authoring and first live run, 2026-11-17.

## TL;DR

A skill that forces the agent to build a disposable low-fi prototype of a spatial/structural/visual/behavioral artifact, score it to ≥95% representational confidence with a mandatory gap list, and halt for approval before final implementation.
Tested end-to-end on one live CAD task (parametric birdhouse via SolidCraft MCP): 1 real defect caught pre-implementation, 3 design pivots absorbed at edit cost.
Grade: **A−** — protocol works, but the 95% gate is noisy on vision-only evidence and the cost is real.

## Why it exists

Spec-driven development and low-fi-first design already cover the planning seat; agent planning usually stops at prose, which lets the agent's spatial or structural model stay unexamined until the final build makes it expensive to correct. This skill takes that one step further: it forces the agent to concretize its internal model as a low-fi prototype it can render and inspect, then self-assess against the intent before writing final code or models. It is distinct from `fidelity` (planning seat — enhanced specs for human review). This is an implementation-reasoning seat: the artifact exists to expose what the agent does not yet understand, while fixing it is still cheap.

## Key design decisions

Decisions taken during the authoring Q&A:

- **Hard approval gate.** No skipping the pause unless the user explicitly overrides ("just build it") or already supplied a concrete design.
- **One prototype by default.** 2–3 variants only when the layout is genuinely open, never as a menu by habit.
- **Medium chosen per request.** Adaptability is the point: HTML boxes, SVG orthographic projections, storyboard grids, Mermaid diagrams, or throwaway code spikes when the risk is behavioral.
- **Threshold = non-trivial spatial work.** Bugfixes, small tweaks, backend-only changes, and user-supplied concrete designs are out of scope.
- **Hybrid, per-medium assessment.** Rendered artifacts get scored by a vision seat; code spikes are executed (green output is the evidence); diagrams are walked through logically.
- **Every assessment returns score 0–100 + a mandatory gap list.** No gap list means the score is invalid.
- **≥95% representational correctness, never polish.** Loop capped at 5 rounds, then present-with-gaps.
- **Presentation contract.** Prototype (rendered where visible) + score + gap list + decisions, assumptions, uncertainties.
- **Approved prototype is binding structure.** Deviations during implementation get flagged, not silently taken. Prototype is discarded after acceptance.

## First live run — birdhouse (SolidCraft MCP, parametric CAD)

**Request.** Small birdhouse, ~6 in wide × 12 in tall, single entrance hole, sloped roof, front panel openable for cleaning.

**Medium picked.** Primitive blockout in the target tool (SolidCraft), rendered via CLI snapshots and scored by a vision seat — the confidence loop run in a domain the skill only nominally covered.

**Build.** Parametric blockout with `w` / `d` / `h` / `wall` / `overhang` / `roof_rise` / `hole_d` / `hole_z` parameters, sketch solved to dof 0, 3 bodies, volumes within 0.55% of hand-computed values.

**Design pivots from mid-loop human review.** Each absorbed as cheap parameter edits, not rebuilds:

1. Landing perch below the entrance hole.
2. Visible pivot mechanism — pin plus knuckles, front panel shown 8° open.
3. Inset flush panel plus two side dowels, replacing the pin/knuckle hinge — a simplification that only emerged by seeing the sketch.

**Scoring record.**

- Round 1: **92/100**. Gap list caught one genuine spatial defect (the roof's front overhang eaten by the protruding panel) and one assessment artifact (hole height measured against the roof-inclusive silhouette).
- Round 2: **88/100** on a strictly better model. Both flagged "defects" dissolved against model coordinates (hole exactly 203.2 mm = 8.0 in; dowels 0.5 in below panel top), and the dark plan-view strip was identified as a render artifact.

The 95% gate never formally closed; the user was satisfied and the final model stayed unbuilt (correctly gated).

## Grade: A−

- **Utility — A.** 1 real defect caught pre-implementation; 3 design pivots at parameter-edit cost; the dowel-hinge simplification came from the prototype itself.
- **Protocol design — B+.** Gap-list discipline worked as written (it demanded coordinate confirmation), but the 95% number is noisy on vision-only evidence — round 2 scored lower than round 1 on a better model. Fix direction: weight deterministic measure-vs-spec evidence into the score.
- **Cost efficiency — B.** Heavy for toy parts (5 renders, 2 vision rounds, 6 subagent sessions). The "non-trivial spatial work" threshold is load-bearing.
- **Adaptability — A−.** Medium selection and per-medium assessment held in CAD.
- **Counterfactual.** Without the skill, the run builds a final birdhouse directly and three design corrections hit a finished model.

## Token spend (10 sessions)

| Session | Fresh in | Cache-read | Out | Cost |
|---|---|---|---|---|
| Main — skill authoring + test drive (137 msgs) | 242.0k | 10.15M | 23.2k | $0 (GLM on OpenCode Go) |
| Roof-fix + inset revision | 50.4k | 1.05M | 5.0k | $0 |
| 6 build/probe subagents | 107.2k | 279.6k | 17.5k | $0 |
| 2 vision-scoring sessions | 55.0k | 14.5k | 1.9k | $0.031 (Gemini API) |
| **Total** | **454.6k** | **11.50M** | **47.6k** | **$0.031 marginal** + Go subscription |

Against targets: fresh-in 454.6k ≪ 1.0M; cache-hit 96% (target 60%).

Known waste: one duplicated subagent dispatch (~37.7k fresh-in); ~12 failed execute calls from a harness transport glitch, unmeasured — `session_part` is empty in the v2 schema, and `scorecard.py` reads the legacy session table, so it misses v2 sessions.

## Learnings folded back into the skill

- Close dimensional gaps against measured coordinates, not another render — vision estimates drift at pixel level.
- Mid-loop human feedback is the prototype doing its job — fold it into the next refinement round rather than deferring to the formal pause.

(Both now appear in SKILL.md's anti-patterns list.)

## Artifacts

- Renders: `prototypes/birdhouse/*.png` — iso, front, interior, plan, dowel-highlight, plus earlier rounds' `blockout-*.png`.
- Model: `blockout.sc` in SolidCraft's recovery folder (project save path needs `--allow-path` in the MCP server config).
- Harness: `notes/harness-changelog.md` entries; AGENTS.md routing row.

Skill source is `SKILL.md` in this folder; the installed harness copy lives at `~/.config/opencode/skill/visual-prototyper/`.
