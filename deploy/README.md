# Deploying THE FOLD to Vita · https://start.cascade.training

The game is static files with no build step, so the server only has to serve `cascade_ar/` over https (the service worker, the
gyro and the camera all refuse plain http). This folder holds everything Vita needs; the DNS record for start.cascade.training
is assumed to point at Vita already, with ports 80 and 443 open.

| File | What it is |
| --- | --- |
| `Caddyfile` | The site: `cascade_ar/` as the root, automatic Let's Encrypt TLS, http → https, the headers (camera and gyro permissions, CSP, caching), the parts' notes and demos hidden. |
| `install.sh` | One-time setup, as root: installs Caddy if missing, checks the game out at `/srv/fold`, points the Caddy service at this Caddyfile, starts it. |
| `deploy.sh` | Every later deploy, as the deploy user: fast-forwards `/srv/fold` to origin/main, reloads Caddy if the Caddyfile changed. |
| `nginx.conf` | The same site for a Vita that already runs nginx (certificates from certbot). |
| `../.github/workflows/deploy.yml` | On every push to main: the check suites, then `deploy.sh` over ssh. |

## First time, on Vita

```
git clone https://github.com/enonenonone/cascade_games.git ~/cascade_games
sudo FOLD_USER=$USER bash ~/cascade_games/deploy/install.sh
```

That leaves the game at `/srv/fold/cascade_ar` served by Caddy on https://start.cascade.training/. Caddy fetches the certificate
on the first request; give it a few seconds. Check with:

```
curl -sI https://start.cascade.training/ | head -n 5
systemctl status caddy
journalctl -u caddy -n 50 --no-pager
```

Debian, Ubuntu and Raspbian are what `install.sh` knows (Caddy's apt repository). On another distribution, install Caddy by its own
instructions, then run the service on `/srv/fold/deploy/Caddyfile` as the systemd override in `install.sh` does.

## Every later deploy

By hand on Vita:

```
bash /srv/fold/deploy/deploy.sh
```

Or on push to main: add these repository secrets on GitHub (Settings → Secrets and variables → Actions) and the workflow runs the
check suites and then `deploy.sh` over ssh.

| Secret | Value |
| --- | --- |
| `VITA_HOST` | `start.cascade.training` (or Vita's address) |
| `VITA_USER` | the deploy user, the `FOLD_USER` of `install.sh` |
| `VITA_SSH_KEY` | a private key (`ssh-keygen -t ed25519 -f vita_deploy -N ''`) whose public half is in that user's `~/.ssh/authorized_keys` on Vita |
| `VITA_KNOWN_HOSTS` | the output of `ssh-keyscan start.cascade.training` |
| `VITA_PORT` | optional, the ssh port if not 22 |

Without `VITA_HOST` the workflow runs the checks and skips the deploy with a notice, so the repository is safe to push before the
secrets exist.

## Already running nginx?

Use `nginx.conf` instead of Caddy: still run `deploy.sh` once for the checkout (it skips the Caddy reload when Caddy is not
running), then

```
sudo cp /srv/fold/deploy/nginx.conf /etc/nginx/sites-available/start.cascade.training
sudo ln -s /etc/nginx/sites-available/start.cascade.training /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
sudo certbot --nginx -d start.cascade.training
```

## What the server must get right

- **https** on the real hostname: the service worker (`sw.js`), `DeviceOrientationEvent.requestPermission` and `getUserMedia`
  are all https-only. Both configs redirect http.
- **No stale `sw.js` or scripts**: both configs send `Cache-Control: no-cache` for the page, the worker, the manifest and every
  script. The worker's own cache (`CACHE` in `sw.js`, bumped on every change) is the offline copy and installs past the HTTP
  cache, so this costs nothing and keeps a phone from pinning an old game. Only `vendor/three.min.js` is cached for a year.
- **Permissions-Policy** names camera, gyroscope, accelerometer and magnetometer for this origin.
- **CSP** allows only the game's own files, inline script and style (the page is one inline script), `data:`/`blob:` images and
  `blob:` media for the camera stream. The game loads nothing from another origin.
- `*.webmanifest` served as `application/manifest+json`, or the install prompt never shows.
