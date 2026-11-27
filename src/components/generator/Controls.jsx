import React, { useId } from "react";
import {
  AiOutlineCopy,
  AiOutlineWhatsApp,
  AiOutlineShareAlt,
  AiOutlineUpload,
  AiOutlineDelete,
  AiOutlineWarning,
  AiOutlineLink,
  AiOutlineFileText,
  AiOutlineDollarCircle,
  AiOutlineWifi,
  AiOutlineMail,
  AiOutlinePhone,
  AiOutlineMessage,
  AiOutlineIdcard,
} from "react-icons/ai";
import { GENERATOR_TYPES } from "../../constants/generatorTypes";
import {
  BARCODE_CATEGORIES,
  BARCODE_EXAMPLES,
} from "../../constants/barcodeTypes";
import { scanWarning } from "../../utils/contrast";
import { CONTENT_TYPES, DEFAULT_FIELDS, encodeContent } from "../../utils/qrContent";
import Segmented from "../common/Segmented";
import ColorPickerAdvanced from "./ColorPickerAdvanced";
import "./Controls.css";

const TEMPLATES = [
  { name: "Padrão", fg: "#000000", bg: "#ffffff", style: "squares", eye: "square" },
  { name: "WhatsApp", fg: "#128C7E", bg: "#E5FFFC", style: "dots", eye: "circle" },
  { name: "Dark", fg: "#E0E0E0", bg: "#1E1E1E", style: "squares", eye: "square" },
  { name: "Azul Tech", fg: "#2563EB", bg: "#EFF6FF", style: "dots", eye: "square" },
];

// Cores escuras para o código e claras para o fundo: as combinações que leem bem.
const FG_PRESETS = ["#000000", "#1f2937", "#1d4ed8", "#047857", "#b91c1c", "#6d28d9", "#9a3412", "#0f766e"];
const BG_PRESETS = ["#ffffff", "#f9fafb", "#eff6ff", "#ecfdf5", "#fef2f2", "#f5f3ff", "#fff7ed", "#f0fdfa"];

const RangeField = ({ label, value, unit, min, max, step, onChange }) => {
  const id = useId();
  return (
  <div className="range-field">
    <div className="range-head">
      <label className="field-label" htmlFor={id}>{label}</label>
      <span className="range-value">
        {value}
        {unit}
      </span>
    </div>
    <input
      id={id}
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
    />
  </div>
  );
};

const TYPE_ICONS = {
  link: <AiOutlineLink aria-hidden="true" />,
  text: <AiOutlineFileText aria-hidden="true" />,
  pix: <AiOutlineDollarCircle aria-hidden="true" />,
  whatsapp: <AiOutlineWhatsApp aria-hidden="true" />,
  wifi: <AiOutlineWifi aria-hidden="true" />,
  email: <AiOutlineMail aria-hidden="true" />,
  phone: <AiOutlinePhone aria-hidden="true" />,
  sms: <AiOutlineMessage aria-hidden="true" />,
  vcard: <AiOutlineIdcard aria-hidden="true" />,
};

const TYPE_OPTIONS = CONTENT_TYPES.map((t) => ({ value: t.id, label: t.label, icon: TYPE_ICONS[t.id] }));

/** One field of a content-type form, rendered from its spec in utils/qrContent. */
const FormField = ({ field, value, onChange }) => {
  const id = useId();
  if (field.type === "checkbox") {
    return (
      <label className="check">
        <input type="checkbox" checked={!!value} onChange={(e) => onChange(e.target.checked)} />
        {field.label}
      </label>
    );
  }
  const common = {
    id,
    value: value ?? "",
    onChange: (e) => onChange(e.target.value),
    placeholder: field.placeholder,
    maxLength: field.maxLength,
  };
  return (
    <div className={field.type === "textarea" ? "form-wide" : undefined}>
      <label className="field-label" htmlFor={id}>
        {field.label}
      </label>
      {field.type === "select" ? (
        <select className="select" {...common}>
          {field.options.map(([v, label]) => (
            <option key={v} value={v}>
              {label}
            </option>
          ))}
        </select>
      ) : field.type === "textarea" ? (
        <textarea className="input" rows={2} {...common} />
      ) : (
        <input
          className="input"
          type={field.type === "decimal" ? "text" : field.type}
          inputMode={field.type === "decimal" ? "decimal" : undefined}
          autoComplete="off"
          spellCheck={false}
          {...common}
        />
      )}
    </div>
  );
};

