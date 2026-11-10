# <Title> — spec v0.1 (<YYYY-MM-DD>)

> Depth: `<none|md|md_html>` · Triage: `<jev|fallback>` · Status: `draft`
> Owner: Rob · Seams: `<n>`

## Problem

What is missing or broken, from the user's or system's point of view. No solution language. 2-4 sentences.

## Solution

The approach in 3-5 sentences: the shape, the boundary, why this shape and not the obvious alternative.

## How we prove it

Seams agreed before code. Prefer existing seams; use the highest one; one is ideal.

| Seam | What it pins | Kind |
|---|---|---|
| `<module or endpoint>` | `<behavior>` | test / command / walkthrough / vision / review |

| R-ID | Check | Evidence target |
|---|---|---|
| R1 | `<method>` | `<test name, command, screenshot path>` |

## Requirements (when/if/then)

Per the `requirements` skill. IDs are stable forever.

```
R1 [must] — <short title>
  When <trigger>
  If   <condition, optional>
  Then <observable outcome>
```

## Data examples

Only when a data flow, payload, record, or state is involved. Actual values, not placeholders.

```
Request   { ... }
Result    { ... }
```

What this proves: `<one sentence>`.

## Mockups

Only when mockups exist. Path, region, and the requirement IDs it demonstrates.

`specs/<slug>/mockups/...` — region `<name>` demonstrates `R1`, `R3`. Settles: `<what>`.

## Decisions

Numbered, permanent. Context → options → decision → consequence.

1. **<Decision title>** — Chose `<X>` over `<Y>`. Because `<reason grounded in code, docs, or the request>`. Consequence: `<what becomes true / harder>`.
   *(amended <date>: <why>)*

## Out of scope

- `<thing deliberately not done>` — `<why it was refused>`

## Open questions

Checklist. Unchecked = unresolved, checked = answered inline.

- [ ] Q1 `<question>` — proposed default: `<default>` · blocks: `<yes|no>`
- [x] Q2 `<question>` — resolved: `<answer, date>`

## Review

| Dimension | Score | Evidence |
|---|---|---|
| Context completeness | `<n>/5` | `<what is present / missing>` |
| Requirement testability | `<n>/5` | `<...>` |
| Readiness | `<n>/5` | `<the question a builder would still ask>` |
| Implementation confidence | `<n>/5` | `<...>` |
| Risk coverage | `<n>/5` | `<...>` |
| Decision traceability | `<n>/5` | `<...>` |
| **Total** | `<n>/30` | Verdict: `<SHIP|REVISE|BLOCK>` |

Reviewed by: `<critic>` · `<date>` · round `<n>`
Findings: `F1 <severity> <finding>` → `<fixed|dismissed (reason)>`

## Risks

- `<risk>` — `<what we could not verify>`
