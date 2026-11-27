import React from "react";
import "./Header.css";

// Marca: um módulo de QR simplificado (três olhos + dados).
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

// Lua e sol no mesmo traço dos ícones Ant usados no resto da interface.
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

const Header = ({ theme, toggleTheme, children }) => {
  const isDark = theme === "dark";
  return (
    <header className="main-header">
      <div className="header-inner">
        <a className="brand" href="/" aria-label="QR & Barcode Studio, página inicial">
          <BrandMark />
          <span className="brand-name">QR &amp; Barcode Studio</span>
        </a>

        <div className="header-actions">
          {children}
          <button
            type="button"
            onClick={toggleTheme}
            className="icon-btn"
            aria-label={isDark ? "Usar tema claro" : "Usar tema escuro"}
            title={isDark ? "Tema claro" : "Tema escuro"}
          >
            <ThemeIcon dark={isDark} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