/**
 * O que vai no código: tipo de conteúdo e formulário (QR) ou formato e valor
 * (código de barras). Fica separado dos ajustes para vir antes da prévia no celular.
 */
export const ContentInput = ({ config, updateConfig, socialLinks, handleCopyText }) => {
  const isQRCode = config.generatorType === GENERATOR_TYPES.QRCODE;
  const type = isQRCode ? config.contentType || "text" : "text";
  const spec = CONTENT_TYPES.find((t) => t.id === type);
  const fields = { ...DEFAULT_FIELDS, ...config.fields };
  const { error } = type === "text" ? {} : encodeContent(type, fields);

  const setField = (name, value) => {
    const next = { ...config.fields, [name]: value };
    updateConfig("fields", next);
    updateConfig("text", encodeContent(type, next).text);
  };

  const setType = (next) => {
    updateConfig("contentType", next);
    if (next !== "text") updateConfig("text", encodeContent(next, config.fields).text);
  };

  // Preenche com o exemplo do formato escolhido.
  const handleFormatChange = (format) => {
    if (!format) return;
    updateConfig("barcodeFormat", format);
    if (BARCODE_EXAMPLES[format]) updateConfig("text", BARCODE_EXAMPLES[format]);
  };

  const visibleFields = (spec?.fields || []).filter(
    (f) => !(f.name === "password" && fields.encryption === "nopass")
  );

  return (
    <section className="panel content-area" aria-label="Conteúdo do código">
      {!isQRCode && (
        <div className="panel-section">
          <label className="field-label" htmlFor="barcode-format">
            Formato
          </label>
          <select
            id="barcode-format"
            className="select"
            value={config.barcodeFormat}
            onChange={(e) => handleFormatChange(e.target.value)}
          >
            {BARCODE_CATEGORIES.map((category) => (
              <optgroup key={category.name} label={category.name}>
                {category.formats.map((format) => (
                  <option key={format.id} value={format.id}>
                    {format.label}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>
      )}

      <div className="panel-section">
        {isQRCode && (
          <div className="type-picker">
            <Segmented
              size="grid"
              legend="Tipo de conteúdo"
              hideLegend
              name="content-type"
              value={type}
              onChange={setType}
              options={TYPE_OPTIONS}
            />
          </div>
        )}
        {type === "text" ? (
          <>
            <label className="field-label" htmlFor="code-text">
              {isQRCode ? "Texto" : "Valor do código"}
            </label>
            <textarea
              id="code-text"
              className="input"
              rows={3}
              spellCheck={false}
              placeholder={isQRCode ? "Qualquer texto, até cerca de 2.900 caracteres" : "Digite os números ou o texto do código"}
              value={config.text}
              onChange={(e) => updateConfig("text", e.target.value)}
            />
            <p className={`field-hint ${isQRCode ? "live-hint" : ""}`}>
              {isQRCode
                ? "O QR Code muda enquanto você digita."
                : `Exemplo válido: ${BARCODE_EXAMPLES[config.barcodeFormat] ?? "—"}`}
            </p>
          </>
        ) : (
          <div className="content-form">
            {visibleFields.map((f) => (
              <FormField key={f.name} field={f} value={fields[f.name]} onChange={(v) => setField(f.name, v)} />
            ))}
          </div>
        )}

        {error && (
          <p className="alert alert-warning controls-alert" role="status">
            <AiOutlineWarning aria-hidden="true" />
            <span>{error}</span>
          </p>
        )}
        {type === "pix" && !error && config.text && (
          <p className="field-hint">Antes de divulgar, faça um teste: leia o QR no app do seu banco e confira nome e valor.</p>
        )}

        <div className="share-row">
          <button type="button" onClick={handleCopyText} className="btn btn-link">
            <AiOutlineCopy aria-hidden="true" /> {type === "pix" ? "Copiar Pix copia e cola" : "Copiar texto"}
          </button>
          {isQRCode && (type === "link" || type === "text") && (
            <>
              <a href={socialLinks.whatsapp} target="_blank" rel="noreferrer" className="btn btn-link" aria-label="Enviar no WhatsApp">
                <AiOutlineWhatsApp aria-hidden="true" /> WhatsApp
              </a>
              <a href={socialLinks.facebook} target="_blank" rel="noreferrer" className="btn btn-link" aria-label="Compartilhar no Facebook">
                <AiOutlineShareAlt aria-hidden="true" /> Facebook
              </a>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

/** Ajustes de aparência do QR Code ou do código de barras. */
const Controls = ({ config, updateConfig, handleLogoUpload }) => {
  const isQRCode = config.generatorType === GENERATOR_TYPES.QRCODE;
  const warning = scanWarning(config.fgColor, config.bgColor);

  const applyTemplate = (t) => {
    updateConfig("fgColor", t.fg);
    updateConfig("bgColor", t.bg);
    updateConfig("qrStyle", t.style);
    updateConfig("eyeStyle", t.eye);
  };

  const isTemplateOn = (t) =>
    config.fgColor.toLowerCase() === t.fg.toLowerCase() &&
    config.bgColor.toLowerCase() === t.bg.toLowerCase() &&
    config.qrStyle === t.style &&
    config.eyeStyle === t.eye;

  const colors = (
    <div className="panel-section">
      <h2 className="section-title">Cores</h2>
      <div className="two-col">
        <ColorPickerAdvanced
          label={isQRCode ? "Cor do código" : "Cor das barras"}
          color={config.fgColor}
          presets={FG_PRESETS}
          onChange={(color) => updateConfig("fgColor", color)}
        />
        <ColorPickerAdvanced
          label="Cor do fundo"
          color={config.bgColor}
          presets={BG_PRESETS}
          onChange={(color) => updateConfig("bgColor", color)}
        />
      </div>
      {warning && (
        <p className="alert alert-warning controls-alert" role="status">
          <AiOutlineWarning aria-hidden="true" />
          <span>{warning}</span>
        </p>
      )}
    </div>
  );

  if (!isQRCode) {
    return (
      <section className="panel settings-area" aria-label="Aparência do código de barras">
        <div className="panel-section">
          <h2 className="section-title">Dimensões</h2>
          <div className="stack">
            <RangeField
              label="Altura"
              value={config.barcodeHeight || 100}
              unit=" px"
              min={50}
              max={200}
              step={10}
              onChange={(v) => updateConfig("barcodeHeight", v)}
            />
            <RangeField
              label="Largura da barra"
              value={config.barcodeWidth || 2}
              unit=" px"
              min={1}
              max={5}
              step={0.5}
              onChange={(v) => updateConfig("barcodeWidth", v)}
            />
            <RangeField
              label="Tamanho do texto"
              value={config.barcodeFontSize || 20}
              unit=" px"
              min={10}
              max={40}
              step={2}
              onChange={(v) => updateConfig("barcodeFontSize", v)}
            />
            <label className="check">
              <input
                type="checkbox"
                checked={config.barcodeDisplayValue !== false}
                onChange={(e) => updateConfig("barcodeDisplayValue", e.target.checked)}
              />
              Mostrar o valor embaixo das barras
            </label>
          </div>
        </div>
        {colors}
      </section>
    );
  }

  return (
    <section className="panel settings-area" aria-label="Aparência do QR Code">
      <div className="panel-section">
        <h2 className="section-title">Modelos prontos</h2>
        <div className="templates">
          {TEMPLATES.map((t) => (
            <button
              key={t.name}
              type="button"
              className="template-btn"
              aria-pressed={isTemplateOn(t)}
              onClick={() => applyTemplate(t)}
            >
              <span className="template-swatch" style={{ background: t.bg, color: t.fg }} aria-hidden="true">
                <svg viewBox="0 0 12 12">
                  <path
                    d="M1 1h4v4H1zM7 1h4v4H7zM1 7h4v4H1zM7 7h2v2H7zM9 9h2v2H9z"
                    fill="currentColor"
                  />
                </svg>
              </span>
              <span>{t.name}</span>
            </button>
          ))}
        </div>
      </div>

      {colors}

      <div className="panel-section">
        <h2 className="section-title">Moldura</h2>
        <Segmented
          legend="Moldura com texto"
          hideLegend
          name="frame"
          value={config.frame ? "on" : "off"}
          onChange={(v) => updateConfig("frame", v === "on")}
          options={[
            { value: "off", label: "Sem moldura" },
            { value: "on", label: "Com texto" },
          ]}
        />
        {config.frame && (
          <div className="stack-top">
            <label className="field-label" htmlFor="frame-text">
              Texto da moldura
            </label>
            <input
              id="frame-text"
              className="input"
              maxLength={24}
              value={config.frameText || ""}
              onChange={(e) => updateConfig("frameText", e.target.value)}
            />
            <p className="field-hint">Até 24 caracteres. Ex.: Escaneie-me, Cardápio, Pague com Pix.</p>
          </div>
        )}
      </div>

      <div className="panel-section">
        <h2 className="section-title">Estilo</h2>
        <div className="two-col">
          <Segmented
            legend="Módulos"
            name="qr-style"
            value={config.qrStyle}
            onChange={(v) => updateConfig("qrStyle", v)}
            options={[
              { value: "squares", label: "Quadrados" },
              { value: "dots", label: "Pontos" },
            ]}
          />
          <Segmented
            legend="Cantos (olhos)"
            name="eye-style"
            value={config.eyeStyle}
            onChange={(v) => updateConfig("eyeStyle", v)}
            options={[
              { value: "square", label: "Retos" },
              { value: "circle", label: "Redondos" },
            ]}
          />
        </div>
        <div className="stack stack-top">
          <Segmented
            legend="Correção de erro"
            name="ec-level"
            value={config.ecLevel}
            onChange={(v) => updateConfig("ecLevel", v)}
            options={[
              { value: "L", label: "L", hint: "7%" },
              { value: "M", label: "M", hint: "15%" },
              { value: "Q", label: "Q", hint: "25%" },
              { value: "H", label: "H", hint: "30%" },
            ]}
          />
          <p className="field-hint">
            Quanto maior, mais o código aguenta sujeira, dobras ou uma logo no
            meio. Use H com logo; L deixa textos longos menos densos.
          </p>
          <RangeField
            label="Tamanho"
            value={config.size}
            unit=" px"
            min={150}
            max={450}
            step={10}
            onChange={(v) => updateConfig("size", v)}
          />
        </div>
      </div>

      <div className="panel-section">
        <h2 className="section-title">Logo no centro</h2>
        <div className="logo-row">
          <label className="btn btn-secondary file-btn">
            <AiOutlineUpload aria-hidden="true" />
            {config.logoImage ? "Trocar imagem" : "Escolher imagem"}
            <input type="file" accept="image/*" className="visually-hidden" onChange={handleLogoUpload} />
          </label>
          {config.logoImage && (
            <>
              <img className="logo-thumb" src={config.logoImage} alt="Logo atual" />
              <button
                type="button"
                className="icon-btn danger"
                aria-label="Remover logo"
                title="Remover logo"
                onClick={() => updateConfig("logoImage", "")}
              >
                <AiOutlineDelete aria-hidden="true" />
              </button>
            </>
          )}
        </div>
        {!config.logoImage && (
          <p className="field-hint">PNG, JPG ou SVG. A imagem fica só no seu aparelho.</p>
        )}

        {config.logoImage && (
          <div className="stack stack-top">
            <Segmented
              legend="Tamanho da logo"
              name="logo-size-mode"
              value={config.logoSizeMode || "auto"}
              onChange={(v) => updateConfig("logoSizeMode", v)}
              options={[
                { value: "auto", label: "Automático" },
                { value: "original", label: "Grande" },
                { value: "custom", label: "Ajustar" },
              ]}
            />
            {config.logoSizeMode === "custom" && (
              <RangeField
                label="Tamanho em relação ao código"
                value={config.logoSize || 25}
                unit="%"
                min={10}
                max={50}
                step={1}
                onChange={(v) => updateConfig("logoSize", v)}
              />
            )}
            <RangeField
              label="Opacidade"
              value={Math.round(config.logoOpacity * 100)}
              unit="%"
              min={0}
              max={100}
              step={10}
              onChange={(v) => updateConfig("logoOpacity", v / 100)}
            />
            <label className="check">
              <input
                type="checkbox"
                checked={config.removeQrCodeBehindLogo}
                onChange={(e) => updateConfig("removeQrCodeBehindLogo", e.target.checked)}
              />
              Limpar os módulos atrás da logo
            </label>
            {config.ecLevel !== "H" && (
              <p className="alert alert-warning" role="status">
                <AiOutlineWarning aria-hidden="true" />
                <span>
                  Com logo, use a correção de erro <strong>H</strong> para o
                  código continuar legível.
                </span>
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default Controls;
