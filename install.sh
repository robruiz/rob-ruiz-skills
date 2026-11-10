#!/usr/bin/env bash
# Install these skills into an OpenCode config directory.
#   ./install.sh           skip files that already exist
#   ./install.sh --force   overwrite
set -euo pipefail

SRC="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DEST="${OPENCODE_CONFIG:-$HOME/.config/opencode}"
FORCE=0
[ "${1:-}" = "--force" ] && FORCE=1

copy() {
  local src="$1" dst="$2"
  mkdir -p "$(dirname "$dst")"
  if [ -e "$dst" ] && [ "$FORCE" -eq 0 ]; then
    printf 'skip (exists): %s\n' "$dst"
  else
    cp "$src" "$dst"
    printf 'installed:     %s\n' "$dst"
  fi
}

for dir in "$SRC"/skills/*/; do
  name="$(basename "$dir")"
  copy "$dir/SKILL.md" "$DEST/skill/$name/SKILL.md"
done

copy "$SRC/templates/spec.md"   "$DEST/spec-templates/spec.md"
copy "$SRC/templates/spec.html" "$DEST/spec-templates/spec.html"
copy "$SRC/scripts/spec-triage.mjs" "$DEST/scripts/spec-triage.mjs"
copy "$SRC/scripts/spec-triage-fixtures.json" "$DEST/scripts/spec-triage-fixtures.json"
copy "$SRC/commands/spec.md" "$DEST/command/spec.md"

printf '\nDone. Restart your agent so it loads the new skills.\n'
printf 'Verify: node %s/scripts/spec-triage.mjs --self-test --heuristic\n' "$DEST"
