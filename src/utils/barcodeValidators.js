// src/utils/barcodeValidators.js

import { BARCODE_EXAMPLES } from "../constants/barcodeTypes";
import { extractAccessKey } from "./nfeParser";

/**
 * Validators for the different barcode formats.
 *
 * Each validator returns `{ valid, message?, suggestion?, normalized? }`.
 * `normalized`, when present, is the value actually passed to the renderer
 * (e.g. a UPC-E expanded to its 12-digit UPC-A equivalent).
 *
 * Validators are keyed by the format `id` defined in constants/barcodeTypes.js.
 */

const onlyDigits = (value) => value.replace(/[^0-9]/g, "");

/**
 * Computes the UPC/EAN check digit for a numeric string (odd positions ×3).
 */
function calculateUPCCheckDigit(code) {
  let sum = 0;
  for (let i = 0; i < code.length; i++) {
    const digit = parseInt(code[i], 10);
    sum += i % 2 === 0 ? digit * 3 : digit;
  }
  return ((10 - (sum % 10)) % 10).toString();
}

/**
 * Expands a UPC-E value (6, 7 or 8 digits) into its 12-digit UPC-A equivalent,
 * which is what JsBarcode actually renders (it has no dedicated UPC-E encoder).
 * Returns the 12-digit UPC-A string, or null if the input length is invalid.
 */
function expandUPCEtoUPCA(digits) {
  let numberSystem = "0";
  let core;

  if (digits.length === 6) {
    core = digits;
  } else if (digits.length === 7 || digits.length === 8) {
    numberSystem = digits[0] === "1" ? "1" : "0";
    core = digits.slice(1, 7);
  } else {
    return null;
  }

  const d = core.split("");
  const last = d[5];
  let manufacturer;
  let product;

  switch (last) {
    case "0":
    case "1":
    case "2":
      manufacturer = d[0] + d[1] + last + "00";
      product = "00" + d[2] + d[3] + d[4];
      break;
    case "3":
      manufacturer = d[0] + d[1] + d[2] + "00";
      product = "000" + d[3] + d[4];
      break;
    case "4":
      manufacturer = d[0] + d[1] + d[2] + d[3] + "0";
      product = "0000" + d[4];
      break;
    default: // 5-9
      manufacturer = d[0] + d[1] + d[2] + d[3] + d[4];
      product = "0000" + last;
      break;
  }

  const upcaNoCheck = numberSystem + manufacturer + product; // 11 digits
  return upcaNoCheck + calculateUPCCheckDigit(upcaNoCheck);
}

/**
 * UPC-A: exactly 12 numeric digits.
 */
