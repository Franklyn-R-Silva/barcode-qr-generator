# Contributing

Thanks for your interest in improving the QR Code & Barcode Generator! This is a
client-side Create React App project — see [ARCHITECTURE.md](./ARCHITECTURE.md)
for an overview before diving in.

## Getting started

Requires **Node.js 18.x**.

```bash
git clone https://github.com/Franklyn-R-Silva/barcode-qr-generator.git
cd barcode-qr-generator
npm install
npm start          # http://localhost:3000
```

Before opening a pull request, make sure the production build compiles:

```bash
npm run build
npm test -- --watchAll=false   # if you added or changed tests
```

## Workflow

1. Fork the repository and create a branch from `main`:
   `git checkout -b feat/short-description` (or `fix/…`, `refactor/…`, `docs/…`).
2. Make your change, keeping it focused — one concern per pull request.
3. Verify `npm run build` succeeds.
4. Push your branch and open a pull request against `main` describing **what**
   changed and **why**.

## Commit messages

This project uses [Conventional Commits](https://www.conventionalcommits.org/).
Use a `type: summary` prefix, for example:

- `feat: add Data Matrix barcode support`
- `fix: correct transparent-background export for QR codes`
- `refactor: simplify Controls state handling`
- `docs: update architecture notes`

Write the summary in the imperative mood and keep it under ~72 characters.

## Code style

- **Components** are `PascalCase` `.jsx` files with a co-located `.css` file.
- **State** lives in the single `config` object in `App.jsx` and flows down via
  props; add new options as fields there and thread them through `Controls` and
  the relevant preview component.
- **Constants** (formats, examples, generator types) belong in `src/constants/`,
  not inline in components.
- **Theming** uses the CSS custom properties defined in `App.css`. Reuse the
  existing tokens (`--primary`, `--text-main`, `--bg-panel`, `--border`, …)
  rather than hard-coding colors, so light/dark mode keeps working.
- User-facing strings are in **Portuguese (pt-BR)**; keep new UI copy consistent.

## Adding a new barcode format

1. Add the key to `BARCODE_FORMATS` in `src/constants/barcodeTypes.js`.
2. List it under a category in `BARCODE_CATEGORIES` and add a sample to
   `BARCODE_EXAMPLES`.
3. Register a validator in `BARCODE_VALIDATORS`
   (`src/utils/barcodeValidators.js`) for every alias/format string that can
   reach it.

## Reporting bugs

Open an issue with steps to reproduce, the barcode/QR format involved, your
browser, and — if relevant — a screenshot. Suggestions and feature requests are
welcome too.
