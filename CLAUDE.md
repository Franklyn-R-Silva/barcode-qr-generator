# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

React 18 + Vite single-page app for generating **and scanning** QR Codes and 1D barcodes (25+ formats) entirely in the browser. No backend. Deployed to **Cloudflare** under the custom domain `qrcode.devfrs.com`: `npm run build` produces `build/`, published as Workers static assets via `wrangler.jsonc` (`npx wrangler deploy`), Node 20 pinned via `.nvmrc` (Wrangler 4 needs Node ≥ 20). The UI is in Portuguese (pt-BR) and English, with a toggle in the header (see "UI text (i18n)" below). Project documentation (README, ARCHITECTURE, CHANGELOG, this file) is in English.

## Commands

```bash
npm start          # Vite dev server at http://localhost:3000
npm run build      # Production build to build/ (vite.config.mjs sets outDir)
npm run preview    # Serve the production build locally
npm test           # Vitest, single run (what CI runs)
npm run test:watch # Vitest in watch mode
npm test -- <pattern>          # Run tests whose file matches the pattern
```

Use Node 22 (`.nvmrc`, `engines` `>=22.12`; Vitest 5 needs it). The entry is `index.html` at the repo root, which loads `src/index.jsx`; files with JSX must use the `.jsx` extension. There is no lint step (CodeQL runs on every PR). Tests (Vitest, globals on, Node environment) live next to the code (`src/**/*.test.js`).

## Architecture

Entry: `src/index.js` → `src/App.jsx`. `App.jsx` holds one unified `config` state object covering both generators (generatorType, shared text/colors, plus QR-specific and barcode-specific fields) and updates it via `updateConfig(field, value)`. State is prop-drilled to `ContentInput` and `Controls` (both in `Controls.jsx`), `ModeSelector`, and the preview/scanner components. `config.generatorType` (`GENERATOR_TYPES.QRCODE` | `.BARCODE` | `.SCANNER`, from `src/constants/generatorTypes.js`, values `"qrcode"`/`"barcode"`/`"scanner"`) selects which mode renders. `ModeSelector` is always rendered at the top of `<main>` (spans the grid) so the user can switch modes; in scanner mode `App.jsx` renders `ScannerPanel` in place of the content/preview/settings trio. Layout lives in `App.css` grid areas (`content`, `preview`, `settings`): stacked on phones, preview sticky on the left from 960px.

```
src/
  App.jsx / App.css       Root component + global styles / theme variables
  components/
    layout/               Header (theme and language toggles), Footer
    common/               Toast, Segmented (radio-based segmented control)
    generator/            QRCodePreview, BarcodePreview, Controls, ModeSelector,
                          ExportOptions, ColorPickerAdvanced, HistoryPanel, HistoryButton
    scanner/              ScannerPanel (html5-qrcode camera/image reader + NF-e details)
  constants/              generatorTypes.js, barcodeTypes.js
  i18n.js                 LangContext, useT(), translate()
  locales/pt.js           Portuguese text keyed by the English source
  utils/                  barcodeValidators.js, nfeParser.js, contrast.js, qrSvg.js, qrContent.js, pix.js,
                          readQr.js, image.js (+ tests)
```

## UI text (i18n)

The code is in English, including every user-facing string. Write it in English and wrap it in `t()` from `useT()` (`src/i18n.js`): `t("Download {format}", { format })`. In `App.jsx` (which provides `LangContext`) use `translate(lang, text, vars)`. Add the Portuguese to `src/locales/pt.js` as `"English text": "Texto em português"`; a missing entry falls back to English. Utils and constants return English (validator messages, Pix errors, `CONTENT_TYPES`, `BARCODE_CATEGORIES`, NF-e model names; contrast warnings are `{ message, ratio }`), and the component translates them where they are shown. `src/i18n.test.js` scans the code for `t("…")` calls and these util strings and fails when a text has no Portuguese entry, when an entry is no longer used, or when placeholders differ. The language is `localStorage` `"lang"` (`"pt"`/`"en"`), else `navigator.language`; `App.jsx` keeps `<html lang>` in sync. `index.html` (SEO metadata) stays in Portuguese.

## Scanner & NF-e (`components/scanner/ScannerPanel.jsx`, `utils/nfeParser.js`)

`ScannerPanel` uses `html5-qrcode` to read QR + 1D barcodes from the camera (`facingMode: "environment"`) or an uploaded image; a single lazily-created `Html5Qrcode` instance targets `#qr-reader-region`, stops on first read, and is released on unmount. `utils/nfeParser.js` is pure: `parseNFe(text)` extracts a 44-digit NF-e/NFC-e access key (from a raw barcode, `chNFe=` param, or SEFAZ URL), validates the modulo-11 check digit, and decodes UF/emission/CNPJ/model/series/number. `ScannerPanel.onGenerate(targetType, text)` (wired to `App.handleGenerateFromScan`) sends a scanned value back into a generator.

## QR and barcode rendering

