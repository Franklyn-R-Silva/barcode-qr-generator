// src/constants/barcodeTypes.js

/**
 * Barcode formats.
 *
 * Each format has a UNIQUE `id` used throughout the app (state, examples,
 * validators). The id is intentionally decoupled from the string JsBarcode
 * expects to render it (`JSBARCODE_FORMAT`), because several distinct formats
 * render through the same JsBarcode encoder — e.g. UPC-A and UPC-E both render
 * as "UPC", and ISBN renders as "EAN13". Keying by id keeps their validation
 * and example values separate.
 */

export const DEFAULT_BARCODE_FORMAT = "CODE128";

/**
 * Maps each format id to the format string understood by JsBarcode/react-barcode.
 */
export const JSBARCODE_FORMAT = {
  CODE39: "CODE39",
  CODE93: "CODE93",
  CODE128: "CODE128",
  CODE128A: "CODE128A",
  CODE128B: "CODE128B",
  CODE128C: "CODE128C",
  GS1_128: "GS1-128",
  ITF: "ITF",
  ITF14: "ITF14",
  EAN13: "EAN13",
  EAN8: "EAN8",
  EAN5: "EAN5",
  EAN2: "EAN2",
  ISBN: "EAN13",
  UPCA: "UPC",
  UPCE: "UPC",
  MSI: "MSI",
  MSI10: "MSI10",
  MSI11: "MSI11",
  MSI1010: "MSI1010",
  MSI1110: "MSI1110",
  PHARMACODE: "pharmacode",
  CODABAR: "codabar",
  // Brazilian documents (the 44-digit key is what gets encoded):
  BOLETO: "ITF", // bank boleto — Interleaved 2 of 5
  BOLETO_ARRECADACAO: "ITF", // collection/tax boleto — Interleaved 2 of 5
  NFE: "CODE128C", // NF-e / DANFE — Code-128C
};

/**
 * Barcode formats grouped by category for the UI selector.
 * Names and labels are English; the UI translates them where they are shown.
 */
export const BARCODE_CATEGORIES = [
  {
    name: "Boletos & Invoices (Brazil)",
    formats: [
      { id: "BOLETO", label: "Bank Boleto (ITF)" },
      { id: "BOLETO_ARRECADACAO", label: "Collection / Tax Boleto (ITF)" },
      { id: "NFE", label: "NF-e / DANFE (Code-128C)" },
    ],
  },
  {
    name: "Code Family",
    formats: [
      { id: "CODE39", label: "Code 39" },
      { id: "CODE93", label: "Code 93" },
      { id: "CODE128", label: "Code 128 (Auto)" },
      { id: "CODE128A", label: "Code 128 A" },
      { id: "CODE128B", label: "Code 128 B" },
      { id: "CODE128C", label: "Code 128 C" },
    ],
  },
  {
    name: "GS1 & ITF",
    formats: [
      { id: "GS1_128", label: "GS1-128" },
      { id: "ITF", label: "Interleaved 2 of 5 (ITF)" },
      { id: "ITF14", label: "ITF-14" },
    ],
  },
  {
    name: "EAN & ISBN",
    formats: [
      { id: "EAN13", label: "EAN-13" },
      { id: "EAN8", label: "EAN-8" },
      { id: "EAN5", label: "EAN-5" },
      { id: "EAN2", label: "EAN-2" },
      { id: "ISBN", label: "ISBN" },
    ],
  },
  {
    name: "UPC",
    formats: [
      { id: "UPCA", label: "UPC-A" },
      { id: "UPCE", label: "UPC-E" },
    ],
  },
  {
    name: "Others",
    formats: [
      { id: "MSI", label: "MSI" },
      { id: "MSI10", label: "MSI10" },
      { id: "MSI11", label: "MSI11" },
      { id: "MSI1010", label: "MSI1010" },
      { id: "MSI1110", label: "MSI1110" },
      { id: "PHARMACODE", label: "Pharmacode" },
      { id: "CODABAR", label: "Codabar" },
    ],
  },
];

/**
 * Default rendering options for barcodes.
 */
export const BARCODE_DEFAULTS = {
  width: 2,
  height: 100,
  displayValue: true,
  fontSize: 20,
  margin: 10,
  background: "#ffffff",
  lineColor: "#000000",
};

/**
 * A valid example value for each format id. The ones with words are
 * translated where they are used, like any other UI text.
 */
export const BARCODE_EXAMPLES = {
  CODE39: "EXAMPLE123",
  CODE93: "EXAMPLE123",
  CODE128: "Example 1234",
  CODE128A: "EXAMPLE 123",
  CODE128B: "Example123",
  CODE128C: "12345678",
  GS1_128: "00123456789012345675",
  ITF: "1234567890",
  ITF14: "12345678901231",
  EAN13: "5901234123457",
  EAN8: "96385074",
  EAN5: "12345",
  EAN2: "12",
  ISBN: "9781234567897",
  UPCA: "123456789012",
  UPCE: "01234565",
  MSI: "1234567890",
  MSI10: "1234567890",
  MSI11: "1234567890",
  MSI1010: "1234567890",
  MSI1110: "1234567890",
  PHARMACODE: "1234",
  CODABAR: "A1234567890B",
  // Barcode (44 digits). The validators also accept the typeable line
  // (47 digits for bank / 48 for collection boletos) and convert it.
  BOLETO: "23791234567890123456789012345678901234567890",
  BOLETO_ARRECADACAO: "81234567890123456789012345678901234567890123",
  NFE: "35240114200166000187650010000001231000001230",
};
