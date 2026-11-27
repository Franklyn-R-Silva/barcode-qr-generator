import React, { useContext, useId } from "react";
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
  AiOutlineScan,
} from "react-icons/ai";
import { GENERATOR_TYPES } from "../../constants/generatorTypes";
import {
  BARCODE_CATEGORIES,
  BARCODE_EXAMPLES,
} from "../../constants/barcodeTypes";
import { scanWarning } from "../../utils/contrast";
import { logoCoverage, EXAMPLE_URL } from "../../utils/qrSvg";
import { readQrFile } from "../../utils/readQr";
import { CONTENT_TYPES, DEFAULT_FIELDS, encodeContent } from "../../utils/qrContent";
import Segmented from "../common/Segmented";
import ColorPickerAdvanced from "./ColorPickerAdvanced";
import { LangContext, useT } from "../../i18n";
import "./Controls.css";

const TEMPLATES = [
  { name: "Default", fg: "#000000", bg: "#ffffff", style: "squares", eye: "square" },
  { name: "WhatsApp", fg: "#128C7E", bg: "#E5FFFC", style: "dots", eye: "circle" },
  { name: "Dark", fg: "#E0E0E0", bg: "#1E1E1E", style: "squares", eye: "square" },
  { name: "Blue Tech", fg: "#2563EB", bg: "#EFF6FF", style: "dots", eye: "square" },
];

// Dark colours for the code and light ones for the background: the pairs that scan well.
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

const TYPE_OPTIONS = CONTENT_TYPES.map((c) => ({ value: c.id, label: c.label, icon: TYPE_ICONS[c.id] }));

