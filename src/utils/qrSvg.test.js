import qrcode from "qrcode-generator";
import { qrSvg, utf16to8, QUIET_ZONE, logoCoverage } from "./qrSvg";

const base = { size: 280, fgColor: "#000000", bgColor: "#ffffff", ecLevel: "H", qrStyle: "squares", eyeStyle: "square" };

test("draws every dark data module of the qrcode-generator matrix", () => {
  const text = "https://qrcode.devfrs.com/çã";
  const qr = qrcode(0, "H");
  qr.addData(utf16to8(text));
  qr.make();
  const n = qr.getModuleCount();
  let dark = 0;
  for (let r = 0; r < n; r++)
    for (let c = 0; c < n; c++)
      if (qr.isDark(r, c) && !((r <= 7 && c <= 7) || (r <= 7 && c >= n - 7) || (r >= n - 7 && c <= 7))) dark++;
  const { svg, width } = qrSvg(base, text);
  expect(width).toBe(280 + 2 * QUIET_ZONE);
  expect(svg.match(/h1v1h-1z/g)).toHaveLength(dark);
  expect(utf16to8("ç")).toBe("\xC3\xA7");
});

test("transparency, frame label escaping and too-long text", () => {
  expect(qrSvg({ ...base, transparentBg: true }, "x").svg).not.toContain('fill="#ffffff"');
  const framed = qrSvg({ ...base, frame: true, frameText: "<Cardápio>" }, "x");
  expect(framed.svg).toContain("&lt;Cardápio&gt;</text>");
  expect(framed.height).toBeGreaterThan(framed.width);
  expect(() => qrSvg(base, "x".repeat(5000))).toThrow();
});

test("logo coverage grows with size and border, and clears modules", () => {
  const logo = { ...base, logoImage: "data:image/png;base64,AAAA", logoSize: 20 };
  const small = logoCoverage(logo, "https://qrcode.devfrs.com");
  const big = logoCoverage({ ...logo, logoSize: 35, logoPad: 8 }, "https://qrcode.devfrs.com");
  expect(small.capacity).toBe(0.3);
  expect(small.coverage).toBeGreaterThan(0.02);
  expect(big.coverage).toBeGreaterThan(small.coverage);
  expect(logoCoverage(base, "x").coverage).toBe(0);
  const kept = qrSvg(logo, "x").svg.match(/h1v1h-1z/g).length;
  const cleared = qrSvg({ ...logo, removeQrCodeBehindLogo: true }, "x").svg.match(/h1v1h-1z/g).length;
  expect(cleared).toBeLessThan(kept);
});

test("margin, gradient, eye colour, round eyes and background image", () => {
  const svg = qrSvg(
    { ...base, margin: 0, gradientOn: true, fgColor2: "#2563eb", eyeColorOn: true, eyeColor: "#ff0000", eyeStyle: "dot", bgImage: "data:image/jpeg;base64,BBBB", bgImageLighten: 0.6 },
    "x"
  );
  expect(svg.width).toBe(280);
  expect(svg.svg).toContain('stop-color="#2563eb"');
  expect(svg.svg).toContain('fill="url(#g)"');
  expect(svg.svg.match(/<circle[^>]*stroke="#ff0000"/g)).toHaveLength(3);
  expect(svg.svg).toContain('opacity="0.6"');
});

test("frame styles: long band labels wrap and fit; text runs round circle and square", () => {
  const long = qrSvg({ ...base, frame: true, frameText: "Escaneie aqui essa informação agora" }, "x").svg;
  expect(long.match(/<text /g)).toHaveLength(2);
  const noSpace = qrSvg({ ...base, frame: true, frameText: "Escaneie-me6656665656565" }, "x").svg;
  expect(noSpace).toContain("textLength=");
  for (const frameStyle of ["circle", "square", "arc"]) {
    const f = qrSvg({ ...base, frame: true, frameStyle, frameText: "Escaneie aqui" }, "x");
    expect(f.svg).toContain('<textPath href="#fp"');
    if (frameStyle !== "arc") {
      expect(f.width).toBe(f.height);
      expect(f.svg).toContain("Escaneie aqui • Escaneie aqui");
    }
  }
});

test("photo inside the modules is clipped to them and darkened", () => {
  const photo = "data:image/jpeg;base64,CCCC";
  const inside = qrSvg({ ...base, bgImage: photo, bgImageMode: "modules", moduleImageDarken: 0.5 }, "x").svg;
  expect(inside).toContain('clip-path="url(#mc)"');
  expect(inside).toContain('opacity="0.5"');
  expect(inside.indexOf(photo)).toBeGreaterThan(inside.indexOf("<g transform"));
  const behind = qrSvg({ ...base, bgImage: photo }, "x").svg;
  expect(behind).not.toContain("url(#mc)");
  expect(behind.indexOf(photo)).toBeLessThan(behind.indexOf("<g transform"));
});

test("gradient direction, radial, three colours, background and frame gradients", () => {
  const g = (extra) => qrSvg({ ...base, gradientOn: true, fgColor2: "#2563eb", ...extra }, "x").svg;
  expect(g({ gradientDir: "h" })).toMatch(/<linearGradient id="g"[^>]*x2="\d+" y2="0"/);
  expect(g({ gradientDir: "v" })).toMatch(/<linearGradient id="g"[^>]*x2="0"/);
  expect(g({ gradientDir: "r" })).toContain('<radialGradient id="g"');
  expect(g({ gradient3On: true, fgColor3: "#7c3aed" }).match(/<stop /g)).toHaveLength(3);
  const bgGrad = qrSvg({ ...base, bgGradientOn: true, bgColor2: "#eff6ff" }, "x").svg;
  expect(bgGrad).toContain('fill="url(#bgg)"');
  const frameGrad = g({ frame: true, frameGradient: true, frameText: "Oi" });
  expect(frameGrad).toContain('<linearGradient id="fgr"');
  expect(frameGrad).toContain('fill="url(#fgr)"');
});

test("new frame formats, own colours, second label and text settings", () => {
  const f = (frameStyle, extra = {}) =>
    qrSvg({ ...base, frame: true, frameStyle, frameText: "Escaneie", frameText2: "Cardápio", ...extra }, "x");
  for (const style of ["top", "bubble", "pill", "ticket", "band", "arc"]) {
    const { svg } = f(style);
    expect(svg).toContain("Escaneie");
    expect(svg).toContain("Cardápio");
  }
  expect(f("ticket").svg).toContain('mask="url(#tm)"');
  expect(f("bubble").svg).toMatch(/l\d+ -\d+l\d+ \d+z/); // the pointer
  const arcs = f("circle", { circleText: "arcs" }).svg;
  expect(arcs).toContain('href="#fpt"');
  expect(arcs).toContain('href="#fpb"');
  const own = f("band", { frameColorsOn: true, frameColor: "#123456", frameTextColor: "#fedcba", frameBold: false }).svg;
  expect(own).toContain('fill="#123456"');
  expect(own).toContain('fill="#fedcba"');
  expect(own).toContain('font-weight="400"');
  const big = f("band", { frameFontScale: 1.3 });
  expect(big.height).toBeGreaterThan(f("band").height);
});
