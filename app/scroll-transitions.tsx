"use client";

import { useEffect } from "react";
import { animate, inView } from "motion";

export default function ScrollTransitions() {
  useEffect(() => {
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (preference.matches) return;

    const elements = Array.from(document.querySelectorAll<HTMLElement>([
      ".intro > *",
      ".section-heading",
      ".avionics-overview > *",
      ".technical-heading",
      ".hardware-grid > div",
      ".avionics-documents > figure",
      ".bik-project > *",
      ".rocket-project > .project-copy",
      ".rocket-media > figure",
      ".featured-project > *",
      ".more-projects > h3",
      ".project-grid > article",
      ".experience-list > article",
      ".about-grid > div",
    ].join(",")));
    const animations: ReturnType<typeof animate>[] = [];
    const stops: (() => void)[] = [];

    const reset = () => {
      stops.forEach((stop) => stop());
      animations.forEach((animation) => animation.cancel());
      elements.forEach((element) => {
        element.style.removeProperty("opacity");
        element.style.removeProperty("transform");
      });
    };

    elements.forEach((element) => {
      // Enhance only after hydration so the server-rendered page stays readable.
      element.style.opacity = "0";
      const siblings = Array.from(element.parentElement?.children ?? []);
      const index = siblings.indexOf(element);
      const staggered = element.parentElement?.matches(
        ".intro, .hardware-grid, .avionics-documents, .project-grid, .rocket-media, .about-grid",
      );
      const heading = element.matches(".section-heading, .technical-heading, .more-projects > h3");
      const media = element.matches("figure, .project-demo, .simulation-demo");
      const card = element.matches(".project-grid > article, .hardware-grid > div, .project-notes");
      const experience = element.matches(".experience-list > article");

      // Give each kind of content a quiet, consistent entrance.
      const entrance = heading
        ? { opacity: [0, 1] }
        : media
          ? { opacity: [0, 1], x: [index % 2 === 0 ? -12 : 12, 0] }
          : card
            ? { opacity: [0, 1], y: [10, 0], scale: [0.985, 1] }
            : experience
              ? { opacity: [0, 1], x: [-10, 0] }
              : { opacity: [0, 1], y: [16, 0] };
      stops.push(inView(element, () => {
        animations.push(animate(element,
          entrance,
          { duration: heading ? 0.45 : media ? 0.7 : 0.6,
            delay: staggered ? (index % 4) * 0.06 : 0,
            ease: [0.22, 1, 0.36, 1] },
        ));
      }, { amount: "some", margin: "0px 0px -40px 0px" }));
    });

    // Keyboard navigation must never land on an invisible link or control.
    const revealFocus = (event: FocusEvent) => {
      const target = event.target;
      if (!(target instanceof Node)) return;
      elements.filter((element) => element.contains(target)).forEach((element) => {
        animations.push(animate(element, { opacity: 1, x: 0, y: 0, scale: 1 }, { duration: 0 }));
      });
    };
    document.addEventListener("focusin", revealFocus);
    preference.addEventListener("change", reset);
    return () => {
      reset();
      document.removeEventListener("focusin", revealFocus);
      preference.removeEventListener("change", reset);
    };
  }, []);

  return null;
}
