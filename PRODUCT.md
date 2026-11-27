# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

The general Brazilian public: anyone who needs a QR Code or a barcode right now, on a phone or a computer, without installing anything or creating an account. Typical jobs: turn a link, Wi-Fi text, WhatsApp number or Pix-style text into a QR Code to print or share; produce a barcode (EAN for a product label, ITF for a boleto, Code-128C for a DANFE key) from a number they already have; point the camera at a code and find out what it says. Some of them are reading an NF-e / NFC-e and want the access key decoded. Most visits are short and task-shaped: arrive, make or read one code, export or copy, leave.

## Product Purpose

QR & Barcode Studio generates, customizes and scans QR Codes and 1D barcodes entirely in the browser. Success is a correct, scannable code exported in the format the person needs (PNG, WEBP, PDF, SVG for barcodes, or the clipboard) in under a minute, or a scanned code turned into readable, actionable content.

## Positioning

Fully client-side and free: nothing is uploaded, there is no sign-up, no watermark. It speaks Brazilian formats natively: it decodes NF-e / NFC-e (and CT-e / MDF-e) access keys into issuing state, month, CNPJ, model, series and number with the modulo-11 check, and generates Boleto (ITF) and NF-e/DANFE (Code-128C) barcodes. A scanned value can be sent straight back into either generator.

## Operating Context

- Phone in hand at a counter, a shelf or a desk, often with the rear camera pointed at a printed code; or a desktop browser preparing a code to print on a label, flyer or menu.
- Camera scanning needs HTTPS or localhost plus camera permission; image upload works everywhere.
- Codes leave the app as files that get printed or pasted elsewhere, so the exported image must scan reliably (contrast, quiet zone, error-correction level).

## Capabilities and Constraints

- Three modes: QR Code generator, barcode generator, scanner (camera or image).
- QR: foreground/background colors, module style (squares or dots), eye style (square or rounded), logo upload with size, opacity and background removal, error-correction L/M/Q/H, ready-made templates.
- Barcodes: 25+ formats (Code 39/93/128 A-B-C, GS1-128, ITF, ITF-14, EAN-13/8/5/2, ISBN, UPC-A/E, MSI variants, Pharmacode, Codabar, Boleto, NF-e/DANFE) with per-format validation, example values and inline error hints.
- Export PNG, WEBP, PDF, SVG (barcodes only), optional transparent background; copy image or text; share via WhatsApp and Facebook.
- Local history in `localStorage`; light and dark themes; installable PWA.
- Stack: React 18 (Create React App), plain co-located CSS, deployed as Cloudflare Workers static assets at qrcode.devfrs.com. UI is pt-BR by default with an English option (src/locales/pt.js); code and docs are English.
- No backend, no analytics claims, no accounts. Do not add features that need a server.

## Brand Commitments

- Name: "QR & Barcode Studio" (short name "QR Studio"), domain qrcode.devfrs.com, author credit Franklyn Silva with GitHub and LinkedIn links.
- Voice: plain, direct pt-BR (and plain English in the English UI); controls name their action.
- Visual direction (chosen 2026-11-27): the category standard, executed at full craft. It should sit comfortably alongside QRCode Monkey and QR Code Generator (qr-code-generator.com); familiarity is the point, not a compromise.

## Evidence on Hand

- No testimonials, usage numbers or press. Do not invent any.
- `foto.png` is a screenshot of the previous UI (README preview); `public/logo192.png`, `logo512.png`, `favicon.ico` are the current app icons.

## Product Principles

1. The code is the product: it must scan. Never trade scan reliability for decoration.
2. One task per visit, no friction: no sign-up, no upload, nothing between the person and the code.
3. Brazilian by default: formats, documents and language Brazilians actually use.
4. Private by construction: everything happens on the device.

## Accessibility & Inclusion

Used by the general public on cheap phones and in bright places: WCAG AA contrast, touch targets of at least 44px, full keyboard operation, and camera features that degrade to image upload.
