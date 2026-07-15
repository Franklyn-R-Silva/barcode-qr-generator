import React from "react";
import {
  AiOutlineQrcode,
  AiOutlineBarcode,
  AiOutlineScan,
} from "react-icons/ai";
import { GENERATOR_TYPES } from "../../constants/generatorTypes";
import {
  BARCODE_EXAMPLES,
  DEFAULT_BARCODE_FORMAT,
} from "../../constants/barcodeTypes";

/**
 * Barra de seleção de modo (QR Code / Código de Barras / Escanear).
 * Sempre visível no topo, de modo que o usuário possa alternar entre
 * gerar e escanear a qualquer momento.
 */
const ModeSelector = ({ config, updateConfig }) => {
  const active = config.generatorType;

  const selectBarcode = () => {
    updateConfig("generatorType", GENERATOR_TYPES.BARCODE);
    const format = config.barcodeFormat || DEFAULT_BARCODE_FORMAT;
    if (!config.barcodeFormat) updateConfig("barcodeFormat", format);
    if (!config.text || config.text === "https://seusite.com") {
      updateConfig("text", BARCODE_EXAMPLES[format]);
    }
  };

  const modes = [
    {
      id: GENERATOR_TYPES.QRCODE,
      label: "QR Code",
      icon: <AiOutlineQrcode size={24} aria-hidden="true" />,
      onClick: () => updateConfig("generatorType", GENERATOR_TYPES.QRCODE),
    },
    {
      id: GENERATOR_TYPES.BARCODE,
      label: "Código de Barras",
      icon: <AiOutlineBarcode size={24} aria-hidden="true" />,
      onClick: selectBarcode,
    },
    {
      id: GENERATOR_TYPES.SCANNER,
      label: "Escanear",
      icon: <AiOutlineScan size={24} aria-hidden="true" />,
      onClick: () => updateConfig("generatorType", GENERATOR_TYPES.SCANNER),
    },
  ];

  return (
    <div
      className="mode-selector control-group type-selector"
      role="tablist"
      aria-label="Modo de operação"
    >
      <div className="group-header">
        <span>🎯 O que você quer fazer?</span>
      </div>
      <div className="type-buttons">
        {modes.map((mode) => (
          <button
            key={mode.id}
            role="tab"
            aria-selected={active === mode.id}
            className={`type-btn ${active === mode.id ? "active" : ""}`}
            onClick={mode.onClick}
          >
            {mode.icon}
            <span>{mode.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ModeSelector;
