// src/utils/barcodeValidators.js

/**
 * Validadores para diferentes formatos de código de barras
 */

/**
 * Valida UPC-A: Exatamente 12 dígitos numéricos
 */
export const validateUPCA = (value) => {
  const cleaned = value.replace(/[^0-9]/g, "");
  if (cleaned.length !== 12) {
    return {
      valid: false,
      message: "UPC-A deve ter exatamente 12 dígitos",
      suggestion: "123456789012",
    };
  }
  return { valid: true };
};

/**
 * Valida UPC-E: 6, 7 ou 8 dígitos numéricos
 */
export const validateUPCE = (value) => {
  const cleaned = value.replace(/[^0-9]/g, "");
  if (cleaned.length < 6 || cleaned.length > 8) {
    return {
      valid: false,
      message: "UPC-E deve ter entre 6 e 8 dígitos",
      suggestion: "01234565",
    };
  }
  return { valid: true };
};

/**
 * Valida EAN-13: Exatamente 13 dígitos numéricos
 */
export const validateEAN13 = (value) => {
  const cleaned = value.replace(/[^0-9]/g, "");
  if (cleaned.length !== 13) {
    return {
      valid: false,
      message: "EAN-13 deve ter exatamente 13 dígitos",
      suggestion: "5901234123457",
    };
  }
  return { valid: true };
};

/**
 * Valida EAN-8: Exatamente 8 dígitos numéricos
 */
export const validateEAN8 = (value) => {
  const cleaned = value.replace(/[^0-9]/g, "");
  if (cleaned.length !== 8) {
    return {
      valid: false,
      message: "EAN-8 deve ter exatamente 8 dígitos",
      suggestion: "96385074",
    };
  }
  return { valid: true };
};

/**
 * Valida EAN-5: Exatamente 5 dígitos numéricos
 */
export const validateEAN5 = (value) => {
  const cleaned = value.replace(/[^0-9]/g, "");
  if (cleaned.length !== 5) {
    return {
      valid: false,
      message: "EAN-5 deve ter exatamente 5 dígitos",
      suggestion: "12345",
    };
  }
  return { valid: true };
};

/**
 * Valida EAN-2: Exatamente 2 dígitos numéricos
 */
export const validateEAN2 = (value) => {
  const cleaned = value.replace(/[^0-9]/g, "");
  if (cleaned.length !== 2) {
    return {
      valid: false,
      message: "EAN-2 deve ter exatamente 2 dígitos",
      suggestion: "12",
    };
  }
  return { valid: true };
};

/**
 * Valida ISBN: 13 dígitos (ISBN-13) ou 10 dígitos (ISBN-10)
 */
export const validateISBN = (value) => {
  const cleaned = value.replace(/[^0-9X]/g, "");
  if (cleaned.length !== 10 && cleaned.length !== 13) {
    return {
      valid: false,
      message: "ISBN deve ter 10 ou 13 dígitos",
      suggestion: "9781234567897",
    };
  }
  return { valid: true };
};

/**
 * Valida ITF: Deve ter número par de dígitos
 */
export const validateITF = (value) => {
  const cleaned = value.replace(/[^0-9]/g, "");
  if (cleaned.length % 2 !== 0) {
    return {
      valid: false,
      message: "ITF deve ter número par de dígitos",
      suggestion: "1234567890",
    };
  }
  if (cleaned.length < 2) {
    return {
      valid: false,
      message: "ITF deve ter pelo menos 2 dígitos",
      suggestion: "1234567890",
    };
  }
  return { valid: true };
};

/**
 * Valida ITF-14: Exatamente 14 dígitos numéricos
 */
export const validateITF14 = (value) => {
  const cleaned = value.replace(/[^0-9]/g, "");
  if (cleaned.length !== 14) {
    return {
      valid: false,
      message: "ITF-14 deve ter exatamente 14 dígitos",
      suggestion: "12345678901231",
    };
  }
  return { valid: true };
};

/**
 * Valida CODE39: Letras maiúsculas, números e alguns caracteres especiais
 */
export const validateCODE39 = (value) => {
  const valid = /^[0-9A-Z\-. $/+%]+$/.test(value);
  if (!valid || value.length === 0) {
    return {
      valid: false,
      message: "CODE39 aceita apenas números, letras maiúsculas e -. $/+%",
      suggestion: "EXAMPLE123",
    };
  }
  return { valid: true };
};

/**
 * Valida CODE128: Qualquer caractere ASCII
 */
export const validateCODE128 = (value) => {
  if (value.length === 0) {
    return {
      valid: false,
      message: "Digite um valor para o código",
      suggestion: "Example 1234",
    };
  }
  return { valid: true };
};

/**
 * Valida CODE128A: Apenas caracteres ASCII de controle e letras maiúsculas
 */
export const validateCODE128A = (value) => {
  const valid = /^[A-Z0-9 ]+$/.test(value);
  if (!valid || value.length === 0) {
    return {
      valid: false,
      message: "CODE128A aceita apenas letras maiúsculas, números e espaços",
      suggestion: "EXAMPLE 123",
    };
  }
  return { valid: true };
};

/**
 * Valida CODE128B: Caracteres ASCII imprimíveis
 */
