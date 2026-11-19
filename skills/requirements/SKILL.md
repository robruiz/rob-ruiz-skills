---
name: requirements
description: Use when writing requirements for a spec, brief, feature plan, or acceptance criteria — the standard when/if/then requirement syntax. Trigger keywords: requirements, acceptance criteria, when/if/then, shall, spec writing, brief. DO NOT trigger for bugfixes with no behavioral surface, pure refactors, or reading existing specs.
---

# Requirements — when/if/then syntax

Every spec carries a numbered requirement list in when/if/then form. These requirements are the contract: implementation follows them, and the close-out acceptance check verifies against them. No requirement list, no "done".

## Syntax

One requirement per item, numbered `R1`, `R2`, … stable for the life of the spec:

```
R<n> [<priority>] — <short title>
  When <situation / trigger — who is where, doing what>
  If   <condition — optional; omit the line when unconditional>
  Then <observable expected behavior — what the user/system sees>
```

- **Priority** is one of `must` / `should` / `could` (default `must`). A `should` may be waived by the user; a `must` may not.
- **When** names the actor and situation: "When the user clicks Generate on the Tokens step", not "When generating".
- **If** is for branches (empty state, error, role, mode). At most one If line; split into two requirements when a feature has two independent conditions.
- **Then** is the observable outcome — behavior, visible state, message, timing bound, data change. One outcome per requirement.

## Bind each requirement to its proof

A requirement without a named check is an aspiration. At authoring time (not at close-out), add the method and the evidence target:

| R-ID | Method | Evidence target |
|---|---|---|
| R3 | test | `nav-drawer.test.ts` · "R3 keyboard escape closes drawer" |
| R7 | walkthrough | `specs/<slug>/evidence/reduced-motion.png` |

Methods: `test`, `command`, `walkthrough`, `vision`, `review`. The close-out acceptance check executes this plan instead of inventing one after the fact. If you cannot name a method, the requirement is not observable yet — rewrite it.

## Non-functional block (include when the change touches any of these)

Write these as ordinary requirements, not a separate appendix, but make sure each area is covered or explicitly out of scope:

- **Performance** — a budget with a number ("Then the panel opens within 150ms on the mid-tier laptop").
- **Accessibility** — keyboard path, focus order, contrast, reduced motion.
- **Data integrity** — what happens to existing rows/sessions/files, and how rollback works.
- **Security / trust boundary** — what crosses a boundary, what is never logged.
- **Failure** — offline, timeout, partial write, permission denied: one requirement each.

## Rules

- **Observable or it doesn't ship.** No "fast" → "Then the list renders within 300ms". No "robust" → "Then a failed save shows an error toast and leaves the document unchanged". If a Then can't be checked by a test, a screenshot, a walkthrough step, or a command's output, rewrite it.
- **No design prose in Then.** Look-and-feel direction lives in the design mockups; a requirement states what must hold (e.g. "Then the primary action is reachable without scrolling at 390px"), not how it is styled.
- **Cover the unhappy paths.** Every feature gets at least one requirement per error/empty/loading state it can enter. This is where expected UX usually breaks.
- **Derive, don't decorate.** Write requirements from the brief/user need, one per distinct promise. 5–15 per feature is the healthy range; if over ~20, the scope is too big or the requirements are splitting hairs.
- **Update the list when reality changes.** If implementation forces a deviation, amend the requirement in the spec (with a one-line why) — never silently drop it.

## Where they live

- In a staged design flow: a **Requirements (when/if/then)** section in the brief, carried forward into the selected mockup as the acceptance contract.
- In md specs (architect, implementation plans): a `## Requirements (when/if/then)` section near the top.
- Written through `spec-author` — that skill judges depth (`none` / `md` / `md_html`) before any file is created, and owns the canonical markdown that the HTML view renders.
- IDs are referenced verbatim by tests (`R3` in a test name/comment), by the acceptance matrix, and in progress notes.

## Pairing

- The design/mockup workflow requires this list before any mockups are built.
- The close-out acceptance check consumes this list and fails any unverified requirement.
- Behavioral testing locks `must` requirements wherever a test is the cheapest honest check.
