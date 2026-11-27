import React, { useMemo } from "react";
import { AiOutlineCloseCircle } from "react-icons/ai";
import ExportOptions from "./ExportOptions";
import { qrSvg, svgDataUrl } from "../../utils/qrSvg";
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
            QR Code <span aria-hidden="true">·</span> {config.size} px{" "}
            <span aria-hidden="true">·</span> correção {config.ecLevel}
          </>
        )}
      </p>

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
