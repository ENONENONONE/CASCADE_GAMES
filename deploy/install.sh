#!/usr/bin/env bash
# THE FOLD — one-time setup of Vita (Debian, Ubuntu or Raspbian) for https://start.cascade.training. Run once as root:
#   sudo FOLD_USER=$USER bash deploy/install.sh
# It installs Caddy from its apt repository if missing, checks the game out at /srv/fold owned by FOLD_USER, points the Caddy
# service at /srv/fold/deploy/Caddyfile (so a pull that changes the Caddyfile can reload it without root) and starts it. Caddy
# fetches the certificate from Let's Encrypt on the first request, so the DNS A/AAAA record must already point at this box and
# ports 80 and 443 must be open. After this, every later deploy is deploy/deploy.sh (or the GitHub Action).
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

say "up. https://start.cascade.training/ (the first request fetches the certificate; give it a few seconds)"
say "later deploys: bash $FOLD_DIR/deploy/deploy.sh, or a push to main with the GitHub Action secrets set (deploy/README.md)"
