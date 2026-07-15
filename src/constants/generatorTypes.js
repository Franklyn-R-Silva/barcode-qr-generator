// src/constants/generatorTypes.js

/**
 * Tipos de modos disponíveis na aplicação.
 * QRCODE e BARCODE geram códigos; SCANNER lê códigos pela câmera/imagem.
 */
export const GENERATOR_TYPES = {
  QRCODE: "qrcode",
  BARCODE: "barcode",
  SCANNER: "scanner",
};

/**
 * Labels amigáveis para cada modo.
 */
export const GENERATOR_LABELS = {
  [GENERATOR_TYPES.QRCODE]: "QR Code",
  [GENERATOR_TYPES.BARCODE]: "Código de Barras",
  [GENERATOR_TYPES.SCANNER]: "Escanear",
};
