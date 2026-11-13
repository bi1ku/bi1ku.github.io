# Owen Shi — Engineering & Projects

A project-focused portfolio, built with React, TypeScript, and vinext. Projects, experience, and background are visible on a single page.

## Development

Run `npm ci`, then `npm run dev`. Run `npm run build` for the deployment build and `npm test` for the server-rendering smoke test.

## Content

The biography, experience, education, and skill details come from Owen_Shi_Resume.pdf, with current Harvard club roles supplied directly by Owen in October 2026. Featured repositories were checked against https://github.com/Bi1ku on September 14, 2026. Edit `app/page.tsx` to update project and experience content, and `app/globals.css` to change the theme. Replace `public/Owen_Shi_Resume.pdf` to update the download.

The model rocket project is Owen’s C6-5 build, with project details and media supplied in October 2026. Its Onshape CAD image and browser-compatible H.264/AAC launch video live in `public/projects/rocket/`; the project section includes an inline CAD preview and a playable launch video.

## GitHub Pages

The public website is https://bi1ku.github.io/. `npm run dev:pages` starts the static development server; `npm run build:pages` creates `dist-pages/`. GitHub Actions builds and deploys each push to `main`. Select **GitHub Actions** under **Settings → Pages → Source** in the repository.

This build reuses the same portfolio component and stylesheet without requiring a server. The original vinext/Sites build remains available through `npm run build`.

## HUAC flight computer

The featured avionics flight computer was designed by Owen for HUAC Rocketry’s IREC 10k rocket. Its schematic, routed PCB screenshot, and 3D render were supplied from Owen’s Desktop in November 2026 and are stored in `public/projects/avionics/`. Hardware descriptions are based on those images. The page does not claim completed firmware, bench testing, or flight validation.

## bik demo

The bik section reflects compiler commit `1ff737f68df68f5577fb0cf3fd6f9a1baac81894`, checked against GitHub HEAD on November 12, 2026. It highlights inheritance, method overrides, independent instances, recursive integer functions, nested calls, and the CLI/regression suite. Runtime string/decimal updates and function-local variable scopes remain unfinished.

The interactive demo has three selectable programs: the repository’s character battle and recursive algorithms, plus a constant-folding example. Each includes full source, full generated MIPS, downloadable files, and actual SPIM stdout. The character health visualization follows captured output during user-initiated replay. Reduced-motion visitors see completed results immediately. This is a replay of verified execution, not a compiler running in the browser or a performance benchmark.

Regenerate with `python3 scripts/generate-bik-demo.py /path/to/bik` after building `build-local/execute` and installing SPIM. Use `--compiler` for an alternate binary path. The script fails if any runtime output differs from the expected result. All capture data and downloadable source/assembly files live in `public/projects/bik/`. The earlier GIF and poster remain as legacy assets; the page no longer uses them.

## SpringForge demo

Owen’s screen recording is embedded beneath the SpringForge description with native playback controls, a still poster, and a full-size video link. The original MP4 and extracted poster are in `public/projects/springforge/`. The section also links to the live GlowScript app. Playback is user-initiated.
