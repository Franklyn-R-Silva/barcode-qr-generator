// Static Pix QR Code ("BR Code", EMV MPM) as specified in the Banco Central
// "Manual de Padrões para Iniciação do Pix".

const field = (id, value) => `${id}${String(value.length).padStart(2, "0")}${value}`;

// Payload fields must be plain ASCII: drop accents and anything non-printable.
const ascii = (s) =>
  String(s || "")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^\x20-\x7e]/g, "")
    .trim();

/** CRC-16/CCITT-FALSE (poly 0x1021, init 0xFFFF), as the BR Code requires. */
export const crc16 = (s) => {
  let crc = 0xffff;
  for (let i = 0; i < s.length; i++) {
    crc ^= s.charCodeAt(i) << 8;
    for (let b = 0; b < 8; b++) crc = crc & 0x8000 ? ((crc << 1) ^ 0x1021) & 0xffff : (crc << 1) & 0xffff;
  }
  return crc.toString(16).toUpperCase().padStart(4, "0");
};

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;
const EMAIL = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

/** Normalised Pix key, or throws an Error with an English message (translated by the UI). */
export const normalizePixKey = (keyType, raw) => {
  const key = String(raw || "").trim();
  const digits = key.replace(/\D/g, "");
  switch (keyType) {
    case "cpf":
      if (digits.length !== 11 && digits.length !== 14) throw new Error("A CPF has 11 digits and a CNPJ has 14.");
      return digits;
    case "phone":
      if (digits.length === 10 || digits.length === 11) return `+55${digits}`;
      if (/^55\d{10,11}$/.test(digits)) return `+${digits}`;
      throw new Error("Mobile: enter area code + number, for example (11) 91234-5678.");
    case "email":
      if (!EMAIL.test(key) || key.length > 77) throw new Error("Invalid email.");
      return key.toLowerCase();
    case "random":
      if (!UUID.test(key.toLowerCase())) throw new Error("Invalid random key: it is 32 letters and numbers with hyphens.");
      return key.toLowerCase();
    default:
      throw new Error("Choose the Pix key type.");
  }
};

/** Parses "1.234,56", "1234.56" or "10" into "1234.56"; "" when empty. Throws on bad input. */
export const pixAmount = (raw) => {
  const s = String(raw || "").trim().replace(/\s|R\$/g, "");
  if (!s) return "";
  const normalised = s.includes(",") ? s.replace(/\./g, "").replace(",", ".") : s;
  const value = Number(normalised);
  if (!Number.isFinite(value) || value <= 0) throw new Error("Invalid amount.");
  const fixed = value.toFixed(2);
  if (fixed.length > 13) throw new Error("Amount too high.");
  return fixed;
};

/**
 * Builds the "Pix copia e cola" payload for a static QR Code.
 * Throws an Error with an English message when a field is invalid.
 */
export const pixPayload = ({ keyType, key, name, city, amount, description, txid }) => {
  const pixKey = normalizePixKey(keyType, key);
  const merchant = ascii(name).slice(0, 25);
  const place = ascii(city).slice(0, 15);
  if (!merchant) throw new Error("Enter the name of the recipient.");
  if (!place) throw new Error("Enter the city of the recipient.");

  const gui = field("00", "br.gov.bcb.pix") + field("01", pixKey);
  // Merchant Account Information is capped at 99 characters in total.
  const room = 99 - gui.length - 4;
  const info = ascii(description).slice(0, Math.max(0, room));
  const account = gui + (info ? field("02", info) : "");
  const value = pixAmount(amount);
  const ref = ascii(txid).replace(/[^A-Za-z0-9]/g, "").slice(0, 25) || "***";

  const payload =
    field("00", "01") +
    field("26", account) +
    field("52", "0000") +
    field("53", "986") +
    (value ? field("54", value) : "") +
    field("58", "BR") +
    field("59", merchant) +
    field("60", place) +
    field("62", field("05", ref)) +
    "6304";
  return payload + crc16(payload);
};
