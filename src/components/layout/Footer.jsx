import React from "react";
import { AiOutlineGithub, AiOutlineLinkedin, AiOutlineLock } from "react-icons/ai";
import { useT } from "../../i18n";
import "./Footer.css";

const Footer = () => {
  const t = useT();
  return (
    <footer className="main-footer">
      <div className="footer-inner">
        <p className="footer-privacy">
          <AiOutlineLock aria-hidden="true" />
          {t("Everything is generated and read in your browser. Nothing is sent to a server.")}
        </p>
        <div className="footer-meta">
          <span>{t("Made by Franklyn Silva © {year}", { year: new Date().getFullYear() })}</span>
          <nav className="footer-links" aria-label={t("Author")}>
            <a href="https://github.com/Franklyn-R-Silva/barcode-qr-generator" target="_blank" rel="noreferrer">
              <AiOutlineGithub aria-hidden="true" /> {t("Code on GitHub")}
            </a>
            <a href="https://www.linkedin.com/in/franklyn-roberto-dev/" target="_blank" rel="noreferrer">
              <AiOutlineLinkedin aria-hidden="true" /> LinkedIn
            </a>
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
