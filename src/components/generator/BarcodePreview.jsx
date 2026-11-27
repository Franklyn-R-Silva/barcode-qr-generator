import React, { useRef, useEffect, useState } from "react";
import Barcode from "react-barcode";
import { AiOutlineReload, AiOutlineCloseCircle } from "react-icons/ai";
import ExportOptions from "./ExportOptions";
import {
  validateBarcodeValue,
  getBarcodeExample,
} from "../../utils/barcodeValidators";
import { JSBARCODE_FORMAT, BARCODE_CATEGORIES } from "../../constants/barcodeTypes";
import { useT } from "../../i18n";
import "./GeneratorArea.css";

const BarcodePreview = ({ config, updateConfig, showToast }) => {
  const t = useT();
  const barcodeRef = useRef(null);
  const [error, setError] = useState(null);
  const [validationError, setValidationError] = useState(null);
  const [normalizedValue, setNormalizedValue] = useState(null);

  /**
   * Validate the value before rendering
   */
  useEffect(() => {
    const validation = validateBarcodeValue(config.barcodeFormat, config.text);
    if (!validation.valid) {
      setValidationError(validation);
      setError(validation.message);
      setNormalizedValue(null);
    } else {
      setValidationError(null);
      setError(null);
      // Use the normalised value when there is one (e.g. UPC-E with added zeros)
      setNormalizedValue(validation.normalized || config.text);
    }
  }, [config.text, config.barcodeFormat]);

  /**
   * Reset to a valid example
   */
  const handleReset = () => {
    const example = t(getBarcodeExample(config.barcodeFormat));
    // A custom event updates the text in the parent component
    window.dispatchEvent(
      new CustomEvent("resetBarcodeText", { detail: example })
    );
    setError(null);
    setValidationError(null);
    if (showToast) showToast(t("Value replaced with the example."));
  };

  // The rendered <svg>, serialised: every export format is produced from it.
  const getSvg = () => new XMLSerializer().serializeToString(barcodeRef.current.querySelector("svg"));

  const formatLabel = t(
    BARCODE_CATEGORIES.flatMap((c) => c.formats).find((f) => f.id === config.barcodeFormat)
      ?.label || config.barcodeFormat
  );

  return (
    <section className="panel preview-area preview-panel" aria-label={t("Barcode preview")}>
      <div className={`preview-stage ${config.transparentBg ? "is-transparent" : ""}`}>
        <div
          className="preview-code barcode-code"
          ref={barcodeRef}
          role={error ? undefined : "img"}
          aria-label={error ? undefined : t("Barcode {format}: {value}", { format: formatLabel, value: normalizedValue || config.text })}
        >
          {error ? (
            <div className="alert alert-danger barcode-error" role="alert">
              <AiOutlineCloseCircle aria-hidden="true" />
              <div>
                <p>
                  <strong>{t("Could not generate this code.")}</strong>
                </p>
                <p>{t(error)}</p>
                {validationError?.suggestion && (
                  <button type="button" onClick={handleReset} className="btn btn-secondary barcode-reset">
                    <AiOutlineReload aria-hidden="true" /> {t("Use the example")}
                  </button>
                )}
              </div>
            </div>
          ) : (
            <Barcode
              value={normalizedValue || config.text || "123456789"}
              format={JSBARCODE_FORMAT[config.barcodeFormat] || config.barcodeFormat}
              width={config.barcodeWidth || 2}
              height={config.barcodeHeight || 100}
              displayValue={config.barcodeDisplayValue !== false}
              background={config.transparentBg ? "transparent" : config.bgColor || "#ffffff"}
              lineColor={config.fgColor || "#000000"}
              fontSize={config.barcodeFontSize || 20}
              margin={config.barcodeMargin || 10}
              valid={(valid) => {
                if (!valid) {
                  // Stored in English, translated where it is shown.
                  setError("Invalid value for this format. Check the chosen format and the value you typed.");
                }
              }}
            />
          )}
        </div>
      </div>

      <p className="preview-meta">{formatLabel}</p>

      <ExportOptions
        kind="barcode"
        getSvg={getSvg}
        config={config}
        updateConfig={updateConfig}
        showToast={showToast}
        disabled={!!error}
      />
    </section>
  );
};

export default BarcodePreview;
