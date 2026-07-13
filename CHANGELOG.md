# Changelog

All notable changes to this project are documented here. The format is based on
[Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [Unreleased]

### Added

- `CONTRIBUTING.md` with development setup, branch/commit conventions, and code
  style guidelines.

### Fixed

- Restored missing theme variables (`--text-primary`, `--text-secondary`,
  `--bg-primary`, `--bg-secondary`, `--border-color`, `--shadow-md`) that broke
  text, backgrounds, borders, and shadows in the color picker, barcode error
  hints, and the logo info box.
- Transparent-background export for QR codes produced a blank image because the
  canvas pixels were read before the code was drawn.
- The notification toast never auto-dismissed while typing, because its close
  handler was recreated on every render and reset the timer.
- Generation history recorded near-duplicate entries when only colors/size were
  tweaked; it now saves once per distinct text value.
- Selecting the "Selecione…" placeholder in a barcode category no longer clears
  the format and renders a broken barcode.

### Removed

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
