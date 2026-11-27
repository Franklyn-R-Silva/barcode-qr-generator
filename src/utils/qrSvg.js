import qrcode from "qrcode-generator";

// Default margin (quiet zone) in px; react-qrcode-logo, which this replaced, used 10.
export const QUIET_ZONE = 10;

// How much of the code each error-correction level can lose and still read.
export const EC_CAPACITY = { L: 0.07, M: 0.15, Q: 0.25, H: 0.3 };

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

/** Logo width in px: a percentage of the QR size. */
export const logoSize = ({ size, logoSize: pct }) => (size * (pct || 25)) / 100;

const esc = (s) =>
  String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

const n3 = (v) => +v.toFixed(3);

const roundedRect = (x, y, w, h, r) =>
  `M${x + r} ${y}h${w - 2 * r}a${r} ${r} 0 0 1 ${r} ${r}v${h - 2 * r}a${r} ${r} 0 0 1 ${-r} ${r}` +
  `h${-(w - 2 * r)}a${r} ${r} 0 0 1 ${-r} ${-r}v${-(h - 2 * r)}a${r} ${r} 0 0 1 ${r} ${-r}z`;

const matrix = (text, ecLevel) => {
  const qr = qrcode(0, ecLevel || "M");
  qr.addData(utf16to8(text));
  qr.make();
  return qr;
};

const isEye = (n) => (r, c) => (r <= 7 && c <= 7) || (r <= 7 && c >= n - 7) || (r >= n - 7 && c <= 7);

/**
 * The area the logo takes (logo + its border), as a point-in-shape test in
 * module coordinates. Null when there is no logo.
 */
const logoPlate = (config, n) => {
  if (!config.logoImage) return null;
  const cs = config.size / n;
  const side = (logoSize(config) + 2 * (config.logoPad || 0)) / cs;
  const h = side / 2;
  const rr = Math.min(((config.logoRadius || 0) / 100) * side, h);
  const mid = n / 2;
  return {
    side,
    contains: (x, y) => {
      const dx = Math.abs(x - mid);
      const dy = Math.abs(y - mid);
      if (dx > h || dy > h) return false;
      if (dx <= h - rr || dy <= h - rr) return true;
      return Math.hypot(dx - (h - rr), dy - (h - rr)) <= rr;
    },
  };
};

/**
 * Share of the data modules hidden under the logo (0–1) and the most the
 * chosen error correction can lose. Throws when the text does not fit.
 */
export const logoCoverage = (config, text) => {
  const qr = matrix(text, config.ecLevel);
  const n = qr.getModuleCount();
  const plate = logoPlate(config, n);
  const capacity = EC_CAPACITY[config.ecLevel] ?? EC_CAPACITY.M;
  if (!plate) return { coverage: 0, capacity };
  const eye = isEye(n);
  let covered = 0;
  let total = 0;
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      if (eye(r, c)) continue;
      total++;
      if (plate.contains(c + 0.5, r + 0.5)) covered++;
    }
  }
  return { coverage: covered / total, capacity };
};

/**
 * Renders the QR Code as an SVG string. The on-screen preview and every
 * export (SVG, PNG, WEBP, PDF, clipboard) come from this one drawing.
 * Throws when the text does not fit in a QR Code.
 */
