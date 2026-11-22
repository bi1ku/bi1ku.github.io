"use client";

import { useRef, useState } from "react";

const base = "/projects/avionics";
const boardViews = [
  { file: "board-3d", label: "3D render" },
  { file: "pcb-layout", label: "PCB layout" },
  { file: "schematic", label: "Schematic" },
];

const stages = [
  {
    date: "Nov 2", title: "First board", folder: base + "/history/2026-11-02",
    description: "The first layout places the controller and microSD footprint on a green v1.0 board.",
    views: boardViews,
  },
  {
    date: "Nov 12", title: "Schematic revision", folder: base + "/history/2026-11-12",
    description: "The revised schematic groups the barometer, IMU, and programming header beside the controller.",
    views: [boardViews[2]],
  },
  {
    date: "Nov 21", title: "Revised layout", folder: base + "/history/2026-11-21",
    description: "An updated set of drawings shows the revised component placement on the v1.0 board.",
    views: boardViews,
  },
  {
    date: "Nov 21 · evening", title: "Routing details", folder: base + "/history/2026-11-21",
    description: "Close-ups of the v1.2 layout follow the traces around the controller and programming header.",
    views: [
      { file: "controller-detail", label: "Controller" },
      { file: "header-detail", label: "Header pins" },
      { file: "header-footprint", label: "Header footprint" },
    ],
  },
  {
    date: "Nov 22", title: "Flight computer v1.2", folder: base,
    description: "The black v1.2 board carries the HUAC mark beside the controller and moves the programming header to the corner by the microSD footprint.",
    views: boardViews,
  },
];

export default function FlightComputerHistory() {
  const dialog = useRef<HTMLDialogElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [stageIndex, setStageIndex] = useState(0);
  const [viewFile, setViewFile] = useState("board-3d");
  const stage = stages[stageIndex];
  const view = stage.views.find(({ file }) => file === viewFile) ?? stage.views[0];
  const src = stage.folder + "/" + view.file + ".png";

  function openHistory() {
    setStageIndex(0);
    setViewFile("board-3d");
    setIsOpen(true);
    dialog.current?.showModal();
  }

  return (
    <>
      <button type="button" className="history-trigger" aria-haspopup="dialog" onClick={openHistory}>
        Design history
      </button>
      <dialog
        ref={dialog}
        className="flight-history"
        aria-labelledby="flight-history-title"
        onClose={() => setIsOpen(false)}
        onClick={(event) => {
          if (event.target === event.currentTarget) dialog.current?.close();
        }}
      >
        <div className="history-panel">
          <header className="history-heading">
            <div>
              <p className="eyebrow">Flight computer · November 2026</p>
              <h2 id="flight-history-title">Design history</h2>
            </div>
            <button type="button" onClick={() => dialog.current?.close()}>Close</button>
          </header>
          {isOpen && (
            <div className="history-body">
              <ol className="history-stages" aria-label="Design stages">
                {stages.map((item, index) => (
                  <li key={item.title}>
                    <button type="button" aria-current={index === stageIndex ? "step" : undefined}
                      onClick={() => setStageIndex(index)}>
                      <span>{item.date}</span>{item.title}
                    </button>
                  </li>
                ))}
              </ol>
              <select className="history-select" aria-label="Design stage" value={stageIndex}
                onChange={(event) => setStageIndex(Number(event.target.value))}>
                {stages.map((item, index) => (
                  <option key={item.title} value={index}>{item.date} · {item.title}</option>
                ))}
              </select>
              <div className="history-content">
                <div className="history-views" role="group" aria-label="Screenshot view">
                  {stage.views.map((item) => (
                    <button key={item.file} type="button" aria-pressed={item.file === view.file}
                      onClick={() => setViewFile(item.file)}>{item.label}</button>
                  ))}
                </div>
                <figure>
                  <a className="history-image" href={src} target="_blank" rel="noreferrer">
                    <img src={src} alt={stage.title + " · " + view.label} />
                  </a>
                  <figcaption>
                    {stage.description} <a href={src} target="_blank" rel="noreferrer">View full size</a>
                  </figcaption>
                </figure>
              </div>
            </div>
          )}
        </div>
      </dialog>
    </>
  );
}
