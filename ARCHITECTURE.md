# Architecture

A client-side Create React App (React 18). No backend — QR codes and barcodes are generated, previewed, and exported entirely in the browser.

## Entry point & state

`src/index.js` renders `src/App.jsx`. `App.jsx` owns a single `config` object that covers **both** generators (shared fields plus QR-specific and barcode-specific fields) and updates it through `updateConfig(field, value)`. `config.generatorType` (`"qrcode"` | `"barcode"`, from `constants/generatorTypes.js`) selects which preview component renders. State is passed down via props.

```
App.jsx  ── config, updateConfig ──▶  Controls           (all inputs)
         ── config ────────────────▶  QRCodePreview  or  BarcodePreview
         ── notification ──────────▶  Toast
                                       HistoryPanel      (portal at root)
```

## Directory layout

```
src/
├── App.jsx / App.css          # Root component + global styles and theme variables
├── index.js                   # Entry point
├── components/
│   ├── layout/                # Header (theme toggle), Footer
│   ├── common/                # Toast
│   └── generator/
│       ├── QRCodePreview.jsx      # QR render + copy (react-qrcode-logo → <canvas>)
│       ├── BarcodePreview.jsx     # Barcode render + validation (react-barcode → <svg>)
│       ├── Controls.jsx           # Unified control panel for both generators
│       ├── ExportOptions.jsx      # PNG / WEBP / PDF / SVG export
│       ├── ColorPickerAdvanced.jsx
│       ├── HistoryPanel.jsx       # localStorage-backed history modal
│       └── HistoryButton.jsx      # History trigger in the header
├── constants/
│   ├── generatorTypes.js      # GENERATOR_TYPES / GENERATOR_LABELS
│   └── barcodeTypes.js        # Formats, UI categories, examples, defaults
└── utils/
    └── barcodeValidators.js   # Per-format validation & normalization
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

## Cross-component channels

Two interactions bypass props (kept intentionally simple):

- **History:** `HistoryPanel` assigns `window.addToHistory`, `window.openHistoryPanel`, and `window.getHistoryCount` on mount; `App.jsx` calls `addToHistory` from a debounced effect (2s after `config.text` stops changing), `HistoryButton` polls `getHistoryCount`.
- **Barcode reset:** `BarcodePreview` dispatches a `resetBarcodeText` `CustomEvent`; `App.jsx` listens and writes the example value back into `config.text`.

## Styling & theming

Plain CSS, co-located per component. Theming is driven by CSS custom properties defined in `App.css` under `:root` (light) and `.dark` (dark); the active theme is toggled by adding a `light`/`dark` class to the root `.app-container`.
