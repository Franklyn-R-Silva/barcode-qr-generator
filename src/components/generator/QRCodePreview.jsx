import React, { useRef } from "react";
import { QRCode } from "react-qrcode-logo";
import { AiOutlineCopy } from "react-icons/ai";
import ExportOptions from "./ExportOptions";
import "./GeneratorArea.css";

const QRCodePreview = ({ config, showToast }) => {
  const qrRef = useRef(null);

  // Lógica de visualização: Define se os olhos são redondos ou quadrados
  const eyeRadius = config.eyeStyle === "circle" ? [10, 10, 10] : [0, 0, 0];

  // Calcular tamanho da logo baseado no modo selecionado
  const calculateLogoSize = () => {
    if (!config.logoImage) return { width: 0, height: 0 };

    switch (config.logoSizeMode) {
      case "original":
        // Usar tamanho original da imagem (limitado ao tamanho do QR)
        return {
          width: Math.min(config.size * 0.4, config.size),
          height: Math.min(config.size * 0.4, config.size),
        };
      case "custom":
        // Usar percentual customizado
        const percentage = (config.logoSize || 25) / 100;
        return {
          width: config.size * percentage,
          height: config.size * percentage,
        };
      case "auto":
      default:
        // Tamanho automático baseado no percentual
        const autoPercentage = (config.logoSize || 25) / 100;
        return {
          width: config.size * autoPercentage,
          height: config.size * autoPercentage,
        };
    }
  };

  const logoSize = calculateLogoSize();

  /**
   * Função auxiliar para pegar o elemento Canvas
   */
  const getCanvas = () => {
    return qrRef.current?.querySelector("canvas");
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
      if (showToast) showToast("Imagem do QR Code copiada.");
    } catch (err) {
      console.error(err);
      if (showToast) showToast("Erro ao copiar a imagem. Use o botão Baixar.");
    }
  };

  const isExample = !config.text;

  return (
    <section className="panel preview-area preview-panel" aria-label="Pré-visualização do QR Code">
      <div className="preview-stage">
        <div
          className="preview-code"
          ref={qrRef}
          role="img"
          aria-label={isExample ? "QR Code de exemplo" : `QR Code com o conteúdo: ${config.text}`}
        >
          <QRCode
            value={config.text || "https://qrcode.devfrs.com"}
            size={config.size}
            fgColor={config.fgColor}
            bgColor={config.bgColor}
            ecLevel={config.ecLevel}
            qrStyle={config.qrStyle}
            logoImage={config.logoImage}
            logoWidth={logoSize.width}
            logoHeight={logoSize.height}
            logoOpacity={config.logoOpacity}
            removeQrCodeBehindLogo={config.removeQrCodeBehindLogo}
            eyeRadius={eyeRadius}
            logoPadding={0}
            logoPaddingStyle="circle"
          />
        </div>
      </div>

      <p className="preview-meta">
        {isExample ? (
          "Exemplo: digite o conteúdo para criar o seu."
        ) : (
          <>
            QR Code <span aria-hidden="true">·</span> {config.size} px{" "}
            <span aria-hidden="true">·</span> correção {config.ecLevel}
          </>
        )}
      </p>

      <ExportOptions getCanvas={getCanvas} config={config} isBarcode={false} showToast={showToast}>
        <button
          type="button"
          onClick={handleCopyQRCode}
          className="btn btn-secondary"
          aria-label="Copiar imagem do QR Code"
        >
          <AiOutlineCopy aria-hidden="true" /> Copiar
        </button>
      </ExportOptions>
    </section>
  );
};

export default QRCodePreview;
