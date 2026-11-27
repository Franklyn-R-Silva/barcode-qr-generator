import React, { useEffect, useMemo, useState } from "react";
import { AiOutlineCloseCircle, AiOutlineCheckCircle, AiOutlineWarning } from "react-icons/ai";
import ExportOptions from "./ExportOptions";
import { qrSvg, svgDataUrl, EXAMPLE_URL } from "../../utils/qrSvg";
import { readQrSvg } from "../../utils/readQr";
import { useT } from "../../i18n";
import "./GeneratorArea.css";


const QRCodePreview = ({ config, updateConfig, showToast }) => {
  const t = useT();
  const isExample = !config.text;

  const qr = useMemo(() => {
    try {
      return qrSvg(config, config.text || EXAMPLE_URL);
    } catch {
      return null; // more data than a QR Code holds
    }
  }, [config]);

  // Reads the drawn code back, like a phone would, a moment after each change.
  const [readable, setReadable] = useState(null); // null = testing
  useEffect(() => {
    if (!qr) return undefined;
    let cancelled = false;
    setReadable(null);
    const timer = setTimeout(async () => {
      let ok = false;
      try {
        ok = (await readQrSvg(qr.svg)) === (config.text || EXAMPLE_URL);
      } catch {
        ok = false;
      }
      if (!cancelled) setReadable(ok);
    }, 500);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [qr, config.text]);

  return (
    <section className="panel preview-area preview-panel" aria-label={t("QR Code preview")}>
      <div className={`preview-stage ${config.transparentBg ? "is-transparent" : ""}`}>
        {qr ? (
          <img
            className="preview-code qr-image"
            src={svgDataUrl(qr.svg)}
            width={qr.width}
            height={qr.height}
            alt={isExample ? t("Example QR Code") : t("QR Code with the content: {text}", { text: config.text })}
          />
        ) : (
          <p className="alert alert-danger preview-error" role="alert">
            <AiOutlineCloseCircle aria-hidden="true" />
            <span>
              <strong>{t("Content too large for a QR Code.")}</strong>{" "}
              {t("Shorten the text or use error correction L.")}
            </span>
          </p>
        )}
      </div>

      <p className="preview-meta">
        {isExample ? (
          t("Example: fill in the content to create yours.")
        ) : (
          <>
            {config.size} px <span aria-hidden="true">·</span> {t("error correction {level}", { level: config.ecLevel })}
            {qr && (
              <span className={`read-test read-${readable === null ? "pending" : readable ? "ok" : "fail"}`} role="status">
                <span aria-hidden="true"> · </span>
                {readable === null ? (
                  t("testing scan…")
                ) : readable ? (
                  <>
                    <AiOutlineCheckCircle aria-hidden="true" /> {t("scan tested")}
                  </>
                ) : (
                  <>
                    <AiOutlineWarning aria-hidden="true" /> {t("did not scan")}
                  </>
                )}
              </span>
            )}
          </>
        )}
      </p>
      {readable === false && !isExample && (
        <p className="read-advice" role="alert">
          {t("The reader could not read this code. Use correction H, shrink the logo, lighten the photo or raise the contrast.")}
        </p>
      )}

      <ExportOptions
        kind="qrcode"
        getSvg={() => qr.svg}
        config={config}
        updateConfig={updateConfig}
        showToast={showToast}
        disabled={!qr}
      />
    </section>
  );
};

export default QRCodePreview;
