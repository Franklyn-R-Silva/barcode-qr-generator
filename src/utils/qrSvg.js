import qrcode from "qrcode-generator";

// Same defaults as react-qrcode-logo, which this replaces, so exports keep their size.
export const QUIET_ZONE = 10;

// react-qrcode-logo's own UTF-16 → byte-string conversion, kept verbatim so a given
// text produces the same matrix it always did (it differs from UTF-8 for emoji).
export const utf16to8 = (str) => {
  let out = "";
  for (let i = 0; i < str.length; i++) {
    const c = str.charCodeAt(i);
    if (c >= 0x0001 && c <= 0x007f) {
      out += str.charAt(i);
    } else if (c > 0x07ff) {
      out += String.fromCharCode(0xe0 | ((c >> 12) & 0x0f));
      out += String.fromCharCode(0x80 | ((c >> 6) & 0x3f));
      out += String.fromCharCode(0x80 | (c & 0x3f));
    } else {
      out += String.fromCharCode(0xc0 | ((c >> 6) & 0x1f));
      out += String.fromCharCode(0x80 | (c & 0x3f));
    }
  }
  return out;
};

/** Logo width in px for the QR size and the chosen size mode. */
export const logoSize = ({ size, logoSizeMode, logoSize: pct }) =>
  logoSizeMode === "original" ? size * 0.4 : (size * (pct || 25)) / 100;

const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

const n3 = (v) => +v.toFixed(3);

const roundedRect = (x, y, w, h, r) =>
  `M${x + r} ${y}h${w - 2 * r}a${r} ${r} 0 0 1 ${r} ${r}v${h - 2 * r}a${r} ${r} 0 0 1 ${-r} ${r}` +
  `h${-(w - 2 * r)}a${r} ${r} 0 0 1 ${-r} ${-r}v${-(h - 2 * r)}a${r} ${r} 0 0 1 ${r} ${-r}z`;

/**
 * Renders the QR Code as an SVG string. The on-screen preview and every
 * export (SVG, PNG, WEBP, PDF, clipboard) come from this one drawing.
 * Throws when the text does not fit in a QR Code.
 */
export const qrSvg = (config, text) => {
  const { size, fgColor: fg, bgColor: bg, ecLevel, qrStyle, eyeStyle, transparentBg } = config;
  const qr = qrcode(0, ecLevel || "M");
  qr.addData(utf16to8(text));
  qr.make();
  const n = qr.getModuleCount();
  const cs = size / n; // px per module
  const box = size + 2 * QUIET_ZONE;

  const logoW = config.logoImage ? logoSize(config) : 0;
  const clearR = config.removeQrCodeBehindLogo ? logoW / 2 / cs : 0; // in modules
  const mid = n / 2;
  const inEye = (r, c) => (r <= 7 && c <= 7) || (r <= 7 && c >= n - 7) || (r >= n - 7 && c <= 7);

  let d = "";
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      if (!qr.isDark(r, c) || inEye(r, c)) continue;
      if (clearR && Math.hypot(c + 0.5 - mid, r + 0.5 - mid) <= clearR) continue;
      d += qrStyle === "dots"
        ? `M${c + 0.875} ${r + 0.5}a.375 .375 0 1 0 -.75 0a.375 .375 0 1 0 .75 0z`
        : `M${c} ${r}h1v1h-1z`;
    }
  }

  // Finder patterns, drawn the way react-qrcode-logo drew them (radius in px).
  const lw = Math.ceil(cs) / cs;
  const R = eyeStyle === "circle" ? 10 / cs : 0;
  const ro = n3(Math.min(R, (7 - lw) / 2));
  const ri = Math.min(R, (3 - lw) / 2);
  const rin = n3(ri > 0 ? ri + lw / 2 : 0);
  const eyes = [[0, 0], [0, n - 7], [n - 7, 0]]
    .map(
      ([r, c]) =>
        `<rect x="${n3(c + lw / 2)}" y="${n3(r + lw / 2)}" width="${n3(7 - lw)}" height="${n3(7 - lw)}" rx="${ro}" fill="none" stroke="${fg}" stroke-width="${n3(lw)}"/>` +
        `<rect x="${c + 2}" y="${r + 2}" width="3" height="3" rx="${rin}" fill="${fg}"/>`
    )
    .join("");

  let code =
    `<g transform="translate(${QUIET_ZONE} ${QUIET_ZONE}) scale(${n3(cs)})">` +
    `<path d="${d}" fill="${fg}"${qrStyle === "dots" ? "" : ' shape-rendering="crispEdges"'}/>${eyes}</g>`;
  if (logoW) {
    const at = n3(QUIET_ZONE + (size - logoW) / 2);
    code += `<image href="${esc(config.logoImage)}" x="${at}" y="${at}" width="${n3(logoW)}" height="${n3(logoW)}" opacity="${config.logoOpacity ?? 1}" preserveAspectRatio="xMidYMid meet"/>`;
  }

  const label = config.frame ? String(config.frameText || "").trim().slice(0, 24) : "";
  if (!config.frame) {
    const ground = transparentBg ? "" : `<rect width="${box}" height="${box}" fill="${bg}"/>`;
    return {
      svg: `<svg xmlns="http://www.w3.org/2000/svg" width="${box}" height="${box}" viewBox="0 0 ${box} ${box}">${ground}${code}</svg>`,
      width: box,
      height: box,
    };
  }

  // Frame: a border in the code colour with a label band underneath.
  const b = Math.max(3, Math.round(box * 0.035));
  const band = Math.round(box * 0.2);
  const W = box + 2 * b;
  const H = box + 2 * b + band;
  const ground = transparentBg ? "" : `<rect x="${b}" y="${b}" width="${box}" height="${box}" fill="${bg}"/>`;
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">` +
    `<path d="${roundedRect(0, 0, W, H, 2 * b)}M${b} ${b}h${box}v${box}h${-box}z" fill="${fg}" fill-rule="evenodd"/>` +
    ground +
    `<g transform="translate(${b} ${b})">${code}</g>` +
    `<text x="${W / 2}" y="${n3(b + box + band / 2)}" fill="${bg}" font-family="Inter, Arial, Helvetica, sans-serif" font-size="${n3(band * 0.42)}" font-weight="700" text-anchor="middle" dominant-baseline="central">${esc(label)}</text>` +
    `</svg>`;
  return { svg, width: W, height: H };
};

export const svgDataUrl = (svg) => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
