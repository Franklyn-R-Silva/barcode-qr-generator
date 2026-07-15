// src/utils/nfeParser.js
//
// Utilitários para reconhecer e interpretar a chave de acesso de documentos
// fiscais eletrônicos brasileiros (NF-e / NFC-e / CT-e / MDF-e).
//
// A chave de acesso possui 44 dígitos com a seguinte estrutura:
//   cUF(2) AAMM(4) CNPJ(14) modelo(2) série(3) número(9) tpEmis(1) cNF(8) DV(1)
//
// Em QR Codes de NFC-e a chave aparece dentro da URL da SEFAZ (parâmetro `p`
// ou `chNFe`); no código de barras do DANFE ela aparece isolada.

/** Códigos de UF (IBGE) para siglas dos estados. */
const UF_CODES = {
  11: "RO", 12: "AC", 13: "AM", 14: "RR", 15: "PA", 16: "AP", 17: "TO",
  21: "MA", 22: "PI", 23: "CE", 24: "RN", 25: "PB", 26: "PE", 27: "AL",
  28: "SE", 29: "BA", 31: "MG", 32: "ES", 33: "RJ", 35: "SP", 41: "PR",
  42: "SC", 43: "RS", 50: "MS", 51: "MT", 52: "GO", 53: "DF",
};

/** Modelos de documento fiscal. */
const MODELOS = {
  55: "NF-e (Nota Fiscal Eletrônica)",
  65: "NFC-e (Nota Fiscal de Consumidor Eletrônica)",
  57: "CT-e (Conhecimento de Transporte Eletrônico)",
  58: "MDF-e (Manifesto de Documentos Fiscais)",
};

/** Formas de emissão (tpEmis). */
const TIPOS_EMISSAO = {
  1: "Normal",
  2: "Contingência FS-IA",
  3: "Contingência SCAN",
  4: "Contingência DPEC",
  5: "Contingência FS-DA",
  6: "Contingência SVC-AN",
  7: "Contingência SVC-RS",
  9: "Contingência offline (NFC-e)",
};

/**
 * Extrai uma chave de acesso de 44 dígitos a partir de qualquer texto
 * escaneado (URL de NFC-e, código de barras do DANFE ou a chave pura).
 * @returns {string|null} os 44 dígitos, ou null se não encontrada.
 */
export function extractAccessKey(text) {
  if (!text) return null;

  // 1) Parâmetro explícito chNFe=... (algumas URLs usam este formato).
  const chMatch = String(text).match(/chNFe=?(\d{44})/i);
  if (chMatch) return chMatch[1];

  // 2) Primeira sequência de exatamente 44 dígitos consecutivos.
  //    (?<!\d) e (?!\d) evitam capturar parte de um número maior.
  const seqMatch = String(text).match(/(?<!\d)(\d{44})(?!\d)/);
  if (seqMatch) return seqMatch[1];

  // 3) Fallback: remove tudo que não é dígito; se sobrarem 44, é a chave.
  const digitsOnly = String(text).replace(/\D/g, "");
  if (digitsOnly.length === 44) return digitsOnly;

  return null;
}

/** Formata CNPJ (14 dígitos) como 00.000.000/0000-00. */
function formatCNPJ(cnpj) {
  return cnpj.replace(
    /^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,
    "$1.$2.$3/$4-$5"
  );
}

/** Formata a chave em 11 blocos de 4 dígitos para leitura. */
export function formatAccessKey(key) {
  return key.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
}

/**
 * Valida o dígito verificador (posição 44) via módulo 11.
 * @returns {boolean}
 */
export function isAccessKeyValid(key) {
  if (!/^\d{44}$/.test(key)) return false;
  const base = key.slice(0, 43);
  const dv = Number(key[43]);

  let weight = 2;
  let sum = 0;
  for (let i = base.length - 1; i >= 0; i--) {
    sum += Number(base[i]) * weight;
    weight = weight === 9 ? 2 : weight + 1;
  }
  const rest = sum % 11;
  const expected = rest === 0 || rest === 1 ? 0 : 11 - rest;
  return expected === dv;
}

/**
 * Interpreta a chave de acesso, decompondo seus campos.
 * @param {string} text texto escaneado (URL, código de barras ou chave)
 * @returns {object|null} campos estruturados, ou null se não for um documento fiscal
 */
export function parseNFe(text) {
  const key = extractAccessKey(text);
  if (!key) return null;

  const cUF = key.slice(0, 2);
  const aamm = key.slice(2, 6);
  const cnpj = key.slice(6, 20);
  const modelo = key.slice(20, 22);
  const serie = key.slice(22, 25);
  const numero = key.slice(25, 34);
  const tpEmis = key.slice(34, 35);
  const ano = `20${aamm.slice(0, 2)}`;
  const mes = aamm.slice(2, 4);

  return {
    key,
    keyFormatted: formatAccessKey(key),
    valid: isAccessKeyValid(key),
    uf: UF_CODES[Number(cUF)] || `UF ${cUF}`,
    emission: `${mes}/${ano}`,
    cnpj: formatCNPJ(cnpj),
    modelo: MODELOS[Number(modelo)] || `Modelo ${modelo}`,
    modeloCode: modelo,
    serie: String(Number(serie)),
    numero: String(Number(numero)),
    tipoEmissao: TIPOS_EMISSAO[Number(tpEmis)] || `Tipo ${tpEmis}`,
  };
}

/** True quando o texto contém uma URL (usada para "abrir" o conteúdo). */
export function isUrl(text) {
  return /^https?:\/\/\S+$/i.test(String(text).trim());
}

/**
 * Portal nacional de consulta pública da NF-e / NFC-e.
 * O usuário informa a chave manualmente (com captcha) no portal.
 */
export const NFE_CONSULTA_URL =
  "https://www.nfe.fazenda.gov.br/portal/consultaRecaptcha.aspx?tipoConsulta=resumo&tipoConteudo=XbSeqxE8pl8=";
