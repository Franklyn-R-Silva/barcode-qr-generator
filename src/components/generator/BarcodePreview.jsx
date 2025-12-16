import React, { useRef, useEffect, useState } from "react";
import Barcode from "react-barcode";
import { AiOutlineCopy, AiOutlineReload } from "react-icons/ai";
import { motion } from "framer-motion";
import ExportOptions from "./ExportOptions";
import { validateBarcodeValue, getBarcodeExample } from "../../utils/barcodeValidators";
import "./GeneratorArea.css";

const BarcodePreview = ({ config, showToast }) => {
  const barcodeRef = useRef(null);
  const [error, setError] = useState(null);
  const [validationError, setValidationError] = useState(null);

  /**
   * Validar valor antes de renderizar
   */
  useEffect(() => {
    const validation = validateBarcodeValue(config.barcodeFormat, config.text);
    if (!validation.valid) {
      setValidationError(validation);
      setError(validation.message);
    } else {
      setValidationError(null);
      setError(null);
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
    if (showToast) showToast("✅ Valor resetado para exemplo válido");
  };

  /**
   * Função auxiliar para pegar o elemento SVG
   */
  const getSVG 
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
return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="preview-section"
      aria-label="Pré-visualização do código de barras"
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="preview-card barcode-card"
        ref={barcodeRef}
        role="img"
        aria-label="Código de barras gerado"
        whileHover={{ scale: 1.02 }}
      >
        {error ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="error-message"
            role="alert"
          >
            <p>❌ Erro ao gerar código de barras</p>
            <small>{error}</small>
            {validationError?.suggestion && (
              <div className="error-suggestion">
                <p>
                  <strong>Sugestão:</strong> {validationError.suggestion}
                </p>
                <button
                  onClick={handleReset}
                  className="btn btn-small btn-primary"
                  style={{ marginTop: "10px" }}
                >
                  <AiOutlineReload /> Usar Exemplo
                </button>
              </div>
            )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="preview-section"
      aria-label="Pré-visualização do código de barras"
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="preview-card barcode-card"
        ref={barcodeRef}
        role="img"
        aria-label="Código de barras gerado"
        whileHover={{ scale: 1.02 }}
      >
        {error ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="error-message"
            role="alert"
          >
            <p>❌ Erro ao gerar código de barras</p>
            <small>{error}</small>
          </motion.div>
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
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="action-buttons-grid"
        role="group"
        aria-label="Ações do código de barras"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleCopyBarcode}
          className="btn btn-secondary"
          disabled={!!error}
          aria-label="Copiar código de barras para área de transferência"
        >
          <AiOutlineCopy aria-hidden="true" /> Copiar Imagem
        </motion.button>

        <ExportOptions
          getSVG={getSVG}
          config={config}
          isBarcode={true}
          showToast={showToast}
        />
      </motion.div>
    </motion.section>
  );
};

export default BarcodePreview;
