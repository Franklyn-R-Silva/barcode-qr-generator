<div align="center">

# QR Code & Barcode Generator Pro

A modern, fully client-side React app for generating **QR Codes** and **barcodes** (25+ formats) — with live preview, light/dark themes, logo embedding, multi-format export, and a local generation history. No backend, no sign-up.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](#license)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Netlify Status](https://img.shields.io/badge/deploy-Netlify-00C7B7?logo=netlify&logoColor=white)](https://barcode-qr-generator.netlify.app/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](./CONTRIBUTING.md)
[![Wakatime](https://wakatime.com/badge/user/268de5b9-4dbd-4873-9ede-a165e5745754/project/9ef7b6c4-80ab-4866-be52-b446eedd73d3.svg)](https://wakatime.com/badge/user/268de5b9-4dbd-4873-9ede-a165e5745754/project/9ef7b6c4-80ab-4866-be52-b446eedd73d3)

**[🌐 Live Demo](https://barcode-qr-generator.netlify.app/)**

![Preview](foto.png)

</div>

> **Note:** The interface is in Brazilian Portuguese (pt-BR); the target audience is Brazilian users. The codebase and documentation are in English.

## Table of Contents

- [Features](#features)
- [Getting Started](#getting-started)
- [Available Scripts](#available-scripts)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Contributing](#contributing)
- [License](#license)

## Features

### QR Codes

- Full color customization (foreground and background)
- Module styles (squares or dots) and eye styles (square or rounded)
- Logo upload with adjustable size, opacity, and background removal
- Four error-correction levels (L, M, Q, H)
- Ready-made templates (Default, WhatsApp, Dark, Blue Tech)

### Barcodes (25+ formats)

| Family    | Formats                                          |
| --------- | ------------------------------------------------ |
| Code      | Code 39 · Code 93 · Code 128 (Auto, A, B, C)     |
| GS1 & ITF | GS1-128 · ITF · ITF-14                           |
| EAN/ISBN  | EAN-13 · EAN-8 · EAN-5 · EAN-2 · ISBN            |
| UPC       | UPC-A · UPC-E _(auto-expanded to UPC-A)_         |
| Other     | MSI (10, 11, 1010, 1110) · Pharmacode · Codabar  |

Every format has dedicated input validation with example values and inline error hints.

### General

- Export to **PNG**, **WEBP**, **PDF**, and **SVG** (SVG for barcodes), with an optional transparent background
- Copy the generated image straight to the clipboard
- Light / dark theme
- Local generation history (stored in `localStorage`)
- Social sharing (WhatsApp, Facebook)
- Responsive, mobile-first layout

## Getting Started

**Prerequisites:** [Node.js 18.x](https://nodejs.org/)

```bash
git clone https://github.com/Franklyn-R-Silva/barcode-qr-generator.git
cd barcode-qr-generator
npm install
npm start
```

The app will be available at [http://localhost:3000](http://localhost:3000).

## Available Scripts

| Command         | Description                          |
| --------------- | ------------------------------------ |
| `npm start`     | Start the development server         |
| `npm run build` | Create an optimized production build |
| `npm test`      | Run the test suite (Jest + RTL)      |

## Architecture

Create React App (React 18), running entirely in the browser. A single `config`
state object in `App.jsx` drives both generators and flows down to the preview
and control components.

```
src/
├── components/
│   ├── layout/      # Header, Footer
│   ├── common/      # Toast
│   └── generator/   # QRCodePreview, BarcodePreview, Controls,
│                    # ExportOptions, ColorPickerAdvanced, History*
├── constants/       # Generator types & barcode format definitions
└── utils/           # Barcode validators
```

QR codes render to a `<canvas>` (via `react-qrcode-logo`) and barcodes to an
`<svg>` (via `react-barcode`/JsBarcode); export logic adapts to each. See
[ARCHITECTURE.md](./ARCHITECTURE.md) for the full picture.

## Tech Stack

- **React 18** (Create React App)
- **react-qrcode-logo** — QR rendering
- **react-barcode** / **JsBarcode** — barcode rendering
- **framer-motion** — animations
- **react-colorful** — color picker
- **jsPDF** — PDF export
- **react-icons** — icons

## Contributing

Contributions are welcome! Please read **[CONTRIBUTING.md](./CONTRIBUTING.md)**
for the development setup, branch/commit conventions, and code style. In short:
fork → branch from `main` → make a focused change → verify `npm run build` →
open a PR using [Conventional Commits](https://www.conventionalcommits.org/).

## License

Released under the [MIT License](https://opensource.org/licenses/MIT).

## Author

**Franklyn Silva** — [GitHub](https://github.com/Franklyn-R-Silva) · [LinkedIn](https://www.linkedin.com/in/franklyn-roberto-dev/)
