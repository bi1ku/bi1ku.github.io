# Owen Shi — Portfolio

Personal portfolio featuring my software and engineering projects, experience, and contact information. Built with React and TypeScript.

## Run locally

Requires Node.js `>=22.13.0`.

```bash
npm install
npm run dev:pages
```

Open the local URL printed by Vite. To create a production build for GitHub Pages:

```bash
npm run build:pages
```

The static site is written to `dist-pages/`.

## Update the portfolio

- Edit project descriptions, experience, and the about section in `app/page.tsx`.
- Adjust layout and styling in `app/globals.css`.
- Replace the resume at `public/Owen_Shi_Resume.pdf`.
- Project photos, videos, and demo media are stored in `public/projects/`.
- Project metadata and content notes are in `PORTFOLIO.md`.

The bik project includes an interactive showcase of inheritance, recursive algorithms, and constant folding. Source, generated MIPS, and actual SPIM output are captured together; the browser replays verified results. To regenerate, install SPIM, build bik at `build-local/execute`, and run:

```bash
python3 scripts/generate-bik-demo.py /path/to/bik
```

Use `--compiler /path/to/execute` for an alternate build location. The script checks each program’s output before writing `public/projects/bik/capture.json`, its bundled copy at `app/bik-capture.json`, and downloadable `.bik` / `.asm` files. The source checkout should be clean and the compiler freshly built to keep the recorded commit accurate.

## Deployment

GitHub Actions builds and deploys the site to GitHub Pages whenever changes are pushed to `main`. The workflow is in `.github/workflows/`.

## Checks

```bash
npm run build:pages
npm test
```
