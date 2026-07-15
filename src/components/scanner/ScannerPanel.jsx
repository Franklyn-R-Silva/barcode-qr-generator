import React, { useEffect, useRef, useState, useCallback } from "react";
import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";
import { motion } from "framer-motion";
import {
  AiOutlineCamera,
  AiOutlineStop,
  AiOutlineCopy,
  AiOutlineLink,
  AiOutlineReload,
  AiOutlinePicture,
  AiOutlineQrcode,
  AiOutlineBarcode,
  AiOutlineFileText,
} from "react-icons/ai";
import { parseNFe, isUrl, NFE_CONSULTA_URL } from "../../utils/nfeParser";
import "./ScannerPanel.css";

// Elemento onde o html5-qrcode injeta o vídeo da câmera.
const READER_ID = "qr-reader-region";

// Formatos lidos: QR Code + principais códigos de barras 1D usados no Brasil
// (o código do DANFE é Code-128).
const SUPPORTED_FORMATS = [
  Html5QrcodeSupportedFormats.QR_CODE,
  Html5QrcodeSupportedFormats.CODE_128,
  Html5QrcodeSupportedFormats.CODE_39,
  Html5QrcodeSupportedFormats.EAN_13,
  Html5QrcodeSupportedFormats.EAN_8,
  Html5QrcodeSupportedFormats.UPC_A,
  Html5QrcodeSupportedFormats.UPC_E,
  Html5QrcodeSupportedFormats.ITF,
  Html5QrcodeSupportedFormats.CODABAR,
];

