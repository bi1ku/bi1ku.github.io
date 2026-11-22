"use client";

import { useRef, useState } from "react";

const matchUrl = "https://www.youtube.com/watch?v=JPtpfMJDVc4&t=22800s";
const photos = [
  { file: "competition", label: "Team 479 on the field", alt: "Robot 479 at a competition with its lift extended." },
  { file: "decode", label: "DECODE robot", alt: "Front view of the DECODE robot CAD model, with a camera above the intake." },
  { file: "into-the-deep", label: "Into the Deep robot", alt: "Side view of the Into the Deep robot CAD model with its horizontal slide extended." },
  { file: "earlier-robot", label: "Earlier robot", alt: "An earlier robot CAD model with its intake extended to one side." },
  { file: "swerve-cad", label: "Swerve chassis CAD", alt: "CAD view of four swerve modules around the chassis electronics." },
  { file: "swerve-prototype", label: "Swerve prototype", alt: "Assembled swerve chassis with its wiring and control electronics." },
];

export default function RoboticsProject() {
  const dialog = useRef<HTMLDialogElement>(null);
  const [photoIndex, setPhotoIndex] = useState(0);
  const photo = photos[photoIndex];

  function changePhoto(direction: number) {
    setPhotoIndex((current) => (current + direction + photos.length) % photos.length);
  }

  return (
    <article className="robotics-project" id="robotics" aria-labelledby="robotics-title">
      <div className="project-copy">
        <p className="eyebrow">Stuy Fusion · FTC 479</p>
        <h3 id="robotics-title">Competition robotics</h3>
        <p className="robotics-description">
          As vice president of Stuy Fusion, I focused on the software that
          connects what our robot sees to how it moves: field localization,
          autonomous alignment, and responsive controls for competition.
        </p>
        <dl className="robotics-contributions">
          <div>
            <dt>Vision & autonomous motion</dt>
            <dd>I built an AprilTag vision pipeline for field localization,
              odometry, and autonomous alignment, helping the robot determine
              where it is and line up on the field.</dd>
          </div>
          <div>
            <dt>Controls & software architecture</dt>
            <dd>I implemented multithreaded robot controls and migrated our
              code to a command-based architecture, making subsystems easier
              to test, reuse, and coordinate during autonomous routines.</dd>
          </div>
          <div>
            <dt>Teaching & team leadership</dt>
            <dd>I designed beginner workshops, delegated technical projects
              across roughly 32 members, and built the team website to support
              recruiting, outreach, and sponsors.</dd>
          </div>
        </dl>
        <p className="robotics-sources">
          <a href="https://github.com/fusion479/deep" target="_blank" rel="noreferrer">Into the Deep code</a>
          {" · "}<a href="https://github.com/fusion479/decode" target="_blank" rel="noreferrer">DECODE code</a>
        </p>
        <a
          className="robotics-match"
          href={matchUrl}
          target="_blank"
          rel="noreferrer"
        >
          <span aria-hidden="true">▶</span> Watch the NYC championship footage
        </a>
        <div className="robotics-time">6:20:00–6:22:50 · NYC FIRST broadcast</div>
        <p className="robotics-demos">
          My demos · <a href="https://www.youtube.com/watch?v=8dDID_h8Fn0" target="_blank" rel="noreferrer">localization is fixed</a>
          {" · "}<a href="https://www.youtube.com/watch?v=GKgql24jaDk" target="_blank" rel="noreferrer">4 Spec Auton</a>
        </p>
      </div>

      <div className="robotics-gallery">
        <figure>
          <button type="button" className="robotics-feature" aria-haspopup="dialog"
            aria-label={`Enlarge ${photo.label}`} onClick={() => dialog.current?.showModal()}>
            <img src={`/projects/robotics/${photo.file}.webp`} alt={photo.alt} loading="lazy" />
            <span>View gallery · {photos.length} images</span>
          </button>
          <figcaption aria-live="polite">{photo.label}</figcaption>
        </figure>
        <div className="robotics-gallery-controls" aria-label="Gallery navigation">
          <button type="button" onClick={() => changePhoto(-1)}>Previous</button>
          <span>{photoIndex + 1} / {photos.length}</span>
          <button type="button" onClick={() => changePhoto(1)}>Next</button>
        </div>
        <p className="robotics-credit">Team robots & CAD · My contribution was software.</p>
      </div>
      <dialog ref={dialog} className="robotics-lightbox" aria-labelledby="robotics-gallery-title"
        onClick={(event) => { if (event.target === event.currentTarget) dialog.current?.close(); }}
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
            event.preventDefault();
            changePhoto(event.key === "ArrowLeft" ? -1 : 1);
          }
        }}>
        <div className="robotics-lightbox-panel">
          <header>
            <h2 id="robotics-gallery-title">Team robots & CAD</h2>
            <button type="button" autoFocus onClick={() => dialog.current?.close()}>Close</button>
          </header>
          <figure>
            <img src={`/projects/robotics/${photo.file}.webp`} alt={photo.alt} />
            <figcaption aria-live="polite">{photo.label}</figcaption>
          </figure>
          <div className="robotics-gallery-controls">
            <button type="button" onClick={() => changePhoto(-1)}>Previous</button>
            <a href={`/projects/robotics/${photo.file}.webp`} target="_blank" rel="noreferrer">Original image · {photoIndex + 1} / {photos.length}</a>
            <button type="button" onClick={() => changePhoto(1)}>Next</button>
          </div>
        </div>
      </dialog>
    </article>
  );
}
