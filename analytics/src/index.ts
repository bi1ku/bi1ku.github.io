/**
 * Visitor analytics for the portfolio.
 *
 *   POST /hit        beacon sent by the site on each page load (public, origin-checked)
 *   GET  /dashboard  password-protected stats page (HTTP Basic auth, any username)
 */

interface Env {
  DB: D1Database;
  ALLOWED_ORIGINS: string;
  DASHBOARD_PASSWORD?: string;
  IPAPI_KEY?: string;
}

type Privacy = "vpn" | "proxy" | "tor" | "relay" | "datacenter" | "none" | "unknown";

interface HitBody {
  path?: unknown;
  referrer?: unknown;
  screen?: unknown;
  language?: unknown;
}

const DAY = 86_400_000;
const IP_CACHE_TTL = 30 * DAY;

// ---------------------------------------------------------------- helpers

function clip(value: unknown, max: number): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed ? trimmed.slice(0, max) : null;
}

function escapeHtml(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

async function sha256(text: string): Promise<string> {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return [...new Uint8Array(digest)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function safeEqual(a: string, b: string): Promise<boolean> {
  const [ha, hb] = await Promise.all([sha256(a), sha256(b)]);
  let diff = 0;
  for (let i = 0; i < ha.length; i++) diff |= ha.charCodeAt(i) ^ hb.charCodeAt(i);
  return diff === 0;
}

const BOT_UA = /bot|crawl|spider|slurp|headless|lighthouse|preview|facebookexternalhit|embedly|curl|wget|python|go-http|node-fetch|axios|monitor/i;

// ------------------------------------------------- VPN / proxy detection

// Matched against the network's registered organisation name. These are hints,
// not proof: a "datacenter" visitor may be a VPN, a cloud VM, or a scraper.
const VPN_ORGS = /nordvpn|tefincom|expressvpn|express technologies|mullvad|proton|surfshark|private internet access|cyberghost|windscribe|ipvanish|hide\.?me|purevpn|tunnelbear|hotspot shield|pango|astrill|vyprvpn|golden frog|torguard|airvpn|ivpn|m247|datacamp|cdn77|packethub|31173 services|xtom|zenlayer/i;
const DATACENTER_ORGS = /amazon web services|amazon data services|amazon technologies|\baws\b|google cloud|microsoft azure|azure|digitalocean|linode|akamai connected cloud|ovh|hetzner|vultr|choopa|the constant company|oracle|alibaba|tencent|contabo|leaseweb|scaleway|online s\.a\.s|hostinger|hostwinds|kamatera|ionos|godaddy|colocrossing|psychz|quadranet|servers\.com|frantech|buyvm|g-core|gcore|stark industries|aeza|hivelocity|performive/i;
// iCloud Private Relay and Cloudflare WARP egress through these networks.
const RELAY_ASNS = new Set([13335, 36183, 54113]);

function classifyByNetwork(asn: number | null, org: string | null): { privacy: Privacy; detail: string | null } {
  if (asn !== null && RELAY_ASNS.has(asn)) return { privacy: "relay", detail: "iCloud Private Relay / Cloudflare WARP network" };
  if (!org) return { privacy: "unknown", detail: null };
  if (VPN_ORGS.test(org)) return { privacy: "vpn", detail: `Known VPN network (${org})` };
  if (DATACENTER_ORGS.test(org)) return { privacy: "datacenter", detail: `Hosting/cloud network (${org})` };
  return { privacy: "none", detail: null };
}

interface IpapiResponse {
  is_vpn?: unknown;
  is_proxy?: unknown;
  is_tor?: unknown;
  is_datacenter?: unknown;
  vpn?: { service?: unknown } | null;
  datacenter?: { datacenter?: unknown } | null;
}

/** Looks the IP up on ipapi.is (needs a free key; keyless responses carry no VPN flags). */
async function classifyByIpapi(env: Env, ip: string): Promise<{ privacy: Privacy; detail: string | null } | null> {
  if (!env.IPAPI_KEY) return null;

  const cached = await env.DB.prepare("SELECT privacy, detail, fetched FROM ip_cache WHERE ip = ?")
    .bind(ip)
    .first<{ privacy: Privacy; detail: string | null; fetched: number }>();
  if (cached && Date.now() - cached.fetched < IP_CACHE_TTL) return { privacy: cached.privacy, detail: cached.detail };

  try {
    const url = `https://api.ipapi.is/?q=${encodeURIComponent(ip)}&key=${encodeURIComponent(env.IPAPI_KEY)}`;
    const res = await fetch(url, { signal: AbortSignal.timeout(4000) });
    if (!res.ok) return null;
    const data = (await res.json()) as IpapiResponse;
    let result: { privacy: Privacy; detail: string | null };
    if (data.is_tor) result = { privacy: "tor", detail: "Tor exit node" };
    else if (data.is_vpn) result = { privacy: "vpn", detail: typeof data.vpn?.service === "string" ? data.vpn.service : "VPN" };
    else if (data.is_proxy) result = { privacy: "proxy", detail: "Proxy" };
    else if (data.is_datacenter)
      result = {
        privacy: "datacenter",
        detail: typeof data.datacenter?.datacenter === "string" ? data.datacenter.datacenter : "Datacenter",
      };
    else result = { privacy: "none", detail: null };

    await env.DB.prepare(
      "INSERT INTO ip_cache (ip, fetched, privacy, detail) VALUES (?, ?, ?, ?) ON CONFLICT(ip) DO UPDATE SET fetched = excluded.fetched, privacy = excluded.privacy, detail = excluded.detail",
    )
      .bind(ip, Date.now(), result.privacy, result.detail)
      .run();
    return result;
  } catch {
    return null; // lookup failed; fall back to the network heuristic
  }
}

// ------------------------------------------------------------- /hit

function corsHeaders(origin: string): HeadersInit {
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}

async function recordHit(request: Request, env: Env, body: HitBody): Promise<void> {
  const ip = request.headers.get("CF-Connecting-IP") ?? "";
  const ua = clip(request.headers.get("User-Agent"), 400) ?? "";
  const cf = (request.cf ?? {}) as Record<string, unknown>;
  const asn = typeof cf.asn === "number" ? cf.asn : null;
  const asOrg = clip(cf.asOrganization, 200);

  const classified = (ip && (await classifyByIpapi(env, ip))) || classifyByNetwork(asn, asOrg);

  await env.DB.prepare(
    `INSERT INTO visits (ts, visitor, ip, path, referrer, user_agent, country, region, city, timezone,
       asn, as_org, screen, language, privacy, privacy_detail, is_bot)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
  )
    .bind(
      Date.now(),
      await sha256(`${ip}|${ua}`),
      ip || null,
      clip(body.path, 300),
      clip(body.referrer, 500),
      ua || null,
      clip(cf.country, 8),
      clip(cf.region, 100),
      clip(cf.city, 100),
      clip(cf.timezone, 64),
      asn,
      asOrg,
      clip(body.screen, 20),
      clip(body.language, 35),
      classified.privacy,
      classified.detail,
      BOT_UA.test(ua) ? 1 : 0,
    )
    .run();
}

async function handleHit(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
  const origin = request.headers.get("Origin") ?? "";
  const allowed = env.ALLOWED_ORIGINS.split(",").map((o) => o.trim());
  if (!allowed.includes(origin)) return new Response("Forbidden", { status: 403 });
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: corsHeaders(origin) });

  const raw = await request.text();
  if (raw.length > 4000) return new Response("Too large", { status: 413, headers: corsHeaders(origin) });
  let body: HitBody = {};
  try {
    body = JSON.parse(raw) as HitBody;
  } catch {
    /* record the hit without client details */
  }
  ctx.waitUntil(recordHit(request, env, body).catch((err) => console.error("recordHit failed", err)));
  return new Response(null, { status: 204, headers: corsHeaders(origin) });
}

// ------------------------------------------------------------ dashboard

const PRIVACY_LABEL: Record<Privacy, string> = {
  vpn: "VPN",
  proxy: "Proxy",
  tor: "Tor",
  relay: "Private Relay / WARP",
  datacenter: "Datacenter / cloud",
  none: "Regular network",
  unknown: "Unknown",
};

function flag(country: string | null): string {
  if (!country || !/^[A-Z]{2}$/.test(country)) return "";
  return String.fromCodePoint(...[...country].map((c) => 0x1f1a5 + c.charCodeAt(0)));
}

function describeUa(ua: string | null): string {
  if (!ua) return "—";
  const os =
    /iPhone|iPad/.test(ua) ? "iOS" : /Android/.test(ua) ? "Android" : /Mac OS X/.test(ua) ? "macOS" : /Windows/.test(ua) ? "Windows" : /CrOS/.test(ua) ? "ChromeOS" : /Linux/.test(ua) ? "Linux" : "Other";
  const browser = /Edg\//.test(ua)
    ? "Edge"
    : /OPR\//.test(ua)
      ? "Opera"
      : /Firefox\//.test(ua)
        ? "Firefox"
        : /Chrome\//.test(ua)
          ? "Chrome"
          : /Safari\//.test(ua)
            ? "Safari"
            : "Other";
  return `${browser} · ${os}`;
}

function referrerHost(ref: string | null): string {
  if (!ref) return "Direct / none";
  try {
    return new URL(ref).hostname.replace(/^www\./, "");
  } catch {
    return ref;
  }
}

function place(r: { city: string | null; region: string | null; country: string | null }): string {
  const parts = [r.city, r.region, r.country].filter(Boolean);
  return parts.length ? `${flag(r.country)} ${parts.join(", ")}`.trim() : "Unknown";
}

function table(headers: string[], rows: string[][], empty = "No data yet"): string {
  if (!rows.length) return `<p class="empty">${empty}</p>`;
  return `<div class="table-wrap"><table><thead><tr>${headers.map((h) => `<th>${h}</th>`).join("")}</tr></thead><tbody>${rows
    .map((r) => `<tr>${r.map((c) => `<td>${c}</td>`).join("")}</tr>`)
    .join("")}</tbody></table></div>`;
}

function barList(rows: { label: string; count: number }[], total: number): string {
  if (!rows.length) return `<p class="empty">No data yet</p>`;
  const max = Math.max(...rows.map((r) => r.count));
  return `<ul class="bars">${rows
    .map(
      (r) => `<li><span class="bar-label">${r.label}</span><span class="bar-track"><span class="bar-fill" style="width:${((r.count / max) * 100).toFixed(1)}%"></span></span><span class="bar-value">${r.count}<small>${total ? Math.round((r.count / total) * 100) : 0}%</small></span></li>`,
    )
    .join("")}</ul>`;
}

function dailyChart(days: { day: string; views: number; visitors: number }[]): string {
  if (!days.length) return `<p class="empty">No visits in this range yet</p>`;
  const w = 720;
  const h = 180;
  const pad = { top: 12, right: 8, bottom: 22, left: 32 };
  const max = Math.max(1, ...days.map((d) => d.views));
  const innerW = w - pad.left - pad.right;
  const innerH = h - pad.top - pad.bottom;
  const slot = innerW / days.length;
  const barW = Math.max(2, Math.min(28, slot - 2));
  const ticks = [0, Math.ceil(max / 2), max];
  const labelEvery = Math.ceil(days.length / 8);

  const grid = ticks
    .map((t) => {
      const y = pad.top + innerH - (t / max) * innerH;
      return `<line class="grid" x1="${pad.left}" x2="${w - pad.right}" y1="${y}" y2="${y}"/><text class="axis" x="${pad.left - 6}" y="${y + 4}" text-anchor="end">${t}</text>`;
    })
    .join("");

  const bars = days
    .map((d, i) => {
      const x = pad.left + i * slot + (slot - barW) / 2;
      const bh = (d.views / max) * innerH;
      const y = pad.top + innerH - bh;
      const r = Math.min(4, barW / 2, bh);
      const path = bh > 0
        ? `M${x},${pad.top + innerH} V${y + r} Q${x},${y} ${x + r},${y} H${x + barW - r} Q${x + barW},${y} ${x + barW},${y + r} V${pad.top + innerH} Z`
        : "";
      const label = i % labelEvery === 0 ? `<text class="axis" x="${x + barW / 2}" y="${h - 6}" text-anchor="middle">${escapeHtml(d.day.slice(5))}</text>` : "";
      return `<g class="col" data-tip="${escapeHtml(`${d.day}: ${d.views} views, ${d.visitors} visitors`)}"><rect class="hit" x="${pad.left + i * slot}" y="${pad.top}" width="${slot}" height="${innerH}"/>${path ? `<path class="bar" d="${path}"/>` : ""}</g>${label}`;
    })
    .join("");

  return `<div class="chart"><svg viewBox="0 0 ${w} ${h}" role="img" aria-label="Page views per day">${grid}${bars}</svg><div class="tip" hidden></div></div>`;
}

async function renderDashboard(env: Env, url: URL, nonce: string): Promise<string> {
  const rangeParam = url.searchParams.get("range") ?? "30";
  const includeBots = url.searchParams.get("bots") === "1";
  const rangeDays = rangeParam === "all" ? null : Math.max(1, Math.min(365, Number(rangeParam) || 30));
  const since = rangeDays ? Date.now() - rangeDays * DAY : 0;
  const where = `ts >= ?1 ${includeBots ? "" : "AND is_bot = 0"}`;
  const q = (sql: string) => env.DB.prepare(sql).bind(since);

  const [totals, daily, countries, cities, orgs, privacy, refs, pages, recent] = await env.DB.batch([
    q(`SELECT COUNT(*) AS views, COUNT(DISTINCT visitor) AS visitors, COUNT(DISTINCT country) AS countries,
         SUM(privacy IN ('vpn','proxy','tor','relay','datacenter')) AS masked FROM visits WHERE ${where}`),
    q(`SELECT strftime('%Y-%m-%d', ts / 1000, 'unixepoch') AS day, COUNT(*) AS views, COUNT(DISTINCT visitor) AS visitors
         FROM visits WHERE ${where} GROUP BY day ORDER BY day`),
    q(`SELECT country, COUNT(DISTINCT visitor) AS n FROM visits WHERE ${where} GROUP BY country ORDER BY n DESC LIMIT 12`),
    q(`SELECT city, region, country, COUNT(DISTINCT visitor) AS n FROM visits WHERE ${where} GROUP BY city, region, country ORDER BY n DESC LIMIT 12`),
    q(`SELECT as_org, asn, COUNT(DISTINCT visitor) AS n FROM visits WHERE ${where} GROUP BY as_org, asn ORDER BY n DESC LIMIT 15`),
    q(`SELECT privacy, COUNT(DISTINCT visitor) AS n FROM visits WHERE ${where} GROUP BY privacy ORDER BY n DESC`),
    q(`SELECT referrer, COUNT(*) AS n FROM visits WHERE ${where} GROUP BY referrer ORDER BY n DESC LIMIT 50`),
    q(`SELECT path, COUNT(*) AS n FROM visits WHERE ${where} GROUP BY path ORDER BY n DESC LIMIT 10`),
    q(`SELECT ts, ip, path, referrer, user_agent, country, region, city, timezone, asn, as_org, screen, language, privacy, privacy_detail, is_bot
         FROM visits WHERE ${where} ORDER BY ts DESC LIMIT 150`),
  ]);

  type Row = Record<string, unknown>;
  const t = (totals.results[0] ?? {}) as Row;
  const views = Number(t.views ?? 0);
  const visitors = Number(t.visitors ?? 0);
  const masked = Number(t.masked ?? 0);

  // Fill empty days so the chart shows gaps honestly.
  const dailyRows = daily.results as { day: string; views: number; visitors: number }[];
  const byDay = new Map(dailyRows.map((d) => [d.day, d]));
  const firstDay = rangeDays ? new Date(since) : dailyRows[0] ? new Date(dailyRows[0].day) : new Date();
  const days: { day: string; views: number; visitors: number }[] = [];
  for (let d = new Date(firstDay.toISOString().slice(0, 10)); d.getTime() <= Date.now(); d = new Date(d.getTime() + DAY)) {
    const key = d.toISOString().slice(0, 10);
    days.push(byDay.get(key) ?? { day: key, views: 0, visitors: 0 });
  }

  const countryTotal = (countries.results as Row[]).reduce((s, r) => s + Number(r.n), 0);
  const privacyRows = privacy.results as { privacy: Privacy; n: number }[];
  const privacyTotal = privacyRows.reduce((s, r) => s + Number(r.n), 0);

  const refCounts = new Map<string, number>();
  for (const r of refs.results as { referrer: string | null; n: number }[]) {
    const host = referrerHost(r.referrer);
    refCounts.set(host, (refCounts.get(host) ?? 0) + Number(r.n));
  }
  const refRows = [...refCounts].sort((a, b) => b[1] - a[1]).slice(0, 10);

  const badge = (p: Privacy) => `<span class="badge badge-${p}">${PRIVACY_LABEL[p] ?? escapeHtml(p)}</span>`;

  const ranges = [
    ["1", "24h"],
    ["7", "7 days"],
    ["30", "30 days"],
    ["90", "90 days"],
    ["all", "All time"],
  ]
    .map(([v, label]) => `<a href="?range=${v}${includeBots ? "&bots=1" : ""}" class="${v === rangeParam ? "on" : ""}">${label}</a>`)
    .join("");

  const fmtTime = (ts: number) => new Date(ts).toISOString().replace("T", " ").slice(0, 16) + " UTC";

  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex,nofollow"><title>Portfolio Visitors</title>
<style>
:root{color-scheme:light;--bg:#f6f5f2;--surface:#fcfcfb;--border:#e4e2dc;--text:#0b0b0b;--text-2:#52514e;--muted:#8a8984;--series:#2a78d6;--grid:#ecebe6;
--warn-bg:#fdf1dc;--warn:#8a5a00;--crit-bg:#fbe3e2;--crit:#a32a29;--info-bg:#e5eefb;--info:#1f5aa3;--ok-bg:#e3f2e8;--ok:#1f6b3a}
@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){color-scheme:dark;--bg:#121211;--surface:#1a1a19;--border:#2e2d2b;--text:#f0efec;--text-2:#c3c2b7;--muted:#8d8c86;--series:#3987e5;--grid:#262624;
--warn-bg:#3a2c0f;--warn:#f0c46a;--crit-bg:#3d1c1b;--crit:#f29b9a;--info-bg:#17273d;--info:#9cc3f2;--ok-bg:#16301f;--ok:#8fd3a6}}
:root[data-theme="dark"]{color-scheme:dark;--bg:#121211;--surface:#1a1a19;--border:#2e2d2b;--text:#f0efec;--text-2:#c3c2b7;--muted:#8d8c86;--series:#3987e5;--grid:#262624;
--warn-bg:#3a2c0f;--warn:#f0c46a;--crit-bg:#3d1c1b;--crit:#f29b9a;--info-bg:#17273d;--info:#9cc3f2;--ok-bg:#16301f;--ok:#8fd3a6}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--text);font:14px/1.45 system-ui,-apple-system,"Segoe UI",sans-serif}
main{max-width:1100px;margin:0 auto;padding:24px 16px 48px}
header{display:flex;flex-wrap:wrap;gap:12px;align-items:center;justify-content:space-between;margin-bottom:20px}
h1{font-size:20px;margin:0}h2{font-size:14px;margin:0 0 12px;color:var(--text-2);font-weight:600}
.filters{display:flex;flex-wrap:wrap;gap:4px}.filters a{padding:5px 10px;border-radius:6px;border:1px solid var(--border);color:var(--text-2);text-decoration:none;font-size:13px;background:var(--surface)}
.filters a.on{background:var(--text);color:var(--bg);border-color:var(--text)}
.tiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:12px;margin-bottom:16px}
.tile,.card{background:var(--surface);border:1px solid var(--border);border-radius:10px;padding:16px}
.tile .label{color:var(--text-2);font-size:12px}.tile .value{font-size:28px;font-weight:650;font-variant-numeric:tabular-nums;margin-top:2px}
.tile .sub{color:var(--muted);font-size:12px}
.grid2{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,420px),1fr));gap:16px;margin-bottom:16px}
.card{margin-bottom:16px}.grid2 .card{margin-bottom:0}
.chart{position:relative}svg{width:100%;height:auto;display:block}
.grid{stroke:var(--grid);stroke-width:1}.axis{fill:var(--muted);font-size:10px;font-variant-numeric:tabular-nums}
.bar{fill:var(--series)}.hit{fill:transparent}.col:hover .bar{opacity:.8}.col:hover .hit{fill:var(--grid);opacity:.5}
.tip{position:absolute;pointer-events:none;background:var(--text);color:var(--bg);padding:4px 8px;border-radius:6px;font-size:12px;white-space:nowrap;transform:translate(-50%,-110%)}
.bars{list-style:none;margin:0;padding:0;display:grid;gap:6px}
.bars li{display:grid;grid-template-columns:minmax(0,1.4fr) minmax(0,1fr) auto;gap:10px;align-items:center}
.bar-label{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.bar-track{height:8px;background:var(--grid);border-radius:4px;overflow:hidden}
.bar-fill{display:block;height:100%;background:var(--series);border-radius:0 4px 4px 0}
.bar-value{font-variant-numeric:tabular-nums;text-align:right;min-width:64px}.bar-value small{color:var(--muted);margin-left:6px}
.table-wrap{overflow-x:auto}table{width:100%;border-collapse:collapse;font-size:13px}
th{text-align:left;color:var(--text-2);font-weight:600;border-bottom:1px solid var(--border);padding:6px 8px;white-space:nowrap}
td{border-bottom:1px solid var(--grid);padding:6px 8px;vertical-align:top}td.mono,.mono{font-family:ui-monospace,SFMono-Regular,Consolas,monospace;font-size:12px}
.dim{color:var(--muted)}.empty{color:var(--muted);margin:0}
.badge{display:inline-block;padding:1px 7px;border-radius:999px;font-size:11px;font-weight:600;white-space:nowrap}
.badge-vpn,.badge-tor,.badge-proxy{background:var(--crit-bg);color:var(--crit)}.badge-datacenter{background:var(--warn-bg);color:var(--warn)}
.badge-relay{background:var(--info-bg);color:var(--info)}.badge-none{background:var(--ok-bg);color:var(--ok)}.badge-unknown{background:var(--grid);color:var(--text-2)}
.note{color:var(--muted);font-size:12px;margin:8px 0 0}
details summary{cursor:pointer;color:var(--text-2)}
</style></head><body><main>
<header><h1>Who's visiting bi1ku.github.io</h1>
<nav class="filters">${ranges}<a href="?range=${escapeHtml(rangeParam)}${includeBots ? "" : "&bots=1"}" class="${includeBots ? "on" : ""}">${includeBots ? "Bots shown" : "Show bots"}</a></nav></header>

<section class="tiles">
<div class="tile"><div class="label">Unique visitors</div><div class="value">${visitors}</div><div class="sub">by IP + browser</div></div>
<div class="tile"><div class="label">Page views</div><div class="value">${views}</div><div class="sub">${visitors ? (views / visitors).toFixed(1) : "0"} per visitor</div></div>
<div class="tile"><div class="label">Countries</div><div class="value">${Number(t.countries ?? 0)}</div></div>
<div class="tile"><div class="label">Masked views</div><div class="value">${views ? Math.round((masked / views) * 100) : 0}%</div><div class="sub">VPN, proxy, relay or cloud</div></div>
</section>

<section class="card"><h2>Page views per day</h2>${dailyChart(days)}</section>

<div class="grid2">
<section class="card"><h2>Countries (visitors)</h2>${barList(
    (countries.results as Row[]).map((r) => ({ label: `${flag(r.country as string)} ${escapeHtml(r.country ?? "Unknown")}`, count: Number(r.n) })),
    countryTotal,
  )}</section>
<section class="card"><h2>Connection type (visitors)</h2>${barList(
    privacyRows.map((r) => ({ label: badge(r.privacy), count: Number(r.n) })),
    privacyTotal,
  )}<p class="note">Detection is a best guess from the visitor's network${env.IPAPI_KEY ? " plus ipapi.is" : ""}. Private Relay and corporate networks can look like VPNs.</p></section>
</div>

<div class="grid2">
<section class="card"><h2>Cities</h2>${table(
    ["Location", "Visitors"],
    (cities.results as Row[]).map((r) => [escapeHtml(place(r as never)), String(r.n)]),
  )}</section>
<section class="card"><h2>Networks / organisations</h2>${table(
    ["Organisation", "ASN", "Visitors"],
    (orgs.results as Row[]).map((r) => [escapeHtml(r.as_org ?? "Unknown"), `<span class="mono dim">${r.asn ? `AS${escapeHtml(r.asn)}` : "—"}</span>`, String(r.n)]),
  )}<p class="note">The organisation is often the most telling signal: a university, company or ISP name.</p></section>
</div>

<div class="grid2">
<section class="card"><h2>Referrers</h2>${table(
    ["Source", "Views"],
    refRows.map(([host, n]) => [escapeHtml(host), String(n)]),
  )}</section>
<section class="card"><h2>Pages</h2>${table(
    ["Path", "Views"],
    (pages.results as Row[]).map((r) => [`<span class="mono">${escapeHtml(r.path ?? "/")}</span>`, String(r.n)]),
  )}</section>
</div>

<section class="card"><h2>Recent visits</h2>${table(
    ["Time", "Location", "Network", "Connection", "Device", "From", "IP"],
    (recent.results as Row[]).map((r) => [
      `<span class="mono">${escapeHtml(fmtTime(Number(r.ts)))}</span>`,
      escapeHtml(place(r as never)),
      `${escapeHtml(r.as_org ?? "Unknown")}`,
      `${badge(r.privacy as Privacy)}${r.privacy_detail ? `<div class="dim">${escapeHtml(r.privacy_detail)}</div>` : ""}`,
      `${escapeHtml(describeUa(r.user_agent as string | null))}${r.is_bot ? ' <span class="badge badge-unknown">bot</span>' : ""}<div class="dim">${escapeHtml(r.screen ?? "")} ${escapeHtml(r.language ?? "")}</div>`,
      escapeHtml(referrerHost(r.referrer as string | null)),
      `<details><summary class="mono">${escapeHtml(r.ip ?? "—")}</summary><div class="mono dim">${escapeHtml(r.user_agent ?? "")}</div></details>`,
    ]),
    "No visits in this range yet",
  )}</section>
</main>
<script nonce="${nonce}">
for (const chart of document.querySelectorAll(".chart")) {
  const tip = chart.querySelector(".tip");
  chart.addEventListener("pointermove", (e) => {
    const col = e.target.closest(".col");
    if (!col) { tip.hidden = true; return; }
    const box = chart.getBoundingClientRect();
    tip.textContent = col.dataset.tip;
    tip.style.left = (e.clientX - box.left) + "px";
    tip.style.top = (e.clientY - box.top) + "px";
    tip.hidden = false;
  });
  chart.addEventListener("pointerleave", () => { tip.hidden = true; });
}
</script></body></html>`;
}

async function handleDashboard(request: Request, env: Env, url: URL): Promise<Response> {
  if (!env.DASHBOARD_PASSWORD) return new Response("Set DASHBOARD_PASSWORD with `wrangler secret put` first.", { status: 503 });

  const auth = request.headers.get("Authorization") ?? "";
  let password = "";
  if (auth.startsWith("Basic ")) {
    try {
      password = atob(auth.slice(6)).split(":").slice(1).join(":");
    } catch {
      /* malformed header */
    }
  }
  if (!(await safeEqual(password, env.DASHBOARD_PASSWORD))) {
    return new Response("Authentication required", {
      status: 401,
      headers: { "WWW-Authenticate": 'Basic realm="Portfolio analytics", charset="UTF-8"' },
    });
  }

  const nonce = crypto.randomUUID().replace(/-/g, "");
  return new Response(await renderDashboard(env, url, nonce), {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-store",
      "X-Robots-Tag": "noindex",
      "Referrer-Policy": "no-referrer",
      "Content-Security-Policy": `default-src 'none'; style-src 'unsafe-inline'; script-src 'nonce-${nonce}'; frame-ancestors 'none'; base-uri 'none'`,
    },
  });
}

export default {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    if (url.pathname === "/hit" && (request.method === "POST" || request.method === "OPTIONS")) return handleHit(request, env, ctx);
    if (url.pathname === "/dashboard" || url.pathname === "/") {
      if (url.pathname === "/") return Response.redirect(`${url.origin}/dashboard`, 302);
      return handleDashboard(request, env, url);
    }
    return new Response("Not found", { status: 404 });
  },
} satisfies ExportedHandler<Env>;
