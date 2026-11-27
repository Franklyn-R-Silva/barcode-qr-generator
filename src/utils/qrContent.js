import { pixPayload } from "./pix";

/**
 * QR content types: each one is a small form whose fields are encoded into
 * the text the QR Code carries. "text" is the free-form fallback.
 */
export const CONTENT_TYPES = [
  { id: "link", label: "Link", fields: [{ name: "url", label: "Endereço do site", type: "url", placeholder: "https://seusite.com.br" }] },
  { id: "text", label: "Texto", fields: [] },
  {
    id: "pix",
    label: "Pix",
    fields: [
      { name: "keyType", label: "Tipo de chave", type: "select", options: [["cpf", "CPF ou CNPJ"], ["phone", "Celular"], ["email", "E-mail"], ["random", "Chave aleatória"]] },
      { name: "key", label: "Chave Pix", type: "text", placeholder: "Sua chave" },
      { name: "name", label: "Nome de quem recebe", type: "text", maxLength: 25, placeholder: "Como no banco" },
      { name: "city", label: "Cidade", type: "text", maxLength: 15, placeholder: "Ex.: São Paulo" },
      { name: "amount", label: "Valor (opcional)", type: "decimal", placeholder: "0,00" },
      { name: "description", label: "Descrição (opcional)", type: "text", maxLength: 40 },
    ],
  },
  {
    id: "whatsapp",
    label: "WhatsApp",
    fields: [
      { name: "phone", label: "Número com DDD", type: "tel", placeholder: "(11) 91234-5678" },
      { name: "message", label: "Mensagem pronta (opcional)", type: "textarea" },
    ],
  },
  {
    id: "wifi",
    label: "Wi-Fi",
    fields: [
      { name: "ssid", label: "Nome da rede", type: "text" },
      { name: "password", label: "Senha", type: "text" },
      { name: "encryption", label: "Segurança", type: "select", options: [["WPA", "WPA/WPA2/WPA3"], ["WEP", "WEP"], ["nopass", "Sem senha"]] },
      { name: "hidden", label: "Rede oculta", type: "checkbox" },
    ],
  },
  {
    id: "email",
    label: "E-mail",
    fields: [
      { name: "to", label: "Para", type: "email", placeholder: "nome@exemplo.com" },
      { name: "subject", label: "Assunto (opcional)", type: "text" },
      { name: "body", label: "Mensagem (opcional)", type: "textarea" },
    ],
  },
  { id: "phone", label: "Telefone", fields: [{ name: "phone", label: "Número", type: "tel", placeholder: "(11) 3123-4567" }] },
  {
    id: "sms",
    label: "SMS",
    fields: [
      { name: "phone", label: "Número", type: "tel", placeholder: "(11) 91234-5678" },
      { name: "message", label: "Mensagem (opcional)", type: "textarea" },
    ],
  },
  {
    id: "vcard",
    label: "Contato",
    fields: [
      { name: "firstName", label: "Nome", type: "text" },
      { name: "lastName", label: "Sobrenome", type: "text" },
      { name: "phone", label: "Telefone", type: "tel" },
      { name: "email", label: "E-mail", type: "email" },
      { name: "org", label: "Empresa (opcional)", type: "text" },
      { name: "url", label: "Site (opcional)", type: "url" },
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
 * Text for the QR Code of a content type, plus a pt-BR error when the
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
