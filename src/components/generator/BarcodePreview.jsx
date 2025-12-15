import React, { useRef, useEffect, useState } from "react";
import Barcode from "react-barcode";
import { AiOutlineCopy, AiOutlineDownload } from "react-icons/ai";
import "./GeneratorArea.css";

const BarcodePreview = ({ config, showToast }) => {
  const barcodeRef = useRef(null);
  const [error, setError] = useState(null);

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
   * Lógica de Download
   */
  const handleDownload = async () => {
    const svg = getSVG();
    if (!svg) {
      showToast && showToast("Erro: Código de barras não encontrado!");
      return;
    }

    try {
      const canvas = await svgToCanvas(svg);
      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `barcode-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
      if (showToast) showToast("Download iniciado!");
    } catch (err) {
      console.error(err);
      if (showToast) showToast("Erro ao baixar código de barras.");
    }
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
      if (showToast) showToast("Código de barras copiado para o clipboard!");
    } catch (err) {
      console.error(err);
      if (showToast) showToast("Erro ao copiar. Tente baixar.");
    }
  };

  // Limpar erro quando o texto mudar
  useEffect(() => {
    setError(null);
  }, [config.text, config.barcodeFormat]);

  return (
    <section
      className="preview-section"
      aria-label="Pré-visualização do código de barras"
    >
      <div
        className="preview-card barcode-card"
        ref={barcodeRef}
        role="img"
        aria-label="Código de barras gerado"
      >
        {error ? (
          <div className="error-message" role="alert">
            <p>❌ Erro ao gerar código de barras</p>
            <small>{error}</small>
          </div>
        ) : (
          <Barcode
            value={config.text || "123456789"}
            format={config.barcodeFormat}
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
                  "Valor inválido para este formato. Verifique o tipo de código e tente novamente."
                );
              }
            }}
          />
        )}
      </div>

      <div
        className="action-buttons-grid"
        role="group"
        aria-label="Ações do código de barras"
      >
        <button
          onClick={handleCopyBarcode}
          className="btn btn-secondary"
          disabled={!!error}
          aria-label="Copiar código de barras para área de transferência"
        >
          <AiOutlineCopy aria-hidden="true" /> Copiar Imagem
        </button>
        <button
          onClick={handleDownload}
          className="btn btn-primary"
          disabled={!!error}
          aria-label="Baixar código de barras como PNG"
        >
          <AiOutlineDownload aria-hidden="true" /> Baixar PNG
        </button>
      </div>
    </section>
  );
};

export default BarcodePreview;