export const validateCODE128B = (value) => {
  if (value.length === 0) {
    return {
      valid: false,
      message: "Digite um valor para o código",
      suggestion: "Example123",
    };
  }
  return { valid: true };
};

/**
 * Valida CODE128C: Apenas dígitos numéricos (pares)
 */
export const validateCODE128C = (value) => {
  const cleaned = value.replace(/[^0-9]/g, "");
  if (cleaned.length === 0 || cleaned.length % 2 !== 0) {
    return {
      valid: false,
      message: "CODE128C aceita apenas números (quantidade par de dígitos)",
      suggestion: "12345678",
    };
  }
  return { valid: true };
};

/**
 * Valida MSI: Apenas dígitos numéricos
 */
export const validateMSI = (value) => {
  const cleaned = value.replace(/[^0-9]/g, "");
  if (cleaned.length === 0) {
    return {
      valid: false,
      message: "MSI deve conter apenas números",
      suggestion: "1234567890",
    };
  }
  return { valid: true };
};

/**
 * Valida Pharmacode: 1 a 6 dígitos numéricos
 */
export const validatePharmacode = (value) => {
  const cleaned = value.replace(/[^0-9]/g, "");
  if (cleaned.length === 0 || cleaned.length > 6) {
    return {
      valid: false,
      message: "Pharmacode deve ter entre 1 e 6 dígitos",
      suggestion: "1234",
    };
  }
  const num = parseInt(cleaned, 10);
  if (num < 3 || num > 131070) {
    return {
      valid: false,
      message: "Pharmacode deve estar entre 3 e 131070",
      suggestion: "1234",
    };
  }
  return { valid: true };
};

/**
 * Valida Codabar: Números e letras A-D com start/stop characters
 */
export const validateCodabar = (value) => {
  const valid = /^[A-D][0-9\-$:/.+]+[A-D]$/i.test(value);
  if (!valid) {
    return {
      valid: false,
      message: "Codabar deve começar e terminar com A, B, C ou D",
      suggestion: "A1234567890B",
    };
  }
  return { valid: true };
};

/**
 * Valida GS1-128: Mínimo 2 dígitos
 */
export const validateGS1_128 = (value) => {
  if (value.length < 2) {
    return {
      valid: false,
      message: "GS1-128 deve ter pelo menos 2 caracteres",
      suggestion: "00123456789012345675",
    };
  }
  return { valid: true };
};

/**
 * Mapa de validadores por formato
 */
export const BARCODE_VALIDATORS = {
  UPC: validateUPCA,
  "UPC-A": validateUPCA,
  UPCA: validateUPCA,
  "UPC-E": validateUPCE,
  UPCE: validateUPCE,
  EAN13: validateEAN13,
  "EAN-13": validateEAN13,
  EAN8: validateEAN8,
  "EAN-8": validateEAN8,
  EAN5: validateEAN5,
  "EAN-5": validateEAN5,
  EAN2: validateEAN2,
  "EAN-2": validateEAN2,
  ISBN: validateISBN,
  ITF: validateITF,
  ITF14: validateITF14,
  "ITF-14": validateITF14,
  CODE39: validateCODE39,
  CODE93: validateCODE39, // CODE93 tem regras similares ao CODE39
  CODE128: validateCODE128,
  CODE128A: validateCODE128A,
  CODE128B: validateCODE128B,
  CODE128C: validateCODE128C,
  MSI: validateMSI,
  MSI10: validateMSI,
  MSI11: validateMSI,
  MSI1010: validateMSI,
  MSI1110: validateMSI,
  pharmacode: validatePharmacode,
  codabar: validateCodabar,
  "GS1-128": validateGS1_128,
};

/**
 * Valida valor para formato específico
 */
export const validateBarcodeValue = (format, value) => {
  if (!value || value.trim().length === 0) {
    return {
      valid: false,
      message: "Digite um valor para gerar o código de barras",
      suggestion: "",
    };
  }

  const validator = BARCODE_VALIDATORS[format];
  if (validator) {
    return validator(value);
  }

  // Formato desconhecido - aceita qualquer valor
  return { valid: true };
};

/**
 * Obtém exemplo para formato específico
 */
export const getBarcodeExample = (format) => {
  const examples = {
    UPC: "123456789012",
    "UPC-A": "123456789012",
    UPCA: "123456789012",
    "UPC-E": "01234565",
    UPCE: "01234565",
    EAN13: "5901234123457",
    "EAN-13": "5901234123457",
    EAN8: "96385074",
    "EAN-8": "96385074",
    EAN5: "12345",
    "EAN-5": "12345",
    EAN2: "12",
    "EAN-2": "12",
    ISBN: "9781234567897",
    ITF: "1234567890",
    ITF14: "12345678901231",
    "ITF-14": "12345678901231",
    CODE39: "EXAMPLE123",
    CODE93: "EXAMPLE123",
    CODE128: "Example 1234",
    CODE128A: "EXAMPLE 123",
    CODE128B: "Example123",
    CODE128C: "12345678",
    MSI: "1234567890",
    MSI10: "1234567890",
    MSI11: "1234567890",
    MSI1010: "1234567890",
    MSI1110: "1234567890",
    pharmacode: "1234",
    codabar: "A1234567890B",
    "GS1-128": "00123456789012345675",
  };

  return examples[format] || "123456789";
};
