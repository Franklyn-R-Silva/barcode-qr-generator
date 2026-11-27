import { useState, useEffect, useCallback, useRef } from "react";
import "./App.css";

import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Toast from "./components/common/Toast";
import QRCodePreview from "./components/generator/QRCodePreview";
import BarcodePreview from "./components/generator/BarcodePreview";
import Controls, { ContentInput } from "./components/generator/Controls";
import ModeSelector from "./components/generator/ModeSelector";
import ScannerPanel from "./components/scanner/ScannerPanel";
import HistoryPanel from "./components/generator/HistoryPanel";
import HistoryButton from "./components/generator/HistoryButton";
import { GENERATOR_TYPES } from "./constants/generatorTypes";
import { DEFAULT_BARCODE_FORMAT } from "./constants/barcodeTypes";
import { loadImage } from "./utils/image";
import { LangContext, translate } from "./i18n";

function App() {
  // UI language: the saved choice, else the browser language.
  const [lang, setLang] = useState(() => {
    try {
      const saved = localStorage.getItem("lang");
      if (saved === "pt" || saved === "en") return saved;
    } catch {
      /* storage blocked: fall back to the browser language */
    }
    return navigator.language?.startsWith("pt") ? "pt" : "en";
  });
  const t = (text, vars) => translate(lang, text, vars);

  // 1. Unified configuration state
  const [config, setConfig] = useState({
    // Generator type
    generatorType: GENERATOR_TYPES.QRCODE,

    // Shared
    text: "",
    contentType: "link", // QR: link | text | pix | whatsapp | wifi | email | phone | sms | vcard
    fields: {}, // form values of the content type
    transparentBg: false,
    fgColor: "#000000",
    bgColor: "#ffffff",

    // QR Code only
    size: 280,
    ecLevel: "H",
    qrStyle: "squares",
    eyeStyle: "square",
    logoImage: "",
    logoOpacity: 1,
    removeQrCodeBehindLogo: false,
    logoSize: 25, // % of the QR Code size
    logoRadius: 0, // % of the logo side (50 = circle)
    logoPad: 0, // px of border around the logo
    moduleScale: 1, // module size (0.4–1)
    margin: 10, // quiet zone, px
    gradientOn: false,
    fgColor2: "#2563eb",
    eyeColorOn: false,
    eyeColor: "#000000",
    bgImage: "", // photo behind the code (artistic QR)
    bgImageLighten: 0.5, // veil of the background colour over the photo
    bgImageMode: "behind", // behind | modules (photo fills the dark modules)
    moduleImageDarken: 0.35, // veil of the code colour over the photo in the modules
    frame: false,
    frameStyle: "band", // band | top | arc | bubble | pill | ticket | circle | square
    frameText2: "", // optional label on the other side
    frameFontScale: 1,
    frameBold: true,
    frameColorsOn: false,
    frameColor: "#111827",
    frameTextColor: "#ffffff",
    frameGradient: false,
    circleText: "around", // around | arcs
    gradientDir: "d", // h | v | d | r
    gradient3On: false,
    fgColor3: "#7c3aed",
    bgGradientOn: false,
    bgColor2: "#eff6ff",
    frameText: t("Scan me"),

    // Barcode only
    barcodeFormat: DEFAULT_BARCODE_FORMAT,
    barcodeWidth: 2,
    barcodeHeight: 100,
    barcodeDisplayValue: true,
    barcodeFontSize: 20,
    barcodeMargin: 10,
  });

  // 2. Interface state (theme and notifications)
  const [theme, setTheme] = useState(() => {
    try {
      const saved = localStorage.getItem("theme");
      if (saved === "light" || saved === "dark") return saved;
    } catch {
      /* storage blocked: fall back to the system preference */
    }
    return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  });
  const [notification, setNotification] = useState(null);

  // Last text saved to the history, to avoid duplicates
  const lastSavedText = useRef("");

  // --- Helpers ---

  // Show a notification
  const showToast = (msg) => setNotification(msg);

  // Close the notification (memoised so the Toast timer does not restart on every render)
  const closeToast = useCallback(() => setNotification(null), []);

  // Update one config field
  const updateConfig = (field, value) => {
    setConfig((prev) => ({ ...prev, [field]: value }));
  };

  // Load a config from the history.
  // Old entries have no content type: they open as free text.
  const loadConfigFromHistory = (historyConfig) => {
    setConfig((prev) => ({
      ...prev,
      contentType: "text",
      fields: {},
      ...historyConfig,
      // The old "Tamanho original" logo mode drew the logo at 40%.
      ...(historyConfig.logoSizeMode === "original" ? { logoSize: 40 } : {}),
    }));
  };

  // Save to the history when the text changes (after 2s of inactivity).
  // Only saves when the text differs from the last one saved, so adjusting
  // colours, size or other options does not add duplicate entries.
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

  // The theme sits on <html> so the page background follows it, and is remembered.
  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
    try {
      localStorage.setItem("theme", theme);
    } catch {
      /* no storage: the theme just is not remembered */
    }
  }, [theme]);

  // Same for the language: <html lang> for screen readers, and remembered.
  useEffect(() => {
    document.documentElement.lang = lang === "pt" ? "pt-BR" : "en";
    try {
      localStorage.setItem("lang", lang);
    } catch {
      /* no storage: the language just is not remembered */
    }
  }, [lang]);

  const toggleLang = () => {
    const next = lang === "pt" ? "en" : "pt";
    setLang(next);
    // The default frame label follows the language until the user edits it.
    setConfig((prev) =>
      prev.frameText === t("Scan me") ? { ...prev, frameText: translate(next, "Scan me") } : prev
    );
  };

  // Toggle the theme
  const toggleTheme = () =>
    setTheme((prev) => (prev === "light" ? "dark" : "light"));

  // Send scanned content to one of the generators
  const handleGenerateFromScan = (targetType, text) => {
    setConfig((prev) => ({
      ...prev,
      text: text || "",
      contentType: "text",
      generatorType:
        targetType === GENERATOR_TYPES.BARCODE
          ? GENERATOR_TYPES.BARCODE
          : GENERATOR_TYPES.QRCODE,
    }));
    showToast(t("Value sent to the generator."));
  };

  // Listen for the barcode reset event
  useEffect(() => {
    const handleBarcodeReset = (event) => {
      updateConfig("text", event.detail);
    };

    window.addEventListener("resetBarcodeText", handleBarcodeReset);
    return () => {
      window.removeEventListener("resetBarcodeText", handleBarcodeReset);
    };
  }, []);

  // Logo upload
  // Logo keeps PNG transparency; the background photo goes JPEG to stay small.
  const handleImageUpload = (field) => async (e) => {
    const file = e.target.files[0];
    e.target.value = ""; // allow picking the same file again
    if (!file) return;
    try {
      const isLogo = field === "logoImage";
      updateConfig(field, await loadImage(file, isLogo ? 512 : 800, isLogo ? "image/png" : "image/jpeg"));
      showToast(isLogo ? t("Logo added.") : t("Background image added."));
    } catch {
      showToast(t("Error: could not open that image."));
    }
  };

  // Copy the input text (not the image)
  const handleCopyText = () => {
    if (config.text) {
      navigator.clipboard.writeText(config.text);
      showToast(t("Text copied."));
    } else {
      showToast(t("Nothing to copy: type some content first."));
    }
  };

  // Social share links
  const shareTextEncoded = encodeURIComponent(config.text);
  const socialLinks = {
    whatsapp: `https://wa.me/?text=${shareTextEncoded}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${shareTextEncoded}`,
  };

  const isScanner = config.generatorType === GENERATOR_TYPES.SCANNER;

  return (
    <LangContext.Provider value={lang}>
      <div className="app-container">
        {notification && <Toast message={notification} onClose={closeToast} />}

        <HistoryPanel onLoadConfig={loadConfigFromHistory} showToast={showToast} />

        <Header theme={theme} toggleTheme={toggleTheme} lang={lang} toggleLang={toggleLang}>
          <HistoryButton />
        </Header>

        <div className="page-intro">
          <h1>{t("QR Code and barcode generator and reader")}</h1>
          <p>
            {t("Free, no sign-up and no watermark.")}
            <span className="intro-extra"> {t("Everything happens in your browser.")}</span>
          </p>
        </div>

        <main className={`main-content ${isScanner ? "is-scanner" : ""}`}>
          <ModeSelector config={config} updateConfig={updateConfig} />

          {isScanner ? (
            <ScannerPanel showToast={showToast} onGenerate={handleGenerateFromScan} />
          ) : (
            <>
              <ContentInput
                config={config}
                updateConfig={updateConfig}
                socialLinks={socialLinks}
                handleCopyText={handleCopyText}
                showToast={showToast}
              />
              {config.generatorType === GENERATOR_TYPES.QRCODE ? (
                <QRCodePreview config={config} updateConfig={updateConfig} showToast={showToast} />
              ) : (
                <BarcodePreview config={config} updateConfig={updateConfig} showToast={showToast} />
              )}
              <Controls
                config={config}
                updateConfig={updateConfig}
                handleImageUpload={handleImageUpload}
              />
            </>
          )}
        </main>

        <Footer />
      </div>
    </LangContext.Provider>
  );
}

export default App;
