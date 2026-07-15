# Architecture

A client-side Create React App (React 18). No backend — QR codes and barcodes are generated, previewed, exported, and scanned entirely in the browser.

## Entry point & state

`src/index.js` renders `src/App.jsx`. `App.jsx` owns a single `config` object that covers both generators (shared fields plus QR-specific and barcode-specific fields) and updates it through `updateConfig(field, value)`. `config.generatorType` (`"qrcode"` | `"barcode"` | `"scanner"`, from `constants/generatorTypes.js`) selects which mode renders. State is passed down via props.

`ModeSelector` is rendered at the top of `<main>` at all times so the user can switch between generating and scanning; it spans the full width of the two-column content grid.

```
App.jsx  ── config, updateConfig ──▶  ModeSelector       (QR / Barcode / Scan)
         ── config, updateConfig ──▶  Controls           (all generator inputs)
         ── config ────────────────▶  QRCodePreview  or  BarcodePreview
         ── showToast, onGenerate ─▶  ScannerPanel       (scanner mode)
         ── notification ──────────▶  Toast
                                       HistoryPanel      (portal at root)
```

In scanner mode, `App.jsx` renders `ScannerPanel` instead of the preview/controls pair. `ScannerPanel`'s `onGenerate(targetType, text)` callback writes the scanned value into `config.text` and switches `generatorType` back to a generator, so a scanned code can be re-generated in one tap.

## Directory layout

```
src/
├── App.jsx / App.css          # Root component + global styles and theme variables
├── index.js                   # Entry point
├── components/
│   ├── layout/                # Header (theme toggle), Footer
│   ├── common/                # Toast
│   ├── generator/
│   │   ├── QRCodePreview.jsx      # QR render + copy (react-qrcode-logo → <canvas>)
│   │   ├── BarcodePreview.jsx     # Barcode render + validation (react-barcode → <svg>)
│   │   ├── Controls.jsx           # Unified control panel for both generators
│   │   ├── ModeSelector.jsx       # QR / Barcode / Scan switcher (always visible)
│   │   ├── ExportOptions.jsx      # PNG / WEBP / PDF / SVG export
│   │   ├── ColorPickerAdvanced.jsx
│   │   ├── HistoryPanel.jsx       # localStorage-backed history modal
│   │   └── HistoryButton.jsx      # History trigger in the header
│   └── scanner/
│       └── ScannerPanel.jsx       # Camera/image reader (html5-qrcode) + NF-e details
├── constants/
│   ├── generatorTypes.js      # GENERATOR_TYPES / GENERATOR_LABELS
│   └── barcodeTypes.js        # Formats, UI categories, examples, defaults
└── utils/
    ├── barcodeValidators.js   # Per-format validation & normalization
    └── nfeParser.js           # NF-e / NFC-e access-key extraction & decoding
```

## QR vs barcode: two rendering paths

The two generators are asymmetric, and export logic branches on `isBarcode`:

- **QR** (`QRCodePreview`) uses `react-qrcode-logo`, which renders to a **`<canvas>`**. Export reads the canvas directly.
- **Barcode** (`BarcodePreview`) uses `react-barcode` (JsBarcode), which renders to an **`<svg>`**. Export serializes the SVG onto a canvas first before producing PNG/WEBP/PDF; SVG export is available for barcodes only.

`ExportOptions` is shared by both and handles all downloads, including an optional transparent-background pass.

## Barcode formats & validation

`constants/barcodeTypes.js` is the single source of truth for the format list (`BARCODE_FORMATS`), UI grouping (`BARCODE_CATEGORIES`), example values (`BARCODE_EXAMPLES`), and defaults. Some UI-distinct formats map to the same JsBarcode string (e.g. both `UPCA` and `UPCE` → `"UPC"`; `ISBN` → `"EAN13"`); the distinction is enforced by validation rather than the underlying library.

`utils/barcodeValidators.js` holds per-format rules. `validateBarcodeValue(format, value)` returns `{ valid, message?, suggestion?, normalized? }`. `BarcodePreview` runs it before rendering, shows an error card (with a "use example" button) when invalid, and passes any `normalized` value (e.g. a UPC-E padded with a computed check digit) to the barcode component.

**To add a barcode format:** add it to `BARCODE_FORMATS`, to a category in `BARCODE_CATEGORIES`, to `BARCODE_EXAMPLES`, and register a validator in `BARCODE_VALIDATORS` for every alias/format string that can reach it.

## Scanner & NF-e decoding

`ScannerPanel` (`components/scanner/`) uses **html5-qrcode** to read codes from the
camera or an uploaded image. A single `Html5Qrcode` instance is created lazily and
targets a fixed DOM node (`#qr-reader-region`); the component starts the rear camera
with `{ facingMode: "environment" }`, stops it on the first successful read, and
always releases it on unmount. Camera scanning and file scanning are mutually
exclusive, so uploading an image stops any running camera first. The reader is
restricted to QR plus the common 1D formats (Code 128 — used by the DANFE — Code 39,
EAN-13/8, UPC-A/E, ITF, Codabar).

Decoding lives in `utils/nfeParser.js` and is pure/testable:

- `extractAccessKey(text)` pulls a 44-digit access key out of any scanned string —
  a raw barcode value, a `chNFe=` parameter, or an NFC-e SEFAZ URL.
- `isAccessKeyValid(key)` validates the check digit via modulo 11.
- `parseNFe(text)` returns the decomposed fields (UF, emission, issuer CNPJ, model,
  series, number, emission type) or `null` when the text is not a fiscal document.

`ScannerPanel` renders those fields when a fiscal document is detected and otherwise
shows the raw decoded text, with actions to copy, open a link, consult the SEFAZ
portal, or hand the value to a generator via the `onGenerate` callback.

## Cross-component channels

Two interactions bypass props (kept intentionally simple):

- **History:** `HistoryPanel` assigns `window.addToHistory`, `window.openHistoryPanel`, and `window.getHistoryCount` on mount; `App.jsx` calls `addToHistory` from a debounced effect (2s after `config.text` stops changing), `HistoryButton` polls `getHistoryCount`.
- **Barcode reset:** `BarcodePreview` dispatches a `resetBarcodeText` `CustomEvent`; `App.jsx` listens and writes the example value back into `config.text`.

## Styling & theming

Plain CSS, co-located per component. Theming is driven by CSS custom properties defined in `App.css` under `:root` (light) and `.dark` (dark); the active theme is toggled by adding a `light`/`dark` class to the root `.app-container`. Dark-mode overrides must be keyed on the `.dark` class (not the OS `prefers-color-scheme`), because the theme is toggled in-app.

## Deployment

Built with `react-scripts build` and served as static files on **Cloudflare Pages**
under the custom domain `qrcode.devfrs.com`. There is no server-side component.

Cloudflare is connected to the GitHub repository and rebuilds on every push to
`main` using build command `npm run build` (Node 20, pinned via `.nvmrc`). The
`build/` output is published as Cloudflare Workers static assets via `wrangler.jsonc`
(`assets.directory: ./build`, SPA fallback), deployed with `npx wrangler deploy`.
The custom domain and DNS are managed in the Cloudflare dashboard, so no `homepage`
field or `CNAME` file is required — assets load from the domain root.
