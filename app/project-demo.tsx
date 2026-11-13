"use client";

import { useState } from "react";

export default function ProjectDemo() {
  const [playing, setPlaying] = useState(false);

  return (
    <figure className="project-demo">
      <div className="demo-toolbar">
        <span>
          bik in action <span className="demo-duration">12 seconds</span>
        </span>
        <button
          type="button"
          aria-pressed={playing}
          aria-controls="bik-demo-image"
          onClick={() => setPlaying(!playing)}
        >
          {playing ? "Stop demo" : "Play demo"}
        </button>
      </div>
      <a
        href="/projects/bik/demo.gif"
        target="_blank"
        rel="noreferrer"
        aria-label="Open the bik demo GIF at full size"
      >
        <img
          id="bik-demo-image"
          src={
            playing
              ? "/projects/bik/demo.gif"
              : "/projects/bik/demo-poster.png"
          }
          width={1280}
          height={760}
          loading="lazy"
          alt="bik compiler demo: tokenize source and generate MIPS assembly, folding 6 times 7 into the constant 42."
        />
      </a>
      <figcaption>
        <span>
          Source → tokens → MIPS assembly. Actual compiler output; assembly
          is not executed in this demo.
        </span>
        <a href="/projects/bik/demo.gif" target="_blank" rel="noreferrer">
          View full size ↗
        </a>
      </figcaption>
    </figure>
  );
}
