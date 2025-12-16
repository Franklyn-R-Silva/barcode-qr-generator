import React from "react";
import {
  AiOutlineCopy,
  AiOutlineShareAlt,
  AiOutlineSetting,
  AiOutlineBgColors,
  AiOutlinePicture,
  AiOutlineLink,
  AiOutlineSafety,
  AiOutlineQrcode,
  AiOutlineBarcode,
} from "react-icons/ai";
import { GENERATOR_TYPES } from "../../constants/generatorTypes";
import {
  BARCODE_CATEGORIES,
  BARCODE_EXAMPLES,
} from "../../constants/barcodeTypes";
import ColorPickerAdvanced from "./ColorPickerAdvanced";
import "./Controls.css";

const Controls = ({
  config,
  updateConfig,
  handleLogoUpload,
  socialLinks,
  handleCopyText,
}) => {
  const templates = [
    {
      name: "Padrão",
      fg: "#000000",
      bg: "#ffffff",
      style: "squares",
      eye: "square",
    },
    {
      name: "WhatsApp",
      fg: "#128C7E",
      bg: "#E5FFFC",
      style: "dots",
      eye: "circle",
    },
    {
      name: "Dark",
      fg: "#E0E0E0",
      bg: "#1E1E1E",
      style: "squares",
      eye: "square",
    },
    {
      name: "Azul Tech",
      fg: "#2563EB",
      bg: "#EFF6FF",
      style: "dots",
      eye: "square",
    },
  ];

  const isQRCode = config.generatorType === GENERATOR_TYPES.QRCODE;
  const isBarcode = config.generatorType === GENERATOR_TYPES.BARCODE;

  // Preencher com exemplo quando trocar de formato
  const handleFormatChange = (format) => {
    updateConfig("barcodeFormat", format);
    if (BARCODE_EXAMPLES[format]) {
      updateConfig("text", BARCODE_EXAMPLES[format]);
    }
  };

  return (
    <section className="controls-section">
      {/* NOVO: Seletor de Tipo de Gerador */}
      <div className="control-group type-selector">
        <div className="group-header">
          <span>🎯 Tipo de Código</span>
        </div>
        <div className="type-buttons">
          <button
            className={`type-btn ${isQRCode ? "active" : ""}`}
            onClick={() =>
              updateConfig("generatorType", GENERATOR_TYPES.QRCODE)
            }
          >
            <AiOutlineQrcode size={24} />
            <span>QR Code</span>
          </button>
          <button
            className={`type-btn ${isBarcode ? "active" : ""}`}
            onClick={() => {
              updateConfig("generatorType", GENERATOR_TYPES.BARCODE);
              if (!config.barcodeFormat) {
                updateConfig("barcodeFormat", "CODE128");
              }
              // Adicionar valor de exemplo se estiver vazio
              if (!config.text || config.text === "https://seusite.com") {
                updateConfig("text", BARCODE_EXAMPLES["CODE128"]);
              }
            }}
          >
            <AiOutlineBarcode size={24} />
            <span>Código de Barras</span>
          </button>
        </div>
      </div>

      {/* Modelos Prontos - APENAS para QR Code */}
      {isQRCode && (
        <div className="control-group">
          <div className="group-header">
            <span>✨ Modelos Prontos</span>
          </div>
          <div className="templates-grid">
            {templates.map((t) => (
              <button
                key={t.name}
                className="template-btn"
                style={{
                  background: t.bg,
                  color: t.fg,
                  border: `1px solid ${t.fg}`,
                }}
                onClick={() => {
                  updateConfig("fgColor", t.fg);
                  updateConfig("bgColor", t.bg);
                  updateConfig("qrStyle", t.style);
                  updateConfig("eyeStyle", t.eye);
                }}
                title={`Aplicar tema ${t.name}`}
              >
                {t.name}
              </button>
            ))}
          </div>
        </div>
      )}
      {/* 1. Grupo de Conteúdo (Texto/URL) */}
      <div className="control-group">
        <div className="group-header">
          <AiOutlineLink /> <span>Conteúdo</span>
        </div>
        <div className="input-wrapper">
          <textarea
            className="input-text"
            rows={3}
            placeholder={
              isQRCode
                ? "Digite URL, texto ou email..."
                : "Digite o valor do código de barras..."
            }
            value={config.text}
            onChange={(e) => updateConfig("text", e.target.value)}
          />
        </div>

        <div className="share-row">
          <button
            onClick={handleCopyText}
            className="btn-icon"
            title="Copiar Texto"
          >
            <AiOutlineCopy /> Copiar
          </button>
          {isQRCode && (
            <>
              <a
                href={socialLinks.whatsapp}
                target="_blank"
                rel="noreferrer"
                className="btn-icon whatsapp"
              >
                <AiOutlineShareAlt /> WhatsApp
              </a>
              <a
                href={socialLinks.facebook}
                target="_blank"
                rel="noreferrer"
                className="btn-icon facebook"
              >
                <AiOutlineShareAlt /> Facebook
              </a>
            </>
          )}
        </div>
      </div>

      {/* NOVO: Seletor de Formato para Código de Barras */}
      {isBarcode && (
        <div className="control-group">
          <div className="group-header">
            <AiOutlineBarcode /> <span>Formato do Código de Barras</span>
          </div>
          {BARCODE_CATEGORIES.map((category) => (
            <div key={category.name} className="barcode-category">
              <h4 className="category-title">{category.name}</h4>
              <select
                value={
                  category.formats.find((f) => f.value === config.barcodeFormat)
                    ? config.barcodeFormat
                    : ""
                }
                onChange={(e) => handleFormatChange(e.target.value)}
                className="barcode-format-select"
              >
                <option value="">Selecione...</option>
                {category.formats.map((format) => (
                  <option key={format.value} value={format.value}>
                    {format.label}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      )}

      {/* 2. Grupo de Aparência */}
      <div className="control-group">
        <div className="group-header">
          <AiOutlineSetting /> <span>Aparência</span>
        </div>

        {/* Tamanho - Diferente para QR Code e Barcode */}
        <div className="control-row">
          <div className="control-item full-width">
            <label>
              {isQRCode
                ? `Tamanho: ${config.size}px`
                : `Altura: ${config.barcodeHeight || 100}px`}
            </label>
            <input
              type="range"
              min={isQRCode ? "150" : "50"}
              max={isQRCode ? "450" : "200"}
              step="10"
              value={isQRCode ? config.size : config.barcodeHeight || 100}
              onChange={(e) =>
                updateConfig(
                  isQRCode ? "size" : "barcodeHeight",
                  Number(e.target.value)
                )
              }
            />
          </div>
        </div>

        {/* Opções específicas para BARCODE */}
        {isBarcode && (
          <>
            <div className="control-row">
              <div className="control-item full-width">
                <label>Largura da Barra: {config.barcodeWidth || 2}px</label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  step="0.5"
                  value={config.barcodeWidth || 2}
                  onChange={(e) =>
                    updateConfig("barcodeWidth", Number(e.target.value))
                  }
                />
              </div>
            </div>

            <div className="control-row">
              <div className="control-item full-width">
                <label>
                  Tamanho da Fonte: {config.barcodeFontSize || 20}px
                </label>
                <input
                  type="range"
                  min="10"
                  max="40"
                  step="2"
                  value={config.barcodeFontSize || 20}
                  onChange={(e) =>
                    updateConfig("barcodeFontSize", Number(e.target.value))
                  }
                />
              </div>
            </div>

            <div className="control-row">
              <div className="control-item full-width">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={config.barcodeDisplayValue !== false}
                    onChange={(e) =>
                      updateConfig("barcodeDisplayValue", e.target.checked)
                    }
                  />
                  Exibir valor abaixo do código
                </label>
              </div>
            </div>
          </>
        )}

        {/* Estilos - APENAS para QR Code */}
        {isQRCode && (
          <>
            <div className="control-row">
              <div className="control-item">
                <label>Módulos</label>
                <select
                  value={config.qrStyle}
                  onChange={(e) => updateConfig("qrStyle", e.target.value)}
                >
                  <option value="squares">Quadrados</option>
                  <option value="dots">Pontos</option>
                </select>
              </div>
              <div className="control-item">
                <label>Olhos</label>
                <select
                  value={config.eyeStyle}
                  onChange={(e) => updateConfig("eyeStyle", e.target.value)}
                >
                  <option value="square">Quadrados</option>
                  <option value="circle">Redondos</option>
                </select>
              </div>
            </div>

            {/* Nível de Correção de Erro - APENAS para QR Code */}
            <div className="control-row">
              <div className="control-item full-width">
                <label title="Aumente para garantir leitura com logos grandes">
                  <AiOutlineSafety style={{ marginRight: 4 }} />
                  Margem de Erro
                </label>
                <select
                  value={config.ecLevel}
                  onChange={(e) => updateConfig("ecLevel", e.target.value)}
                >
                  <option value="L">
                    Baixa (L) - Melhor para dados longos
                  </option>
                  <option value="M">Média (M)</option>
                  <option value="Q">Alta (Q)</option>
                  <option value="H">Máxima (H) - Melhor para Logos</option>
                </select>
              </div>
            </div>
          </>
        )}
      </div>

      {/* 3. Grupo de Cores */}
      <div className="control-group">
        <div className="group-header">
          <AiOutlineBgColors /> <span>Cores</span>
        </div>
        <div className="color-pickers-advanced">
          <ColorPickerAdvanced
            label="Cor da Frente"
            color={config.fgColor}
            onChange={(color) => updateConfig("fgColor", color)}
          />
          <ColorPickerAdvanced
            label="Cor de Fundo"
            color={config.bgColor}
            onChange={(color) => updateConfig("bgColor", color)}
          />
        </div>
      </div>

      {/* 4. Grupo de Logo - APENAS para QR Code */}
      {isQRCode && (
        <div className="control-group">
          <div className="group-header">
            <AiOutlinePicture /> <span>Logo</span>
          </div>

          <label className="file-upload">
            <span>
              {config.logoImage ? "Alterar Logo" : "Carregar Logo (Opcional)"}
            </span>
            <input type="file" accept="image/*" onChange={handleLogoUpload} />
          </label>

          {config.logoImage && (
            <div className="logo-settings fade-in">
              {/* Modo de Tamanho */}
              <div className="control-item full-width">
                <label>Modo de Tamanho</label>
                <select
                  value={config.logoSizeMode || "auto"}
                  onChange={(e) => updateConfig("logoSizeMode", e.target.value)}
                >
                  <option value="auto">Automático (Proporcional ao QR)</option>
                  <option value="original">Tamanho Original da Imagem</option>
                  <option value="custom">Personalizado (Ajustável)</option>
                </select>
              </div>

              {/* Tamanho Personalizado */}
              {config.logoSizeMode === "custom" && (
                <div className="control-item full-width">
                  <label>Tamanho: {config.logoSize || 25}%</label>
                  <input
                    type="range"
                    min="10"
                    max="50"
                    step="1"
                    value={config.logoSize || 25}
                    onChange={(e) =>
                      updateConfig("logoSize", Number(e.target.value))
                    }
                  />
                  <small style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginTop: '0.25rem' }}>
                    Ajusta o tamanho da logo em relação ao QR Code
                  </small>
                </div>
              )}

              {/* Opacidade */}
              <div className="control-item full-width">
                <label>Opacidade: {(config.logoOpacity * 100).toFixed(0)}%</label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={config.logoOpacity}
                  onChange={(e) =>
                    updateConfig("logoOpacity", Number(e.target.value))
                  }
                />
              </div>

              {/* Remover fundo */}
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={config.removeQrCodeBehindLogo}
                  onChange={(e) =>
                    updateConfig("removeQrCodeBehindLogo", e.target.checked)
                  }
                />
                Remover padrão do QR atrás da logo
              </label>

              {/* Informação sobre posicionamento */}
              <div style={{ 
                marginTop: '0.75rem', 
                padding: '0.75rem', 
                background: 'var(--bg-secondary)', 
                borderRadius: '8px',
                border: '1px solid var(--border)'
              }}>
                <small style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: '1.5' }}>
                  💡 <strong>Dica:</strong> A logo é sempre centralizada no QR Code. 
                  Use o modo "Original" para manter proporções da imagem ou "Personalizado" para ajustar livremente.
                </small>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default Controls;
