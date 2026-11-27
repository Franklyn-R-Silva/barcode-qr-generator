// WCAG relative luminance / contrast for #rgb or #rrggbb colours.

const toRgb = (hex) => {
  const m = /^#?([0-9a-f]{3}|[0-9a-f]{6})$/i.exec(hex || "");
  if (!m) return null;
  const h = m[1].length === 3 ? m[1].replace(/./g, "$&$&") : m[1];
  const n = parseInt(h, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
};

const channel = (v) => {
  const c = v / 255;
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
};

export const luminance = (hex) => {
  const rgb = toRgb(hex);
  if (!rgb) return null;
  const [r, g, b] = rgb.map(channel);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

export const contrastRatio = (a, b) => {
  const la = luminance(a);
  const lb = luminance(b);
  if (la === null || lb === null) return null;
  const [hi, lo] = la > lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
};

// Below 3:1 phone cameras start missing modules (WhatsApp green on mint is ~3.9:1 and reads fine).
export const MIN_SCAN_CONTRAST = 3;

/**
 * Warning `{ message, ratio? }` when a foreground/background pair is likely to
 * scan badly, or null when it is fine (or a colour is not a valid hex). The
 * message is English with a {ratio} placeholder; the UI translates it.
 */
export const scanWarning = (fg, bg) => {
  const ratio = contrastRatio(fg, bg);
  if (ratio === null) return null;
  if (luminance(fg) > luminance(bg)) {
    return { message: "Light code on a dark background: many readers do not recognise it. Make the code darker than the background." };
  }
  if (ratio < MIN_SCAN_CONTRAST) {
    return {
      message: "Low contrast ({ratio}:1): the code may not scan. Darken the code or lighten the background.",
      ratio: ratio.toFixed(1),
    };
  }
  return null;
};
