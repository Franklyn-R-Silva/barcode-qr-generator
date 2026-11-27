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
import "./ModeSelector.css";

/**
 * Seletor de modo (QR Code / Código de barras / Ler código).
 * Sempre visível no topo, para alternar entre gerar e ler a qualquer momento.
 */
const ModeSelector = ({ config, updateConfig }) => {
  const selectBarcode = () => {
    updateConfig("generatorType", GENERATOR_TYPES.BARCODE);
    const format = config.barcodeFormat || DEFAULT_BARCODE_FORMAT;
    if (!config.barcodeFormat) updateConfig("barcodeFormat", format);
    if (!config.text || config.text === "https://seusite.com") {
      updateConfig("text", BARCODE_EXAMPLES[format]);
    }
  };

  const handleChange = (mode) => {
    if (mode === GENERATOR_TYPES.BARCODE) selectBarcode();
    else updateConfig("generatorType", mode);
  };

  return (
    <div className="mode-selector mode-area">
      <Segmented
        size="lg"
        legend="O que você quer fazer?"
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
            label: "Código de barras",
            icon: <AiOutlineBarcode aria-hidden="true" />,
          },
          {
            value: GENERATOR_TYPES.SCANNER,
            label: "Ler código",
            icon: <AiOutlineScan aria-hidden="true" />,
          },
        ]}
      />
    </div>
  );
};

export default ModeSelector;
