# Rob Ruiz skills

Agent skills built for [OpenCode](https://opencode.ai), portable to any harness that loads `SKILL.md` files.

## What's inside

| Skill | Does |
|---|---|
| `spec-html` | The HTML artifact protocol: first-viewport triad, layout vocabulary, diagrams, data examples, embedded mockups, scorecard. Runs after spec triage says the request warrants an HTML render. |
| `visual-prototyper` | Low-fi spike before implementation: build a disposable prototype (HTML boxes, SVG projections, storyboard, Mermaid, throwaway code), loop build-render-assess to ≥95% representational confidence with a mandatory gap list, then pause for approval. |

Supporting files the skills reference: `templates/` (a markdown skeleton and a working HTML template), `scripts/spec-triage.mjs` (the depth/scope judge, with a deterministic fallback), `commands/spec.md` (the `/spec` entry point), and a complete worked example in `examples/spec-authoring-system/`.

`skills/visual-prototyper/TEST-NOTES.md` is the first-run experiment record, kept as provenance.

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
node scripts/spec-triage.mjs --self-test
```

No key? Every command falls back to a deterministic heuristic and flags `source: "fallback"`, so nothing blocks. The fallback is deliberately conservative: it never upgrades a request to an HTML artifact on a hunch.

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
