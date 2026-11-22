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
  return (
    <article className="robotics-project" id="robotics" aria-labelledby="robotics-title">
      <div className="project-copy">
        <p className="eyebrow">Stuy Fusion · FTC 479</p>
        <h3 id="robotics-title">Competition robotics</h3>
        <p className="robotics-description">
          My role was programming only. I wrote the software that used AprilTags
          to locate our robot on the field and line it up autonomously.
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

      <div className="robotics-gallery" role="group" aria-label="Team robots and CAD models">
        {photos.map(({ file, label, alt }) => (
          <figure key={file}>
            <a href={`/projects/robotics/${file}.webp`} target="_blank" rel="noreferrer">
              <img src={`/projects/robotics/${file}.webp`} alt={alt} loading="lazy" />
            </a>
            <figcaption>{label}</figcaption>
          </figure>
        ))}
      </div>
    </article>
  );
}
