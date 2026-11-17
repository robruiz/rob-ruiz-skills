---
name: visual-prototyper
description: Use when implementation is about to begin on a spatial, structural, visual, or behavioral build — UI layout, 3D/CAD part, animation storyboard, scene, data layout, tricky behavior — and the agent should reason through a disposable prototype before writing final code or models. Generates a low-fi artifact (HTML boxes, SVG projections, storyboard grid, Mermaid diagram, or throwaway code spike), loops build-render-assess to ≥95% representational confidence with a mandatory gap list, then pauses for approval with assumptions and uncertainties. Trigger keywords: prototype first, sketch before build, low-fi sketch, wireframe this, blueprint before code, storyboard, orthographic projections, spike this. DO NOT trigger for bugfixes, small tweaks, backend-only work, user-supplied concrete designs, design exploration or spec staging (fidelity), post-build visual verification (vision-loop), or polished art/3D assets.
---

# Visual Prototyper — spike to confidence, then build

Think by sketching: before final implementation, build a disposable low-fi prototype, prove it models the intent at ≥95% confidence, get approval, then build against it. The prototype exists so the agent finds out what it actually understands about the work — while that is still cheap to fix.

## When this applies

At the implementation boundary of any spatial, structural, visual, or behavioral build — after planning (`fidelity`, `spec-author`, or the request itself) and before final code, models, or animation.

Skip (and say you are skipping) when: the user explicitly overrides ("just build it", "skip the prototype"), the user already supplied a concrete design, or the work is a bugfix, small tweak, or backend-only change.

## Steps

1. **Pick the medium.** Choose the format that best exposes your understanding of the artifact's structure. Examples — invent a better format when none fit:

   | Domain | Candidate format |
   |---|---|
   | Web UI / layout | HTML/CSS boxes and borders |
   | 3D / CAD geometry | SVG orthographic projections (top/front/side), or a primitive blockout in the target tool |
   | Animation / video | Markdown storyboard grid, Mermaid state diagram |
   | Data layout / schema | Markdown grid, Mermaid diagram |
   | Behavioral risk (tricky logic, API) | Throwaway code spike that demonstrates the behavior |

   Constraint: the artifact must render or be easily visualized. Medium follows the risk — spatial → sketch, behavioral → spike.

2. **Build it low-fi.** Layout, proportions, structure, flow only. No colors, textures, or polish. Save artifacts (sketch, screenshots, spikes) to `prototypes/<slug>/` at the project root (sibling of `specs/`). It is a disposable sketch, not a draft of the final product.

3. **Confidence loop — the point of this skill.** Assess the artifact against the request and any approved spec, per medium:
   - **Rendered artifacts** (HTML, SVG, blockouts): render, screenshot, and have `vision-quick` score the screenshot against the intent. Score from the actual render, never from what you imagine it looks like.
   - **Code spikes**: execute them. Green output demonstrating the intended behavior is the evidence.
   - **Diagram/text artifacts**: logical walkthrough against the flow or structure they claim to model.

   Every assessment returns a **score (0–100) plus a mandatory gap list** — what concretely keeps it from 100. A score without a gap list is invalid. Refine and re-assess until **≥95% representational correctness** (correctness of structure, proportions, and flow as a model of intent — never polish). **Cap: 5 rounds.** At the ceiling, stop and present with gaps.

4. **Halt for approval.** Present: the artifact rendered where the user can see it (open HTML/SVG in a browser, diagrams inline), the final score + gap list, and a readout — decisions made, assumptions taken where the request was silent, open uncertainties. Then stop and wait.

5. **Approval loop.** For requested changes, adjust and re-run step 3. On the **3rd rejected round**, stop redrawing: interrogate what is blocking before touching the artifact again.

6. **Handoff.** Implement against the approved prototype: its layout/structure is binding. Flag any deviation instead of silently diverging. Discard the prototype after acceptance.

## Hard rules

- **Never skip the pause** without an explicit user override or a user-supplied concrete design. The pause is where misreads get caught cheaply.
- **Look at what you built.** Rendered artifacts are scored from real screenshots (via a vision seat), never from imagination.
- **Stay disposable.** If the prototype acquires polish, it has become the implementation. Strip it back.
- **The number is earned.** ≥95% requires a gap list written from the artifact — not reverse-engineered to bless a score already chosen.

## Output contract

Caller gets: approved artifact path, final score + gap list, and the readout (decisions, assumptions, uncertainties). Implementation then proceeds against the prototype.

## Anti-patterns

- Scoring from imagination instead of a render.
- Inventing a format that cannot be rendered or visualized.
- Fidelity creep: iterating the sketch toward the final product.
- Gap-list theater: writing gaps to justify a pre-chosen score.
- Silently diverging from the approved prototype during implementation.
- Skimming past step 3 for "obvious" builds — the loop is where the reasoning happens.
