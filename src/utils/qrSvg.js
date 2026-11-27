import qrcode from "qrcode-generator";

// Default margin (quiet zone) in px; react-qrcode-logo, which this replaced, used 10.
export const QUIET_ZONE = 10;

// What the QR shows (and the coverage meter measures) while the content is empty.
export const EXAMPLE_URL = "https://qrcode.devfrs.com";

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
  const bgFill = config.bgGradientOn ? "url(#bgg)" : bg;
  // Module gradient in module units, so the eyes take the colour of where they sit.
  const defs =
    (config.gradientOn ? gradientDef("g", config.gradientDir, codeStops(config), n) : "") +
    (config.bgGradientOn ? gradientDef("bgg", config.gradientDir, [bg, config.bgColor2 || bg]) : "");

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

  // The uploaded photo goes either behind the code or inside the dark modules.
  const photoInModules = config.bgImage && config.bgImageMode === "modules";

  // Ground: colour, then an optional photo lightened by a veil of the background colour.
  let ground = transparentBg ? "" : `<rect width="${box}" height="${box}" fill="${bgFill}"/>`;
  if (config.bgImage && !photoInModules) {
    ground +=
      `<image href="${esc(config.bgImage)}" width="${box}" height="${box}" preserveAspectRatio="xMidYMid slice"/>` +
      `<rect width="${box}" height="${box}" fill="${bg}" opacity="${config.bgImageLighten ?? 0.5}"/>`;
  }

  let code =
    ground +
    `<g transform="translate(${margin} ${margin}) scale(${n3(cs)})">` +
    (photoInModules
      ? // Photo clipped to the module shapes, under a veil of the code colour so it still scans.
        `<clipPath id="mc"><path d="${d}"/></clipPath>` +
        `<image href="${esc(config.bgImage)}" width="${n}" height="${n}" preserveAspectRatio="xMidYMid slice" clip-path="url(#mc)"/>` +
        `<path d="${d}" fill="${ink}" opacity="${config.moduleImageDarken ?? 0.35}"/>`
      : `<path d="${d}" fill="${ink}"${qrStyle === "squares" || !qrStyle ? ' shape-rendering="crispEdges"' : ""}/>`) +
    `${eyes}</g>`;

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
      svg: `<svg xmlns="http://www.w3.org/2000/svg" width="${box}" height="${box}" viewBox="0 0 ${box} ${box}">${defs ? `<defs>${defs}</defs>` : ""}${code}</svg>`,
      width: box,
      height: box,
    };
  }
  return frameSvg(code, defs, box, config, bgFill);
};

/** Colour stops of the code gradient: start, optional middle, end. */
const codeStops = (c) => [c.fgColor, ...(c.gradient3On ? [c.fgColor3 || c.fgColor] : []), c.fgColor2 || c.fgColor];

/**
 * Gradient definition. Direction: "h" horizontal, "v" vertical, "d" diagonal
 * (default), "r" radial. `span` (user units) pins it to a fixed area; without
 * it the gradient stretches over each filled shape.
 */
const gradientDef = (id, dir, stops, span) => {
  const st = stops.map((c, i) => `<stop offset="${n3(i / (stops.length - 1))}" stop-color="${c}"/>`).join("");
  const S = span ?? 1;
  const units = span ? 'gradientUnits="userSpaceOnUse"' : "";
  if (dir === "r") {
    return `<radialGradient id="${id}" ${units} cx="${S / 2}" cy="${S / 2}" r="${n3(S * Math.SQRT1_2)}">${st}</radialGradient>`;
  }
  const [x2, y2] = dir === "h" ? [S, 0] : dir === "v" ? [0, S] : [S, S];
  return `<linearGradient id="${id}" ${units} x1="0" y1="0" x2="${x2}" y2="${y2}">${st}</linearGradient>`;
};

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
 * Frames around the code. Formats: "band" / "top" (label strip below or above),
 * "ticket" (band with side notches and a dashed tear line), "bubble" (speech
 * bubble under a bordered code), "pill" (label pill, no border), "arc" (U shape,
 * label on the curve), "circle" (label round the ring, or on the top and bottom
 * arcs) and "square" (label all the way round). `frameText` is the main label,
 * `frameText2` an optional second one on the other side.
 */
