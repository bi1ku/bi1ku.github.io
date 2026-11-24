# Visitor analytics

A tiny Cloudflare Worker + D1 database that records each visit to the portfolio and
shows a password-protected dashboard: visitors, pages, referrers, country / city,
network organisation (ISP, university, company), device, and whether the visitor
looks like they're on a VPN, proxy, Tor, iCloud Private Relay, or a cloud server.

Runs entirely on Cloudflare's free tier.

## One-time setup

Run these from this `analytics/` directory (the `-c wrangler.toml` flag is needed
because the repo root has its own Wrangler state):

```bash
npx wrangler login
npx wrangler d1 create portfolio-analytics          # paste the printed database_id into wrangler.toml
npx wrangler d1 migrations apply portfolio-analytics --remote -c wrangler.toml
npx wrangler secret put DASHBOARD_PASSWORD -c wrangler.toml
npx wrangler deploy -c wrangler.toml                # prints https://portfolio-analytics.<you>.workers.dev
```

Then set `ANALYTICS_URL` in `../pages-main.tsx` to that URL and push to `main`.

Open `https://portfolio-analytics.<you>.workers.dev/dashboard` and sign in with any
username and your `DASHBOARD_PASSWORD`.

### Better VPN detection (optional)

By default, VPN / datacenter status is guessed from the visitor's network name
(e.g. "Mullvad", "M247", "DigitalOcean"). For real VPN / proxy / Tor flags, create a
free account at https://ipapi.is (1,000 lookups/day; results are cached 30 days per IP) and run:

```bash
npx wrangler secret put IPAPI_KEY -c wrangler.toml
```

This sends visitor IP addresses to ipapi.is.

## Tracking links (`?ref=`)

Add a `ref` tag to any link you share and the dashboard groups visits by it:

```
https://bi1ku.github.io/?ref=resume
https://bi1ku.github.io/?ref=linkedin
```

`utm_source=` works too. Tags are lowercased and limited to letters, digits and `-._~:@+`.
Each visit also records the previous website (`document.referrer`); most browsers only
send its domain, but the full URL is shown whenever one arrives.

### Upgrading an existing deployment

Apply new migrations **before** deploying the worker, or hits will fail to save:

```bash
npx wrangler d1 migrations apply portfolio-analytics --remote -c wrangler.toml
npx wrangler deploy -c wrangler.toml
```

## Local testing

```bash
echo 'DASHBOARD_PASSWORD=test' > .dev.vars
npx wrangler d1 migrations apply portfolio-analytics --local -c wrangler.toml
npx wrangler dev -c wrangler.toml
```

## Privacy notes

Raw IP addresses and user agents are stored so you can tell visitors apart.
Delete old rows whenever you like, e.g.:

```bash
npx wrangler d1 execute portfolio-analytics --remote -c wrangler.toml \
  --command "DELETE FROM visits WHERE ts < (unixepoch() - 90*86400) * 1000"
```
