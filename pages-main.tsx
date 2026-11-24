import React, { useLayoutEffect } from "react";
import { createRoot } from "react-dom/client";
import Home from "./app/page";
import "./app/globals.css";

// Visitor analytics worker (see analytics/README.md). Leave empty to disable.
const ANALYTICS_URL = "https://portfolio-analytics.bi1ku.workers.dev";

function reportVisit() {
  if (!ANALYTICS_URL || ["localhost", "127.0.0.1"].includes(window.location.hostname)) return;
  const params = new URLSearchParams(window.location.search);
  const body = JSON.stringify({
    path: window.location.pathname + window.location.hash,
    // Tag added to shared links, e.g. https://bi1ku.github.io/?ref=linkedin
    ref: params.get("ref") ?? params.get("utm_source") ?? params.get("source"),
    // The previous website (browsers usually send only its origin, not the full URL).
    referrer: document.referrer,
    screen: `${window.screen.width}x${window.screen.height}`,
    language: navigator.language,
  });
  // text/plain keeps this a "simple" cross-origin request (no CORS preflight).
  fetch(`${ANALYTICS_URL}/hit`, {
    method: "POST",
    body,
    headers: { "Content-Type": "text/plain" },
    keepalive: true,
  }).catch(() => {});
}

function Portfolio() {
  useLayoutEffect(() => {
    // GitHub Pages initially serves an empty root, so resolve incoming links after render.
    const id = window.location.hash.slice(1);
    if (id) document.getElementById(id)?.scrollIntoView({ behavior: "instant" });
    reportVisit();
  }, []);

  return <Home />;
}

createRoot(document.getElementById("root")!).render(<Portfolio />);
