import { pixPayload } from "./pix";

/**
 * QR content types: each one is a small form whose fields are encoded into
 * the text the QR Code carries. "text" is the free-form fallback.
 * Labels, placeholders and options are English; the UI translates them.
 */
export const CONTENT_TYPES = [
  { id: "link", label: "Link", fields: [{ name: "url", label: "Website address", type: "url", placeholder: "https://yoursite.com" }] },
  { id: "text", label: "Text", fields: [] },
  {
    id: "pix",
    label: "Pix",
    fields: [
      { name: "keyType", label: "Key type", type: "select", options: [["cpf", "CPF or CNPJ"], ["phone", "Mobile"], ["email", "Email"], ["random", "Random key"]] },
      { name: "key", label: "Pix key", type: "text", placeholder: "Your key" },
      { name: "name", label: "Recipient name", type: "text", maxLength: 25, placeholder: "As registered at the bank" },
      { name: "city", label: "City", type: "text", maxLength: 15, placeholder: "E.g. São Paulo" },
      { name: "amount", label: "Amount (optional)", type: "decimal", placeholder: "0.00" },
      { name: "description", label: "Description (optional)", type: "text", maxLength: 40 },
    ],
  },
  {
    id: "whatsapp",
    label: "WhatsApp",
    fields: [
      { name: "phone", label: "Number with area code", type: "tel", placeholder: "(11) 91234-5678" },
      { name: "message", label: "Ready-made message (optional)", type: "textarea" },
    ],
  },
  {
    id: "wifi",
    label: "Wi-Fi",
    fields: [
      { name: "ssid", label: "Network name", type: "text" },
      { name: "password", label: "Password", type: "text" },
      { name: "encryption", label: "Security", type: "select", options: [["WPA", "WPA/WPA2/WPA3"], ["WEP", "WEP"], ["nopass", "No password"]] },
      { name: "hidden", label: "Hidden network", type: "checkbox" },
    ],
  },
  {
    id: "email",
    label: "Email",
    fields: [
      { name: "to", label: "To", type: "email", placeholder: "name@example.com" },
      { name: "subject", label: "Subject (optional)", type: "text" },
      { name: "body", label: "Message (optional)", type: "textarea" },
    ],
  },
  { id: "phone", label: "Phone", fields: [{ name: "phone", label: "Number", type: "tel", placeholder: "(11) 3123-4567" }] },
  {
    id: "sms",
    label: "SMS",
    fields: [
      { name: "phone", label: "Number", type: "tel", placeholder: "(11) 91234-5678" },
      { name: "message", label: "Message (optional)", type: "textarea" },
    ],
  },
  {
    id: "vcard",
    label: "Contact",
    fields: [
      { name: "firstName", label: "First name", type: "text" },
      { name: "lastName", label: "Last name", type: "text" },
      { name: "phone", label: "Phone", type: "tel" },
      { name: "email", label: "Email", type: "email" },
      { name: "org", label: "Company (optional)", type: "text" },
      { name: "url", label: "Website (optional)", type: "url" },
    ],
  },
];

export const DEFAULT_FIELDS = { keyType: "cpf", encryption: "WPA" };

const digits = (s) => String(s || "").replace(/\D/g, "");
// Brazilian numbers typed as DDD + number get the country code.
const brPhone = (s) => {
  const d = digits(s);
  return d.length === 10 || d.length === 11 ? `55${d}` : d;
};
const wifiEsc = (s) => String(s || "").replace(/([\\;,:"])/g, "\\$1");
const vEsc = (s) => String(s || "").trim().replace(/([\\;,])/g, "\\$1");

/**
 * Text for the QR Code of a content type, plus an English error when the
 * fields cannot produce a valid code. Empty text means "not filled in yet".
 */
export const encodeContent = (type, f = {}) => {
  const v = { ...DEFAULT_FIELDS, ...f };
  switch (type) {
    case "link": {
      const url = String(v.url || "").trim();
      if (!url) return { text: "" };
      return { text: /^[a-z][a-z0-9+.-]*:/i.test(url) ? url : `https://${url}` };
    }
    case "pix": {
      if (!v.key && !v.name && !v.city) return { text: "" };
      try {
        return { text: pixPayload(v) };
      } catch (e) {
        return { text: "", error: e.message };
      }
    }
    case "whatsapp": {
      if (!digits(v.phone)) return { text: "" };
      const msg = String(v.message || "").trim();
      return { text: `https://wa.me/${brPhone(v.phone)}${msg ? `?text=${encodeURIComponent(msg)}` : ""}` };
    }
    case "wifi": {
      if (!String(v.ssid || "").trim()) return { text: "" };
      const open = v.encryption === "nopass";
      return {
        text: `WIFI:T:${open ? "nopass" : v.encryption};S:${wifiEsc(v.ssid)};${open ? "" : `P:${wifiEsc(v.password)};`}${v.hidden ? "H:true;" : ""};`,
      };
    }
    case "email": {
      const to = String(v.to || "").trim();
      if (!to) return { text: "" };
      const q = [["subject", v.subject], ["body", v.body]]
        .filter(([, x]) => String(x || "").trim())
        .map(([k, x]) => `${k}=${encodeURIComponent(String(x).trim())}`)
        .join("&");
      return { text: `mailto:${to}${q ? `?${q}` : ""}` };
    }
    case "phone":
      return digits(v.phone) ? { text: `tel:+${brPhone(v.phone)}` } : { text: "" };
    case "sms":
      return digits(v.phone) ? { text: `SMSTO:+${brPhone(v.phone)}:${String(v.message || "").trim()}` } : { text: "" };
    case "vcard": {
      const first = vEsc(v.firstName);
      const last = vEsc(v.lastName);
      if (!first && !last) return { text: "" };
      const lines = [
        "BEGIN:VCARD",
        "VERSION:3.0",
        `N:${last};${first};;;`,
        `FN:${[first, last].filter(Boolean).join(" ")}`,
        v.org && `ORG:${vEsc(v.org)}`,
        digits(v.phone) && `TEL;TYPE=CELL:+${brPhone(v.phone)}`,
        v.email && `EMAIL:${vEsc(v.email)}`,
        v.url && `URL:${vEsc(v.url)}`,
        "END:VCARD",
      ];
      return { text: lines.filter(Boolean).join("\n") };
    }
    default:
      return { text: "" };
  }
};
