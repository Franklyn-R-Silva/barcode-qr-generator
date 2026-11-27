// src/components/generator/ExportOptions.jsx
import React, { useState } from "react";
import { AiOutlineDownload, AiOutlineCopy } from "react-icons/ai";
import jsPDF from "jspdf";
import Segmented from "../common/Segmented";
import { svgDataUrl } from "../../utils/qrSvg";
import { useT } from "../../i18n";
import "./ExportOptions.css";

const FORMATS = [
  { value: "png", label: "PNG" },
  { value: "webp", label: "WEBP" },
  { value: "svg", label: "SVG" },
  { value: "pdf", label: "PDF" },
];

// Rasterises the SVG at the screen's pixel density, as the old canvas export did.
const svgToCanvas = async (svg) => {
  const img = new Image();
  img.src = svgDataUrl(svg);
  await img.decode();
  const scale = window.devicePixelRatio || 1;
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(img.naturalWidth * scale);
  canvas.height = Math.round(img.naturalHeight * scale);
  canvas.getContext("2d").drawImage(img, 0, 0, canvas.width, canvas.height);
  return canvas;
};

const save = (href, name) => {
  const link = document.createElement("a");
  link.download = name;
  link.href = href;
  link.click();
};

/**
 * Download and copy for both generators. `getSvg` returns the code as an SVG
 * string; every format is produced from it, so files match the preview.
 */
const ExportOptions = ({ getSvg, kind, config, updateConfig, showToast, disabled = false }) => {
  const t = useT();
  const [format, setFormat] = useState("png");
  const formatName = format.toUpperCase();
  const base = `${kind}-${Date.now()}`;

  const download = async () => {
    try {
      const svg = getSvg();
      if (format === "svg") {
        const url = URL.createObjectURL(new Blob([svg], { type: "image/svg+xml" }));
        save(url, `${base}.svg`);
        URL.revokeObjectURL(url);
      } else {
        const canvas = await svgToCanvas(svg);
        if (format === "pdf") {
          const pdf = new jsPDF({
            orientation: canvas.width > canvas.height ? "landscape" : "portrait",
            unit: "px",
            format: [canvas.width, canvas.height],
          });
          pdf.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0, canvas.width, canvas.height);
          pdf.save(`${base}.pdf`);
        } else {
          save(canvas.toDataURL(`image/${format}`, 0.95), `${base}.${format}`);
        }
      }
      showToast?.(t("{format} downloaded.", { format: formatName }));
    } catch (err) {
      console.error(err);
      showToast?.(t("Error downloading the {format}. Try another format.", { format: formatName }));
    }
  };

  const copy = async () => {
    try {
      const canvas = await svgToCanvas(getSvg());
      const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
      await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
      showToast?.(t("Image copied."));
    } catch (err) {
      console.error(err);
      showToast?.(t("Error copying the image. Use the Download button."));
    }
  };

  return (
    <div className="export-options">
      <div className="export-actions">
        <button type="button" onClick={download} className="btn btn-primary export-download" disabled={disabled}>
          <AiOutlineDownload aria-hidden="true" />
          {t("Download {format}", { format: formatName })}
        </button>
        <button type="button" onClick={copy} className="btn btn-secondary" disabled={disabled} aria-label={t("Copy image")}>
          <AiOutlineCopy aria-hidden="true" /> {t("Copy")}
        </button>
      </div>
      <div className="export-settings">
        <Segmented
          legend={t("File format")}
          hideLegend
          name={`export-format-${kind}`}
          value={format}
          onChange={setFormat}
          options={FORMATS}
        />
        <label className="check export-transparent">
          <input
            type="checkbox"
            checked={!!config.transparentBg}
            onChange={(e) => updateConfig("transparentBg", e.target.checked)}
          />
          {t("Transparent background")}
        </label>
      </div>
    </div>
  );
};

export default ExportOptions;
