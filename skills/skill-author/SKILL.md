---
name: skill-author
description: Use when creating, extracting, editing, or sharing a skill — decides harness vs project scope with a judge call, then writes the SKILL.md at the right home. Trigger keywords: new skill, create a skill, write a skill, extract this into a skill, skill for, share my skills, skill scope.
---

# Skill author — judge scope first, then write

A skill is a routing document, not an essay. Its description decides whether it ever loads; its body decides whether loading helps. Get the scope wrong and the wrong home rots.

## Step 1 — Scope the skill (mandatory, before writing)

```bash
node ~/.config/opencode/scripts/spec-triage.mjs --scope "<what the skill does, and who it serves>"
```

| Verdict | Home |
|---|---|
| `harness` | `~/.config/opencode/skill/<name>/SKILL.md` — applies to every project |
| `project` | `<repo>/.opencode/skill/<name>/SKILL.md` — one codebase, stack, or client |

Rules:
- **Unclear means project.** Only promote to harness when the judge says harness with confidence ≥ 0.7 and you can name the cross-project concern in one sentence.
- `source: fallback` or any `override` → ask the user before installing globally.
- A project skill that earns reuse gets promoted later. A harness skill that turns out to be one repo's quirk is worse: it loads everywhere and fits nowhere.
- Check for an existing owner first: `ls ~/.config/opencode/skill` and the project's `.opencode/skill`. Extending one skill beats adding a near-duplicate that competes for the same trigger.

## Step 2 — Write the description, not the body, first

The description is the entire product: it is what the agent sees before deciding to load.

```yaml
description: Use when <situation, in the user's words>. <One sentence on what it does.> Trigger keywords: <5-8 phrases someone would actually type>. DO NOT trigger for <the nearest false positive>.
```

- Trigger phrases come from real requests, not synonyms you invented.
- Name the nearest false positive explicitly, or the skill will steal another skill's traffic.
- Harness skills are global: their description competes with ~15 others. If two descriptions overlap, one of them is redundant.

## Step 3 — Body shape

Under ~100 lines. Structure:

1. **One-line purpose**, then the rule that matters most.
2. **When this applies / when it does not** — if the description was precise, this is one line.
3. **Steps**, numbered, with the actual command or path.
4. **Hard rules** — the ones that prevent a known failure, each with its reason.
5. **Output contract** — what the caller should get back.
6. **Anti-patterns** — failures already observed, not hypotheticals.

No preamble, no motivation section, no restating the description. If a rule cannot be checked, cut it or make it checkable.

## Step 4 — Verify it before shipping

- **Trigger test:** would a fresh session load this on the intended phrase, and *not* load it on the nearest false positive? Read only the description and answer.
- **Collision test:** `grep -h "^description:" ~/.config/opencode/skill/*/SKILL.md` — if yours overlaps, sharpen or merge.
- **Path test:** every path in the body resolves from the home you chose.
- **Scope test:** does the body assume one repo? Then it is a project skill, whatever the judge said.

## Step 5 — Register only what needs routing

Add an AGENTS.md row only when the skill is a *seat*: a situation the primary must be routed to (review gate, spec authoring, design). Reference material and technique skills stay unlisted and load by description.

## Step 6 — Log and share

- Harness skill changed → one line in `~/.config/opencode/notes/harness-changelog.md` (what changed, why, how it will be measured).
- Sharing: copy the folder into the personal skills repo, keep the relative paths working, and do not strip the trigger keywords on the way out — they are the part other people need most.

## Anti-patterns

- Writing the body first and back-filling a vague description: the skill never loads.
- A harness skill whose content is one project's convention.
- Two skills with the same trigger: whichever loads is luck.
- A skill that restates doctrine already in AGENTS.md, so the two drift.