export const qrSvg = (config, text) => {
  const { size, fgColor: fg, bgColor: bg, qrStyle, eyeStyle, transparentBg } = config;
  const margin = config.margin ?? QUIET_ZONE;
  const qr = matrix(text, config.ecLevel);
  const n = qr.getModuleCount();
  const cs = size / n; // px per module
  const box = size + 2 * margin;
  const eye = isEye(n);
  const plate = logoPlate(config, n);
  const clear = plate && config.removeQrCodeBehindLogo;

  const ink = config.gradientOn ? "url(#g)" : fg;
  const eyeInk = config.eyeColorOn ? config.eyeColor : ink;
  const defs = config.gradientOn
    ? `<defs><linearGradient id="g" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="${n}" y2="${n}"><stop offset="0" stop-color="${fg}"/><stop offset="1" stop-color="${config.fgColor2 || fg}"/></linearGradient></defs>`
    : "";

  // Data modules. `moduleScale` shrinks them so a background image shows through.
  const k = Math.min(1, Math.max(0.4, config.moduleScale ?? 1));
  const inset = (1 - k) / 2;
  let d = "";
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      if (!qr.isDark(r, c) || eye(r, c)) continue;
      if (clear && plate.contains(c + 0.5, r + 0.5)) continue;
      if (qrStyle === "dots") {
        const rad = n3(0.375 * k);
        d += `M${n3(c + 0.5 + rad)} ${r + 0.5}a${rad} ${rad} 0 1 0 ${-2 * rad} 0a${rad} ${rad} 0 1 0 ${2 * rad} 0z`;
      } else if (qrStyle === "rounded") {
        const rad = n3(0.3 * k);
        d += roundedRect(n3(c + inset), n3(r + inset), n3(k), n3(k), rad);
      } else {
        d += k === 1 ? `M${c} ${r}h1v1h-1z` : `M${n3(c + inset)} ${n3(r + inset)}h${n3(k)}v${n3(k)}h${-n3(k)}z`;
      }
    }
  }

  // Finder patterns. "square" and "circle" (rounded corners, 10px) match what
  // react-qrcode-logo drew; "dot" draws true circles.
  const lw = Math.ceil(cs) / cs;
  const eyes = [[0, 0], [0, n - 7], [n - 7, 0]]
    .map(([r, c]) => {
      if (eyeStyle === "dot") {
        return (
          `<circle cx="${c + 3.5}" cy="${r + 3.5}" r="${n3(3.5 - lw / 2)}" fill="none" stroke="${eyeInk}" stroke-width="${n3(lw)}"/>` +
          `<circle cx="${c + 3.5}" cy="${r + 3.5}" r="1.5" fill="${eyeInk}"/>`
        );
      }
      const R = eyeStyle === "circle" ? 10 / cs : 0;
      const ro = n3(Math.min(R, (7 - lw) / 2));
      const ri = Math.min(R, (3 - lw) / 2);
      return (
        `<rect x="${n3(c + lw / 2)}" y="${n3(r + lw / 2)}" width="${n3(7 - lw)}" height="${n3(7 - lw)}" rx="${ro}" fill="none" stroke="${eyeInk}" stroke-width="${n3(lw)}"/>` +
        `<rect x="${c + 2}" y="${r + 2}" width="3" height="3" rx="${n3(ri > 0 ? ri + lw / 2 : 0)}" fill="${eyeInk}"/>`
      );
    })
    .join("");

  // Ground: colour, then an optional photo lightened by a veil of the background colour.
  let ground = transparentBg ? "" : `<rect width="${box}" height="${box}" fill="${bg}"/>`;
  if (config.bgImage) {
    ground +=
      `<image href="${esc(config.bgImage)}" width="${box}" height="${box}" preserveAspectRatio="xMidYMid slice"/>` +
      `<rect width="${box}" height="${box}" fill="${bg}" opacity="${config.bgImageLighten ?? 0.5}"/>`;
  }

  let code =
    ground +
    `<g transform="translate(${margin} ${margin}) scale(${n3(cs)})">` +
    `<path d="${d}" fill="${ink}"${qrStyle === "squares" || !qrStyle ? ' shape-rendering="crispEdges"' : ""}/>${eyes}</g>`;

  if (plate) {
    const logoW = logoSize(config);
    const sidePx = plate.side * cs;
    const at = margin + (size - sidePx) / 2;
    const rPlate = n3(Math.min(((config.logoRadius || 0) / 100) * sidePx, sidePx / 2));
    if ((config.logoPad || config.removeQrCodeBehindLogo) && !transparentBg) {
      code += `<rect x="${n3(at)}" y="${n3(at)}" width="${n3(sidePx)}" height="${n3(sidePx)}" rx="${rPlate}" fill="${bg}"/>`;
    }
    const lx = n3(margin + (size - logoW) / 2);
    const rLogo = n3(Math.min(((config.logoRadius || 0) / 100) * logoW, logoW / 2));
    code +=
      `<clipPath id="lc"><rect x="${lx}" y="${lx}" width="${n3(logoW)}" height="${n3(logoW)}" rx="${rLogo}"/></clipPath>` +
      `<image href="${esc(config.logoImage)}" x="${lx}" y="${lx}" width="${n3(logoW)}" height="${n3(logoW)}" opacity="${config.logoOpacity ?? 1}" preserveAspectRatio="xMidYMid slice" clip-path="url(#lc)"/>`;
  }

  if (!config.frame) {
    return {
      svg: `<svg xmlns="http://www.w3.org/2000/svg" width="${box}" height="${box}" viewBox="0 0 ${box} ${box}">${defs}${code}</svg>`,
      width: box,
      height: box,
    };
  }
  return frameSvg(code, defs, box, config);
};

