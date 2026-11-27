import React, { useRef, useEffect, useState } from "react";
import Barcode from "react-barcode";
import { AiOutlineReload, AiOutlineCloseCircle } from "react-icons/ai";
import ExportOptions from "./ExportOptions";
import {
  validateBarcodeValue,
  getBarcodeExample,
} from "../../utils/barcodeValidators";
import { JSBARCODE_FORMAT, BARCODE_CATEGORIES } from "../../constants/barcodeTypes";
import "./GeneratorArea.css";

const BarcodePreview = ({ config, updateConfig, showToast }) => {
  const barcodeRef = useRef(null);
  const [error, setError] = useState(null);
  const [validationError, setValidationError] = useState(null);
  const [normalizedValue, setNormalizedValue] = useState(null);

  /**
   * Validar valor antes de renderizar
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
      // Usar valor normalizado se disponível (ex: UPC-E com zeros adicionados)
      setNormalizedValue(validation.normalized || config.text);
    }
  }, [config.text, config.barcodeFormat]);

  /**
   * Resetar para exemplo válido
   */
  const handleReset = () => {
    const example = getBarcodeExample(config.barcodeFormat);
    // Usar evento customizado para atualizar o texto no componente pai
    window.dispatchEvent(
      new CustomEvent("resetBarcodeText", { detail: example })
    );
    setError(null);
    setValidationError(null);
    if (showToast) showToast("Valor trocado pelo exemplo.");
  };

  // The rendered <svg>, serialised: every export format is produced from it.
  const getSvg = () => new XMLSerializer().serializeToString(barcodeRef.current.querySelector("svg"));

  const formatLabel =
    BARCODE_CATEGORIES.flatMap((c) => c.formats).find((f) => f.id === config.barcodeFormat)
      ?.label || config.barcodeFormat;

  return (
    <section className="panel preview-area preview-panel" aria-label="Pré-visualização do código de barras">
      <div className={`preview-stage ${config.transparentBg ? "is-transparent" : ""}`}>
        <div
          className="preview-code barcode-code"
          ref={barcodeRef}
          role={error ? undefined : "img"}
          aria-label={error ? undefined : `Código de barras ${formatLabel}: ${normalizedValue || config.text}`}
        >
          {error ? (
            <div className="alert alert-danger barcode-error" role="alert">
              <AiOutlineCloseCircle aria-hidden="true" />
              <div>
                <p>
                  <strong>Não deu para gerar este código.</strong>
                </p>
                <p>{error}</p>
                {validationError?.suggestion && (
                  <button type="button" onClick={handleReset} className="btn btn-secondary barcode-reset">
                    <AiOutlineReload aria-hidden="true" /> Usar o exemplo
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
                  setError(
                    "Valor inválido para este formato. Confira o formato escolhido e o valor digitado."
                  );
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
