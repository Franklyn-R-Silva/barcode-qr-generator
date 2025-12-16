import { useState, useEffect } from "react";
import "./App.css";

// Importando os componentes modulares
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Toast from "./components/common/Toast";
import QRCodePreview from "./components/generator/QRCodePreview";
import BarcodePreview from "./components/generator/BarcodePreview";
import Controls from "./components/generator/Controls";
import HistoryPanel from "./components/generator/HistoryPanel";
import { GENERATOR_TYPES } from "./constants/generatorTypes";
import { BARCODE_FORMATS } from "./constants/barcodeTypes";

function App() {
  // 1. Estado Unificado das Configurações
  const [config, setConfig] = useState({
    // Tipo de Gerador
    generatorType: GENERATOR_TYPES.QRCODE,

    // Comum
    text: "",
    fgColor: "#000000",
    bgColor: "#ffffff",

    // QR Code específico
    size: 280,
    ecLevel: "H",
    qrStyle: "squares",
    eyeStyle: "square",
    logoImage: "",
    logoOpacity: 1,
    removeQrCodeBehindLogo: false,

    // Barcode específico
    barcodeFormat: BARCODE_FORMATS.CODE128,
    barcodeWidth: 2,
    barcodeHeight: 100,
    barcodeDisplayValue: true,
    barcodeFontSize: 20,
    barcodeMargin: 10,
  });

  // 2. Estados de Interface (Tema e Notificações)
  const [theme, setTheme] = useState("light");
  const [notification, setNotification] = useState(null);

  // --- Funções Auxiliares (Lógica de Negócio) ---

  // Exibir notificação
  const showToast = (msg) => setNotification(msg);

  // Atualizar configuração genérica
  const updateConfig = (field, value) => {
    setConfig((prev) => ({ ...prev, [field]: value }));
  };

  // Carregar configuração do histórico
  const loadConfigFromHistory = (historyConfig) => {
    setConfig(historyConfig);
  };

  // Salvar no histórico quando texto mudar
  useEffect(() => {
    if (config.text && config.text.length > 0) {
      const timer = setTimeout(() => {
        if (window.addToHistory) {
          window.addToHistory(config);
        }
      }, 2000); // Salva após 2 segundos de inatividade

      return () => clearTimeout(timer);
    }
  }, [config.text, config.generatorType]);

  // Alternar tema
  const toggleTheme = () =>
    setTheme((prev) => (prev === "light" ? "dark" : "light"));

  // Upload de Logo
  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateConfig("logoImage", reader.result);
        showToast("Logo carregado com sucesso!");
      };
      reader.readAsDataURL(file);
    }
  };

  // Copiar o texto do input (não a imagem)
  const handleCopyText = () => {
    if (config.text) {
      navigator.clipboard.writeText(config.text);
      showToast("Texto copiado para a área de transferência!");
    } else {
      showToast("Digite algum texto primeiro!");
    }
  };

  // Gerar links de compartilhamento social
  const shareTextEncoded = encodeURIComponent(config.text);
  const socialLinks = {
    whatsapp: `https://wa.me/?text=${shareTextEncoded}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${shareTextEncoded}`,
    twitter: `https://twitter.com/intent/tweet?text=${shareTextEncoded}`,
  };

  return (
    <div className={`app-container ${theme}`}>
      {/* Componente de Notificação (Renderizado condicionalmente) */}
      {notification && (
        <Toast message={notification} onClose={() => setNotification(null)} />
      )}

      {/* Cabeçalho */}
      <Header theme={theme} toggleTheme={toggleTheme} />

      <main className="main-content">
        {/* Esquerda: Visualização do Código */}
        {config.generatorType === GENERATOR_TYPES.QRCODE ? (
          <QRCodePreview config={config} showToast={showToast} />
        ) : (
          <BarcodePreview config={config} showToast={showToast} />
        )}

        {/* Direita: Controles de Edição */}
        <Controls
          config={config}
          updateConfig={updateConfig}
          handleLogoUpload={handleLogoUpload}
          socialLinks={socialLinks}
          handleCopyText={handleCopyText}
        />
      </main>

      {/* Botão Flutuante de Histórico */}
      <HistoryPanel
        onLoadConfig={loadConfigFromHistory}
        showToast={showToast}
      />

      <Footer />
    </div>
  );
}

export default App;
