import React, { useRef } from "react";
import { QRCode } from "react-qrcode-logo";
import { AiOutlineCopy, AiOutlineDownload } from "react-icons/ai";
import "./GeneratorArea.css";

const QRCodePreview = ({ config, showToast }) => {
  const qrRef = useRef(null);

  // Lógica de visualização: Define se os olhos são redondos ou quadrados
  const eyeRadius = config.eyeStyle === "circle" ? [10, 10, 10] : [0, 0, 0];

  /**
   * Função auxiliar para pegar o elemento Canvas
   */
  const getCanvas = () => {
    return qrRef.current?.querySelector("canvas");
  };

  /**
   * Lógica de Download
   */
  const handleDownload = () => {
    const canvas = getCanvas();
    if (!canvas) {
      showToast && showToast("Erro: Canvas não encontrado!");
      return;
    }

    try {
      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `qrcode-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
      if (showToast) showToast("Download iniciado!");
    } catch (err) {
      console.error(err);
      if (showToast) showToast("Erro ao baixar QR Code.");
    }
  };

  /**
   * Lógica de Copiar para a Área de Transferência
   */
  const handleCopyQRCode = async () => {
    const canvas = getCanvas();
    if (!canvas) return;

    try {
      const dataUrl = canvas.toDataURL("image/png");
      const blob = await (await fetch(dataUrl)).blob();
      const clipboardItem = new ClipboardItem({ "image/png": blob });
      await navigator.clipboard.write([clipboardItem]);
      if (showToast) showToast("QR Code copiado para o clipboard!");
    } catch (err) {
      console.error(err);
      if (showToast) showToast("Erro ao copiar. Tente baixar.");
    }
  };

  return (
    <section
      className="preview-section"
      aria-label="Pré-visualização do código"
    >
      <div
        className="preview-card"
        ref={qrRef}
        role="img"
        aria-label="QR Code gerado"
      >
        <QRCode
          value={config.text || "https://seusite.com"}
          size={config.size}
          fgColor={config.fgColor}
          bgColor={config.bgColor}
          ecLevel={config.ecLevel}
          qrStyle={config.qrStyle}
          logoImage={config.logoImage}
          logoWidth={config.size * 0.25}
          logoHeight={config.size * 0.25}
          logoOpacity={config.logoOpacity}
          removeQrCodeBehindLogo={config.removeQrCodeBehindLogo}
          eyeRadius={eyeRadius}
        />
      </div>

      <div
        className="action-buttons-grid"
        role="group"
        aria-label="Ações do QR Code"
      >
        <button
          onClick={handleCopyQRCode}
          className="btn btn-secondary"
          aria-label="Copiar QR Code para área de transferência"
        >
          <AiOutlineCopy aria-hidden="true" /> Copiar Imagem
        </button>
        <button
          onClick={handleDownload}
          className="btn btn-primary"
          aria-label="Baixar QR Code como PNG"
        >
          <AiOutlineDownload aria-hidden="true" /> Baixar PNG
        </button>
      </div>
    </section>
  );
};

export default QRCodePreview;