/** One field of a content-type form, rendered from its spec in utils/qrContent. */
const FormField = ({ field, value, onChange }) => {
  const id = useId();
  const t = useT();
  if (field.type === "checkbox") {
    return (
      <label className="check">
        <input type="checkbox" checked={!!value} onChange={(e) => onChange(e.target.checked)} />
        {t(field.label)}
      </label>
    );
  }
  const common = {
    id,
    value: value ?? "",
    onChange: (e) => onChange(e.target.value),
    placeholder: field.placeholder && t(field.placeholder),
    maxLength: field.maxLength,
  };
  return (
    <div className={field.type === "textarea" ? "form-wide" : undefined}>
      <label className="field-label" htmlFor={id}>
        {t(field.label)}
      </label>
      {field.type === "select" ? (
        <select className="select" {...common}>
          {field.options.map(([v, label]) => (
            <option key={v} value={v}>
              {t(label)}
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
 * What goes in the code: content type and form (QR) or format and value
 * (barcode). Kept apart from the settings so it comes before the preview on phones.
 */
export const ContentInput = ({ config, updateConfig, socialLinks, handleCopyText, showToast }) => {
  const t = useT();
  const isQRCode = config.generatorType === GENERATOR_TYPES.QRCODE;
  const type = isQRCode ? config.contentType || "text" : "text";
  const spec = CONTENT_TYPES.find((c) => c.id === type);
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

  // Reads a QR from a photo or screenshot and brings the content in to edit and recreate.
  const importFromImage = async (e) => {
    const file = e.target.files[0];
    e.target.value = "";
    if (!file) return;
    try {
      const text = await readQrFile(file);
      updateConfig("contentType", "text");
      updateConfig("text", text);
      showToast?.(t("QR read: the content is in the Text field."));
    } catch {
      showToast?.(t("Error: no QR Code found in that image."));
    }
  };

  // Fills in the example of the chosen format.
  const handleFormatChange = (format) => {
    if (!format) return;
    updateConfig("barcodeFormat", format);
    if (BARCODE_EXAMPLES[format]) updateConfig("text", t(BARCODE_EXAMPLES[format]));
  };

  const visibleFields = (spec?.fields || []).filter(
    (f) => !(f.name === "password" && fields.encryption === "nopass")
  );

  return (
    <section className="panel content-area" aria-label={t("Code content")}>
      {!isQRCode && (
        <div className="panel-section">
          <label className="field-label" htmlFor="barcode-format">
            {t("Format")}
          </label>
          <select
            id="barcode-format"
            className="select"
            value={config.barcodeFormat}
            onChange={(e) => handleFormatChange(e.target.value)}
          >
            {BARCODE_CATEGORIES.map((category) => (
              <optgroup key={category.name} label={t(category.name)}>
                {category.formats.map((format) => (
                  <option key={format.id} value={format.id}>
                    {t(format.label)}
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
              legend={t("Content type")}
              hideLegend
              name="content-type"
              value={type}
              onChange={setType}
              options={TYPE_OPTIONS.map((o) => ({ ...o, label: t(o.label) }))}
            />
          </div>
        )}
        {type === "text" ? (
          <>
            <label className="field-label" htmlFor="code-text">
              {isQRCode ? t("Text") : t("Code value")}
            </label>
            <textarea
              id="code-text"
              className="input"
              rows={3}
              spellCheck={false}
              placeholder={isQRCode ? t("Any text, up to about 2,900 characters") : t("Type the numbers or the text of the code")}
              value={config.text}
              onChange={(e) => updateConfig("text", e.target.value)}
            />
            <p className={`field-hint ${isQRCode ? "live-hint" : ""}`}>
              {isQRCode
                ? t("The QR Code changes as you type.")
                : t("Valid example: {example}", { example: t(BARCODE_EXAMPLES[config.barcodeFormat] ?? "—") })}
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
            <span>{t(error)}</span>
          </p>
        )}
        {type === "pix" && !error && config.text && (
          <p className="field-hint">{t("Before sharing it, test it: scan the QR in your bank app and check the name and amount.")}</p>
        )}

        <div className="share-row">
          <button type="button" onClick={handleCopyText} className="btn btn-link">
            <AiOutlineCopy aria-hidden="true" /> {type === "pix" ? t("Copy Pix copy-and-paste code") : t("Copy text")}
          </button>
          {isQRCode && (
            <label className="btn btn-link import-btn" title={t("Reads a QR Code from a photo or screenshot and brings the content in to recreate it")}>
              <AiOutlineScan aria-hidden="true" /> {t("Import from image")}
              <input type="file" accept="image/*" className="visually-hidden" onChange={importFromImage} />
            </label>
          )}
          {isQRCode && (type === "link" || type === "text") && (
            <>
              <a href={socialLinks.whatsapp} target="_blank" rel="noreferrer" className="btn btn-link" aria-label={t("Send on WhatsApp")}>
                <AiOutlineWhatsApp aria-hidden="true" /> WhatsApp
              </a>
              <a href={socialLinks.facebook} target="_blank" rel="noreferrer" className="btn btn-link" aria-label={t("Share on Facebook")}>
                <AiOutlineShareAlt aria-hidden="true" /> Facebook
              </a>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

/** Appearance settings of the QR Code or the barcode. */
const Controls = ({ config, updateConfig, handleImageUpload }) => {
  const t = useT();
  const lang = useContext(LangContext);
  const isQRCode = config.generatorType === GENERATOR_TYPES.QRCODE;
  const warning =
    scanWarning(config.fgColor, config.bgColor) ||
    (isQRCode && config.gradientOn && scanWarning(config.fgColor2, config.bgColor)) ||
    (isQRCode && config.eyeColorOn && scanWarning(config.eyeColor, config.bgColor));

  const applyTemplate = (tpl) => {
    updateConfig("fgColor", tpl.fg);
    updateConfig("bgColor", tpl.bg);
    updateConfig("qrStyle", tpl.style);
    updateConfig("eyeStyle", tpl.eye);
  };

  const isTemplateOn = (tpl) =>
    config.fgColor.toLowerCase() === tpl.fg.toLowerCase() &&
    config.bgColor.toLowerCase() === tpl.bg.toLowerCase() &&
    config.qrStyle === tpl.style &&
    config.eyeStyle === tpl.eye;

  const colors = (
    <div className="panel-section">
      <h2 className="section-title">{t("Colors")}</h2>
      <div className="two-col">
        <ColorPickerAdvanced
          label={isQRCode ? t("Code color") : t("Bar color")}
          color={config.fgColor}
          presets={FG_PRESETS}
          onChange={(color) => updateConfig("fgColor", color)}
        />
        <ColorPickerAdvanced
          label={t("Background color")}
          color={config.bgColor}
          presets={BG_PRESETS}
          onChange={(color) => updateConfig("bgColor", color)}
        />
      </div>
      {isQRCode && (
        <div className="two-col stack-top">
          <div className="stack">
            <label className="check">
              <input type="checkbox" checked={!!config.gradientOn} onChange={(e) => updateConfig("gradientOn", e.target.checked)} />
              {t("Gradient on the code")}
            </label>
            {config.gradientOn && (
              <ColorPickerAdvanced
                label={t("Second color")}
                color={config.fgColor2}
                presets={FG_PRESETS}
                onChange={(color) => updateConfig("fgColor2", color)}
              />
            )}
          </div>
          <div className="stack">
            <label className="check">
              <input type="checkbox" checked={!!config.eyeColorOn} onChange={(e) => updateConfig("eyeColorOn", e.target.checked)} />
              {t("Different color for the eyes")}
            </label>
            {config.eyeColorOn && (
              <ColorPickerAdvanced
                label={t("Eye color")}
                color={config.eyeColor}
                presets={FG_PRESETS}
                onChange={(color) => updateConfig("eyeColor", color)}
              />
            )}
          </div>
        </div>
      )}
      {warning && (
        <p className="alert alert-warning controls-alert" role="status">
          <AiOutlineWarning aria-hidden="true" />
          <span>{t(warning.message, { ratio: lang === "pt" ? warning.ratio?.replace(".", ",") : warning.ratio })}</span>
        </p>
      )}
    </div>
  );

  if (!isQRCode) {
    return (
      <section className="panel settings-area" aria-label={t("Barcode appearance")}>
        <div className="panel-section">
          <h2 className="section-title">{t("Dimensions")}</h2>
          <div className="stack">
            <RangeField
              label={t("Height")}
              value={config.barcodeHeight || 100}
              unit=" px"
              min={50}
              max={200}
              step={10}
              onChange={(v) => updateConfig("barcodeHeight", v)}
            />
            <RangeField
              label={t("Bar width")}
              value={config.barcodeWidth || 2}
              unit=" px"
              min={1}
              max={5}
              step={0.5}
              onChange={(v) => updateConfig("barcodeWidth", v)}
            />
            <RangeField
              label={t("Text size")}
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
              {t("Show the value under the bars")}
            </label>
          </div>
        </div>
        {colors}
      </section>
    );
  }

  const imagePicker = (field, label) => (
    <div className="logo-row">
      <label className="btn btn-secondary file-btn">
        <AiOutlineUpload aria-hidden="true" />
        {config[field] ? t("Change image") : label}
        <input type="file" accept="image/*" className="visually-hidden" onChange={handleImageUpload(field)} />
      </label>
      {config[field] && (
        <>
          <img className="logo-thumb" src={config[field]} alt="" />
          <button
            type="button"
            className="icon-btn danger"
            aria-label={t("Remove image")}
            title={t("Remove image")}
            onClick={() => updateConfig(field, "")}
          >
            <AiOutlineDelete aria-hidden="true" />
          </button>
        </>
      )}
    </div>
  );

  return (
    <section className="panel settings-area" aria-label={t("QR Code appearance")}>
      <div className="panel-section">
        <h2 className="section-title">{t("Ready-made templates")}</h2>
        <div className="templates">
          {TEMPLATES.map((tpl) => (
            <button
              key={tpl.name}
              type="button"
              className="template-btn"
              aria-pressed={isTemplateOn(tpl)}
              onClick={() => applyTemplate(tpl)}
            >
              <span className="template-swatch" style={{ background: tpl.bg, color: tpl.fg }} aria-hidden="true">
                <svg viewBox="0 0 12 12">
                  <path d="M1 1h4v4H1zM7 1h4v4H7zM1 7h4v4H1zM7 7h2v2H7zM9 9h2v2H9z" fill="currentColor" />
                </svg>
              </span>
              <span>{t(tpl.name)}</span>
            </button>
          ))}
        </div>
      </div>

      {colors}

      <div className="panel-section">
        <h2 className="section-title">{t("Frame")}</h2>
        <Segmented
          legend={t("Frame shape")}
          hideLegend
          name="frame"
          value={config.frame ? config.frameStyle || "band" : "off"}
          onChange={(v) => {
            updateConfig("frame", v !== "off");
            if (v !== "off") updateConfig("frameStyle", v);
          }}
          options={[
            { value: "off", label: t("None") },
            { value: "band", label: t("Band") },
            { value: "arc", label: t("U shape") },
            { value: "circle", label: t("Circle") },
            { value: "square", label: t("Square") },
          ]}
        />
        {config.frame && (
          <div className="stack-top">
            <label className="field-label" htmlFor="frame-text">
              {t("Frame text")}
            </label>
            <input
              id="frame-text"
              className="input"
              maxLength={60}
              value={config.frameText || ""}
              onChange={(e) => updateConfig("frameText", e.target.value)}
            />
            <p className="field-hint">
              {config.frameStyle === "circle" || config.frameStyle === "square"
                ? t("The text repeats until it goes all the way round the code.")
                : t("Long texts wrap to two lines or shrink to fit.")}
            </p>
          </div>
        )}
      </div>

      <div className="panel-section">
        <h2 className="section-title">{t("Style")}</h2>
        <div className="stack">
          <Segmented
            legend={t("Modules")}
            name="qr-style"
            value={config.qrStyle}
            onChange={(v) => updateConfig("qrStyle", v)}
            options={[
              { value: "squares", label: t("Squares") },
              { value: "rounded", label: t("Rounded") },
              { value: "dots", label: t("Dots") },
            ]}
          />
          <Segmented
            legend={t("Corners (eyes)")}
            name="eye-style"
            value={config.eyeStyle}
            onChange={(v) => updateConfig("eyeStyle", v)}
            options={[
              { value: "square", label: t("Straight") },
              { value: "circle", label: t("Rounded") },
              { value: "dot", label: t("Circles") },
            ]}
          />
        </div>
        <div className="stack stack-top">
          <RangeField
            label={t("Module size")}
            value={Math.round((config.moduleScale ?? 1) * 100)}
            unit="%"
            min={40}
            max={100}
            step={5}
            onChange={(v) => updateConfig("moduleScale", v / 100)}
          />
          <Segmented
            legend={t("Error correction")}
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
            {t("The higher it is, the more dirt, folds, logo or photo the code withstands. Use H with a logo or background image; L makes long texts less dense.")}
          </p>
          <div className="two-col">
            <RangeField
              label={t("Size")}
              value={config.size}
              unit=" px"
              min={150}
              max={450}
              step={10}
              onChange={(v) => updateConfig("size", v)}
            />
            <RangeField
              label={t("Margin")}
              value={config.margin ?? 10}
              unit=" px"
              min={0}
              max={40}
              step={2}
              onChange={(v) => updateConfig("margin", v)}
            />
          </div>
        </div>
      </div>

      <div className="panel-section">
        <h2 className="section-title">{t("Photo in the code")}</h2>
        {imagePicker("bgImage", t("Choose photo"))}
        {config.bgImage ? (
          <div className="stack stack-top">
            <Segmented
              legend={t("Where to use the photo")}
              name="photo-mode"
              value={config.bgImageMode || "behind"}
              onChange={(v) => updateConfig("bgImageMode", v)}
              options={[
                { value: "behind", label: t("Behind the code") },
                { value: "modules", label: t("Inside the modules") },
              ]}
            />
            {config.bgImageMode === "modules" ? (
              <RangeField
                label={t("Darken the photo")}
                value={Math.round((config.moduleImageDarken ?? 0.35) * 100)}
                unit="%"
                min={0}
                max={90}
                step={5}
                onChange={(v) => updateConfig("moduleImageDarken", v / 100)}
              />
            ) : (
              <RangeField
                label={t("Lighten the photo")}
                value={Math.round((config.bgImageLighten ?? 0.5) * 100)}
                unit="%"
                min={0}
                max={90}
                step={5}
                onChange={(v) => updateConfig("bgImageLighten", v / 100)}
              />
            )}
            <p className="field-hint">
              {config.bgImageMode === "modules"
                ? t("The modules show the photo. Light photos need more darkening; check the scan test under the code.")
                : t("The photo shows between the modules. Shrink the modules for it to show more, and check the scan test under the code.")}
            </p>
          </div>
        ) : (
          <p className="field-hint">{t("A photo behind the code or inside the modules (artistic QR). It stays on your device only.")}</p>
        )}
      </div>

      <div className="panel-section">
        <h2 className="section-title">{t("Logo in the center")}</h2>
        {imagePicker("logoImage", t("Choose image"))}
        {!config.logoImage && <p className="field-hint">{t("PNG, JPG or SVG. The image stays on your device only.")}</p>}

        {config.logoImage && (
          <div className="stack stack-top">
            <div className="two-col">
              <RangeField
                label={t("Logo size")}
                value={config.logoSize || 25}
                unit="%"
                min={10}
                max={40}
                step={1}
                onChange={(v) => updateConfig("logoSize", v)}
              />
              <RangeField
                label={t("Round corners")}
                value={config.logoRadius || 0}
                unit="%"
                min={0}
                max={50}
                step={5}
                onChange={(v) => updateConfig("logoRadius", v)}
              />
              <RangeField
                label={t("Border around")}
                value={config.logoPad || 0}
                unit=" px"
                min={0}
                max={20}
                step={1}
                onChange={(v) => updateConfig("logoPad", v)}
              />
              <RangeField
                label={t("Opacity")}
                value={Math.round(config.logoOpacity * 100)}
                unit="%"
                min={0}
                max={100}
                step={10}
                onChange={(v) => updateConfig("logoOpacity", v / 100)}
              />
            </div>
            <label className="check">
              <input
                type="checkbox"
                checked={config.removeQrCodeBehindLogo}
                onChange={(e) => updateConfig("removeQrCodeBehindLogo", e.target.checked)}
              />
              {t("Clear the modules behind the logo")}
            </label>
            <CoverageMeter config={config} />
          </div>
        )}
      </div>
    </section>
  );
};

/** How much of the code the logo hides, against what the error correction can recover. */
const CoverageMeter = ({ config }) => {
  const t = useT();
  let result;
  try {
    result = logoCoverage(config, config.text || EXAMPLE_URL);
  } catch {
    return null;
  }
  const { coverage, capacity } = result;
  const pct = Math.round(coverage * 100);
  const cap = Math.round(capacity * 100);
  // Above ~60% of the capacity there is little room left for print and camera noise.
  const level = coverage <= capacity * 0.6 ? "ok" : coverage <= capacity ? "risk" : "over";
  const copy = {
    ok: t("Within the safe margin."),
    risk: t("At the limit: it may fail with poor printing or cameras. Shrink the logo or the border."),
    over: t("More than correction {level} recovers: the code will probably not scan. Shrink the logo or use H.", { level: config.ecLevel }),
  }[level];
  return (
    <div className={`coverage coverage-${level}`} role="status">
      <div className="range-head">
        <span className="field-label">{t("The logo covers")}</span>
        <span className="range-value">
          {t("{pct}% of {cap}% possible (correction {level})", { pct, cap, level: config.ecLevel })}
        </span>
      </div>
      <div className="coverage-bar" aria-hidden="true">
        <span style={{ width: `${Math.min(100, (coverage / capacity) * 100)}%` }} />
      </div>
      <p className="field-hint">{copy}</p>
    </div>
  );
};

export default Controls;
