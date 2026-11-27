import React, { useEffect, useMemo, useState } from "react";
import { AiOutlineCloseCircle, AiOutlineCheckCircle, AiOutlineWarning } from "react-icons/ai";
import ExportOptions from "./ExportOptions";
import { qrSvg, svgDataUrl } from "../../utils/qrSvg";
import { readQrSvg } from "../../utils/readQr";
import "./GeneratorArea.css";

const EXAMPLE = "https://qrcode.devfrs.com";

const QRCodePreview = ({ config, updateConfig, showToast }) => {
  const isExample = !config.text;

  const qr = useMemo(() => {
    try {
      return qrSvg(config, config.text || EXAMPLE);
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
        ok = (await readQrSvg(qr.svg)) === (config.text || EXAMPLE);
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
    <section className="panel preview-area preview-panel" aria-label="Pré-visualização do QR Code">
      <div className={`preview-stage ${config.transparentBg ? "is-transparent" : ""}`}>
        {qr ? (
          <img
            className="preview-code qr-image"
            src={svgDataUrl(qr.svg)}
            width={qr.width}
            height={qr.height}
            alt={isExample ? "QR Code de exemplo" : `QR Code com o conteúdo: ${config.text}`}
          />
        ) : (
          <p className="alert alert-danger preview-error" role="alert">
            <AiOutlineCloseCircle aria-hidden="true" />
            <span>
              <strong>Conteúdo grande demais para um QR Code.</strong> Encurte o
              texto ou use a correção de erro L.
            </span>
          </p>
        )}
      </div>

      <p className="preview-meta">
        {isExample ? (
          "Exemplo: preencha o conteúdo para criar o seu."
        ) : (
          <>
            {config.size} px <span aria-hidden="true">·</span> correção {config.ecLevel}
            {qr && (
              <span className={`read-test read-${readable === null ? "pending" : readable ? "ok" : "fail"}`} role="status">
                <span aria-hidden="true"> · </span>
                {readable === null ? (
                  "testando leitura…"
                ) : readable ? (
                  <>
                    <AiOutlineCheckCircle aria-hidden="true" /> leitura testada
                  </>
                ) : (
                  <>
                    <AiOutlineWarning aria-hidden="true" /> não leu
                  </>
                )}
              </span>
            )}
          </>
        )}
      </p>
      {readable === false && !isExample && (
        <p className="read-advice" role="alert">
          O leitor não conseguiu ler este código. Use correção H, diminua a logo,
          clareie a foto ou aumente o contraste.
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
