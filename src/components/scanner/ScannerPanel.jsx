import React, { useEffect, useRef, useState, useCallback } from "react";
import { Html5Qrcode, Html5QrcodeSupportedFormats } from "html5-qrcode";
import {
  AiOutlineCamera,
  AiOutlineStop,
  AiOutlineCopy,
  AiOutlineLink,
  AiOutlinePicture,
  AiOutlineQrcode,
  AiOutlineBarcode,
  AiOutlineFileText,
  AiOutlineCheckCircle,
  AiOutlineWarning,
  AiOutlineCloseCircle,
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
      if (showToast) showToast("Código lido.");
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
      if (showToast) showToast("Conteúdo copiado.");
    }
  };

  const nfe = result?.nfe;

  const scanAnother = () => {
    setResult(null);
    setError(null);
    startCamera();
  };

  return (
    <section className="scanner-area scanner" aria-label="Ler QR Code ou código de barras">
      <div className="panel scanner-capture">
        <div className="scanner-stage">
          {/* O html5-qrcode injeta o vídeo da câmera aqui. */}
          <div id={READER_ID} className={`scanner-reader ${scanning ? "active" : ""}`} />

          {!scanning && (
            <div className="scanner-placeholder">
              <svg className="scanner-frame" viewBox="0 0 64 64" aria-hidden="true">
                <path
                  d="M4 18V8a4 4 0 0 1 4-4h10M46 4h10a4 4 0 0 1 4 4v10M60 46v10a4 4 0 0 1-4 4H46M18 60H8a4 4 0 0 1-4-4V46"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                />
                <path d="M14 32h36" stroke="currentColor" strokeWidth="3" strokeLinecap="round" opacity=".45" />
              </svg>
              <p className="scanner-placeholder-title">
                {result ? "Leitura concluída" : "Aponte para um código"}
              </p>
              <p className="scanner-placeholder-text">
                QR Code, código de barras ou a chave de uma NF-e / NFC-e.
                Sem câmera? Envie uma foto.
              </p>
            </div>
          )}
        </div>

        <div className="scanner-actions">
          {!scanning ? (
            <button type="button" className="btn btn-primary" onClick={result ? scanAnother : startCamera} disabled={starting}>
              <AiOutlineCamera aria-hidden="true" />
              {starting ? "Abrindo a câmera…" : result ? "Ler outro código" : "Usar a câmera"}
            </button>
          ) : (
            <button type="button" className="btn btn-secondary" onClick={stopCamera}>
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
              className="visually-hidden"
            />
          </label>
        </div>

        {error && (
          <p className="alert alert-danger scanner-error" role="alert">
            <AiOutlineCloseCircle aria-hidden="true" />
            <span>{error}</span>
          </p>
        )}
      </div>

      <div className="panel scan-result" aria-live="polite">
        {!result ? (
          <div className="scan-result-empty">
            <h2 className="section-title">O que aparece aqui</h2>
            <ul>
              <li>O texto ou link lido, pronto para copiar ou abrir.</li>
              <li>
                Em notas fiscais (NF-e, NFC-e, CT-e, MDF-e): estado, mês de
                emissão, CNPJ do emitente, série, número e a conferência do
                dígito verificador.
              </li>
              <li>Um atalho para gerar um QR Code ou código de barras com o mesmo valor.</li>
            </ul>
            <p className="field-hint">A leitura acontece no seu aparelho; nada é enviado.</p>
          </div>
        ) : (
          <>
            <div className="scan-result-header">
              <h2 className="section-title">{nfe ? nfe.modelo : "Conteúdo lido"}</h2>
              {nfe && (
                <span className={`badge ${nfe.valid ? "badge-ok" : "badge-warn"}`}>
                  {nfe.valid ? <AiOutlineCheckCircle aria-hidden="true" /> : <AiOutlineWarning aria-hidden="true" />}
                  {nfe.valid ? "Dígito verificador válido" : "Dígito verificador inválido"}
                </span>
              )}
            </div>

            {nfe ? (
              <dl className="nfe-grid">
                <div className="nfe-key">
                  <dt>Chave de acesso</dt>
                  <dd className="mono">{nfe.keyFormatted}</dd>
                </div>
                <div><dt>Estado (UF)</dt><dd>{nfe.uf}</dd></div>
                <div><dt>Emissão</dt><dd className="mono">{nfe.emission}</dd></div>
                <div><dt>CNPJ do emitente</dt><dd className="mono">{nfe.cnpj}</dd></div>
                <div><dt>Série</dt><dd className="mono">{nfe.serie}</dd></div>
                <div><dt>Número</dt><dd className="mono">{nfe.numero}</dd></div>
                <div><dt>Forma de emissão</dt><dd>{nfe.tipoEmissao}</dd></div>
              </dl>
            ) : (
              <p className="scan-result-text mono">{result.text}</p>
            )}

            <div className="scan-result-actions">
              <button type="button" className="btn btn-secondary" onClick={handleCopy}>
                <AiOutlineCopy aria-hidden="true" /> Copiar
              </button>
              {isUrl(result.text) && (
                <a className="btn btn-secondary" href={result.text} target="_blank" rel="noreferrer">
                  <AiOutlineLink aria-hidden="true" /> Abrir link
                </a>
              )}
              {nfe && (
                <a className="btn btn-secondary" href={NFE_CONSULTA_URL} target="_blank" rel="noreferrer">
                  <AiOutlineFileText aria-hidden="true" /> Consultar no portal da NF-e
                </a>
              )}
            </div>
            <div className="scan-result-actions scan-result-generate">
              <span>Gerar com este valor:</span>
              <button type="button" className="btn btn-link" onClick={() => onGenerate && onGenerate("qrcode", result.text)}>
                <AiOutlineQrcode aria-hidden="true" /> QR Code
              </button>
              <button
                type="button"
                className="btn btn-link"
                onClick={() => onGenerate && onGenerate("barcode", nfe ? nfe.key : result.text)}
              >
                <AiOutlineBarcode aria-hidden="true" /> Código de barras
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default ScannerPanel;
