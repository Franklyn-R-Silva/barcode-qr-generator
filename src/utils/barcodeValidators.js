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
 * Messages are English; the UI translates them where they are shown.
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
      message: "UPC-A must have exactly 12 digits",
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
      message: "UPC-E must have between 6 and 8 digits",
      suggestion: "01234565",
    };
  }
  const normalized = expandUPCEtoUPCA(cleaned);
  if (!normalized) {
    return {
      valid: false,
      message: "Could not convert the UPC-E",
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
      message: "EAN-13 must have exactly 13 digits",
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
      message: "EAN-8 must have exactly 8 digits",
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
      message: "EAN-5 must have exactly 5 digits",
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
      message: "EAN-2 must have exactly 2 digits",
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
      message: "ISBN must have 10 or 13 digits",
      suggestion: "9781234567897",
    };
  }
  // JsBarcode renders ISBN through EAN-13, which requires 13 numeric digits.
  if (cleaned.length !== 13) {
    return {
      valid: false,
      message: "Use the ISBN-13 (13 digits) to generate the barcode",
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
      message: "ITF must have at least 2 digits",
      suggestion: "1234567890",
    };
  }
  if (cleaned.length % 2 !== 0) {
    return {
      valid: false,
      message: "ITF must have an even number of digits",
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
      message: "ITF-14 must have exactly 14 digits",
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
      message: "CODE39 only accepts numbers, uppercase letters and -. $/+%",
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
      message: "Type a value for the code",
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
      message: "CODE128A only accepts uppercase letters, numbers and spaces",
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
      message: "CODE128C only accepts numbers (an even number of digits)",
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
      message: "MSI must contain numbers only",
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
      message: "Pharmacode must have between 1 and 6 digits",
      suggestion: "1234",
    };
  }
  const num = parseInt(cleaned, 10);
  if (num < 3 || num > 131070) {
    return {
      valid: false,
      message: "Pharmacode must be between 3 and 131070",
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
      message: "Codabar must start and end with A, B, C or D",
      suggestion: "A1234567890B",
    };
  }
  return { valid: true };
};

/**
 * Converts the typeable line of a bank boleto (47 digits) into the 44-digit
 * barcode that is actually encoded (ITF).
 */
function bankLineToBarcode(l) {
  const bank = l.slice(0, 3);
  const currency = l.slice(3, 4);
  const freeFieldA = l.slice(4, 9); // 5
  const freeFieldB = l.slice(10, 20); // 10
  const freeFieldC = l.slice(21, 31); // 10
  const checkDigit = l.slice(32, 33);
  const dueFactorAmount = l.slice(33, 47); // due factor(4) + amount(10)
  return bank + currency + checkDigit + dueFactorAmount + freeFieldA + freeFieldB + freeFieldC;
}

/**
 * Converts the typeable line of a collection boleto (48 digits, 4 blocks of
 * 11 digits + check digit) into the 44-digit barcode.
 */
function collectionLineToBarcode(l) {
  return l.slice(0, 11) + l.slice(12, 23) + l.slice(24, 35) + l.slice(36, 47);
}

/**
 * Bank boleto: accepts the barcode (44 digits) or the typeable line
 * (47 digits), converting the latter into the 44 encoded digits (ITF).
 */
export const validateBoleto = (value) => {
  const d = onlyDigits(value);
  if (d.length === 44) return { valid: true };
  if (d.length === 47) return { valid: true, normalized: bankLineToBarcode(d) };
  return {
    valid: false,
    message:
      "Bank boleto: enter the typeable line (47 digits) or the barcode (44 digits)",
    suggestion: BARCODE_EXAMPLES.BOLETO,
  };
};

/**
 * Collection / tax boleto: barcode (44 digits, starting with 8) or typeable
 * line (48 digits), converted into the 44 digits.
 */
export const validateCollectionBoleto = (value) => {
  const d = onlyDigits(value);
  if (d.length === 44) {
    if (d[0] !== "8") {
      return {
        valid: false,
        message: "Collection boleto: the barcode must start with 8",
        suggestion: BARCODE_EXAMPLES.BOLETO_ARRECADACAO,
      };
    }
    return { valid: true };
  }
  if (d.length === 48) {
    return { valid: true, normalized: collectionLineToBarcode(d) };
  }
  return {
    valid: false,
    message:
      "Collection: enter the typeable line (48 digits) or the barcode (44 digits)",
    suggestion: BARCODE_EXAMPLES.BOLETO_ARRECADACAO,
  };
};

/**
 * NF-e / DANFE: extracts the 44-digit access key (from a bare key, a SEFAZ
 * URL or any text) and encodes it as Code-128C.
 */
export const validateNFe = (value) => {
  const key = extractAccessKey(value) || onlyDigits(value);
  if (key.length !== 44) {
    return {
      valid: false,
      message: "NF-e / DANFE: the access key must have 44 digits",
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
      message: "GS1-128 must have at least 2 characters",
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
  BOLETO_ARRECADACAO: validateCollectionBoleto,
  NFE: validateNFe,
};

/**
 * Validates a value for a given format id.
 */
export const validateBarcodeValue = (formatId, value) => {
  if (!value || value.trim().length === 0) {
    return {
      valid: false,
      message: "Type a value to generate the barcode",
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
