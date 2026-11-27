# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

React (Create React App) single-page app for generating **and scanning** QR Codes and 1D barcodes (25+ formats) entirely in the browser. No backend. Deployed to **Cloudflare** under the custom domain `qrcode.devfrs.com`: `npm run build` produces `build/`, published as Workers static assets via `wrangler.jsonc` (`npx wrangler deploy`), Node 20 pinned via `.nvmrc` (Wrangler 4 needs Node ≥ 20). The UI is in Portuguese (pt-BR) — match this when adding user-facing strings. Project documentation (README, ARCHITECTURE, CHANGELOG, this file) is in English.

## Commands

```bash
npm start          # Dev server at http://localhost:3000
npm run build      # Production build to build/
npm test           # Jest + React Testing Library (watch mode)
npm test -- --watchAll=false   # Single run (CI-style)
npm test -- <pattern>          # Run tests matching a filename/name pattern
```

Use Node 20 (`.nvmrc`; the build itself also runs on 18, `engines` says `>=18`). There is no lint script; CRA's ESLint runs during `npm run build`, and with `CI=true` its warnings fail the build (that is how CI runs it). Tests: `src/utils/contrast.test.js`.

## Architecture

Entry: `src/index.js` → `src/App.jsx`. `App.jsx` holds one unified `config` state object covering both generators (generatorType, shared text/colors, plus QR-specific and barcode-specific fields) and updates it via `updateConfig(field, value)`. State is prop-drilled to `ContentInput` and `Controls` (both in `Controls.jsx`), `ModeSelector`, and the preview/scanner components. `config.generatorType` (`GENERATOR_TYPES.QRCODE` | `.BARCODE` | `.SCANNER`, from `src/constants/generatorTypes.js`, values `"qrcode"`/`"barcode"`/`"scanner"`) selects which mode renders. `ModeSelector` is always rendered at the top of `<main>` (spans the grid) so the user can switch modes; in scanner mode `App.jsx` renders `ScannerPanel` in place of the content/preview/settings trio. Layout lives in `App.css` grid areas (`content`, `preview`, `settings`): stacked on phones, preview sticky on the left from 960px.

```
src/
  App.jsx / App.css       Root component + global styles / theme variables
  components/
    layout/               Header (theme toggle), Footer
    common/               Toast, Segmented (radio-based segmented control)
    generator/            QRCodePreview, BarcodePreview, Controls, ModeSelector,
                          ExportOptions, ColorPickerAdvanced, HistoryPanel, HistoryButton
    scanner/              ScannerPanel (html5-qrcode camera/image reader + NF-e details)
  constants/              generatorTypes.js, barcodeTypes.js
  utils/                  barcodeValidators.js, nfeParser.js, contrast.js (+ test)
```

## Scanner & NF-e (`components/scanner/ScannerPanel.jsx`, `utils/nfeParser.js`)

`ScannerPanel` uses `html5-qrcode` to read QR + 1D barcodes from the camera (`facingMode: "environment"`) or an uploaded image; a single lazily-created `Html5Qrcode` instance targets `#qr-reader-region`, stops on first read, and is released on unmount. `utils/nfeParser.js` is pure: `parseNFe(text)` extracts a 44-digit NF-e/NFC-e access key (from a raw barcode, `chNFe=` param, or SEFAZ URL), validates the modulo-11 check digit, and decodes UF/emission/CNPJ/model/series/number. `ScannerPanel.onGenerate(targetType, text)` (wired to `App.handleGenerateFromScan`) sends a scanned value back into a generator.

## QR vs Barcode rendering differences

These two paths are asymmetric and export logic branches on `isBarcode`:
- **QR** (`QRCodePreview.jsx`) uses `react-qrcode-logo`, which renders to a **`<canvas>`**. Export reads the canvas directly (`getCanvas`).
- **Barcode** (`BarcodePreview.jsx`) uses `react-barcode` (JsBarcode), which renders to an **`<svg>`**. Export serializes the SVG and draws it onto a canvas first (`getSVG` → `svgToCanvas`).

`ExportOptions.jsx` is shared by both and does all export work inline (PNG / WEBP / PDF via jsPDF; SVG download is barcode-only), including the optional transparent-background pass. The preview passes its copy-image button as `children`.

## Barcode formats & validation

- `src/constants/barcodeTypes.js` is the single source of truth for the format list: `BARCODE_FORMATS` (keys → JsBarcode format strings), `BARCODE_CATEGORIES` (UI grouping), `BARCODE_EXAMPLES`, `BARCODE_DEFAULTS`. Some UI-distinct formats map to the same JsBarcode string (e.g. both `UPCA` and `UPCE` → `"UPC"`; `ISBN` → `"EAN13"`); the difference is enforced by validation, not by the underlying library.
- `src/utils/barcodeValidators.js` holds per-format rules. `validateBarcodeValue(format, value)` returns `{ valid, message?, suggestion?, normalized? }`. `BarcodePreview` runs this in a `useEffect` before rendering and shows an error card (with a "use example" button) when invalid. A `normalized` value (e.g. UPC-E padded with system/check digits via `calculateUPCCheckDigit`) is what actually gets passed to `<Barcode>`.
- To add a barcode format: add it to `BARCODE_FORMATS`, a category in `BARCODE_CATEGORIES`, an entry in `BARCODE_EXAMPLES`, and a validator wired into `BARCODE_VALIDATORS` (keyed by every alias/format string that can reach it).

## Cross-component channels (bypass props — be careful when refactoring)

- **History**: `HistoryPanel.jsx` assigns `window.addToHistory` / `window.openHistoryPanel` / `window.getHistoryCount` on mount and deletes them on unmount. `App.jsx` calls `addToHistory` via a debounced `useEffect` (2s after `config.text` stops changing); `HistoryButton.jsx` polls `getHistoryCount` on an interval.
- **Barcode reset**: `BarcodePreview.jsx` fires a `resetBarcodeText` `CustomEvent` on `window`; `App.jsx` listens and writes the example value back into `config.text`.

## Styling & theming

Plain CSS co-located per component; tokens and shared primitives (`.panel`, `.btn*`, `.input`, `.select`, `.check`, `.alert`) live in `App.css`. Theme is a `dark` class on `<html>` (set before paint by an inline script in `public/index.html`, then kept in sync and saved by `App.jsx`), driving CSS custom properties in `App.css` (`:root` for light, `.dark` for dark). `App.css` still defines the older alias names (`--text-primary`, `--text-secondary`, `--bg-secondary`, …) mapped to the base tokens (`--text-main`, `--text-muted`, `--bg-sunken`); new code should use the base names.

## Design (impeccable)

The UI was redesigned with [impeccable](https://github.com/pbakaus/impeccable) (installed under `.claude/`, with its design hook in `.claude/settings.json`). Read `PRODUCT.md` (who it is for, constraints) and `DESIGN.md` (tokens, components) before UI work; the direction contract is in `.impeccable/surfaces/src-app-jsx.md`. The chosen direction is the category standard: familiar, one blue for actions, no gradients, emoji or decorative motion. `.impeccable/config.json` waives the `overused-font` finding for Inter on purpose.
