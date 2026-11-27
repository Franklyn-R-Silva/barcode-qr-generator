// src/utils/nfeParser.js
//
// Helpers to recognise and decode the access key of Brazilian electronic
// fiscal documents (NF-e / NFC-e / CT-e / MDF-e).
//
// The access key has 44 digits with this structure:
//   cUF(2) YYMM(4) CNPJ(14) model(2) series(3) number(9) tpEmis(1) cNF(8) DV(1)
//
// In NFC-e QR Codes the key sits inside the SEFAZ URL (`p` or `chNFe`
// parameter); in the DANFE barcode it appears on its own.
//
// Model and emission names are English; the UI translates them where they
// are shown (the "{code}" fallbacks take modelCode / emissionTypeCode).

/** UF (IBGE) codes to state abbreviations. */
const UF_CODES = {
  11: "RO", 12: "AC", 13: "AM", 14: "RR", 15: "PA", 16: "AP", 17: "TO",
  21: "MA", 22: "PI", 23: "CE", 24: "RN", 25: "PB", 26: "PE", 27: "AL",
  28: "SE", 29: "BA", 31: "MG", 32: "ES", 33: "RJ", 35: "SP", 41: "PR",
  42: "SC", 43: "RS", 50: "MS", 51: "MT", 52: "GO", 53: "DF",
};

/** Fiscal document models. */
const MODELS = {
  55: "NF-e (Electronic Invoice)",
  65: "NFC-e (Electronic Consumer Invoice)",
  57: "CT-e (Electronic Bill of Lading)",
  58: "MDF-e (Fiscal Documents Manifest)",
};

/** Emission types (tpEmis). */
const EMISSION_TYPES = {
  1: "Normal",
  2: "Contingency FS-IA",
  3: "Contingency SCAN",
  4: "Contingency DPEC",
  5: "Contingency FS-DA",
  6: "Contingency SVC-AN",
  7: "Contingency SVC-RS",
  9: "Offline contingency (NFC-e)",
};

/**
 * Extracts a 44-digit access key from any scanned text
 * (NFC-e URL, DANFE barcode or the bare key).
 * @returns {string|null} the 44 digits, or null when not found.
 */
export function extractAccessKey(text) {
  if (!text) return null;

  const str = String(text);

  // 1) Explicit chNFe=... parameter (some URLs use this format).
  const chMatch = str.match(/chNFe=?(\d{44})/i);
  if (chMatch) return chMatch[1];

  // 2) A maximal run of exactly 44 digits (delimited by non-digits,
  //    as in `?p=<key>|...`). Avoids lookbehind for compatibility with
  //    older browsers (e.g. Safari < 16.4).
  const runs = str.match(/\d+/g);
  if (runs) {
    const key = runs.find((run) => run.length === 44);
    if (key) return key;
  }

  // 3) Fallback: strip every non-digit; if 44 are left, that is the key.
  const digitsOnly = str.replace(/\D/g, "");
  if (digitsOnly.length === 44) return digitsOnly;

  return null;
}

/** Formats a CNPJ (14 digits) as 00.000.000/0000-00. */
function formatCNPJ(cnpj) {
  return cnpj.replace(
    /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
    "$1.$2.$3/$4-$5"
  );
}

/** Formats the key in 11 blocks of 4 digits for reading. */
export function formatAccessKey(key) {
  return key.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
}

/**
 * Validates the check digit (position 44) with modulo 11.
 * @returns {boolean}
 */
export function isAccessKeyValid(key) {
  if (!/^\d{44}$/.test(key)) return false;
  const base = key.slice(0, 43);
  const dv = Number(key[43]);

  let weight = 2;
  let sum = 0;
  for (let i = base.length - 1; i >= 0; i--) {
    sum += Number(base[i]) * weight;
    weight = weight === 9 ? 2 : weight + 1;
  }
  const rest = sum % 11;
  const expected = rest === 0 || rest === 1 ? 0 : 11 - rest;
  return expected === dv;
}

/**
 * Decodes the access key into its fields.
 * @param {string} text scanned text (URL, barcode or key)
 * @returns {object|null} structured fields, or null when it is not a fiscal document
 */
export function parseNFe(text) {
  const key = extractAccessKey(text);
  if (!key) return null;

  const cUF = key.slice(0, 2);
  const yymm = key.slice(2, 6);
  const cnpj = key.slice(6, 20);
  const model = key.slice(20, 22);
  const series = key.slice(22, 25);
  const number = key.slice(25, 34);
  const tpEmis = key.slice(34, 35);
  const year = `20${yymm.slice(0, 2)}`;
  const month = yymm.slice(2, 4);

  return {
    key,
    keyFormatted: formatAccessKey(key),
    valid: isAccessKeyValid(key),
    uf: UF_CODES[Number(cUF)] || `UF ${cUF}`,
    emission: `${month}/${year}`,
    cnpj: formatCNPJ(cnpj),
    model: MODELS[Number(model)] || "Model {code}",
    modelCode: model,
    series: String(Number(series)),
    number: String(Number(number)),
    emissionType: EMISSION_TYPES[Number(tpEmis)] || "Type {code}",
    emissionTypeCode: tpEmis,
  };
}

/** True when the text is a URL (used to "open" the content). */
export function isUrl(text) {
  return /^https?:\/\/\S+$/i.test(String(text).trim());
}

/**
 * National public lookup portal for NF-e / NFC-e.
 * The user types the key in by hand (with a captcha) on the portal.
 */
export const NFE_LOOKUP_URL =
  "https://www.nfe.fazenda.gov.br/portal/consultaRecaptcha.aspx?tipoConsulta=resumo&tipoConteudo=XbSeqxE8pl8=";
