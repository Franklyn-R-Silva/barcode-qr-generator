import React from "react";
import { AiOutlineQrcode } from "react-icons/ai"; // Certifique-se de ter react-icons instalado
import "./Header.css"; // Vamos criar um CSS específico para facilitar a manutenção

const Header = ({ theme, toggleTheme, children }) => {
  return (
    <header className="main-header" role="banner">
      <div className="brand">
        <AiOutlineQrcode className="brand-icon" size={36} aria-hidden="true" />
        <div className="brand-text">
          <h1>QR &amp; Barcode Studio</h1>
          <span className="subtitle">✨ Gere, Escaneie e Compartilhe</span>
        </div>
      </div>

      <div className="header-actions">
        {children}

        <button
          onClick={toggleTheme}
          className="theme-toggle"
          aria-label={
            theme === "light" ? "Ativar modo escuro" : "Ativar modo claro"
          }
          title={
            theme === "light"
              ? "Mudar para Modo Escuro"
              : "Mudar para Modo Claro"
          }
        >
          {theme === "light" ? (
            <span className="icon" role="img" aria-label="Lua">
              🌙
            </span>
          ) : (
            <span className="icon" role="img" aria-label="Sol">
              ☀️
            </span>
          )}
        </button>
      </div>
    </header>
  );
};

export default Header;
