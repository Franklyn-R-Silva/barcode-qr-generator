import { useState, useEffect, useCallback, useRef } from "react";
import "./App.css";

// Importando os componentes modulares
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Toast from "./components/common/Toast";
import QRCodePreview from "./components/generator/QRCodePreview";
import BarcodePreview from "./components/generator/BarcodePreview";
import Controls from "./components/generator/Controls";
import ModeSelector from "./components/generator/ModeSelector";
import ScannerPanel from "./components/scanner/ScannerPanel";
import HistoryPanel from "./components/generator/HistoryPanel";
import HistoryButton from "./components/generator/HistoryButton";
import { GENERATOR_TYPES } from "./constants/generatorTypes";
import { DEFAULT_BARCODE_FORMAT } from "./constants/barcodeTypes";

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
    logoSize: 25, // Percentual do tamanho do QR Code (25%)
    logoX: 0, // Offset X da posição da logo
    logoY: 0, // Offset Y da posição da logo
    logoSizeMode: "auto", // "auto", "original", "custom"

    // Barcode específico
    barcodeFormat: DEFAULT_BARCODE_FORMAT,
    barcodeWidth: 2,
    barcodeHeight: 100,
    barcodeDisplayValue: true,
    barcodeFontSize: 20,
    barcodeMargin: 10,
  });

  // 2. Estados de Interface (Tema e Notificações)
  const [theme, setTheme] = useState("light");
  const [notification, setNotification] = useState(null);

  // Guarda o último texto salvo no histórico para evitar duplicatas
  const lastSavedText = useRef("");

  // --- Funções Auxiliares (Lógica de Negócio) ---

  // Exibir notificação
  const showToast = (msg) => setNotification(msg);

  // Fechar notificação (memoizado para não reiniciar o timer do Toast a cada render)
  const closeToast = useCallback(() => setNotification(null), []);

  // Atualizar configuração genérica
  const updateConfig = (field, value) => {
    setConfig((prev) => ({ ...prev, [field]: value }));
  };

  // Carregar configuração do histórico
  const loadConfigFromHistory = (historyConfig) => {
    setConfig(historyConfig);
  };

  // Salvar no histórico quando o texto mudar (após 2s de inatividade).
  // Só salva se o texto for diferente do último salvo, evitando entradas
  // duplicadas ao apenas ajustar cores, tamanho ou outras opções.
  useEffect(() => {
    if (config.text && config.text.length > 0) {
      const timer = setTimeout(() => {
        if (config.text !== lastSavedText.current && window.addToHistory) {
          window.addToHistory(config);
          lastSavedText.current = config.text;
        }
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [config]);

  // Alternar tema
  const toggleTheme = () =>
    setTheme((prev) => (prev === "light" ? "dark" : "light"));

  // Enviar conteúdo escaneado para um dos geradores
  const handleGenerateFromScan = (targetType, text) => {
    setConfig((prev) => ({
      ...prev,
      text: text || "",
      generatorType:
        targetType === GENERATOR_TYPES.BARCODE
          ? GENERATOR_TYPES.BARCODE
          : GENERATOR_TYPES.QRCODE,
    }));
    showToast("Conteúdo enviado para o gerador!");
  };

  // Ouvir evento de reset do barcode
  useEffect(() => {
    const handleBarcodeReset = (event) => {
      updateConfig("text", event.detail);
    };

    window.addEventListener("resetBarcodeText", handleBarcodeReset);
    return () => {
      window.removeEventListener("resetBarcodeText", handleBarcodeReset);
    };
  }, []);

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
      {notification && <Toast message={notification} onClose={closeToast} />}

      {/* Painel de Histórico (nível raiz para z-index funcionar corretamente) */}
      <HistoryPanel
        onLoadConfig={loadConfigFromHistory}
        showToast={showToast}
      />

      {/* Cabeçalho */}
      <Header theme={theme} toggleTheme={toggleTheme}>
        <HistoryButton />
      </Header>

      <main className="main-content">
        {/* Barra de seleção de modo (sempre visível, largura total) */}
        <ModeSelector config={config} updateConfig={updateConfig} />

        {config.generatorType === GENERATOR_TYPES.SCANNER ? (
          /* Modo Leitor */
          <ScannerPanel
            showToast={showToast}
            onGenerate={handleGenerateFromScan}
          />
        ) : (
          <>
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
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}

export default App;