const ScannerPanel = ({ showToast, onGenerate }) => {
  const scannerRef = useRef(null);
  const runningRef = useRef(false);
  const fileInputRef = useRef(null);

  const [scanning, setScanning] = useState(false);
  const [starting, setStarting] = useState(false);
  const [result, setResult] = useState(null); // { text, nfe }
  const [error, setError] = useState(null);

  // Garante uma instância única do leitor.
  const getScanner = useCallback(() => {
    if (!scannerRef.current) {
      scannerRef.current = new Html5Qrcode(READER_ID, {
        formatsToSupport: SUPPORTED_FORMATS,
        verbose: false,
      });
    }
    return scannerRef.current;
  }, []);

  const stopCamera = useCallback(async () => {
    const scanner = scannerRef.current;
    if (scanner && runningRef.current) {
      try {
        await scanner.stop();
        scanner.clear();
      } catch (err) {
        // ignora erros ao parar (câmera já pode ter sido liberada)
      }
    }
    runningRef.current = false;
    setScanning(false);
  }, []);

  const handleDetected = useCallback(
    (decodedText) => {
      const nfe = parseNFe(decodedText);
      setResult({ text: decodedText, nfe });
      setError(null);
      if (showToast) showToast("✅ Código lido com sucesso!");
    },
    [showToast]
  );

  const startCamera = useCallback(async () => {
    setError(null);
    setResult(null);
    setStarting(true);
    try {
      const scanner = getScanner();
      await scanner.start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: (vfWidth, vfHeight) => {
            const min = Math.min(vfWidth, vfHeight);
            const size = Math.max(180, Math.floor(min * 0.75));
            return { width: size, height: Math.floor(size * 0.7) };
          },
          aspectRatio: 1.3333,
        },
        (decodedText) => {
          handleDetected(decodedText);
          stopCamera();
        },
        () => {
          /* frame sem código — silencioso */
        }
      );
      runningRef.current = true;
      setScanning(true);
    } catch (err) {
      console.error(err);
      setError(
        "Não foi possível acessar a câmera. Verifique as permissões do navegador ou use a opção de enviar uma imagem."
      );
    } finally {
      setStarting(false);
    }
  }, [getScanner, handleDetected, stopCamera]);

  const handleFile = useCallback(
    async (e) => {
      const file = e.target.files && e.target.files[0];
      if (!file) return;
      setError(null);
      setResult(null);
      // A leitura de arquivo e a câmera são mutuamente exclusivas.
      await stopCamera();
      try {
        const scanner = getScanner();
        const decodedText = await scanner.scanFile(file, false);
        handleDetected(decodedText);
      } catch (err) {
        console.error(err);
        setError(
          "Nenhum código foi encontrado nesta imagem. Tente uma foto mais nítida e bem enquadrada."
        );
      } finally {
        // permite reenviar o mesmo arquivo
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    },
    [getScanner, handleDetected, stopCamera]
  );

  // Limpeza ao desmontar: libera a câmera.
  useEffect(() => {
    return () => {
      const scanner = scannerRef.current;
      if (scanner && runningRef.current) {
        scanner.stop().catch(() => {});
      }
    };
  }, []);

  const handleCopy = () => {
    if (result?.text) {
      navigator.clipboard.writeText(result.text);
      if (showToast) showToast("Conteúdo copiado!");
    }
  };

  const nfe = result?.nfe;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="scanner-section"
      aria-label="Leitor de QR Code e código de barras"
    >
      <div className="scanner-card">
        {/* Região da câmera (o html5-qrcode injeta o vídeo aqui) */}
        <div
          id={READER_ID}
          className={`scanner-reader ${scanning ? "active" : ""}`}
        />

        {!scanning && !result && (
          <div className="scanner-placeholder">
            <AiOutlineQrcode className="scanner-placeholder-icon" aria-hidden="true" />
            <p className="scanner-placeholder-title">Escaneie um código</p>
            <p className="scanner-placeholder-text">
              QR Code, código de barras ou a chave de acesso de uma NF-e / NFC-e.
              Use a câmera ou envie uma imagem.
            </p>
          </div>
        )}

        {error && (
          <div className="scanner-error" role="alert">
            <AiOutlineFileText aria-hidden="true" /> {error}
          </div>
        )}
      </div>

      {/* Controles do leitor */}
      <div className="scanner-actions">
        {!scanning ? (
          <button
            className="btn btn-primary"
            onClick={startCamera}
            disabled={starting}
          >
            <AiOutlineCamera aria-hidden="true" />{" "}
            {starting ? "Abrindo câmera..." : "Escanear com a câmera"}
          </button>
        ) : (
          <button className="btn btn-secondary" onClick={stopCamera}>
            <AiOutlineStop aria-hidden="true" /> Parar câmera
          </button>
        )}

        <label className="btn btn-secondary scanner-file-btn">
          <AiOutlinePicture aria-hidden="true" /> Enviar imagem
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFile}
            hidden
          />
        </label>
      </div>

      {/* Resultado da leitura */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="scan-result"
        >
          <div className="scan-result-header">
            <span>{nfe ? "📄 Documento Fiscal detectado" : "🔎 Resultado da leitura"}</span>
          </div>

          {nfe ? (
            <div className="nfe-details">
              <div className="nfe-badge">
                <strong>{nfe.modelo}</strong>
                <span className={`nfe-dv ${nfe.valid ? "ok" : "warn"}`}>
                  {nfe.valid ? "Dígito verificador válido" : "Dígito verificador inválido"}
                </span>
              </div>
              <dl className="nfe-grid">
                <div><dt>Chave de acesso</dt><dd className="mono">{nfe.keyFormatted}</dd></div>
                <div><dt>Estado (UF)</dt><dd>{nfe.uf}</dd></div>
                <div><dt>Emissão</dt><dd>{nfe.emission}</dd></div>
                <div><dt>CNPJ do emitente</dt><dd className="mono">{nfe.cnpj}</dd></div>
                <div><dt>Série</dt><dd>{nfe.serie}</dd></div>
                <div><dt>Número</dt><dd>{nfe.numero}</dd></div>
                <div><dt>Forma de emissão</dt><dd>{nfe.tipoEmissao}</dd></div>
              </dl>
            </div>
          ) : (
            <p className="scan-result-text mono">{result.text}</p>
          )}

          <div className="scan-result-actions">
            <button className="btn-icon" onClick={handleCopy}>
              <AiOutlineCopy aria-hidden="true" /> Copiar
            </button>

            {isUrl(result.text) && (
              <a
                className="btn-icon"
                href={result.text}
                target="_blank"
                rel="noreferrer"
              >
                <AiOutlineLink aria-hidden="true" /> Abrir link
              </a>
            )}

            {nfe && (
              <a
                className="btn-icon"
                href={NFE_CONSULTA_URL}
                target="_blank"
                rel="noreferrer"
              >
                <AiOutlineFileText aria-hidden="true" /> Consultar no portal
              </a>
            )}

            <button
              className="btn-icon"
              onClick={() => onGenerate && onGenerate("qrcode", result.text)}
            >
              <AiOutlineQrcode aria-hidden="true" /> Gerar QR
            </button>
            <button
              className="btn-icon"
              onClick={() =>
                onGenerate && onGenerate("barcode", nfe ? nfe.key : result.text)
              }
            >
              <AiOutlineBarcode aria-hidden="true" /> Gerar código
            </button>

            <button
              className="btn-icon"
              onClick={() => {
                setResult(null);
                setError(null);
                startCamera();
              }}
            >
              <AiOutlineReload aria-hidden="true" /> Escanear outro
            </button>
          </div>
        </motion.div>
      )}
    </motion.section>
  );
};

export default ScannerPanel;
