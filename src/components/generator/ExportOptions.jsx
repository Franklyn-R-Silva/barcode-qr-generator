// src/components/generator/ExportOptions.jsx
import React, { useState } from "react";
import {
  AiOutlineDownload,
  AiOutlineFilePdf,
  AiOutlineFileImage,
  AiOutlinePicture,
} from "react-icons/ai";
import jsPDF from "jspdf";
import "./ExportOptions.css";

const ExportOptions = ({
  getCanvas,
  getSVG,
  config,
  isBarcode = false,
  showToast,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState("png");
  const [transparentBg, setTransparentBg] = useState(false);

  /**
   * Converte SVG para Canvas com opção de fundo transparente
   */
  const svgToCanvas = async (svg, transparent = false) => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const svgData = new XMLSerializer().serializeToString(svg);
      const img = new Image();

      img.onload = () => {
        canvas.width = img.width;
        canvas.height = img.height;

        if (!transparent) {
          // Preencher com cor de fundo se não for transparente
          ctx.fillStyle = config.bgColor || "#ffffff";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

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
   * Obter canvas com opção de fundo transparente
   */
  const getCanvasWithOptions = async () => {
    if (isBarcode) {
      const svg = getSVG();
      if (!svg) throw new Error("Código não encontrado");
      return await svgToCanvas(svg, transparentBg);
    } else {
      const canvas = getCanvas();
      if (!canvas) throw new Error("Código não encontrado");

      if (transparentBg) {
        // Criar novo canvas com fundo transparente
        const newCanvas = document.createElement("canvas");
        const ctx = newCanvas.getContext("2d");
        newCanvas.width = canvas.width;
        newCanvas.height = canvas.height;

        // Desenhar o QR Code ANTES de ler os pixels
        ctx.drawImage(canvas, 0, 0);

        // Ler os pixels já desenhados para poder processá-los
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        // Tornar pixels da cor de fundo transparentes
        const bgColor = hexToRgb(config.bgColor || "#ffffff");
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];

          // Se pixel é muito próximo da cor de fundo, tornar transparente
          if (
            Math.abs(r - bgColor.r) < 10 &&
            Math.abs(g - bgColor.g) < 10 &&
            Math.abs(b - bgColor.b) < 10
          ) {
            data[i + 3] = 0; // Alpha = 0 (transparente)
          }
        }

        ctx.putImageData(imageData, 0, 0);
        return newCanvas;
      }

      return canvas;
    }
  };

  /**
   * Converter hex para RGB
   */
  const hexToRgb = (hex) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : { r: 255, g: 255, b: 255 };
  };

  /**
   * Download PNG
   */
  const downloadPNG = async () => {
    try {
      const canvas = await getCanvasWithOptions();
      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `${isBarcode ? "barcode" : "qrcode"}-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
      showToast?.("✅ PNG baixado com sucesso!");
    } catch (err) {
      console.error(err);
      showToast?.("❌ Erro ao baixar PNG");
    }
  };

  /**
   * Download WEBP (menor tamanho)
   */
  const downloadWEBP = async () => {
    try {
      const canvas = await getCanvasWithOptions();
      const dataUrl = canvas.toDataURL("image/webp", 0.95);
      const link = document.createElement("a");
      link.download = `${isBarcode ? "barcode" : "qrcode"}-${Date.now()}.webp`;
      link.href = dataUrl;
      link.click();
      showToast?.("✅ WEBP baixado com sucesso!");
    } catch (err) {
      console.error(err);
      showToast?.("❌ Erro ao baixar WEBP");
    }
  };

  /**
   * Download SVG (vetorial)
   */
  const downloadSVG = async () => {
    try {
      if (isBarcode) {
        const svg = getSVG();
        if (!svg) throw new Error("Código não encontrado");

        const svgData = new XMLSerializer().serializeToString(svg);
        const blob = new Blob([svgData], { type: "image/svg+xml" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.download = `barcode-${Date.now()}.svg`;
        link.href = url;
        link.click();
        URL.revokeObjectURL(url);
        showToast?.("✅ SVG baixado com sucesso!");
      } else {
        showToast?.("⚠️ SVG disponível apenas para códigos de barras");
      }
    } catch (err) {
      console.error(err);
      showToast?.("❌ Erro ao baixar SVG");
    }
  };

  /**
   * Download PDF
   */
  const downloadPDF = async () => {
    try {
      const canvas = await getCanvasWithOptions();
      const imgData = canvas.toDataURL("image/png");

      const pdf = new jsPDF({
        orientation: canvas.width > canvas.height ? "landscape" : "portrait",
        unit: "px",
        format: [canvas.width, canvas.height],
      });

      pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
      pdf.save(`${isBarcode ? "barcode" : "qrcode"}-${Date.now()}.pdf`);
      showToast?.("✅ PDF baixado com sucesso!");
    } catch (err) {
      console.error(err);
      showToast?.("❌ Erro ao baixar PDF");
    }
  };

  /**
   * Executar download baseado no formato selecionado
   */
  const handleDownload = async () => {
    switch (exportFormat) {
      case "png":
        await downloadPNG();
        break;
      case "webp":
        await downloadWEBP();
        break;
      case "svg":
        await downloadSVG();
        break;
      case "pdf":
        await downloadPDF();
        break;
      default:
        await downloadPNG();
    }
  };

  return (
    <div className="export-options">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="btn btn-primary btn-export"
        aria-label="Opções de exportação"
        aria-expanded={isOpen}
      >
        <AiOutlineDownload aria-hidden="true" />
        Baixar {exportFormat.toUpperCase()}
      </button>

      {isOpen && (
        <div className="export-dropdown">
          <div className="export-section">
            <label className="export-label">
              <AiOutlineFileImage /> Formato:
            </label>
            <div className="format-buttons">
              <button
                className={`format-btn ${
                  exportFormat === "png" ? "active" : ""
                }`}
                onClick={() => setExportFormat("png")}
              >
                PNG
              </button>
              <button
                className={`format-btn ${
                  exportFormat === "webp" ? "active" : ""
                }`}
                onClick={() => setExportFormat("webp")}
              >
                WEBP
              </button>
              {isBarcode && (
                <button
                  className={`format-btn ${
                    exportFormat === "svg" ? "active" : ""
                  }`}
                  onClick={() => setExportFormat("svg")}
                >
                  SVG
                </button>
              )}
              <button
                className={`format-btn ${
                  exportFormat === "pdf" ? "active" : ""
                }`}
                onClick={() => setExportFormat("pdf")}
              >
                <AiOutlineFilePdf /> PDF
              </button>
            </div>
          </div>

          <div className="export-section">
            <label className="checkbox-label-export">
              <input
                type="checkbox"
                checked={transparentBg}
                onChange={(e) => setTransparentBg(e.target.checked)}
              />
              <AiOutlinePicture />
              <span>Fundo Transparente</span>
            </label>
            <p className="export-hint">
              Remove o fundo, mantendo apenas o código
            </p>
          </div>

          <button
            onClick={handleDownload}
            className="btn btn-primary btn-download-confirm"
          >
            <AiOutlineDownload /> Baixar Agora
          </button>
        </div>
      )}
    </div>
  );
};

export default ExportOptions;
