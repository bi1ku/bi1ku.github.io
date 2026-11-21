import React, { useLayoutEffect } from "react";
import { createRoot } from "react-dom/client";
import Home from "./app/page";
import "./app/globals.css";

function Portfolio() {
  useLayoutEffect(() => {
    // GitHub Pages initially serves an empty root, so resolve incoming links after render.
    const id = window.location.hash.slice(1);
    if (id) document.getElementById(id)?.scrollIntoView({ behavior: "instant" });
  }, []);

  return <Home />;
}

createRoot(document.getElementById("root")!).render(<Portfolio />);
