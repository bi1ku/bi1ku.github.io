import ProjectDemo from "./project-demo";
import ScrollTransitions from "./scroll-transitions";
import type { ReactNode } from "react";

function External({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noreferrer">
      {children} <span aria-hidden="true">↗</span>
    </a>
  );
}

const otherProjects = [
  {
    name: "Slipstream",
    category: "Multiplayer racing game",
    tech: "Java · Processing · Networking",
    description:
      "Built a client-server racing game with synchronized player state, momentum-based driving, drifting, nitro, and terrain-dependent speed limits.",
  },
  {
    name: "SimplyGrades",
    category: "Gradebook prototype",
    tech: "TypeScript · Next.js · Prisma · PostgreSQL",
    description:
      "Built class rosters, assignment and grade entry, configurable grading categories, and dashboard charts around a relational model of teachers, students, and classes. A prototype with unfinished statistics endpoints.",
  },
  {
    name: "FutureVoice",
    category: "Congressional App Challenge",
    tech: "React · TypeScript · Congress.gov API",
    description:
      "Built with Leo Ling for New York’s 10th district. Lets young voters look up congressional representatives and browse bills using filters, pagination, and detail views.",
  },
  {
    name: "ascii",
    category: "Video conversion",
    tech: "Python",
    description:
      "Converts video frames into ASCII characters and plays the result in a terminal.",
  },
];
const experience = [
  {
    dates: "Sep 2026 — Present",
    organization: "Harvard Undergraduate Aerospace Collective",
    role: "Engineer · Rocketry",
  },
  {
    dates: "Sep 2026 — Present",
    organization: "Harvard Undergraduate Robotics Club",
    role: "Electrical / Software Engineer",
  },
  {
    dates: "Sep 2023 — Jul 2026",
    organization: "Stuy Fusion · FTC 479",
    role: "Vice President",
    description:
      "Developed AprilTag localization and autonomous alignment, multithreaded controls, and a reusable command-based architecture. Built the team website and taught workshops for a team of about 32 members.",
  },
  {
    dates: "Feb 2022 — Sep 2025",
    organization: "BCTCio",
    role: "Full-Stack Web Developer Intern",
    description:
      "Maintained a UI library with 30+ components and helped develop Future Sphere Education’s portal for 4,000+ active students, 300+ classes, and 12+ teachers.",
  },
  {
    dates: "Jun — Sep 2024",
    organization: "NYC Department of Health and Mental Hygiene",
    role: "Information Technology Specialist Intern",
    description:
      "Supported recovery across 3,000+ computers after the CrowdStrike outage, imaged 62 PCs, and audited hardware inventory.",
  },
];