const FONT = 'font-family="Inter, Arial, Helvetica, sans-serif" font-weight="700"';
// shortcut: width estimated as 0.6em per character (bold sans); textLength corrects any overshoot.
const textWidth = (s, fs) => s.length * fs * 0.6;
const fit = (s, fs, max) => (textWidth(s, fs) > max ? ` textLength="${n3(max)}" lengthAdjust="spacingAndGlyphs"` : "");

// Splits at the space that best balances two lines; null when there is none.
const splitLines = (label) => {
  let best = null;
  for (let i = label.indexOf(" "); i > 0; i = label.indexOf(" ", i + 1)) {
    const lines = [label.slice(0, i).trim(), label.slice(i + 1).trim()];
    if (!best || Math.max(...lines.map((l) => l.length)) < Math.max(...best.map((l) => l.length))) best = lines;
  }
  return best;
};

// Repeats the label with separators so it runs all the way round a closed path.
const around = (label, fs, length) => {
  const unit = `${label} • `;
  return unit.repeat(Math.max(1, Math.round(length / textWidth(unit, fs))));
};

const circlePath = (cx, cy, r) =>
  `M${n3(cx)} ${n3(cy - r)}a${n3(r)} ${n3(r)} 0 1 1 0 ${n3(2 * r)}a${n3(r)} ${n3(r)} 0 1 1 0 ${n3(-2 * r)}z`;

/**
 * Frames around the code, all drawn in the code colour with the label in the
 * background colour: "band" (label underneath), "arc" (U shape, label on the
 * curve), "circle" and "square" (label running all the way round).
 */
