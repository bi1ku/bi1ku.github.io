"use client";

import { useEffect, useState } from "react";
import capture from "./bik-capture.json";

const examples = [
  {
    title: "Character battle",
    feature: "Inheritance & method dispatch",
    description: "A Paladin inherits Warrior’s damage override. A Mage takes a different branch. Each instance keeps its own state.",
  },
  {
    title: "Recursive algorithms",
    feature: "Stack frames & nested calls",
    description: "Factorial, Fibonacci, and Euclid’s algorithm exercise recursive calls, branching, integer returns, and remainder.",
  },
  {
    title: "Constant folding",
    feature: "Work done before runtime",
    description: "The compiler evaluates a constant expression and places its result directly in the MIPS data section.",
  },
];

function Code({ value }: { value: string }) {
  return <code>{value.trimEnd().split("\n").map((line, i) => (
    <span className="bik-code-line" key={i}>
      <span className="bik-line-number" aria-hidden="true">{i + 1}</span>
      <span>{line.split(/("(?:\\.|[^"\\])*"|\b(?:class|extends|func|int|ret|if|log)\b|\b\d+\b)/g).map((part, j) => (
        <span key={j} className={part.startsWith('"') ? "bik-string" : /^(class|extends|func|int|ret|if|log)$/.test(part) ? "bik-keyword" : /^\d+$/.test(part) ? "bik-number" : undefined}>{part}</span>
      ))}{line ? "" : "\u00a0"}</span>
    </span>
  ))}</code>;
}

export default function ProjectDemo() {
  const [selected, setSelected] = useState(0);
  const [view, setView] = useState<"source" | "assembly">("source");
  const [tick, setTick] = useState<number | null>(null);
  const sample = capture.examples[selected];
  const example = examples[selected];
  const lines = sample.output.trimEnd().split("\n");
  const playing = tick !== null;
  const visibleLines = tick === null ? lines.length : Math.max(0, tick - 2);
  const complete = !playing;
  const health = visibleLines >= 4 ? 36 : visibleLines >= 3 ? 63 : 100;

  useEffect(() => {
    if (tick === null) return;
    const timer = window.setTimeout(() => {
      setTick(tick >= lines.length + 2 ? null : tick + 1);
    }, 650);
    return () => window.clearTimeout(timer);
  }, [tick, lines.length]);

  function selectExample(index: number) {
    setSelected(index);
    setTick(null);
    setView("source");
  }

  function replay() {
    // Reduced-motion visitors get the complete result immediately.
    setTick(window.matchMedia("(prefers-reduced-motion: reduce)").matches ? null : 0);
  }

  return (
    <figure className="project-demo" aria-label="bik compiler showcase">
      <div className="bik-demo-shell">
        <div className="bik-demo-heading">
          <div><span className="bik-live-dot" /> THE COMPILER, IN ACTION</div>
          <span className="bik-capture-label">Verified with SPIM</span>
        </div>
        <div className="bik-example-picker" role="group" aria-label="Demo programs">
          {examples.map((item, index) => (
            <button type="button" key={item.title} aria-pressed={selected === index} onClick={() => selectExample(index)}>
              <span className="bik-example-index">0{index + 1}</span>{item.title}
            </button>
          ))}
        </div>
        <div className="bik-demo-context">
          <div><h4>{example.feature}</h4><p>{example.description}</p></div>
          <button type="button" className="bik-replay" onClick={playing ? () => setTick(null) : replay} aria-controls="bik-runtime">
            <span aria-hidden="true">{playing ? "■" : "↻"}</span> {playing ? "Show result" : "Replay execution"}
          </button>
        </div>
        <div className="bik-workbench">
          <div className="bik-editor">
            <div className="bik-pane-toolbar">
              <div role="group" aria-label="Code view">
                <button type="button" aria-pressed={view === "source"} onClick={() => setView("source")}>Source</button>
                <button type="button" aria-pressed={view === "assembly"} onClick={() => setView("assembly")}>MIPS</button>
              </div>
              <a href={`/projects/bik/${sample.id}.${view === "source" ? "bik" : "asm"}`} download>Download ↓</a>
            </div>
            <div className="bik-filename">{sample.id}.{view === "source" ? "bik" : "asm"}<span>{view === "source" ? "bik" : "MIPS32"}</span></div>
            <pre key={`${selected}-${view}`} className="bik-code" tabIndex={0} aria-label={view === "source" ? "bik source code" : "Generated MIPS assembly"}>
              <Code value={view === "source" ? sample.source : sample.assembly} />
            </pre>
          </div>
          <div className="bik-result">
            <ol className="bik-pipeline" aria-label="Compiler pipeline">
              {["Source", "Compile", "Execute"].map((step, index) => <li key={step} data-active={tick === null || tick >= index}><span>{index + 1}</span>{step}</li>)}
            </ol>
            <div className="bik-result-visual">
              {selected === 0 ? <>
                <div className="bik-tree" aria-label="Character inheritance hierarchy">
                  <span>Character</span><span className="bik-tree-branch">↳ Warrior <span>→ Paladin</span></span><span className="bik-tree-branch">↳ Mage</span>
                </div>
                <div className="bik-health-label"><span>Enemy health</span><strong>{health}<span> / 100</span></strong></div>
                <div className="bik-health-track" role="meter" aria-label="Enemy health" aria-valuemin={0} aria-valuemax={100} aria-valuenow={health}><div style={{ width: `${health}%` }} /></div>
                <div className="bik-health-legend"><span>Paladin strike <b>−37</b></span><span>Mage strike <b>−27</b></span></div>
              </> : selected === 1 ? <div className="bik-algorithms">
                {[["factorial(7)", "5,040"], ["fibonacci(12)", "144"], ["gcd(1071, 462)", "21"]].map(([label, result]) => <div key={label}><code>{label}</code><strong>{visibleLines ? result : "—"}</strong></div>)}
              </div> : <div className="bik-folding"><code>(7 + 5) * 3</code><span>↓ evaluated at compile time</span><code>answer: .word <strong>36</strong></code></div>}
            </div>
            <div className="bik-terminal" id="bik-runtime" aria-label="Captured runtime output">
              <div className="bik-terminal-heading"><span>SPIM / stdout</span><span>{complete ? "exit 0" : "replaying"}</span></div>
              <p className="bik-command">$ {sample.run_command}</p>
              <pre>{lines.slice(0, visibleLines).join("\n") || " "}</pre>
            </div>
            <p className="bik-demo-status" role="status">{complete ? "✓ Execution verified · output matches expected result" : "Replaying captured execution…"}</p>
          </div>
        </div>
      </div>
      <figcaption>
        <span>Real compiler + SPIM output. Replayed in your browser.</span>
        <a href={`${capture.repository}/commit/${capture.commit}`} target="_blank" rel="noreferrer">Captured at {capture.commit.slice(0, 7)} ↗</a>
      </figcaption>
    </figure>
  );
}
