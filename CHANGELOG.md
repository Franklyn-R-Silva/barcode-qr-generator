# Changelog

All notable changes to this project are documented here. The format is based on
[Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [Unreleased]

### Added

- **Frame formats**: band, U-shaped arc, circle and square, with the label
  following the curve or running all the way round (SVG `textPath`). Long
  band labels wrap to two lines or shrink to fit instead of overflowing.
- **Artistic QR**: a photo behind the code with a lightening veil and a
  module-size control (the photo shows between smaller modules).
- **Logo controls**: size, rounded corners up to a circle, border, opacity and
  cleared modules, with a coverage meter against the error-correction capacity
  (`logoCoverage` in `utils/qrSvg.js`).
- **Live read test**: the preview reads its own code back with the scanner's
  decoder (`utils/readQr.js`) and shows "leitura testada" or "não leu".
- **More QR styles**: rounded modules, circular eyes, gradient, eye colour,
  adjustable margin.
- **Import from an image**: recreate a QR Code from a photo or screenshot of it.
- Uploaded images are downscaled (`utils/image.js`) so the preview stays fast
  and the history fits in localStorage.
- **QR content types**: Link, Texto, Pix, WhatsApp, Wi-Fi, E-mail, Telefone,
  SMS and Contato (vCard), each with a form (`utils/qrContent.js`, tested).
- **Pix**: static QR Code in the Banco Central BR Code format with CRC-16
  (`utils/pix.js`); the test reproduces the manual's example exactly. The
  "copia e cola" text can be copied.
- **Frame** with a label ("Escaneie-me", "Cardápio"…) around the QR Code,
  included in every export.
- **SVG export for QR Codes**, and a checkerboard preview when "Fundo
  transparente" is on (barcodes now export with a truly transparent background).
- New app icons (`logo192.png`, `logo512.png`, `favicon.ico`) drawn from the
  new mark; the manifest also lists `favicon.svg`.
- **Redesign** made with [impeccable](https://github.com/pbakaus/impeccable): the
  familiar layout of the category leaders (code on the left, always in view,
  with one blue download button; content and settings on the right; on phones
  content, code, settings). New tokens and shared primitives in `App.css`,
  Inter type, radio-based `Segmented` control, history as a native `<dialog>`
  drawer, colour picker that closes on Esc/outside click and validates hex.
  `PRODUCT.md`, `DESIGN.md` and the impeccable skill/hook under `.claude/`.
- Scan-safety warning when the code colour is too light for its background or
  lighter than it (`utils/contrast.js`, with tests), and a reminder to use
  error correction H when a logo is added; button to remove the logo.
- Theme follows the system on the first visit, is remembered, and is applied
  before the first paint (no white flash in dark mode).
- `LICENSE` (MIT, which the README already claimed), `SECURITY.md` with private
  vulnerability reporting, a CI workflow (tests + `CI=true` build) and grouped
  monthly Dependabot updates.
- **Brazilian document barcodes**: new "Boletos & Notas Fiscais" category with
  Boleto Bancário and Boleto de Arrecadação (ITF, 44 digits) and NF-e / DANFE
  (Code-128C, 44 digits). Validators accept either the 44-digit barcode or the
  digitable line (47 digits bank / 48 digits arrecadação) and convert it; the
  NF-e option extracts the access key from a raw key or a SEFAZ URL.
- **Scanner mode**: read QR Codes and 1D barcodes with the device camera or from
  an uploaded image, powered by `html5-qrcode`. Added a `ScannerPanel` component
  and a `scanner` value to `GENERATOR_TYPES`.
- **NF-e / NFC-e reader**: `utils/nfeParser.js` extracts the 44-digit access key
  from a barcode, a `chNFe` parameter, or an NFC-e SEFAZ URL, validates its
  modulo-11 check digit, and decodes UF, emission month, issuer CNPJ, model,
  series, and number. Scanned fiscal documents show a structured details card with
  copy / open-link / SEFAZ-lookup / re-generate actions.
- **Always-visible `ModeSelector`** (QR Code / Barcode / Scan) at the top of the
  content area, replacing the two-button selector previously inside `Controls`.
- **Cloudflare deployment** as a static build (`npm run build` → `build/`,
  published as Workers static assets, Node 20 pinned via `.nvmrc`), served from
  the custom domain `qrcode.devfrs.com`.
- SEO/PWA metadata: descriptive `<title>`, Open Graph/Twitter tags, canonical URL,
  `robots.txt` + `sitemap.xml`, and a branded `manifest.json`.
- `CONTRIBUTING.md` with development setup, branch/commit conventions, and code
  style guidelines.
- Proper UPC-E support: UPC-E values are now expanded to their 12-digit UPC-A
  equivalent so they render correctly.

### Changed

- Export: the download button sits right under the code and names the format
  ("Baixar PNG"); format and transparent background are always visible instead
  of hidden in a dropdown.
- Emoji removed from headings and messages; icons come from one set.
- Deployment docs: Cloudflare Workers static assets and Node 20 everywhere
  (README, CONTRIBUTING, ARCHITECTURE, CLAUDE.md).
- **Rebranded** the app to "QR & Barcode Studio" across the header, footer, page
  title, and manifest; the footer now links to `qrcode.devfrs.com`.
- Barcode formats now use a unique `id` decoupled from the JsBarcode render
  string, so formats that share an encoder (UPC-A/UPC-E, EAN-13/ISBN) keep
  independent validation and example values.
- Replaced the five separate barcode-category dropdowns with a single grouped
  `<select>` (using `<optgroup>`), simplifying format selection.
- Made the color-picker dark mode follow the app's theme toggle instead of the
  operating system's `prefers-color-scheme`.

### Fixed

- History panel dark-mode styles were keyed on the OS `prefers-color-scheme`
  instead of the app's `.dark` theme class, so they ignored the in-app toggle.
- Replaced hardcoded pastel hover backgrounds (`#fef2f2`, `#f0fdf4`, `#fee2e2`) on
  the history/preview buttons with translucent tints that work in dark mode.
- Export-format buttons "disappeared" on hover in dark mode (hover background
  matched the dropdown surface); they now use a translucent primary tint.
- The preview modal could render behind the history panel; its overlay now stacks
  above the panel.
- Error toasts no longer show a green success check icon and glow — the toast now
  reflects error vs. success styling based on the message.
- **UPC-A and UPC-E were broken**: they shared the JsBarcode `"UPC"` value, so
  their example values collided and UPC-A received an invalid 8-digit example.
- EAN-13 no longer shows the ISBN example value (previous key collision).
- ISBN and UPC-E now run their own validators instead of falling back to
  EAN-13 / UPC-A.
- Restored missing theme variables (`--text-primary`, `--text-secondary`,
  `--bg-primary`, `--bg-secondary`, `--border-color`, `--shadow-md`) — declared
  in both light and dark scopes — that broke text, backgrounds, borders, and
  shadows in the color picker, barcode error hints, and the logo info box.
- Transparent-background export for QR codes produced a blank image because the
  canvas pixels were read before the code was drawn.
- The notification toast never auto-dismissed while typing, because its close
  handler was recreated on every render and reset the timer.
- Generation history recorded near-duplicate entries when only colors/size were
  tweaked; it now saves once per distinct text value.
- Selecting the "Selecione…" placeholder in a barcode category no longer clears
  the format and renders a broken barcode.

### Removed

- `react-qrcode-logo`: QR Codes are drawn as SVG by `utils/qrSvg.js` on top of
  `qrcode-generator` (the same matrix library, same byte encoding), so the
  preview and every export come from one drawing. Exported codes were
  checked by reading them back with the app's scanner.
- `framer-motion` and the entrance/hover-zoom animations on the code preview.
- The history "preview" modal (its details now show in the list row).
- **Netlify**: removed `netlify.toml` and all Netlify references (deployment
  moved to GitHub Pages at the time, and later to Cloudflare).
- Dead parallel architecture that was never wired into the running app
  (`App.refactored.jsx`, `contexts/`, `services/`, `hooks/`, `styles/`,
  and the unused `AnimatedGenerator` and `LoadingSpinner` components).
- Unused dependencies (`qrcode`, `react-qr-code`, `html-to-image`,
  `html2canvas`, `web-vitals`) and a stray self-referential dependency.
- Redundant Portuguese planning/summary Markdown files.

### Changed

- Rewrote the project documentation (`README`, `ARCHITECTURE`, `CHANGELOG`)
  in English.

## [2.0.0]

### Added

- **Barcode support** with 25+ formats: Code 39/93/128 (A/B/C), GS1-128,
  ITF, ITF-14, EAN-13/8/5/2, ISBN, UPC-A, UPC-E, MSI variants, Pharmacode,
  and Codabar.
- Generator type selector to switch between QR Code and barcode, with
  per-format example values filled in automatically.
- Barcode controls: bar height, bar width, font size, and a toggle to
  show/hide the numeric value.
- Per-format validation with friendly error messages and example values.
- Multi-format export (PNG, WEBP, PDF, and SVG for barcodes) with an
  optional transparent background.
- Local generation history backed by `localStorage`.

### Changed

- Reorganized `src/` into `layout/`, `common/`, and `generator/` component
  groups, with shared configuration under `constants/`.

## [1.0.0]

### Added

- Initial QR Code generator: color customization, module and eye styles,
  logo upload with opacity control, error-correction levels, ready-made
  templates, light/dark theme, PNG download, clipboard copy, and social
  sharing.
