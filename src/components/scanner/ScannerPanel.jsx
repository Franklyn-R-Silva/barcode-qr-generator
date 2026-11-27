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
import { parseNFe, isUrl, NFE_LOOKUP_URL } from "../../utils/nfeParser";
import { useT } from "../../i18n";
import "./ScannerPanel.css";

// Element where html5-qrcode injects the camera video.
const READER_ID = "qr-reader-region";

// Formats read: QR Code + the main 1D barcodes used in Brazil
// (the DANFE barcode is Code-128).
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
  const t = useT();
  const scannerRef = useRef(null);
  const runningRef = useRef(false);
  const fileInputRef = useRef(null);

  const [scanning, setScanning] = useState(false);
  const [starting, setStarting] = useState(false);
  const [result, setResult] = useState(null); // { text, nfe }
  const [error, setError] = useState(null);

  // Ensures a single reader instance.
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
        // ignore errors on stop (the camera may already be released)
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
      if (showToast) showToast(t("Code read."));
    },
    [showToast, t]
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
          /* frame without a code: silent */
        }
      );
      runningRef.current = true;
      setScanning(true);
    } catch (err) {
      console.error(err);
      // Stored in English, translated where it is shown.
      setError(
        "Could not access the camera. Check the browser permissions or use the option to upload an image."
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
      // Reading a file and the camera are mutually exclusive.
      await stopCamera();
      try {
        const scanner = getScanner();
        const decodedText = await scanner.scanFile(file, false);
        handleDetected(decodedText);
      } catch (err) {
        console.error(err);
        setError(
          "No code was found in this image. Try a sharper, well-framed photo."
        );
      } finally {
        // allows uploading the same file again
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    },
    [getScanner, handleDetected, stopCamera]
  );

  // Cleanup on unmount: releases the camera.
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
      if (showToast) showToast(t("Content copied."));
    }
  };

  const nfe = result?.nfe;

  const scanAnother = () => {
    setResult(null);
    setError(null);
    startCamera();
  };

  return (
    <section className="scanner-area scanner" aria-label={t("Read a QR Code or barcode")}>
      <div className="panel scanner-capture">
        <div className="scanner-stage">
          {/* html5-qrcode injects the camera video here. */}
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
                {result ? t("Scan complete") : t("Point at a code")}
              </p>
              <p className="scanner-placeholder-text">
                {t("QR Code, barcode or the key of an NF-e / NFC-e. No camera? Upload a photo.")}
              </p>
            </div>
          )}
        </div>

        <div className="scanner-actions">
          {!scanning ? (
            <button type="button" className="btn btn-primary" onClick={result ? scanAnother : startCamera} disabled={starting}>
              <AiOutlineCamera aria-hidden="true" />
              {starting ? t("Opening the camera…") : result ? t("Scan another code") : t("Use the camera")}
            </button>
          ) : (
            <button type="button" className="btn btn-secondary" onClick={stopCamera}>
              <AiOutlineStop aria-hidden="true" /> {t("Stop camera")}
            </button>
          )}

          <label className="btn btn-secondary scanner-file-btn">
            <AiOutlinePicture aria-hidden="true" /> {t("Upload image")}
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
            <span>{t(error)}</span>
          </p>
        )}
      </div>

      <div className="panel scan-result" aria-live="polite">
        {!result ? (
          <div className="scan-result-empty">
            <h2 className="section-title">{t("What shows up here")}</h2>
            <ul>
              <li>{t("The text or link read, ready to copy or open.")}</li>
              <li>
                {t("On invoices (NF-e, NFC-e, CT-e, MDF-e): state, month of issue, issuer CNPJ, series, number and the check digit verification.")}
              </li>
              <li>{t("A shortcut to generate a QR Code or barcode with the same value.")}</li>
            </ul>
            <p className="field-hint">{t("Reading happens on your device; nothing is sent.")}</p>
          </div>
        ) : (
          <>
            <div className="scan-result-header">
              <h2 className="section-title">{nfe ? t(nfe.model, { code: nfe.modelCode }) : t("Content read")}</h2>
              {nfe && (
                <span className={`badge ${nfe.valid ? "badge-ok" : "badge-warn"}`}>
                  {nfe.valid ? <AiOutlineCheckCircle aria-hidden="true" /> : <AiOutlineWarning aria-hidden="true" />}
                  {nfe.valid ? t("Valid check digit") : t("Invalid check digit")}
                </span>
              )}
            </div>

            {nfe ? (
              <dl className="nfe-grid">
                <div className="nfe-key">
                  <dt>{t("Access key")}</dt>
                  <dd className="mono">{nfe.keyFormatted}</dd>
                </div>
                <div><dt>{t("State (UF)")}</dt><dd>{nfe.uf}</dd></div>
                <div><dt>{t("Issue month")}</dt><dd className="mono">{nfe.emission}</dd></div>
                <div><dt>{t("Issuer CNPJ")}</dt><dd className="mono">{nfe.cnpj}</dd></div>
                <div><dt>{t("Series")}</dt><dd className="mono">{nfe.series}</dd></div>
                <div><dt>{t("Number")}</dt><dd className="mono">{nfe.number}</dd></div>
                <div><dt>{t("Emission type")}</dt><dd>{t(nfe.emissionType, { code: nfe.emissionTypeCode })}</dd></div>
              </dl>
            ) : (
              <p className="scan-result-text mono">{result.text}</p>
            )}

            <div className="scan-result-actions">
              <button type="button" className="btn btn-secondary" onClick={handleCopy}>
                <AiOutlineCopy aria-hidden="true" /> {t("Copy")}
              </button>
              {isUrl(result.text) && (
                <a className="btn btn-secondary" href={result.text} target="_blank" rel="noreferrer">
                  <AiOutlineLink aria-hidden="true" /> {t("Open link")}
                </a>
              )}
              {nfe && (
                <a className="btn btn-secondary" href={NFE_LOOKUP_URL} target="_blank" rel="noreferrer">
                  <AiOutlineFileText aria-hidden="true" /> {t("Look it up on the NF-e portal")}
                </a>
              )}
            </div>
            <div className="scan-result-actions scan-result-generate">
              <span>{t("Generate with this value:")}</span>
              <button type="button" className="btn btn-link" onClick={() => onGenerate && onGenerate("qrcode", result.text)}>
                <AiOutlineQrcode aria-hidden="true" /> QR Code
              </button>
              <button
                type="button"
                className="btn btn-link"
                onClick={() => onGenerate && onGenerate("barcode", nfe ? nfe.key : result.text)}
              >
                <AiOutlineBarcode aria-hidden="true" /> {t("Barcode")}
              </button>
            </div>
          </>
        )}
      </div>
    </section>
  );
};

export default ScannerPanel;
