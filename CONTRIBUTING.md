# Contributing

Everyone is welcome here: first-time contributors, designers, people who only
found a typo, and people who want to add a barcode format. You do not need to
know the whole codebase; [ARCHITECTURE.md](./ARCHITECTURE.md) gives the map in
five minutes. Portuguese or English are both fine in issues and pull requests.

By taking part you agree to follow the [Code of Conduct](./CODE_OF_CONDUCT.md).

## Ways to help

- **Report a bug** or a code that does not scan: open a
  [bug report](https://github.com/Franklyn-R-Silva/barcode-qr-generator/issues/new?template=bug_report.yml).
- **Suggest an idea**: open a
  [feature request](https://github.com/Franklyn-R-Silva/barcode-qr-generator/issues/new?template=feature_request.yml).
- **Pick an issue**: start with the
  [good first issues](https://github.com/Franklyn-R-Silva/barcode-qr-generator/issues?q=is%3Aissue%20is%3Aopen%20label%3A%22good%20first%20issue%22),
  or any open issue; say in a comment that you are taking it.
- **Improve the docs**: README, this guide, or a clearer error message in the app.

Security problems go through the private channel in [SECURITY.md](./SECURITY.md),
never a public issue.

## Getting started

Requires **Node.js 22** (see `.nvmrc`).

```bash
git clone https://github.com/Franklyn-R-Silva/barcode-qr-generator.git
cd barcode-qr-generator
npm install
npm start          # http://localhost:3000 (Vite)
```

Before opening a pull request, make sure the production build compiles:

```bash
npm test
npm run build
```

GitHub Actions runs both on every pull request.

## Workflow

Every change starts from an issue: open one (or pick an existing one) before
the pull request, so the problem is agreed on first. The pull request then
says `Closes #<number>`, and merging it closes the issue.

1. Fork the repository and create a branch from `main`:
   `git checkout -b feat/short-description` (or `fix/…`, `refactor/…`, `docs/…`).
2. Make your change, keeping it focused — one concern per pull request.
3. Verify `npm run build` succeeds.
4. Push your branch and open a pull request against `main` describing **what**
   changed and **why**.

## Tests

New behaviour and bug fixes come with a test that fails without the change.
Pure logic lives in `src/utils/` with a `*.test.js` next to it (see
`pix.test.js`, `qrSvg.test.js`); that is the easiest place to test. CI runs
`npm test` and `npm run build` on every pull request.
UI-only changes can say how you checked them instead.

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
  rather than hard-coding colors, so light/dark mode keeps working. Shared
  building blocks (`.panel`, `.btn`, `.input`, `.select`, `Segmented`) already
  exist; use them before adding new styles. `DESIGN.md` documents the system.
- User-facing strings are written in **English** in the code and wrapped in
  `t()` (`useT()` from `src/i18n.js`); add the Portuguese (pt-BR) text to
  `src/locales/pt.js`. `src/i18n.test.js` fails when a string has no
  Portuguese entry or an entry is no longer used.

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
