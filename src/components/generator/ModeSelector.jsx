import React from "react";
import {
  AiOutlineQrcode,
  AiOutlineBarcode,
  AiOutlineScan,
} from "react-icons/ai";
import Segmented from "../common/Segmented";
import { GENERATOR_TYPES } from "../../constants/generatorTypes";
import {
  BARCODE_EXAMPLES,
  DEFAULT_BARCODE_FORMAT,
} from "../../constants/barcodeTypes";
import { encodeContent } from "../../utils/qrContent";
import { useT } from "../../i18n";
import "./ModeSelector.css";

/**
 * Mode selector (QR Code / Barcode / Scan code).
 * Always visible at the top, to switch between generating and reading at any time.
 */
const ModeSelector = ({ config, updateConfig }) => {
  const t = useT();
  const selectBarcode = () => {
    updateConfig("generatorType", GENERATOR_TYPES.BARCODE);
    const format = config.barcodeFormat || DEFAULT_BARCODE_FORMAT;
    if (!config.barcodeFormat) updateConfig("barcodeFormat", format);
    if (!config.text || config.text === "https://seusite.com") {
      updateConfig("text", t(BARCODE_EXAMPLES[format]));
    }
  };

  const handleChange = (mode) => {
    if (mode === GENERATOR_TYPES.BARCODE) return selectBarcode();
    updateConfig("generatorType", mode);
    // The barcode value may have replaced the text; the QR form is the source of truth.
    if (mode === GENERATOR_TYPES.QRCODE && config.contentType && config.contentType !== "text") {
      updateConfig("text", encodeContent(config.contentType, config.fields).text);
    }
  };

  return (
    <div className="mode-selector mode-area">
      <Segmented
        size="lg"
        legend={t("What do you want to do?")}
        hideLegend
        name="mode"
        value={config.generatorType}
        onChange={handleChange}
        options={[
          {
            value: GENERATOR_TYPES.QRCODE,
            label: "QR Code",
            icon: <AiOutlineQrcode aria-hidden="true" />,
          },
          {
            value: GENERATOR_TYPES.BARCODE,
            label: t("Barcode"),
            icon: <AiOutlineBarcode aria-hidden="true" />,
          },
          {
            value: GENERATOR_TYPES.SCANNER,
            label: t("Scan code"),
            icon: <AiOutlineScan aria-hidden="true" />,
          },
        ]}
      />
    </div>
  );
};

export default ModeSelector;
