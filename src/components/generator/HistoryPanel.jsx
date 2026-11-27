// src/components/generator/HistoryPanel.jsx
import React, { useState, useEffect, useRef } from "react";
import {
  AiOutlineHistory,
  AiOutlineDelete,
  AiOutlineClose,
  AiOutlineQrcode,
  AiOutlineBarcode,
} from "react-icons/ai";
import "./HistoryPanel.css";

const HistoryPanel = ({ onLoadConfig, showToast }) => {
  const [history, setHistory] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const dialogRef = useRef(null);

  // <dialog> nativo: Esc, foco preso e fundo inerte vêm de graça.
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isOpen && !dialog.open) dialog.showModal?.();
    if (!isOpen && dialog.open) dialog.close();
  }, [isOpen]);

  // Carregar histórico do localStorage
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
      console.error("Erro ao carregar histórico:", err);
    }
  };

  const deleteItem = (id) => {
    const updated = history.filter((item) => item.id !== id);
    setHistory(updated);
    localStorage.setItem("qrcode_history", JSON.stringify(updated));
    showToast?.("Item removido do histórico.");
  };

  const clearHistory = () => {
    if (window.confirm("Apagar todo o histórico? Isso não pode ser desfeito.")) {
      setHistory([]);
      localStorage.removeItem("qrcode_history");
      showToast?.("Histórico apagado.");
    }
  };

  const loadItem = (item) => {
    onLoadConfig?.(item.config);
    setIsOpen(false);
    showToast?.("Código carregado do histórico.");
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    return new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  // Expor função para componente pai adicionar ao histórico
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
        console.error("Erro ao salvar histórico:", err);
      }
    };

    window.addToHistory = saveFunc;

    // Expor função para abrir o painel
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
        // Clique no fundo escurecido (fora da folha) fecha.
        if (e.target === e.currentTarget) setIsOpen(false);
      }}
    >
      <div className="history-sheet">
        <header className="history-header">
          <h2 id="history-title">Histórico</h2>
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="icon-btn"
            aria-label="Fechar histórico"
          >
            <AiOutlineClose aria-hidden="true" />
          </button>
        </header>

        {history.length === 0 ? (
          <div className="history-empty">
            <AiOutlineHistory aria-hidden="true" />
            <p>Nenhum código ainda</p>
            <small>
              Os códigos que você gerar aparecem aqui, guardados só neste
              navegador.
            </small>
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
                          {isQR ? "QR Code" : "Código de barras"} ·{" "}
                          {formatDate(item.timestamp)}
                        </span>
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteItem(item.id)}
                      className="icon-btn danger"
                      aria-label={`Excluir ${item.preview}`}
                      title="Excluir"
                    >
                      <AiOutlineDelete aria-hidden="true" />
                    </button>
                  </li>
                );
              })}
            </ul>
            <footer className="history-footer">
              <span>{history.length} de 20 guardados</span>
              <button type="button" onClick={clearHistory} className="btn btn-ghost">
                Apagar tudo
              </button>
            </footer>
          </>
        )}
      </div>
    </dialog>
  );
};

export default HistoryPanel;
