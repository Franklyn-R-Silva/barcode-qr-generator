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
 * pt-BR warning when a foreground/background pair is likely to scan badly,
 * or null when it is fine (or a colour is not a valid hex).
 */
export const scanWarning = (fg, bg) => {
  const ratio = contrastRatio(fg, bg);
  if (ratio === null) return null;
  if (luminance(fg) > luminance(bg)) {
    return "Código claro sobre fundo escuro: muitos leitores não reconhecem. Deixe o código mais escuro que o fundo.";
  }
  if (ratio < MIN_SCAN_CONTRAST) {
    return `Contraste baixo (${ratio.toFixed(1).replace(".", ",")}:1): o código pode não ser lido. Escureça o código ou clareie o fundo.`;
  }
  return null;
};
