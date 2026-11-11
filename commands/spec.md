---
description: Author a spec at the right depth — Jev triage, capable-model reasoning, cheap-model HTML rendering. Args are the request.
agent: build
---

Author a spec for: $ARGUMENTS

1. Run `node ~/.config/opencode/scripts/spec-triage.mjs --log "$ARGUMENTS"` and state the depth verdict in one line. `--log` is mandatory: it is the only proof that triage ran.
2. Load the `spec-author` skill and follow it exactly: research/decisions yourself (capable model), markdown as the source of truth, adversarial review via `spec-review`, and a cheap render subagent for HTML only when depth is `md_html` (load `spec-html`; hand over a written packet file).
3. If triage returned `source: fallback` or any override, stop and confirm depth with the user before writing.
4. Report at the end: depth chosen, md path, html path if any, requirement count, and the seams you are proposing to test at.
