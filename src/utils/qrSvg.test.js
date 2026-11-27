import qrcode from "qrcode-generator";
import { qrSvg, utf16to8, QUIET_ZONE } from "./qrSvg";

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