const frameSvg = (code, defs, box, config) => {
  const { fgColor: fg, bgColor: bg, transparentBg } = config;
  const label = esc(String(config.frameText || "").trim().slice(0, 60));
  const style = config.frameStyle || "band";
  const wrap = (W, H, body) => ({
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="${n3(W)}" height="${n3(H)}" viewBox="0 0 ${n3(W)} ${n3(H)}">${defs}${body}</svg>`,
    width: Math.round(W),
    height: Math.round(H),
  });
  const onPath = (fs, text, length) =>
    `<text fill="${bg}" ${FONT} font-size="${n3(fs)}" dominant-baseline="central">` +
    `<textPath href="#fp" startOffset="50%" text-anchor="middle"${fit(text, fs, length)}>${text}</textPath></text>`;

  if (style === "circle") {
    const t = Math.round(box * 0.16); // ring thickness
    const rIn = box * Math.SQRT1_2 + Math.round(box * 0.02);
    const rOut = rIn + t;
    const c = rOut;
    const rMid = rIn + t / 2;
    const fs = t * 0.5;
    const length = 2 * Math.PI * rMid;
    return wrap(
      2 * rOut,
      2 * rOut,
      `<path d="${circlePath(c, c, rOut)}${circlePath(c, c, rIn)}" fill="${fg}" fill-rule="evenodd"/>` +
        (transparentBg ? "" : `<circle cx="${n3(c)}" cy="${n3(c)}" r="${n3(rIn)}" fill="${bg}"/>`) +
        `<g transform="translate(${n3(c - box / 2)} ${n3(c - box / 2)})">${code}</g>` +
        `<path id="fp" d="${circlePath(c, c, rMid)}" fill="none"/>` +
        onPath(fs, around(label, fs, length), length * 0.98)
    );
  }

  if (style === "square") {
    const t = Math.round(box * 0.13);
    const g = Math.round(box * 0.015);
    const S = box + 2 * (t + g);
    const inner = box + 2 * g;
    const fs = t * 0.5;
    const r = t / 2;
    const side = S - t;
    const length = 4 * side - 8 * r + 2 * Math.PI * r;
    return wrap(
      S,
      S,
      `<path d="${roundedRect(0, 0, S, S, t)}M${t} ${t}h${inner}v${inner}h${-inner}z" fill="${fg}" fill-rule="evenodd"/>` +
        (transparentBg ? "" : `<rect x="${t}" y="${t}" width="${inner}" height="${inner}" fill="${bg}"/>`) +
        `<g transform="translate(${t + g} ${t + g})">${code}</g>` +
        `<path id="fp" d="${roundedRect(t / 2, t / 2, side, side, r)}" fill="none"/>` +
        onPath(fs, around(label, fs, length), length * 0.98)
    );
  }

  const b = Math.max(3, Math.round(box * 0.035));
  const W = box + 2 * b;
  const hole = `M${b} ${b}h${box}v${box}h${-box}z`;

  if (style === "arc") {
    const band = Math.round(box * 0.18);
    const e = band * 1.8; // depth of the U below the code
    const y0 = b + box;
    const r = 2 * b;
    const rx = W / 2 - band * 0.55;
    const ry = e - band * 0.55;
    const fs = band * 0.5;
    const length = (Math.PI * (3 * (rx + ry) - Math.sqrt((3 * rx + ry) * (rx + 3 * ry)))) / 2;
    return wrap(
      W,
      y0 + e,
      `<path d="M0 ${r}a${r} ${r} 0 0 1 ${r} ${-r}h${W - 2 * r}a${r} ${r} 0 0 1 ${r} ${r}V${y0}A${n3(W / 2)} ${n3(e)} 0 0 1 0 ${y0}z${hole}" fill="${fg}" fill-rule="evenodd"/>` +
        `<g transform="translate(${b} ${b})">${code}</g>` +
        `<path id="fp" d="M${n3(W / 2 - rx)} ${y0}A${n3(rx)} ${n3(ry)} 0 0 0 ${n3(W / 2 + rx)} ${y0}" fill="none"/>` +
        // Only the bottom 60% of the curve is clear of the code's corners.
        onPath(fs, label, length * 0.6)
    );
  }

  // "band": a label strip under the code; long labels wrap to two lines, then shrink.
  const band = Math.round(box * 0.2);
  const avail = W - 4 * b;
  let fs = band * 0.42;
  let lines = [label];
  if (textWidth(label, fs) > avail) {
    const two = splitLines(label);
    if (two) {
      lines = two;
      fs = band * 0.32;
    }
  }
  const mid = b + box + band / 2;
  const text = lines
    .map((line, i) => {
      const y = lines.length === 1 ? mid : mid + (i === 0 ? -0.58 : 0.58) * fs;
      return `<text x="${W / 2}" y="${n3(y)}" fill="${bg}" ${FONT} font-size="${n3(fs)}" text-anchor="middle" dominant-baseline="central"${fit(line, fs, avail)}>${line}</text>`;
    })
    .join("");
  return wrap(
    W,
    box + 2 * b + band,
    `<path d="${roundedRect(0, 0, W, box + 2 * b + band, 2 * b)}${hole}" fill="${fg}" fill-rule="evenodd"/>` +
      `<g transform="translate(${b} ${b})">${code}</g>${text}`
  );
};

export const svgDataUrl = (svg) => `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;

/** Draws an SVG string onto a canvas (scale 1 = the SVG's own pixel size). */
export const svgToCanvas = async (svg, scale = 1) => {
  const img = new Image();
  img.src = svgDataUrl(svg);
  await img.decode();
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(img.naturalWidth * scale);
  canvas.height = Math.round(img.naturalHeight * scale);
  canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
  return canvas;
};
