# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

React (Create React App) single-page app for generating QR Codes and 1D barcodes (25+ formats) entirely in the browser. No backend. Deployed to Netlify. The UI is in Portuguese (pt-BR) — match this when adding user-facing strings. Project documentation (README, ARCHITECTURE, CHANGELOG, this file) is in English.

## Commands

```bash
npm start          # Dev server at http://localhost:3000
npm run build      # Production build to build/
npm test           # Jest + React Testing Library (watch mode)
npm test -- --watchAll=false   # Single run (CI-style)
npm test -- <pattern>          # Run tests matching a filename/name pattern
```

Node 18 is required (`engines` in package.json; `netlify.toml` pins `node_version = "18"`). There is no lint script and there are currently no test files, though the Jest tooling is configured.

## Architecture

Entry: `src/index.js` → `src/App.jsx`. `App.jsx` holds one unified `config` state object covering **both** generators (generatorType, shared text/colors, plus QR-specific and barcode-specific fields) and updates it via `updateConfig(field, value)`. State is prop-drilled to `Controls` and the preview components. `config.generatorType` (`GENERATOR_TYPES.QRCODE` | `.BARCODE`, from `src/constants/generatorTypes.js`, values `"qrcode"`/`"barcode"`) selects which preview renders.

```
src/
  App.jsx / App.css       Root component + global styles / theme variables
  components/
    layout/               Header (theme toggle), Footer
    common/               Toast
    generator/            QRCodePreview, BarcodePreview, Controls, ExportOptions,
                          ColorPickerAdvanced, HistoryPanel, HistoryButton
  constants/              generatorTypes.js, barcodeTypes.js
  utils/                  barcodeValidators.js
```

## QR vs Barcode rendering differences

These two paths are asymmetric and export logic branches on `isBarcode`:
- **QR** (`QRCodePreview.jsx`) uses `react-qrcode-logo`, which renders to a **`<canvas>`**. Export reads the canvas directly (`getCanvas`).
- **Barcode** (`BarcodePreview.jsx`) uses `react-barcode` (JsBarcode), which renders to an **`<svg>`**. Export serializes the SVG and draws it onto a canvas first (`getSVG` → `svgToCanvas`).

`ExportOptions.jsx` is shared by both and does all export work inline (PNG / WEBP / PDF via jsPDF; SVG download is barcode-only), including the optional transparent-background pass.

## Barcode formats & validation

- `src/constants/barcodeTypes.js` is the single source of truth for the format list: `BARCODE_FORMATS` (keys → JsBarcode format strings), `BARCODE_CATEGORIES` (UI grouping), `BARCODE_EXAMPLES`, `BARCODE_DEFAULTS`. Some UI-distinct formats map to the same JsBarcode string (e.g. both `UPCA` and `UPCE` → `"UPC"`; `ISBN` → `"EAN13"`); the difference is enforced by validation, not by the underlying library.
- `src/utils/barcodeValidators.js` holds per-format rules. `validateBarcodeValue(format, value)` returns `{ valid, message?, suggestion?, normalized? }`. `BarcodePreview` runs this in a `useEffect` before rendering and shows an error card (with a "use example" button) when invalid. A `normalized` value (e.g. UPC-E padded with system/check digits via `calculateUPCCheckDigit`) is what actually gets passed to `<Barcode>`.
- To add a barcode format: add it to `BARCODE_FORMATS`, a category in `BARCODE_CATEGORIES`, an entry in `BARCODE_EXAMPLES`, and a validator wired into `BARCODE_VALIDATORS` (keyed by every alias/format string that can reach it).

## Cross-component channels (bypass props — be careful when refactoring)

- **History**: `HistoryPanel.jsx` assigns `window.addToHistory` / `window.openHistoryPanel` / `window.getHistoryCount` on mount and deletes them on unmount. `App.jsx` calls `addToHistory` via a debounced `useEffect` (2s after `config.text` stops changing); `HistoryButton.jsx` polls `getHistoryCount` on an interval.
- **Barcode reset**: `BarcodePreview.jsx` fires a `resetBarcodeText` `CustomEvent` on `window`; `App.jsx` listens and writes the example value back into `config.text`.

## Styling & theming

Plain CSS co-located per component. Theme is a `light`/`dark` class on the root `.app-container`, driving CSS custom properties in `App.css` (`:root` for light, `.dark` for dark). Note the alias variables in `App.css` (`--text-primary`, `--text-secondary`, `--bg-secondary`) that map to the base tokens (`--text-main`, `--text-muted`, `--secondary`) — several component stylesheets use the alias names, so keep both sets defined.
