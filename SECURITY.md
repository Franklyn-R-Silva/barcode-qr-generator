# Security Policy

## Supported Versions

QR & Barcode Studio is a web app with a single live version at
[qrcode.devfrs.com](https://qrcode.devfrs.com), built from the `main` branch.
Fixes ship there; there are no older releases to patch.

## Reporting a Vulnerability

Everything runs in the visitor's browser: there is no backend, no account and
no upload. Issues worth reporting include, for example, script injection through
a scanned code or a history entry, a crafted image or text that makes the app
load or send data somewhere else, or a dependency flaw that is reachable from
the page.

**Preferred:** use GitHub's
[private vulnerability reporting](https://github.com/Franklyn-R-Silva/barcode-qr-generator/security/advisories/new)
("Report a vulnerability" under the Security tab).

**Alternative:** email the maintainer at franklyn.dev.mobile@gmail.com with:

- A description of the vulnerability and its impact
- Steps to reproduce (a sample code, image or URL is ideal)
- The browser and device where you saw it

Please do not open a public issue for a vulnerability.

## Response Expectations

- **Acknowledgement:** within 5 business days
- **Assessment & fix timeline:** communicated after triage
- **Disclosure:** coordinated; please allow a reasonable window for a fix to
  reach the live site before any public disclosure

Thank you for helping keep the app safe.
