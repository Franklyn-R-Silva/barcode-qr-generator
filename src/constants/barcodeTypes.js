// src/constants/barcodeTypes.js

/**
 * Formatos de códigos de barras suportados
 * Agrupados por categoria para melhor organização
 */

export const BARCODE_FORMATS = {
  // 1D Barcodes - Code Family
  CODE39: "CODE39",
  CODE93: "CODE93",
  CODE128: "CODE128",
  CODE128A: "CODE128A",
  CODE128B: "CODE128B",
  CODE128C: "CODE128C",

  // GS1
  GS1_128: "GS1-128",

  // ITF Family
  ITF: "ITF",
  ITF14: "ITF14",

  // EAN Family
  EAN13: "EAN13",
  EAN8: "EAN8",
  EAN5: "EAN5",
  EAN2: "EAN2",

  // UPC Family
  UPCA: "UPC",
  UPCE: "UPC", // UPC-E usa mesmo formato mas com validação diferente

  // Others
  ISBN: "EAN13", // ISBN usa formato EAN13 com validação especial
  MSI: "MSI",
  MSI10: "MSI10",
  MSI11: "MSI11",
  MSI1010: "MSI1010",
  MSI1110: "MSI1110",
  PHARMACODE: "pharmacode",
  CODABAR: "codabar",
};

/**
 * Categorias de códigos de barras para organização na UI
 */
export const BARCODE_CATEGORIES = [
  {
    name: "Code Family",
    formats: [
      { value: BARCODE_FORMATS.CODE39, label: "Code 39" },
      { value: BARCODE_FORMATS.CODE93, label: "Code 93" },
      { value: BARCODE_FORMATS.CODE128, label: "Code 128 (Auto)" },
      { value: BARCODE_FORMATS.CODE128A, label: "Code 128 A" },
      { value: BARCODE_FORMATS.CODE128B, label: "Code 128 B" },
      { value: BARCODE_FORMATS.CODE128C, label: "Code 128 C" },
    ],
  },
  {
    name: "GS1 & ITF",
    formats: [
      { value: BARCODE_FORMATS.GS1_128, label: "GS1-128" },
      { value: BARCODE_FORMATS.ITF, label: "Interleaved 2 of 5 (ITF)" },
      { value: BARCODE_FORMATS.ITF14, label: "ITF-14" },
    ],
  },
  {
    name: "EAN & ISBN",
    formats: [
      { value: BARCODE_FORMATS.EAN13, label: "EAN-13" },
      { value: BARCODE_FORMATS.EAN8, label: "EAN-8" },
      { value: BARCODE_FORMATS.EAN5, label: "EAN-5" },
      { value: BARCODE_FORMATS.EAN2, label: "EAN-2" },
      { value: BARCODE_FORMATS.ISBN, label: "ISBN" },
    ],
  },
  {
    name: "UPC",
    formats: [
      { value: BARCODE_FORMATS.UPCA, label: "UPC-A" },
      { value: BARCODE_FORMATS.UPCE, label: "UPC-E" },
    ],
  },
  {
    name: "Outros",
    formats: [
      { value: BARCODE_FORMATS.MSI, label: "MSI" },
      { value: BARCODE_FORMATS.MSI10, label: "MSI10" },
      { value: BARCODE_FORMATS.MSI11, label: "MSI11" },
      { value: BARCODE_FORMATS.MSI1010, label: "MSI1010" },
      { value: BARCODE_FORMATS.MSI1110, label: "MSI1110" },
      { value: BARCODE_FORMATS.PHARMACODE, label: "Pharmacode" },
      { value: BARCODE_FORMATS.CODABAR, label: "Codabar" },
    ],
  },
];

/**
 * Configurações padrão para cada formato
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
 * Exemplos de valores válidos para cada tipo de código
 */
export const BARCODE_EXAMPLES = {
  [BARCODE_FORMATS.CODE39]: "EXAMPLE123",
  [BARCODE_FORMATS.CODE93]: "EXAMPLE123",
  [BARCODE_FORMATS.CODE128]: "Example 1234",
  [BARCODE_FORMATS.CODE128A]: "EXAMPLE 123",
  [BARCODE_FORMATS.CODE128B]: "Example123",
  [BARCODE_FORMATS.CODE128C]: "12345678",
  [BARCODE_FORMATS.GS1_128]: "00123456789012345675",
  [BARCODE_FORMATS.ITF]: "1234567890",
  [BARCODE_FORMATS.ITF14]: "12345678901231",
  [BARCODE_FORMATS.EAN13]: "5901234123457",
  [BARCODE_FORMATS.EAN8]: "96385074",
  [BARCODE_FORMATS.EAN5]: "12345",
  [BARCODE_FORMATS.EAN2]: "12",
  [BARCODE_FORMATS.ISBN]: "9781234567897",
  [BARCODE_FORMATS.UPCA]: "123456789999",
  [BARCODE_FORMATS.UPCE]: "01234565",
  [BARCODE_FORMATS.MSI]: "1234567890",
  [BARCODE_FORMATS.MSI10]: "1234567890",
  [BARCODE_FORMATS.MSI11]: "1234567890",
  [BARCODE_FORMATS.MSI1010]: "1234567890",
  [BARCODE_FORMATS.MSI1110]: "1234567890",
  [BARCODE_FORMATS.PHARMACODE]: "1234",
  [BARCODE_FORMATS.CODABAR]: "A1234567890B",
};
