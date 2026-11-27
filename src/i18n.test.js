import fs from "fs";
import path from "path";
import pt from "./locales/pt";
import { translate } from "./i18n";
import { CONTENT_TYPES } from "./utils/qrContent";
import { BARCODE_CATEGORIES, BARCODE_EXAMPLES } from "./constants/barcodeTypes";
import { parseNFe } from "./utils/nfeParser";

const sourceFiles = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const file = path.join(dir, entry.name);
    if (entry.isDirectory()) return entry.name === "locales" ? [] : sourceFiles(file);
    return /\.jsx?$/.test(entry.name) && !entry.name.endsWith(".test.js") ? [file] : [];
  });

const read = (file) => fs.readFileSync(path.join(__dirname, file), "utf8");
const grab = (text, re) => [...text.matchAll(re)].map((m) => m[m.length - 1]);

// t("…") and translate(lang, "…") calls; setError("…") stores an English key that is translated where shown.
const CALL = /(?:\b(?:t|setError)\(|\btranslate\(\s*\w+\s*,)\s*(["'])((?:\\.|(?!\1).)*)\1/g;

const calls = sourceFiles(__dirname).flatMap((file) => grab(fs.readFileSync(file, "utf8"), CALL));

// English text the utils and constants hand to the UI, which translates it where it is shown.
const nfeKey = (model, emission) => `352401${"0".repeat(14)}${model}001000000001${emission}000000010`;
const nfe = [
  ...Array.from({ length: 100 }, (_, m) => parseNFe(nfeKey(String(m).padStart(2, "0"), 1)).model),
  ...Array.from({ length: 10 }, (_, e) => parseNFe(nfeKey("55", e)).emissionType),
];
const data = [
  ...grab(read("utils/barcodeValidators.js"), /message:\s*"([^"]+)"/g),
  ...grab(read("utils/contrast.js"), /message:\s*"([^"]+)"/g),
  ...grab(read("utils/pix.js"), /new Error\("([^"]+)"\)/g),
  ...grab(read("components/generator/Controls.jsx"), /\{ name: "([^"]+)", fg:/g), // TEMPLATES
  ...CONTENT_TYPES.flatMap((type) => [
    type.label,
    ...type.fields.flatMap((f) => [f.label, f.placeholder, ...(f.options || []).map(([, label]) => label)]),
  ]),
  ...BARCODE_CATEGORIES.flatMap((c) => [c.name, ...c.formats.map((f) => f.label)]),
  ...Object.values(BARCODE_EXAMPLES).filter((v) => /[a-z]{3}/i.test(v)),
  ...nfe,
].filter(Boolean);

const keys = [...new Set([...calls, ...data])];

// Technical names that read the same in Portuguese, so they need no entry.
const SAME_IN_BOTH =
  /^(Link|Pix|WhatsApp|Wi-Fi|SMS|WEP|WPA\/WPA2\/WPA3|Normal|Dark|\(11\) [\d-]+|Code (\d+( [ABC]| \(Auto\))?|Family)|(GS1|EAN|ITF|UPC)(-\w+)?( & \w+)?|ISBN|MSI\d*|Pharmacode|Codabar|Interleaved 2 of 5 \(ITF\)|NF-e \/ DANFE \(Code-128C\))$/;

const placeholders = (s) => (s.match(/\{\w+\}/g) || []).sort();

test("the scan finds the UI text", () => {
  expect(keys.length).toBeGreaterThan(250);
  expect(keys).toEqual(expect.arrayContaining(["Download {format}", "Scan me", "Model {code}", "Example 1234"]));
});

test("every English text has a Portuguese translation", () => {
  expect(keys.filter((k) => !(k in pt) && !SAME_IN_BOTH.test(k))).toEqual([]);
});

test("every Portuguese entry is used and keeps the same placeholders", () => {
  expect(Object.keys(pt).filter((k) => !keys.includes(k))).toEqual([]);
  for (const [en, value] of Object.entries(pt)) expect([en, placeholders(value)]).toEqual([en, placeholders(en)]);
});

test("translate fills placeholders and falls back to English", () => {
  expect(translate("pt", "Download {format}", { format: "PNG" })).toBe("Baixar PNG");
  expect(translate("en", "Download {format}", { format: "PNG" })).toBe("Download PNG");
  expect(translate("pt", "{n} of 20 saved", { n: 3 })).toBe("3 de 20 guardados");
  expect(translate("pt", "Not in the dictionary, {x}", { x: "ok" })).toBe("Not in the dictionary, ok");
  expect(translate("pt", "Delete {item}", { item: "{n}" })).toBe("Excluir {n}"); // values are not re-filled
  expect(translate("pt", "Model {code}")).toBe("Modelo {code}"); // a missing var stays visible
});
