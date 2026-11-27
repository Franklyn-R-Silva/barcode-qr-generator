import React, { useRef, useEffect, useState } from "react";
import Barcode from "react-barcode";
import { AiOutlineCopy, AiOutlineReload, AiOutlineCloseCircle } from "react-icons/ai";
import ExportOptions from "./ExportOptions";
import {
  validateBarcodeValue,
  getBarcodeExample,
} from "../../utils/barcodeValidators";
import { JSBARCODE_FORMAT, BARCODE_CATEGORIES } from "../../constants/barcodeTypes";
import "./GeneratorArea.css";

const BarcodePreview = ({ config, showToast }) => {
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

  /**
   * Função auxiliar para pegar o elemento SVG
   */
  const getSVG = () => {
    return barcodeRef.current?.querySelector("svg");
  };

  /**
   * Converte SVG para Canvas
   */
  const svgToCanvas = async (svg) => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const svgData = new XMLSerializer().serializeToString(svg);
      const img = new Image();

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        resolve(canvas);
      };

      img.onerror = reject;
      img.src =
        "data:image/svg+xml;base64," +
        btoa(unescape(encodeURIComponent(svgData)));
    });
  };

  /**
   * Lógica de Copiar para a Área de Transferência
   */
  const handleCopyBarcode = async () => {
    const svg = getSVG();
    if (!svg) return;

    try {
      const canvas = await svgToCanvas(svg);
      const dataUrl = canvas.toDataURL("image/png");
      const blob = await (await fetch(dataUrl)).blob();
      const clipboardItem = new ClipboardItem({ "image/png": blob });
      await navigator.clipboard.write([clipboardItem]);
      if (showToast) showToast("Imagem do código de barras copiada.");
    } catch (err) {
      console.error(err);
      if (showToast) showToast("Erro ao copiar a imagem. Use o botão Baixar.");
    }
  };

  const formatLabel =
    BARCODE_CATEGORIES.flatMap((c) => c.formats).find((f) => f.id === config.barcodeFormat)
      ?.label || config.barcodeFormat;

  return (
    <section className="panel preview-area preview-panel" aria-label="Pré-visualização do código de barras">
      <div className="preview-stage">
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
              background={config.bgColor || "#ffffff"}
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

      <ExportOptions getSVG={getSVG} config={config} isBarcode={true} showToast={showToast} disabled={!!error}>
        <button
          type="button"
          onClick={handleCopyBarcode}
          className="btn btn-secondary"
          disabled={!!error}
          aria-label="Copiar imagem do código de barras"
        >
          <AiOutlineCopy aria-hidden="true" /> Copiar
        </button>
      </ExportOptions>
    </section>
  );
};

export default BarcodePreview;
