#!/usr/bin/env bash
# THE FOLD — one-time setup of Vita (Debian, Ubuntu or Raspbian) for https://start.cascade.training. Run once as root:
#   sudo FOLD_USER=$USER bash deploy/install.sh
# It installs Caddy from its apt repository if missing, checks the game out at /srv/fold owned by FOLD_USER, points the Caddy
# service at /srv/fold/deploy/Caddyfile (so a pull that changes the Caddyfile can reload it without root) and starts it. Caddy
# fetches the certificate from Let's Encrypt on the first request, so the DNS A/AAAA record must already point at this box and
# ports 80 and 443 must be open. Then THE LEDGER's service (deploy/ledger/server.js, node 18 or later) as the systemd unit
# fold-ledger on 127.0.0.1:8257, its store at /srv/fold-ledger outside the checkout, and a sudoers line so deploy.sh can restart
# it; without node 18 the game runs without the ledger. After this, every later deploy is deploy/deploy.sh (or the GitHub Action).
set -euo pipefail

FOLD_DIR=${FOLD_DIR:-/srv/fold}
FOLD_USER=${FOLD_USER:-${SUDO_USER:-$(id -un)}}
[ "$(id -u)" = 0 ] || { echo "run as root: sudo FOLD_USER=\$USER bash deploy/install.sh" >&2; exit 1; }

say() { printf '\033[1;33m[fold]\033[0m %s\n' "$*"; }

if ! command -v caddy >/dev/null 2>&1; then
  say "installing Caddy"
  apt-get update -qq
  apt-get install -y -qq debian-keyring debian-archive-keyring apt-transport-https curl git
  curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
  curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' > /etc/apt/sources.list.d/caddy-stable.list
  apt-get update -qq
  apt-get install -y -qq caddy
fi
command -v git >/dev/null 2>&1 || apt-get install -y -qq git

say "checkout at $FOLD_DIR as $FOLD_USER"
mkdir -p "$FOLD_DIR"
chown "$FOLD_USER" "$FOLD_DIR"
sudo -u "$FOLD_USER" env FOLD_DIR="$FOLD_DIR" bash "$(dirname "$0")/deploy.sh" || true   # the clone; Caddy is not up yet
[ -f "$FOLD_DIR/deploy/Caddyfile" ] || { echo "no $FOLD_DIR/deploy/Caddyfile after the clone" >&2; exit 1; }

say "Caddy service on $FOLD_DIR/deploy/Caddyfile"
install -d -o caddy -g caddy /var/log/caddy
install -d /etc/systemd/system/caddy.service.d
cat > /etc/systemd/system/caddy.service.d/fold.conf <<EOF
[Service]
ExecStart=
ExecStart=/usr/bin/caddy run --environ --config $FOLD_DIR/deploy/Caddyfile --adapter caddyfile
ExecReload=
ExecReload=/usr/bin/caddy reload --config $FOLD_DIR/deploy/Caddyfile --adapter caddyfile --force
EOF
caddy validate --config "$FOLD_DIR/deploy/Caddyfile" --adapter caddyfile >/dev/null
systemctl daemon-reload
systemctl enable --quiet caddy
systemctl restart caddy
sleep 1
systemctl is-active --quiet caddy || { journalctl -u caddy -n 30 --no-pager; exit 1; }

# THE LEDGER (deploy/ledger/server.js): a node service Caddy proxies at /ledger; its store outside the checkout (a deploy resets the
# checkout); deploy.sh restarts it through the sudoers line written here
LEDGER_DIR=${LEDGER_DIR:-/srv/fold-ledger}
node18() { node -e 'process.exit(+process.versions.node.split(".")[0] >= 18 ? 0 : 1)' 2>/dev/null; }
node18 || { say "node 18 or later is not here: trying apt"; apt-get install -y -qq nodejs || true; }
if node18; then
  say "the ledger service as $FOLD_USER, the store at $LEDGER_DIR/ledger.jsonl"
  install -d -o "$FOLD_USER" -g "$(id -gn "$FOLD_USER")" "$LEDGER_DIR"
  [ -f "$LEDGER_DIR/env" ] || { printf '%s\n' '# FOLD_LEDGER_ADMIN=a-long-secret   # uncomment to allow DELETE /ledger/<id> with Authorization: Bearer <it>, then: sudo systemctl restart fold-ledger' > "$LEDGER_DIR/env"; chown "$FOLD_USER" "$LEDGER_DIR/env"; chmod 600 "$LEDGER_DIR/env"; }
  cat > /etc/systemd/system/fold-ledger.service <<EOF
[Unit]
Description=THE FOLD ledger (deploy/ledger/server.js)
After=network.target

[Service]
User=$FOLD_USER
Environment=FOLD_LEDGER_PORT=8257
Environment=FOLD_LEDGER_HOST=127.0.0.1
Environment=FOLD_LEDGER_DATA=$LEDGER_DIR/ledger.jsonl
EnvironmentFile=-$LEDGER_DIR/env
ExecStart=$(command -v node) $FOLD_DIR/deploy/ledger/server.js --no-static
Restart=on-failure
RestartSec=2

[Install]
WantedBy=multi-user.target
EOF
  printf '%s\n' "$FOLD_USER ALL=(root) NOPASSWD: $(command -v systemctl) restart fold-ledger" > /etc/sudoers.d/fold-ledger
  chmod 440 /etc/sudoers.d/fold-ledger
  systemctl daemon-reload
  systemctl enable --quiet fold-ledger
  systemctl restart fold-ledger
  sleep 1
  systemctl is-active --quiet fold-ledger || { journalctl -u fold-ledger -n 30 --no-pager; exit 1; }
else
  say "no node 18 or later: the ledger service is not set up (install node from nodesource.com and run this again); the game runs without it"
fi

say "up. https://start.cascade.training/ (the first request fetches the certificate; give it a few seconds)"
say "later deploys: bash $FOLD_DIR/deploy/deploy.sh, or a push to main with the GitHub Action secrets set (deploy/README.md)"
