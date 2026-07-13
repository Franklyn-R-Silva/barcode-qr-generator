# 🎯 QR Code & Barcode Generator Pro

[![Wakatime](https://wakatime.com/badge/user/268de5b9-4dbd-4873-9ede-a165e5745754/project/9ef7b6c4-80ab-4866-be52-b446eedd73d3.svg)](https://wakatime.com/badge/user/268de5b9-4dbd-4873-9ede-a165e5745754/project/9ef7b6c4-80ab-4866-be52-b446eedd73d3)

A modern React web app for generating **QR Codes** and **barcodes** (25+ formats) entirely in the browser — with live preview, light/dark themes, logo embedding, multi-format export, and a local generation history. No backend, no sign-up.

> The interface is in Brazilian Portuguese (pt-BR); the target audience is Brazilian users.

**🌐 Live demo:** [barcode-qr-generator.netlify.app](https://barcode-qr-generator.netlify.app/)

![Preview](foto.png)

---

## ✨ Features

### QR Codes

- Full color customization (foreground and background)
- Module styles (squares or dots) and eye styles (square or rounded)
- Logo upload with adjustable size, opacity, and background removal
- 4 error-correction levels (L, M, Q, H)
- Ready-made templates (Default, WhatsApp, Dark, Blue Tech)

### Barcodes (25+ formats)

| Family    | Formats                                          |
| --------- | ------------------------------------------------ |
| Code      | Code 39 · Code 93 · Code 128 (Auto, A, B, C)      |
| GS1 & ITF | GS1-128 · ITF · ITF-14                             |
| EAN/ISBN  | EAN-13 · EAN-8 · EAN-5 · EAN-2 · ISBN             |
| UPC       | UPC-A · UPC-E                                      |
| Other     | MSI (10, 11, 1010, 1110) · Pharmacode · Codabar   |

Each format has per-format input validation with example values and inline error hints.

### General

- Export to **PNG**, **WEBP**, **PDF**, and **SVG** (SVG for barcodes only), with an optional transparent-background option
- Copy the generated image to the clipboard
- Light/dark theme
- Local generation history (stored in `localStorage`)
- Social sharing (WhatsApp, Facebook)
- Responsive design

---

## 🚀 Getting Started

Requires **Node.js 18.x**.

```bash
git clone https://github.com/Franklyn-R-Silva/barcode-qr-generator.git
cd barcode-qr-generator
npm install
npm start
```

The app runs at `http://localhost:3000`.

### Scripts

```bash
npm start          # Start the dev server
npm run build      # Production build to build/
npm test           # Run tests (Jest + React Testing Library)
```

---

## 🏗️ Architecture

Create React App (React 18). All logic runs client-side. A single `config` state object in `App.jsx` drives both generators and is passed down to the preview and control components.

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

See [ARCHITECTURE.md](./ARCHITECTURE.md) for details.

---

## 💻 Tech Stack

- **React 18** (Create React App)
- **react-qrcode-logo** — QR rendering (to `<canvas>`)
- **react-barcode** / **JsBarcode** — barcode rendering (to `<svg>`)
- **framer-motion** — animations
- **react-colorful** — color picker
- **jsPDF** — PDF export
- **react-icons** — icons

---

## 🤝 Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](./CONTRIBUTING.md) for
the development setup, branch/commit conventions, and code style. In short:

1. Fork the project and branch from `main` (`git checkout -b feat/my-feature`)
2. Make a focused change and verify `npm run build` succeeds
3. Commit using [Conventional Commits](https://www.conventionalcommits.org/)
4. Push and open a Pull Request against `main`

---

## 📄 License

MIT.

## 👨‍💻 Author

**Franklyn Silva** — [GitHub](https://github.com/Franklyn-R-Silva) · [LinkedIn](https://www.linkedin.com/in/franklyn-roberto-dev/)
