import React from "react";
import { AiOutlineQrcode } from "react-icons/ai"; // Certifique-se de ter react-icons instalado
import "./Header.css"; // Vamos criar um CSS específico para facilitar a manutenção

const Header = ({ theme, toggleTheme }) => {
  return (
    <header className="main-header" role="banner">
      <div className="brand">
        <AiOutlineQrcode className="brand-icon" size={36} aria-hidden="true" />
        <div className="brand-text">
          <h1>QR Generator Pro</h1>
          <span className="subtitle">✨ Crie, Personalize e Compartilhe</span>
        </div>
      </div>

      <button
        onClick={toggleTheme}
        className="theme-toggle"
        aria-label={
          theme === "light" ? "Ativar modo escuro" : "Ativar modo claro"
        }
        title={
          theme === "light" ? "Mudar para Modo Escuro" : "Mudar para Modo Claro"
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
    </header>
  );
};

export default Header;
