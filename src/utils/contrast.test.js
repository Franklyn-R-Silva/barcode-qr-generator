import { contrastRatio, scanWarning } from "./contrast";

test("contrast ratio matches WCAG reference values", () => {
  expect(contrastRatio("#000000", "#ffffff")).toBeCloseTo(21, 1);
  expect(contrastRatio("#fff", "#000")).toBeCloseTo(21, 1);
  expect(contrastRatio("#777777", "#ffffff")).toBeCloseTo(4.48, 1);
  expect(contrastRatio("nope", "#fff")).toBeNull();
});

test("scanWarning flags inverted and low-contrast pairs only", () => {
  expect(scanWarning("#000000", "#ffffff")).toBeNull();
  expect(scanWarning("#128C7E", "#E5FFFC")).toBeNull();
  expect(scanWarning("#E0E0E0", "#1E1E1E").message).toMatch(/Light code on a dark background/);
  expect(scanWarning("#9ca3af", "#ffffff")).toEqual({ message: expect.stringMatching(/^Low contrast \(\{ratio\}:1\)/), ratio: "2.5" });
  expect(scanWarning("#12", "#ffffff")).toBeNull();
});
