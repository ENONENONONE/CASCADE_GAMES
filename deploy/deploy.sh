#!/usr/bin/env bash
# THE FOLD — put main on Vita. Run on the server as the deploy user (no root): clones the repository the first time, afterwards
# fast-forwards it to origin/main, keeps the files readable by Caddy, and reloads Caddy only when deploy/Caddyfile changed.
# The GitHub Action deploy/.. /.github/workflows/deploy.yml pipes this script over ssh on every push to main; it also runs by hand:
#   bash deploy/deploy.sh
# Settings (environment): FOLD_DIR (default /srv/fold), FOLD_BRANCH (main), FOLD_REPO (the GitHub url).
set -euo pipefail

FOLD_DIR=${FOLD_DIR:-/srv/fold}
FOLD_BRANCH=${FOLD_BRANCH:-main}
FOLD_REPO=${FOLD_REPO:-https://github.com/enonenonone/cascade_games.git}
CADDYFILE="$FOLD_DIR/deploy/Caddyfile"

say() { printf '\033[1;33m[fold]\033[0m %s\n' "$*"; }

if [ ! -d "$FOLD_DIR/.git" ]; then
  say "cloning $FOLD_REPO ($FOLD_BRANCH) into $FOLD_DIR"
  git clone --quiet --branch "$FOLD_BRANCH" "$FOLD_REPO" "$FOLD_DIR"
  before=none
else
  before=$(git -C "$FOLD_DIR" rev-parse HEAD)
  say "fetching origin/$FOLD_BRANCH"
  git -C "$FOLD_DIR" fetch --quiet origin "$FOLD_BRANCH"
  git -C "$FOLD_DIR" checkout --quiet "$FOLD_BRANCH" 2>/dev/null || git -C "$FOLD_DIR" checkout --quiet -b "$FOLD_BRANCH" "origin/$FOLD_BRANCH"
  git -C "$FOLD_DIR" reset --quiet --hard "origin/$FOLD_BRANCH"
fi
after=$(git -C "$FOLD_DIR" rev-parse HEAD)

# Caddy runs as its own user and only reads: every file of the checkout world-readable, every folder enterable.
chmod -R o+rX "$FOLD_DIR"

# Reload Caddy when its config changed (the running config is this very file, see deploy/install.sh); the static files need no
# reload, a pull is live at once. The admin socket on localhost:2019 takes the reload from any local user.
if command -v caddy >/dev/null 2>&1 && systemctl is-active --quiet caddy 2>/dev/null; then
  if [ "$before" = none ] || ! git -C "$FOLD_DIR" diff --quiet "$before" "$after" -- deploy/Caddyfile; then
    say "Caddyfile changed: validating and reloading"
    caddy validate --config "$CADDYFILE" --adapter caddyfile >/dev/null
    caddy reload --config "$CADDYFILE" --adapter caddyfile
  fi
fi

if [ "$before" = "$after" ]; then
  say "already at $after, nothing new"
else
  say "deployed $after ($(git -C "$FOLD_DIR" log -1 --format='%s' "$after"))"
fi
say "https://start.cascade.training/"