These two paths are asymmetric and export logic branches on `isBarcode`:
- **QR** (`QRCodePreview.jsx`) is drawn by `utils/qrSvg.js`: `qrcode-generator` builds the matrix (bytes converted with the same `utf16to8` react-qrcode-logo used, so codes are unchanged) and the function returns an SVG string with the module style, eyes, logo, transparency and the optional "Scan me" / "Escaneie-me" frame. The preview is an `<img>` of that SVG; it throws when the text does not fit, and the preview shows an error.
- **Barcode** (`BarcodePreview.jsx`) uses `react-barcode` (JsBarcode), which renders an inline **`<svg>`**; `getSvg` serialises it.

`utils/qrSvg.js` also exports `logoCoverage(config, text)` (share of data modules under the logo plate vs `EC_CAPACITY` of the level) used by the meter in `Controls`. `utils/readQr.js` reads QR Codes from files with one hidden, serialised `Html5Qrcode` instance: `QRCodePreview` reads its own SVG back (debounced) to show "scan tested / did not scan", and `ContentInput` uses it to import a QR from an image. Uploaded images go through `utils/image.js` (`loadImage`, max 512px logo PNG / 800px photo JPEG) so data URLs stay small enough for the preview and the localStorage history.

`ExportOptions.jsx` is shared by both: it receives `getSvg()` and produces every format from that string (SVG as is; PNG / WEBP / PDF and the clipboard copy by drawing it onto a canvas at `devicePixelRatio`). Transparency is `config.transparentBg` (the SVG simply has no background), so the preview shows it on a checkerboard.

## QR content types & Pix (`utils/qrContent.js`, `utils/pix.js`)

`CONTENT_TYPES` declares each QR type (Link, Text, Pix, WhatsApp, Wi-Fi, Email, Phone, SMS, Contact) as a list of fields; `ContentInput` renders the form from it and `encodeContent(type, fields)` turns the values into `config.text` (`{ text, error }`). `config.contentType` and `config.fields` travel with the config (and the history); entries without a type load as `text`. `pix.js` builds the static BR Code (EMV) with CRC-16/CCITT-FALSE; its test reproduces the Banco Central manual example exactly, so keep it green before touching the payload.

## Barcode formats & validation

- `src/constants/barcodeTypes.js` is the single source of truth for the format list: `BARCODE_FORMATS` (keys → JsBarcode format strings), `BARCODE_CATEGORIES` (UI grouping), `BARCODE_EXAMPLES`, `BARCODE_DEFAULTS`. Some UI-distinct formats map to the same JsBarcode string (e.g. both `UPCA` and `UPCE` → `"UPC"`; `ISBN` → `"EAN13"`); the difference is enforced by validation, not by the underlying library.
- `src/utils/barcodeValidators.js` holds per-format rules. `validateBarcodeValue(format, value)` returns `{ valid, message?, suggestion?, normalized? }`. `BarcodePreview` runs this in a `useEffect` before rendering and shows an error card (with a "use example" button) when invalid. A `normalized` value (e.g. UPC-E padded with system/check digits via `calculateUPCCheckDigit`) is what actually gets passed to `<Barcode>`.
- To add a barcode format: add it to `BARCODE_FORMATS`, a category in `BARCODE_CATEGORIES`, an entry in `BARCODE_EXAMPLES`, and a validator wired into `BARCODE_VALIDATORS` (keyed by every alias/format string that can reach it).

## Cross-component channels (bypass props — be careful when refactoring)

- **History**: `HistoryPanel.jsx` assigns `window.addToHistory` / `window.openHistoryPanel` / `window.getHistoryCount` on mount and deletes them on unmount. `App.jsx` calls `addToHistory` via a debounced `useEffect` (2s after `config.text` stops changing); `HistoryButton.jsx` polls `getHistoryCount` on an interval.
- **Barcode reset**: `BarcodePreview.jsx` fires a `resetBarcodeText` `CustomEvent` on `window`; `App.jsx` listens and writes the example value back into `config.text`.

## Styling & theming

Plain CSS co-located per component; tokens and shared primitives (`.panel`, `.btn*`, `.input`, `.select`, `.check`, `.alert`) live in `App.css`. Theme is a `dark` class on `<html>` (set before paint by an inline script in `index.html`, then kept in sync and saved by `App.jsx`), driving CSS custom properties in `App.css` (`:root` for light, `.dark` for dark). `App.css` still defines the older alias names (`--text-primary`, `--text-secondary`, `--bg-secondary`, …) mapped to the base tokens (`--text-main`, `--text-muted`, `--bg-sunken`); new code should use the base names.

## Design (impeccable)

The UI was redesigned with [impeccable](https://github.com/pbakaus/impeccable) (installed under `.claude/`, with its design hook in `.claude/settings.json`). Read `PRODUCT.md` (who it is for, constraints) and `DESIGN.md` (tokens, components) before UI work; the direction contract is in `.impeccable/surfaces/src-app-jsx.md`. The chosen direction is the category standard: familiar, one blue for actions, no gradients, emoji or decorative motion. `.impeccable/config.json` waives the `overused-font` finding for Inter on purpose.
