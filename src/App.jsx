import { useState, useRef, useEffect } from "react";
import { QRCode } from "react-qrcode-logo";
import {
  AiOutlineDownload,
  AiOutlineCopy,
  AiOutlineShareAlt,
  AiOutlineBgColors,
  AiOutlineSetting,
  AiOutlineCheckCircle,
} from "react-icons/ai";
import "./App.css";

// Componente de Notificação (Toast)
const Toast = ({ message, onClose }) => (
  <div className="toast visible">
    <AiOutlineCheckCircle size={20} />
    <span>{message}</span>
  </div>
);

function App() {
  // Estado unificado para configurações do QR Code
  const [config, setConfig] = useState({
    text: "",
    size: 250, // Tamanho padrão um pouco maior
    fgColor: "#000000",
    bgColor: "#ffffff",
    ecLevel: "H",
    qrStyle: "squares",
    eyeStyle: "square",
    logoImage: "",
    logoOpacity: 1,
    removeQrCodeBehindLogo: false,
  });

  const [theme, setTheme] = useState("light");
  const [notification, setNotification] = useState(null);
  const qrRef = useRef(null);

  // Fecha a notificação automaticamente após 3 segundos
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const showToast = (msg) => setNotification(msg);

  const updateConfig = (field, value) => {
    setConfig((prev) => ({ ...prev, [field]: value }));
  };

  const toggleTheme = () =>
    setTheme((prev) => (prev === "light" ? "dark" : "light"));

  const eyeRadius = config.eyeStyle === "circle" ? [10, 10, 10] : [0, 0, 0]; // Array para garantir compatibilidade

  // --- Ações ---

  const getCanvas = () => qrRef.current?.querySelector("canvas");

  const handleDownload = () => {
    const canvas = getCanvas();
    if (!canvas) return;

    try {
      const dataUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `qrcode-${Date.now()}.png`;
      link.href = dataUrl;
      link.click();
      showToast("Download iniciado!");
    } catch (err) {
      console.error(err);
    }
  };

  const handleCopyQRCode = async () => {
    const canvas = getCanvas();
    if (!canvas) return;

    try {
      const dataUrl = canvas.toDataURL("image/png");
      const blob = await (await fetch(dataUrl)).blob();
      const clipboardItem = new ClipboardItem({ "image/png": blob });
      await navigator.clipboard.write([clipboardItem]);
      showToast("QR Code copiado!");
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => updateConfig("logoImage", reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleCopyText = () => {
    if (config.text) {
      navigator.clipboard.writeText(config.text);
      showToast("Texto copiado!");
    }
  };

  // Links de compartilhamento
  const shareTextEncoded = encodeURIComponent(config.text);
  const socialLinks = {
    whatsapp: `https://wa.me/?text=${shareTextEncoded}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${shareTextEncoded}`,
    twitter: `https://twitter.com/intent/tweet?text=${shareTextEncoded}`,
  };

  return (
    <div className={`app-container ${theme}`}>
      {notification && (
        <Toast message={notification} onClose={() => setNotification(null)} />
      )}

      <header className="main-header">
        <div className="brand">
          <h1>QR Generator Pro</h1>
        </div>
        <button onClick={toggleTheme} className="theme-toggle">
          {theme === "light" ? "🌙" : "☀️"}
        </button>
      </header>

      <main className="main-content">
        {/* Coluna da Esquerda: Preview (Sticky) */}
        <section className="preview-section">
          <div className="qr-card" ref={qrRef}>
            <QRCode
              value={config.text || "https://seusite.com"}
              size={config.size}
              fgColor={config.fgColor}
              bgColor={config.bgColor}
              ecLevel={config.ecLevel}
              qrStyle={config.qrStyle}
              logoImage={config.logoImage}
              logoWidth={config.size * 0.25}
              logoHeight={config.size * 0.25}
              logoOpacity={config.logoOpacity}
              removeQrCodeBehindLogo={config.removeQrCodeBehindLogo}
              eyeRadius={eyeRadius}
            />
          </div>

          <div className="action-buttons-grid">
            <button onClick={handleCopyQRCode} className="btn btn-secondary">
              <AiOutlineCopy /> Copiar Imagem
            </button>
            <button onClick={handleDownload} className="btn btn-primary">
              <AiOutlineDownload /> Baixar PNG
            </button>
          </div>
        </section>

        {/* Coluna da Direita: Controles */}
        <section className="controls-section">
          <div className="control-group">
            <label>Conteúdo</label>
            <textarea
              className="input-text"
              rows={3}
              placeholder="Digite URL, texto ou email..."
              value={config.text}
              onChange={(e) => updateConfig("text", e.target.value)}
            />
            <div className="share-row">
              <button
                onClick={handleCopyText}
                className="btn-icon"
                title="Copiar Texto"
              >
                <AiOutlineCopy />
              </button>
              <a
                href={socialLinks.whatsapp}
                target="_blank"
                rel="noreferrer"
                className="btn-icon whatsapp"
              >
                <AiOutlineShareAlt /> WA
              </a>
              <a
                href={socialLinks.facebook}
                target="_blank"
                rel="noreferrer"
                className="btn-icon facebook"
              >
                <AiOutlineShareAlt /> FB
              </a>
            </div>
          </div>

          <div className="control-group">
            <div className="group-header">
              <AiOutlineSetting /> <span>Aparência</span>
            </div>

            <div className="control-row">
              <div className="control-item">
                <label>Tamanho ({config.size}px)</label>
                <input
                  type="range"
                  min="150"
                  max="450"
                  step="10"
                  value={config.size}
                  onChange={(e) => updateConfig("size", Number(e.target.value))}
                />
              </div>
            </div>

            <div className="control-row">
              <div className="control-item">
                <label>Estilo Módulos</label>
                <select
                  value={config.qrStyle}
                  onChange={(e) => updateConfig("qrStyle", e.target.value)}
                >
                  <option value="squares">Quadrados</option>
                  <option value="dots">Pontos</option>
                </select>
              </div>
              <div className="control-item">
                <label>Estilo Olhos</label>
                <select
                  value={config.eyeStyle}
                  onChange={(e) => updateConfig("eyeStyle", e.target.value)}
                >
                  <option value="square">Quadrados</option>
                  <option value="circle">Redondos</option>
                </select>
              </div>
            </div>
          </div>

          <div className="control-group">
            <div className="group-header">
              <AiOutlineBgColors /> <span>Cores</span>
            </div>
            <div className="color-pickers">
              <div className="color-item">
                <input
                  type="color"
                  value={config.fgColor}
                  onChange={(e) => updateConfig("fgColor", e.target.value)}
                />
                <label>Cor do QR</label>
              </div>
              <div className="color-item">
                <input
                  type="color"
                  value={config.bgColor}
                  onChange={(e) => updateConfig("bgColor", e.target.value)}
                />
                <label>Fundo</label>
              </div>
            </div>
          </div>

          <div className="control-group">
            <div className="group-header">
              <span>Logo & Customização</span>
            </div>

            <label className="file-upload">
              <span>{config.logoImage ? "Trocar Logo" : "Carregar Logo"}</span>
              <input type="file" accept="image/*" onChange={handleLogoUpload} />
            </label>

            {config.logoImage && (
              <>
                <div className="control-item">
                  <label>Opacidade do Logo</label>
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
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={config.removeQrCodeBehindLogo}
                    onChange={(e) =>
                      updateConfig("removeQrCodeBehindLogo", e.target.checked)
                    }
                  />
                  Remover QR atrás do logo
                </label>
              </>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