export default function Home() {
  return (
    <>
      <ScrollTransitions />
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <header className="site-header">
        <a className="wordmark" href="#">
          Owen Shi
        </a>
        <nav aria-label="Main navigation">
          <a href="#projects">Projects</a>
          <a href="#experience">Experience</a>
          <a href="#about">About</a>
          <a href="mailto:2008owenshi@gmail.com">
            Contact <span aria-hidden="true">↗</span>
          </a>
        </nav>
      </header>
      <main id="main">
        <section className="intro" aria-labelledby="intro-title">
          <div className="intro-copy">
            <p className="eyebrow">
              Electrical Engineering &amp; Computer Science · Harvard College
            </p>
            <h1 id="intro-title">Owen Shi</h1>
            <p className="intro-description">
              I design electronics and build compilers, robotics software, and web
              applications. I’m a freshman at Harvard, working with the
              undergraduate rocketry and robotics teams.
            </p>
            <div className="links">
              <External href="https://github.com/Bi1ku">GitHub</External>
              <External href="https://www.linkedin.com/in/owen-shi-14a5a426a/">
                LinkedIn
              </External>
              <a href="mailto:2008owenshi@gmail.com">
                Email <span aria-hidden="true">↗</span>
              </a>
              <a href="/Owen_Shi_Resume.pdf" target="_blank" rel="noreferrer">
                Resume <span className="link-note">PDF ↗</span>
              </a>
            </div>
          </div>
          <img
            className="intro-portrait"
            src="/owen-shi.png"
            alt="Owen Shi smiling"
            width={800}
            height={800}
            fetchPriority="high"
          />
        </section>

        <section id="projects" aria-labelledby="projects-title">
          <div className="section-heading">
            <h2 id="projects-title">Projects</h2>
            <span>Software &amp; engineering</span>
          </div>
          <article className="avionics-project" id="flight-computer">
            <div className="avionics-overview">
              <div className="project-copy">
                <p className="eyebrow">HUAC Rocketry · IREC 10k</p>
                <h3>Avionics flight computer</h3>
                <p className="project-summary">
                  Designed a custom flight computer for HUAC Rocketry’s IREC 10k
                  rocket, with dual-deployment recovery functionality.
                </p>
                <p>
                  The PCB is currently being printed. Stress and simulation
                  testing are planned. The simulations will use simulated sensor
                  data to test reliability and validate drogue and main parachute
                  deployment as part of the rocket’s dual-deployment recovery
                  system.
                </p>
                <p>
                  I designed the schematic and board layout around an STM32F405
                  microcontroller, with pressure and inertial sensors, a microSD
                  interface, and a dedicated programming header. The board
                  brings sensing, storage, and power onto a single PCB.
                </p>
                <p>
                  The layout places the battery input and regulator at one end,
                  the sensor packages near the microcontroller, and the external
                  connections at the other end. Four mounting holes secure the
                  board in the avionics assembly.
                </p>
                <p className="tech">KiCad · PCB design · STM32 · I²C · SPI</p>
                <div className="links">
                  <External href="/projects/avionics/schematic.png">
                    Full schematic
                  </External>
                  <External href="/projects/avionics/pcb-layout.png">
                    PCB layout
                  </External>
                </div>
              </div>
              <figure className="avionics-render">
                <a
                  href="/projects/avionics/board-3d.png"
                  target="_blank"
                  rel="noreferrer"
                >
                  <img
                    src="/projects/avionics/board-3d.png"
                    width="872"
                    height="1342"
                    alt="3D CAD render of Owen’s HUACR Avionics v1.0 PCB, showing the microcontroller, connectors, sensor packages, and four mounting holes."
                  />
                </a>
                <figcaption>HUACR Avionics v1.0 · 3D PCB render</figcaption>
              </figure>
            </div>
            <h4 className="technical-heading">Hardware architecture</h4>
            <dl className="hardware-grid">
              <div>
                <dt>Controller</dt>
                <dd>
                  STM32F405RGTx with an external crystal, supply decoupling, and
                  a reset connection. A 10-pin ARM JTAG/SWD header provides
                  programming and debug access.
                </dd>
              </div>
              <div>
                <dt>Flight sensors</dt>
                <dd>
                  BMP581 barometer and LSM6DS3 IMU share the I²C bus, with
                  pull-up resistors on the clock and data lines. Together they
                  provide pressure and inertial measurements.
                </dd>
              </div>
              <div>
                <dt>Data storage</dt>
                <dd>
                  A microSD socket connects to the controller over SPI,
                  providing a storage interface for flight-data logging.
                </dd>
              </div>
              <div>
                <dt>Power &amp; outputs</dt>
                <dd>
                  A 9 V battery input feeds an LD1117 3.3 V linear regulator.
                  The schematic also includes a buzzer and a MOSFET-switched
                  output with screw-terminal connections.
                </dd>
              </div>
            </dl>
            <div className="avionics-documents">
              <figure>
                <a
                  href="/projects/avionics/schematic.png"
                  target="_blank"
                  rel="noreferrer"
                >
                  <img
                    src="/projects/avionics/schematic.png"
                    width="1704"
                    height="1310"
                    loading="lazy"
                    alt="Flight-computer schematic showing the STM32F405, barometer, IMU, regulator, microSD socket, debug header, and output circuitry."
                  />
                </a>
                <figcaption>
                  Schematic ·{" "}
                  <a
                    href="/projects/avionics/schematic.png"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Open full resolution to inspect component values ↗
                  </a>
                </figcaption>
              </figure>
              <figure className="pcb-detail">
                <a
                  href="/projects/avionics/pcb-layout.png"
                  target="_blank"
                  rel="noreferrer"
                >
                  <img
                    src="/projects/avionics/pcb-layout.png"
                    width="876"
                    height="1320"
                    loading="lazy"
                    alt="KiCad PCB layout showing component placement, routed traces, copper fill, and mounting holes."
                  />
                </a>
                <figcaption>
                  PCB layout ·{" "}
                  <a
                    href="/projects/avionics/pcb-layout.png"
                    target="_blank"
                    rel="noreferrer"
                  >
                    View routing at full size ↗
                  </a>
                </figcaption>
              </figure>
            </div>
          </article>

          <article className="bik-project" id="bik">
            <div className="project-copy">
              <p className="eyebrow">Compiler design · In progress</p>
              <h3>bik</h3>
              <p className="project-summary">
                A compiler for a custom language, written in C and targeting
                MIPS assembly.
              </p>
              <p>
                I built bik to explore the compiler pipeline: tokenizing source,
                parsing an abstract syntax tree, resolving variables, folding
                constant expressions, and generating assembly. MIPS code
                generation is still in progress.
              </p>
              <ul>
                <li>
                  Operator precedence, variable environments, arithmetic, and
                  string concatenation with automatic number conversion.
                </li>
                <li>
                  Integer functions with up to four arguments, conditionals,
                  recursion, and return statements.
                </li>
                <li>
                  Classes with default fields, separate instances, and
                  class-level methods.
                </li>
              </ul>
              <p className="tech">C · CMake · MIPS assembly</p>
              <div className="links">
                <External href="https://github.com/Bi1ku/bik">
                  Source code
                </External>
                <External href="https://github.com/Bi1ku/bik#readme">
                  Language &amp; usage
                </External>
              </div>
            </div>
            <ProjectDemo />
          </article>

          <article className="rocket-project" id="model-rocket">
            <div className="project-copy">
              <p className="eyebrow">Design &amp; fabrication</p>
              <h3>Model rocket</h3>
              <p className="project-summary">
                Designed, manufactured, and flight-tested a C6-5 model rocket.
              </p>
              <p>
                I used OpenRocket for the rocket design and Onshape for CAD,
                then made components with laser cutting and 3D printing. The
                flight test captured both launch and parachute deployment.
              </p>
              <p className="tech">
                OpenRocket · Onshape · Laser cutting · 3D printing
              </p>
            </div>
            <div className="rocket-media">
              <figure>
                <a
                  className="cad-link"
                  href="/projects/rocket/cad.png"
                  target="_blank"
                  rel="noreferrer"
                >
                  <img
                    src="/projects/rocket/cad.png"
                    width="1253"
                    height="450"
                    loading="lazy"
                    alt="Onshape CAD assembly of the rocket, showing the nose cone, body, internal components, and fins."
                  />
                </a>
                <figcaption>
                  Onshape assembly and internal components ·{" "}
                  <a
                    href="/projects/rocket/cad.png"
                    target="_blank"
                    rel="noreferrer"
                  >
                    View full size ↗
                  </a>
                </figcaption>
              </figure>
              <figure>
                <video
                  controls
                  playsInline
                  preload="none"
                  aria-label="Model rocket launch and parachute deployment"
                >
                  <source src="/projects/rocket/launch.mp4" type="video/mp4" />
                  Your browser does not support video.{" "}
                  <a href="/projects/rocket/launch.mp4">
                    Download the launch video
                  </a>
                  .
                </video>
                <figcaption>
                  Flight test · Launch and parachute deployment
                </figcaption>
              </figure>
            </div>
          </article>

          <article className="featured-project" id="springforge">
            <div className="project-copy">
              <p className="eyebrow">Physics simulation</p>
              <h3>SpringForge</h3>
              <p className="project-summary">
                An interactive simulator for the rotational motion of
                spring-wheel systems.
              </p>
              <p>
                Configure up to three springs and adjust mass, radius,
                attachment points, and spring constants. Compare the small-angle
                approximation with a nonlinear model, with live plots of angular
                position, velocity, and acceleration.
              </p>
              <p>
                A polygon editor calculates the center of mass and moment of
                inertia of custom shapes using the shoelace formula and
                parallel-axis theorem.
              </p>
              <p className="tech">Python · VPython · Numerical integration</p>
              <div className="links">
                <External href="https://www.glowscript.org/#/user/2008owenshi/folder/MyPrograms/program/SpringForge">
                  Run simulation
                </External>
                <External href="https://github.com/Bi1ku/SpringForge">
                  Source code &amp; setup
                </External>
              </div>
            </div>
            <div className="project-notes">
              <h4>What you can explore</h4>
              <dl>
                <div>
                  <dt>System</dt>
                  <dd>
                    One to three springs attached to a rotating wheel or custom
                    polygon.
                  </dd>
                </div>
                <div>
                  <dt>Model</dt>
                  <dd>
                    Small-angle approximation or nonlinear rotational motion.
                  </dd>
                </div>
                <div>
                  <dt>Measurements</dt>
                  <dd>
                    Angular position, velocity, and acceleration over time.
                  </dd>
                </div>
              </dl>
            </div>
            <figure className="simulation-demo">
              <video
                controls
                playsInline
                preload="metadata"
                poster="/projects/springforge/poster.jpg"
                aria-label="SpringForge simulation demo"
              >
                <source src="/projects/springforge/demo.mp4" type="video/mp4" />
                Your browser does not support video.{" "}
                <a href="/projects/springforge/demo.mp4">
                  Download the SpringForge demo
                </a>
                .
              </video>
              <figcaption>
                <span>
                  SpringForge · Three-spring system and custom-shape simulation
                </span>
                <a
                  href="/projects/springforge/demo.mp4"
                  target="_blank"
                  rel="noreferrer"
                >
                  Watch full size ↗
                </a>
              </figcaption>
            </figure>
          </article>

          <div className="more-projects">
            <h3>Other projects</h3>
            <div className="project-grid">
              {otherProjects.map((project) => (
                <article key={project.name}>
                  <p className="eyebrow">{project.category}</p>
                  <h4>
                    <External href={`https://github.com/Bi1ku/${project.name}`}>
                      {project.name}
                    </External>
                  </h4>
                  <p>{project.description}</p>
                  <p className="tech">{project.tech}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="experience" aria-labelledby="experience-title">
          <div className="section-heading">
            <h2 id="experience-title">Experience</h2>
          </div>
          <div className="experience-list">
            {experience.map((item) => (
              <article key={item.organization}>
                <p className="dates">{item.dates}</p>
                <div>
                  <h3>{item.organization}</h3>
                  <p className="role">{item.role}</p>
                  {item.description && <p>{item.description}</p>}
                </div>
              </article>
            ))}
          </div>
        </section>
        <section id="about" className="about" aria-labelledby="about-title">
          <div className="section-heading">
            <h2 id="about-title">About</h2>
          </div>
          <div className="about-grid">
            <div>
              <p>
                I’m from Queens, New York, and graduated from Stuyvesant High
                School. I’m now studying Electrical Engineering and Computer
                Science at Harvard College in Cambridge, Massachusetts.
              </p>
              <a href="/Owen_Shi_Resume.pdf" target="_blank" rel="noreferrer">
                View Resume <span className="link-note">PDF ↗</span>
              </a>
            </div>
            <div>
              <h3>Tools I use</h3>
              <p className="tools-list">
                C · C++ · Java · Kotlin · Lua · Go · JavaScript · TypeScript ·
                Python · HTML · CSS · React · Next.js · Node.js · Tailwind CSS ·
                Material UI · PostgreSQL · Prisma · MongoDB · VS Code · Android
                Studio · Neovim · CMake · AWS · Google Cloud · Supabase · KiCad
              </p>
              <h3>Contact</h3>
              <p className="contact-emails">
                <a href="mailto:2008owenshi@gmail.com">2008owenshi@gmail.com</a>
                <br />
                <a href="mailto:oshi1@college.harvard.edu">
                  oshi1@college.harvard.edu
                </a>
                <br />
                <External href="https://www.linkedin.com/in/owen-shi-14a5a426a/">
                  LinkedIn
                </External>
              </p>
            </div>
          </div>
        </section>
      </main>
      <footer>
        <span>Owen Shi</span>
        <a href="#">Back to top ↑</a>
      </footer>
    </>
  );
}