export const validateUPCA = (value) => {
  const cleaned = onlyDigits(value);
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
 * UPC-E: 6, 7 or 8 digits, expanded to a full UPC-A for rendering.
 */
export const validateUPCE = (value) => {
  const cleaned = onlyDigits(value);
  if (cleaned.length < 6 || cleaned.length > 8) {
    return {
      valid: false,
      message: "UPC-E deve ter entre 6 e 8 dígitos",
      suggestion: "01234565",
    };
  }
  const normalized = expandUPCEtoUPCA(cleaned);
  if (!normalized) {
    return {
      valid: false,
      message: "Não foi possível converter o UPC-E",
      suggestion: "01234565",
    };
  }
  return { valid: true, normalized };
};

/**
 * EAN-13: exactly 13 numeric digits.
 */
export const validateEAN13 = (value) => {
  const cleaned = onlyDigits(value);
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
 * EAN-8: exactly 8 numeric digits.
 */
export const validateEAN8 = (value) => {
  const cleaned = onlyDigits(value);
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
 * EAN-5: exactly 5 numeric digits.
 */
export const validateEAN5 = (value) => {
  const cleaned = onlyDigits(value);
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
 * EAN-2: exactly 2 numeric digits.
 */
export const validateEAN2 = (value) => {
  const cleaned = onlyDigits(value);
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
 * ISBN: 10 or 13 digits (rendered as EAN-13).
 */
export const validateISBN = (value) => {
  const cleaned = value.replace(/[^0-9X]/gi, "");
  if (cleaned.length !== 10 && cleaned.length !== 13) {
    return {
      valid: false,
      message: "ISBN deve ter 10 ou 13 dígitos",
      suggestion: "9781234567897",
    };
  }
  // JsBarcode renders ISBN through EAN-13, which requires 13 numeric digits.
  if (cleaned.length !== 13) {
    return {
      valid: false,
      message: "Use o ISBN-13 (13 dígitos) para gerar o código de barras",
      suggestion: "9781234567897",
    };
  }
  return { valid: true };
};

/**
 * ITF: even number of digits, at least 2.
 */
export const validateITF = (value) => {
  const cleaned = onlyDigits(value);
  if (cleaned.length < 2) {
    return {
      valid: false,
      message: "ITF deve ter pelo menos 2 dígitos",
      suggestion: "1234567890",
    };
  }
  if (cleaned.length % 2 !== 0) {
    return {
      valid: false,
      message: "ITF deve ter número par de dígitos",
      suggestion: "1234567890",
    };
  }
  return { valid: true };
};

/**
 * ITF-14: exactly 14 numeric digits.
 */
export const validateITF14 = (value) => {
  const cleaned = onlyDigits(value);
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
 * CODE39: uppercase letters, digits and a few symbols.
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
 * CODE128 (Auto/B): any non-empty ASCII value.
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
 * CODE128A: uppercase letters, digits and spaces.
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
 * CODE128C: even number of digits.
 */
export const validateCODE128C = (value) => {
  const cleaned = onlyDigits(value);
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
 * MSI (and variants): numeric only.
 */
export const validateMSI = (value) => {
  const cleaned = onlyDigits(value);
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
 * Pharmacode: integer between 3 and 131070.
 */
export const validatePharmacode = (value) => {
  const cleaned = onlyDigits(value);
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
 * Codabar: starts and ends with A-D, digits and a few symbols in between.
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
 * Converte a linha digitável de um boleto bancário (47 dígitos) no código de
 * barras de 44 dígitos que é efetivamente codificado (ITF).
 */
function bankLinhaToBarcode(l) {
  const banco = l.slice(0, 3);
  const moeda = l.slice(3, 4);
  const campoLivreA = l.slice(4, 9); // 5
  const campoLivreB = l.slice(10, 20); // 10
  const campoLivreC = l.slice(21, 31); // 10
  const dvGeral = l.slice(32, 33);
  const fatorValor = l.slice(33, 47); // fator(4) + valor(10)
  return banco + moeda + dvGeral + fatorValor + campoLivreA + campoLivreB + campoLivreC;
}

/**
 * Converte a linha digitável de um boleto de arrecadação (48 dígitos, 4 blocos
 * de 11 dígitos + DV) no código de barras de 44 dígitos.
 */
function arrecadacaoLinhaToBarcode(l) {
  return l.slice(0, 11) + l.slice(12, 23) + l.slice(24, 35) + l.slice(36, 47);
}

/**
 * Boleto bancário: aceita o código de barras (44 dígitos) ou a linha digitável
 * (47 dígitos), convertendo esta última para os 44 dígitos codificados (ITF).
 */
export const validateBoleto = (value) => {
  const d = onlyDigits(value);
  if (d.length === 44) return { valid: true };
  if (d.length === 47) return { valid: true, normalized: bankLinhaToBarcode(d) };
  return {
    valid: false,
    message:
      "Boleto bancário: informe a linha digitável (47 dígitos) ou o código de barras (44 dígitos)",
    suggestion: BARCODE_EXAMPLES.BOLETO,
  };
};

/**
 * Boleto de arrecadação / tributos: código de barras (44 dígitos, começando com
 * 8) ou linha digitável (48 dígitos), convertida para os 44 dígitos.
 */
export const validateBoletoArrecadacao = (value) => {
  const d = onlyDigits(value);
  if (d.length === 44) {
    if (d[0] !== "8") {
      return {
        valid: false,
        message: "Boleto de arrecadação: o código de barras deve começar com 8",
        suggestion: BARCODE_EXAMPLES.BOLETO_ARRECADACAO,
      };
    }
    return { valid: true };
  }
  if (d.length === 48) {
    return { valid: true, normalized: arrecadacaoLinhaToBarcode(d) };
  }
  return {
    valid: false,
    message:
      "Arrecadação: informe a linha digitável (48 dígitos) ou o código de barras (44 dígitos)",
    suggestion: BARCODE_EXAMPLES.BOLETO_ARRECADACAO,
  };
};

/**
 * NF-e / DANFE: extrai a chave de acesso de 44 dígitos (de uma chave pura, de
 * uma URL da SEFAZ ou de um texto) e a codifica em Code-128C.
 */
export const validateNFe = (value) => {
  const key = extractAccessKey(value) || onlyDigits(value);
  if (key.length !== 44) {
    return {
      valid: false,
      message: "NF-e / DANFE: a chave de acesso deve ter 44 dígitos",
      suggestion: BARCODE_EXAMPLES.NFE,
    };
  }
  return { valid: true, normalized: key };
};

/**
 * GS1-128: at least 2 characters.
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
 * Validator map keyed by format id.
 */
export const BARCODE_VALIDATORS = {
  CODE39: validateCODE39,
  CODE93: validateCODE39, // CODE93 shares CODE39's character rules
  CODE128: validateCODE128,
  CODE128A: validateCODE128A,
  CODE128B: validateCODE128,
  CODE128C: validateCODE128C,
  GS1_128: validateGS1_128,
  ITF: validateITF,
  ITF14: validateITF14,
  EAN13: validateEAN13,
  EAN8: validateEAN8,
  EAN5: validateEAN5,
  EAN2: validateEAN2,
  ISBN: validateISBN,
  UPCA: validateUPCA,
  UPCE: validateUPCE,
  MSI: validateMSI,
  MSI10: validateMSI,
  MSI11: validateMSI,
  MSI1010: validateMSI,
  MSI1110: validateMSI,
  PHARMACODE: validatePharmacode,
  CODABAR: validateCodabar,
  BOLETO: validateBoleto,
  BOLETO_ARRECADACAO: validateBoletoArrecadacao,
  NFE: validateNFe,
};

/**
 * Validates a value for a given format id.
 */
export const validateBarcodeValue = (formatId, value) => {
  if (!value || value.trim().length === 0) {
    return {
      valid: false,
      message: "Digite um valor para gerar o código de barras",
      suggestion: "",
    };
  }

  const validator = BARCODE_VALIDATORS[formatId];
  if (validator) {
    return validator(value);
  }

  // Unknown format — accept as-is.
  return { valid: true };
};

/**
 * Returns a valid example value for a given format id.
 */
export const getBarcodeExample = (formatId) =>
  BARCODE_EXAMPLES[formatId] || "123456789";
