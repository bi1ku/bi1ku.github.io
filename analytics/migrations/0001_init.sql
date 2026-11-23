CREATE TABLE visits (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ts INTEGER NOT NULL,              -- unix ms
  visitor TEXT NOT NULL,            -- sha256(ip + user agent), stable per device/network
  ip TEXT,
  path TEXT,
  referrer TEXT,
  user_agent TEXT,
  country TEXT,
  region TEXT,
  city TEXT,
  timezone TEXT,
  asn INTEGER,
  as_org TEXT,
  screen TEXT,
  language TEXT,
  privacy TEXT,                     -- vpn | proxy | tor | datacenter | relay | none | unknown
  privacy_detail TEXT,
  is_bot INTEGER NOT NULL DEFAULT 0
);
CREATE INDEX visits_ts ON visits(ts);
CREATE INDEX visits_visitor ON visits(visitor);

-- ipapi.is results cached per IP for up to 30 days (allowed by their terms).
CREATE TABLE ip_cache (
  ip TEXT PRIMARY KEY,
  fetched INTEGER NOT NULL,
  privacy TEXT NOT NULL,
  detail TEXT
);
