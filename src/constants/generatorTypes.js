// src/constants/generatorTypes.js

/**
 * Modes available in the app.
 * QRCODE and BARCODE generate codes; SCANNER reads codes from the camera/an image.
 */
export const GENERATOR_TYPES = {
  QRCODE: "qrcode",
  BARCODE: "barcode",
  SCANNER: "scanner",
};

/**
 * Friendly label for each mode.
 */
export const GENERATOR_LABELS = {
  [GENERATOR_TYPES.QRCODE]: "QR Code",
  [GENERATOR_TYPES.BARCODE]: "Barcode",
  [GENERATOR_TYPES.SCANNER]: "Scan",
};