const frameSvg = (code, defs, box, config, bgFill) => {
  const { transparentBg } = config;
  const own = config.frameColorsOn;
  const frameInk = own && config.frameColor ? config.frameColor : config.fgColor;
  const textInk = own && config.frameTextColor ? config.frameTextColor : config.bgColor;
  const fill = config.frameGradient ? "url(#fgr)" : frameInk;
  const clean = (t) => esc(String(t || "").trim().slice(0, 60));
  const main = clean(config.frameText);
  const extra = clean(config.frameText2);
  const scale = Math.min(1.4, Math.max(0.6, config.frameFontScale ?? 1));
  const font = `font-family="Inter, Arial, Helvetica, sans-serif" font-weight="${config.frameBold === false ? 400 : 700}"`;
  const style = config.frameStyle || "band";
  const ground = (W, H) => (transparentBg ? "" : `<rect width="${n3(W)}" height="${n3(H)}" fill="${bgFill}"/>`);

  const wrap = (W, H, body) => {
    const all = defs + (config.frameGradient ? gradientDef("fgr", config.gradientDir, codeStops(config)) : "");
    return {
      svg: `<svg xmlns="http://www.w3.org/2000/svg" width="${n3(W)}" height="${n3(H)}" viewBox="0 0 ${n3(W)} ${n3(H)}">${all ? `<defs>${all}</defs>` : ""}${body}</svg>`,
      width: Math.round(W),
      height: Math.round(H),
    };
  };
  const line = (text, x, y, fs, max, color = textInk) =>
    `<text x="${n3(x)}" y="${n3(y)}" fill="${color}" ${font} font-size="${n3(fs)}" text-anchor="middle" dominant-baseline="central"${fit(text, fs, max)}>${text}</text>`;
  // A label in a strip: one line, or two balanced lines when it is long, then shrunk to fit.
  const strip = (text, x, mid, band, max, color) => {
    if (!text) return "";
    let fs = band * 0.42 * scale;
    let lines = [text];
    if (textWidth(text, fs) > max) {
      const two = splitLines(text);
      if (two) {
        lines = two;
        fs = band * 0.32 * scale;
      }
    }
    return lines
      .map((l, i) => line(l, x, lines.length === 1 ? mid : mid + (i === 0 ? -0.58 : 0.58) * fs, fs, max, color))
      .join("");
  };
  const onPath = (id, fs, text, length) =>
    `<text fill="${textInk}" ${font} font-size="${n3(fs)}" dominant-baseline="central">` +
    `<textPath href="#${id}" startOffset="50%" text-anchor="middle"${fit(text, fs, length)}>${text}</textPath></text>`;

  if (style === "circle") {
    const t = Math.round(box * 0.16 * Math.max(1, scale)); // ring thickness
    const rIn = box * Math.SQRT1_2 + Math.round(box * 0.02);
    const rOut = rIn + t;
    const c = rOut;
    const rMid = rIn + t / 2;
    const fs = t * 0.5 * scale;
    let text;
    if (config.circleText === "arcs") {
      // Upright text on the top arc (main) and the bottom arc (second label).
      const half = Math.PI * rMid * 0.8;
      text =
        `<path id="fpt" d="M${n3(c - rMid)} ${n3(c)}A${n3(rMid)} ${n3(rMid)} 0 0 1 ${n3(c + rMid)} ${n3(c)}" fill="none"/>` +
        `<path id="fpb" d="M${n3(c - rMid)} ${n3(c)}A${n3(rMid)} ${n3(rMid)} 0 0 0 ${n3(c + rMid)} ${n3(c)}" fill="none"/>` +
        (main ? onPath("fpt", fs, main, half) : "") +
        (extra ? onPath("fpb", fs, extra, half) : "");
    } else {
      const length = 2 * Math.PI * rMid;
      text = `<path id="fp" d="${circlePath(c, c, rMid)}" fill="none"/>` + onPath("fp", fs, around(main, fs, length), length * 0.98);
    }
    return wrap(
      2 * rOut,
      2 * rOut,
      `<path d="${circlePath(c, c, rOut)}${circlePath(c, c, rIn)}" fill="${fill}" fill-rule="evenodd"/>` +
        (transparentBg ? "" : `<circle cx="${n3(c)}" cy="${n3(c)}" r="${n3(rIn)}" fill="${bgFill}"/>`) +
        `<g transform="translate(${n3(c - box / 2)} ${n3(c - box / 2)})">${code}</g>` +
        text
    );
  }

  if (style === "square") {
    const t = Math.round(box * 0.13 * Math.max(1, scale));
    const g = Math.round(box * 0.015);
    const S = box + 2 * (t + g);
    const inner = box + 2 * g;
    const fs = t * 0.5 * scale;
    const r = t / 2;
    const side = S - t;
    const length = 4 * side - 8 * r + 2 * Math.PI * r;
    return wrap(
      S,
      S,
      `<path d="${roundedRect(0, 0, S, S, t)}M${t} ${t}h${inner}v${inner}h${-inner}z" fill="${fill}" fill-rule="evenodd"/>` +
        (transparentBg ? "" : `<rect x="${t}" y="${t}" width="${inner}" height="${inner}" fill="${bgFill}"/>`) +
        `<g transform="translate(${t + g} ${t + g})">${code}</g>` +
        `<path id="fp" d="${roundedRect(t / 2, t / 2, side, side, r)}" fill="none"/>` +
        onPath("fp", fs, around(main, fs, length), length * 0.98)
    );
  }

  const b = Math.max(3, Math.round(box * (style === "ticket" ? 0.06 : 0.035)));
  const W = box + 2 * b;
  const bandH = Math.round(box * 0.2 * Math.max(1, scale));
  const plainH = extra ? Math.round(box * 0.14 * Math.max(1, scale)) : 0; // plain text above the code
  const plain = extra ? line(extra, W / 2, plainH / 2, plainH * 0.55 * scale, W - 2 * b, frameInk) : "";

  if (style === "bubble" || style === "pill") {
    const gap = Math.round(box * 0.05);
    const isPill = style === "pill";
    const codeW = isPill ? box : W;
    const codeH = codeW;
    const labelY = plainH + codeH + gap;
    const labelH = Math.round(bandH * (isPill ? 0.8 : 1));
    const labelW = isPill ? codeW * 0.86 : codeW;
    const labelX = (codeW - labelW) / 2;
    const H = labelY + labelH;
    const border = isPill
      ? `<g transform="translate(0 ${plainH})">${code}</g>`
      : `<path d="${roundedRect(0, plainH, W, W, 2 * b)}M${b} ${plainH + b}h${box}v${box}h${-box}z" fill="${fill}" fill-rule="evenodd"/>` +
        `<g transform="translate(${b} ${plainH + b})">${code}</g>`;
    const pointer = isPill ? "" : `M${n3(codeW / 2 - gap)} ${labelY + 1}l${gap} ${-gap - 1}l${gap} ${gap + 1}z`;
    return wrap(
      codeW,
      H,
      ground(codeW, H) +
        plain +
        border +
        `<path d="${roundedRect(labelX, labelY, labelW, labelH, isPill ? labelH / 2 : 2 * b)}${pointer}" fill="${fill}"/>` +
        strip(main, codeW / 2, labelY + labelH / 2, labelH, labelW - 4 * b)
    );
  }

  if (style === "arc") {
    const band = Math.round(box * 0.18 * Math.max(1, scale));
    const topH = extra ? bandH : 0;
    const e = band * 1.8; // depth of the U below the code
    const y0 = b + topH + box;
    const r = 2 * b;
    const rx = W / 2 - band * 0.55;
    const ry = e - band * 0.55;
    const fs = band * 0.5 * scale;
    const length = (Math.PI * (3 * (rx + ry) - Math.sqrt((3 * rx + ry) * (rx + 3 * ry)))) / 2;
    return wrap(
      W,
      y0 + e,
      `<path d="M0 ${r}a${r} ${r} 0 0 1 ${r} ${-r}h${W - 2 * r}a${r} ${r} 0 0 1 ${r} ${r}V${y0}A${n3(W / 2)} ${n3(e)} 0 0 1 0 ${y0}z` +
        `M${b} ${b + topH}h${box}v${box}h${-box}z" fill="${fill}" fill-rule="evenodd"/>` +
        `<g transform="translate(${b} ${b + topH})">${code}</g>` +
        strip(extra, W / 2, b + topH / 2, bandH, W - 4 * b) +
        `<path id="fp" d="M${n3(W / 2 - rx)} ${y0}A${n3(rx)} ${n3(ry)} 0 0 0 ${n3(W / 2 + rx)} ${y0}" fill="none"/>` +
        // Only the bottom 60% of the curve is clear of the code's corners.
        onPath("fp", fs, main, length * 0.6)
    );
  }

  // "band" / "top" / "ticket": strips above and/or below the code inside one border.
  const topText = style === "top" ? main : extra;
  const bottomText = style === "top" ? extra : main;
  const topH = topText ? bandH : 0;
  const botH = bottomText || !topText ? bandH : 0;
  const H = topH + box + botH + 2 * b;
  let body =
    `<path d="${roundedRect(0, 0, W, H, 2 * b)}M${b} ${b + topH}h${box}v${box}h${-box}z" fill="${fill}" fill-rule="evenodd"/>` +
    `<g transform="translate(${b} ${b + topH})">${code}</g>` +
    strip(topText, W / 2, b + topH / 2, bandH, W - 4 * b) +
    strip(bottomText, W / 2, b + topH + box + botH / 2, bandH, W - 4 * b);
  if (style === "ticket") {
    // Notches on both sides and a dashed tear line where each strip meets the code.
    const cuts = [topH ? b + topH : null, botH ? b + topH + box : null].filter((y) => y !== null);
    const mask =
      `<mask id="tm"><rect width="${W}" height="${H}" fill="#fff"/>` +
      cuts.map((y) => `<circle cx="0" cy="${y}" r="${b}" fill="#000"/><circle cx="${W}" cy="${y}" r="${b}" fill="#000"/>`).join("") +
      `</mask>`;
    // The tear line sits inside the strip, clear of the code's quiet zone.
    const tear = cuts
      .map((y) => {
        const ty = n3(y === b + topH && topH ? y - b / 2 : y + b / 2);
        return `<path d="M${2 * b} ${ty}H${W - 2 * b}" stroke="${textInk}" stroke-width="${n3(b / 4)}" stroke-dasharray="${n3(b / 2)} ${n3(b / 2)}" opacity=".6"/>`;
      })
      .join("");
    body = `${mask}<g mask="url(#tm)">${body}</g>${tear}`;
  }
  return wrap(W, H, body);
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
