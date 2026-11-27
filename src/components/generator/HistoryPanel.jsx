// src/components/generator/HistoryPanel.jsx
import React, { useState, useEffect, useRef, useContext } from "react";
import {
  AiOutlineHistory,
  AiOutlineDelete,
  AiOutlineClose,
  AiOutlineQrcode,
  AiOutlineBarcode,
} from "react-icons/ai";
import { LangContext, useT } from "../../i18n";
import "./HistoryPanel.css";

const HistoryPanel = ({ onLoadConfig, showToast }) => {
  const t = useT();
  const lang = useContext(LangContext);
  const [history, setHistory] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const dialogRef = useRef(null);

  // Native <dialog>: Esc, trapped focus and an inert background come for free.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isOpen && !dialog.open) dialog.showModal?.();
    if (!isOpen && dialog.open) dialog.close();
  }, [isOpen]);

  // Load the history from localStorage
  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = () => {
    try {
      const saved = localStorage.getItem("qrcode_history");
      if (saved) {
        setHistory(JSON.parse(saved));
      }
    } catch (err) {
      console.error("Error loading the history:", err);
    }
  };

  const deleteItem = (id) => {
    const updated = history.filter((item) => item.id !== id);
    setHistory(updated);
    localStorage.setItem("qrcode_history", JSON.stringify(updated));
    showToast?.(t("Item removed from history."));
  };

  const clearHistory = () => {
    if (window.confirm(t("Delete the whole history? This cannot be undone."))) {
      setHistory([]);
      localStorage.removeItem("qrcode_history");
      showToast?.(t("History deleted."));
    }
  };

  const loadItem = (item) => {
    onLoadConfig?.(item.config);
    setIsOpen(false);
    showToast?.(t("Code loaded from history."));
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat(lang === "pt" ? "pt-BR" : "en", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  // Expose a function for the parent component to add to the history
  useEffect(() => {
    const saveFunc = (config) => {
      try {
        const newItem = {
          id: Date.now(),
          timestamp: new Date().toISOString(),
          config: { ...config },
          preview:
            config.text.substring(0, 50) +
            (config.text.length > 50 ? "..." : ""),
        };

        const updatedHistory = [newItem, ...history].slice(0, 20);
        setHistory(updatedHistory);
        localStorage.setItem("qrcode_history", JSON.stringify(updatedHistory));
      } catch (err) {
        console.error("Error saving the history:", err);
      }
    };

    window.addToHistory = saveFunc;

    // Expose a function to open the panel
    window.openHistoryPanel = () => setIsOpen(true);
    window.getHistoryCount = () => history.length;

    return () => {
      delete window.addToHistory;
      delete window.openHistoryPanel;
      delete window.getHistoryCount;
    };
  }, [history]);

  return (
    <dialog
      ref={dialogRef}
      className="history-drawer"
      aria-labelledby="history-title"
      onClose={() => setIsOpen(false)}
      onClick={(e) => {
        // A click on the dimmed backdrop (outside the sheet) closes it.
        if (e.target === e.currentTarget) setIsOpen(false);
      }}
    >
      <div className="history-sheet">
        <header className="history-header">
          <h2 id="history-title">{t("History")}</h2>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="icon-btn"
            aria-label={t("Close history")}
          >
            <AiOutlineClose aria-hidden="true" />
          </button>
        </header>

        {history.length === 0 ? (
          <div className="history-empty">
            <AiOutlineHistory aria-hidden="true" />
            <p>{t("No codes yet")}</p>
            <small>{t("The codes you generate show up here, kept only in this browser.")}</small>
          </div>
        ) : (
          <>
            <ul className="history-list">
              {history.map((item) => {
                const isQR = item.config.generatorType === "qrcode";
                return (
                  <li key={item.id} className="history-item">
                    <button
                      type="button"
                      className="history-load"
                      onClick={() => loadItem(item)}
                      title={item.config.text}
                    >
                      <span
                        className="history-icon"
                        style={{ background: item.config.bgColor, color: item.config.fgColor }}
                        aria-hidden="true"
                      >
                        {isQR ? <AiOutlineQrcode /> : <AiOutlineBarcode />}
                      </span>
                      <span className="history-text">
                        <span className="history-preview">{item.preview}</span>
                        <span className="history-meta">
                          {isQR ? "QR Code" : t("Barcode")} ·{" "}
                          {formatDate(item.timestamp)}
                        </span>
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteItem(item.id)}
                      className="icon-btn danger"
                      aria-label={t("Delete {item}", { item: item.preview })}
                      title={t("Delete")}
                    >
                      <AiOutlineDelete aria-hidden="true" />
                    </button>
                  </li>
                );
              })}
            </ul>
            <footer className="history-footer">
              <span>{t("{n} of 20 saved", { n: history.length })}</span>
              <button type="button" onClick={clearHistory} className="btn btn-ghost">
                {t("Delete all")}
              </button>
            </footer>
          </>
        )}
      </div>
    </dialog>
  );
};

export default HistoryPanel;
