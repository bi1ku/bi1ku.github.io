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

The bik project has a short demo GIF built from real compiler output. To regenerate it, install Pillow, build bik at `build-local/execute`, and run:

```bash
python3 scripts/generate-bik-demo.py /path/to/bik
```

## Deployment

GitHub Actions builds and deploys the site to GitHub Pages whenever changes are pushed to `main`. The workflow is in `.github/workflows/`.

## Checks

```bash
npm run build:pages
npm test
```
