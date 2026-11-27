import React from "react";
import { AiOutlineGithub, AiOutlineLinkedin, AiOutlineLock } from "react-icons/ai";
import "./Footer.css";

const Footer = () => (
  <footer className="main-footer">
    <div className="footer-inner">
      <p className="footer-privacy">
        <AiOutlineLock aria-hidden="true" />
        Tudo é gerado e lido no seu navegador. Nada é enviado para servidor.
      </p>
      <div className="footer-meta">
        <span>
          Feito por Franklyn Silva &copy; {new Date().getFullYear()}
        </span>
        <nav className="footer-links" aria-label="Autor">
          <a href="https://github.com/Franklyn-R-Silva/barcode-qr-generator" target="_blank" rel="noreferrer">
            <AiOutlineGithub aria-hidden="true" /> Código no GitHub
          </a>
          <a href="https://www.linkedin.com/in/franklyn-roberto-dev/" target="_blank" rel="noreferrer">
            <AiOutlineLinkedin aria-hidden="true" /> LinkedIn
          </a>
        </nav>
      </div>
    </div>
  </footer>
);

export default Footer;
