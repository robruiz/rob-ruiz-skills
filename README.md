# Rob Ruiz skills

Agent skills for writing specs that humans can read and agents can build from. Built for [OpenCode](https://opencode.ai), portable to any harness that loads `SKILL.md` files.

The problem these solve: specs with no testable contract, markdown and HTML versions that drift, and HTML artifacts written for changes that needed one sentence. The fix is judged depth, a capability split between reasoning and formatting, and one canonical source.

## What's inside

| Skill | Does |
|---|---|
| `spec-author` | Judges how much spec a request needs (`none` / `md` / `md_html`), does the reasoning with a capable model, delegates only markup |
| `spec-review` | Adversarial review before code: six dimensions scored 0–5, SHIP / REVISE / BLOCK |
| `spec-html` | The artifact protocol: first-viewport triad, layout vocabulary, diagrams, data examples, embedded mockups, scorecard |
| `requirements` | `when/if/then` requirements, one check method each, non-functional coverage |
| `skill-author` | Scope judgment for new skills (harness vs project, unclear → project) and how to write one |

Plus `templates/` (a markdown skeleton and a working HTML template), `scripts/spec-triage.mjs` (the depth/scope judge, with a deterministic fallback), and a complete worked example in `examples/spec-authoring-system/`.

## How it flows

```
request → depth judge → none: no file
                      → md: decision record (spec.md)
                      → md_html: md + packet.md → cheap model renders spec.html
                                     ↓
                            adversarial review (scored)
                                     ↓
                       implement → acceptance eval → amend the md
```

Two rules carry most of the value:

1. **Markdown is canonical.** The HTML is a rendered view. If a fact exists only in the HTML, it's a defect.
2. **Reasoning does not get delegated down.** Research, decisions, and diagram semantics stay on the capable model; a cheaper one may only lay out pages from a written packet. That packet is the boundary that prevents a fast model from inventing plausible architecture.

## Install

```bash
git clone https://github.com/robruiz/rob-ruiz-skills.git
cd rob-ruiz-skills
./install.sh          # copies into ${OPENCODE_CONFIG:-~/.config/opencode}
./install.sh --force  # overwrite existing files
```

Then restart your agent so it picks up the skills. The `/spec` command lands in `command/spec.md`.

Requires Node 18+ for the triage script.

## The judge (optional, degrades gracefully)

`spec-triage.mjs` calls [Jev](https://jevmodel.org) through OpenRouter's decisions endpoint when `OPENROUTER_API_KEY` is set (or an OpenCode `auth.json` key is present). A call costs about $0.00003 and returns in 200–500ms.

```bash
node scripts/spec-triage.mjs "add a dark mode toggle"
node scripts/spec-triage.mjs --json "refactor the agent runtime across three services"
node scripts/spec-triage.mjs --scope "a reusable skill for reviewing migrations"
node scripts/spec-triage.mjs --self-test
```

No key? Every command falls back to a deterministic heuristic and flags `source: "fallback"`, so nothing blocks. The fallback is deliberately conservative: it never upgrades a request to an HTML artifact on a hunch.

The `--scope` mode answers a different question: does this skill or spec belong to every project (harness level) or one codebase (project level)? Unclear always resolves to project, because a global skill that fits nothing is worse than a local one promoted later.

## Layout

```
skills/                 one SKILL.md per skill
templates/              spec.md skeleton, spec.html with the artifact chrome
scripts/                spec-triage.mjs + fixtures
commands/spec.md        the /spec entry point
examples/               a full spec, packet, and rendered artifact
install.sh
```

## License

MIT. Take it, change it, no attribution needed.
