import React from "react";
import { useT } from "../../i18n";
import "./Header.css";

// Brand: a simplified QR module (three eyes + data).
const BrandMark = () => (
  <svg className="brand-mark" viewBox="0 0 32 32" aria-hidden="true">
    <rect width="32" height="32" rx="8" fill="var(--primary)" />
    <g fill="none" stroke="#fff" strokeWidth="2">
      <rect x="7" y="7" width="7" height="7" rx="1" />
      <rect x="18" y="7" width="7" height="7" rx="1" />
      <rect x="7" y="18" width="7" height="7" rx="1" />
    </g>
    <g fill="#fff">
      <rect x="18" y="18" width="3" height="3" />
      <rect x="22" y="22" width="3" height="3" />
      <rect x="22" y="18" width="3" height="3" opacity=".55" />
    </g>
  </svg>
);

// Moon and sun in the same stroke as the Ant icons used in the rest of the UI.
const ThemeIcon = ({ dark }) => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor"
    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {dark ? (
      <>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2.5v2M12 19.5v2M4.6 4.6l1.4 1.4M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4L6 18M18 6l1.4-1.4" />
      </>
    ) : (
      <path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5z" />
    )}
  </svg>
);

const Header = ({ theme, toggleTheme, lang, toggleLang, children }) => {
  const t = useT();
  const isDark = theme === "dark";
  // Named in the language it switches to.
  const langLabel = lang === "pt" ? "Switch to English" : "Mudar para português";
  return (
    <header className="main-header">
      <div className="header-inner">
        <a className="brand" href="/" aria-label={t("QR & Barcode Studio, home page")}>
          <BrandMark />
          <span className="brand-name">QR &amp; Barcode Studio</span>
        </a>

        <div className="header-actions">
          {children}
          <button
            type="button"
            onClick={toggleLang}
            className="icon-btn"
            lang={lang === "pt" ? "en" : "pt-BR"}
            aria-label={langLabel}
            title={langLabel}
          >
            {lang === "pt" ? "EN" : "PT"}
          </button>
          <button
            type="button"
            onClick={toggleTheme}
            className="icon-btn"
            aria-label={isDark ? t("Use light theme") : t("Use dark theme")}
            title={isDark ? t("Light theme") : t("Dark theme")}
          >
            <ThemeIcon dark={isDark} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
