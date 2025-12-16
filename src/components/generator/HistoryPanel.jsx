// src/components/generator/HistoryPanel.jsx
import React, { useState, useEffect } from "react";
import {
  AiOutlineHistory,
  AiOutlineDelete,
  AiOutlineEye,
  AiOutlineClose,
  AiOutlineClear,
} from "react-icons/ai";
import "./HistoryPanel.css";

const HistoryPanel = ({ onLoadConfig, showToast }) => {
  const [history, setHistory] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [previewItem, setPreviewItem] = useState(null);

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

  const saveToHistory = (config) => {
    try {
      const newItem = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        config: { ...config },
        preview:
          config.text.substring(0, 50) + (config.text.length > 50 ? "..." : ""),
      };

      const updatedHistory = [newItem, ...history].slice(0, 20); // Manter apenas 20
      setHistory(updatedHistory);
      localStorage.setItem("qrcode_history", JSON.stringify(updatedHistory));
    } catch (err) {
      console.error("Erro ao salvar histórico:", err);
    }
  };

  const deleteItem = (id) => {
    const updated = history.filter((item) => item.id !== id);
    setHistory(updated);
    localStorage.setItem("qrcode_history", JSON.stringify(updated));
    showToast?.("🗑️ Item removido do histórico");
  };

  const clearHistory = () => {
    if (window.confirm("Tem certeza que deseja limpar todo o histórico?")) {
      setHistory([]);
      localStorage.removeItem("qrcode_history");
      showToast?.("🗑️ Histórico limpo");
    }
  };

  const loadItem = (item) => {
    onLoadConfig?.(item.config);
    setIsOpen(false);
    showToast?.("✅ Configuração carregada");
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
    return () => {
      delete window.addToHistory;
    };
  }, [history]);

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="btn-history-floating"
        aria-label="Ver histórico"
        title={`Histórico (${history.length} itens)`}
      >
        <AiOutlineHistory size={24} />
        <span>Histórico</span>
        {history.length > 0 && (
          <span className="history-badge">{history.length}</span>
        )}
      </button>

      {isOpen && (
        <div className="history-panel-overlay" onClick={() => setIsOpen(false)}>
          <div className="history-panel" onClick={(e) => e.stopPropagation()}>
            <div className="history-header">
              <h3>
                <AiOutlineHistory /> Histórico de Gerações
              </h3>
              <div className="history-actions">
                {history.length > 0 && (
                  <button
                    onClick={clearHistory}
                    className="btn-icon-small"
                    title="Limpar histórico"
                  >
                    <AiOutlineClear />
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="btn-icon-small"
                  aria-label="Fechar"
                >
                  <AiOutlineClose />
                </button>
              </div>
            </div>

            <div className="history-content">
              {history.length === 0 ? (
                <div className="history-empty">
                  <AiOutlineHistory size={48} />
                  <p>Nenhum código no histórico</p>
                  <small>Seus códigos gerados aparecerão aqui</small>
                </div>
              ) : (
                <div className="history-list">
                  {history.map((item) => (
                    <div key={item.id} className="history-item">
                      <div className="history-item-content">
                        <div className="history-item-type">
                          {item.config.generatorType === "qrcode"
                            ? "🔲 QR Code"
                            : "📊 Barcode"}
                        </div>
                        <div className="history-item-text">{item.preview}</div>
                        <div className="history-item-date">
                          {formatDate(item.timestamp)}
                        </div>
                      </div>
                      <div className="history-item-actions">
                        <button
                          onClick={() => setPreviewItem(item)}
                          className="btn-icon-small"
                          title="Visualizar"
                        >
                          <AiOutlineEye />
                        </button>
                        <button
                          onClick={() => loadItem(item)}
                          className="btn-icon-small btn-load"
                          title="Carregar"
                        >
                          ↻
                        </button>
                        <button
                          onClick={() => deleteItem(item.id)}
                          className="btn-icon-small btn-delete"
                          title="Excluir"
                        >
                          <AiOutlineDelete />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {previewItem && (
        <div
          className="preview-modal-overlay"
          onClick={() => setPreviewItem(null)}
        >
          <div className="preview-modal" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setPreviewItem(null)}
              className="preview-close"
              aria-label="Fechar"
            >
              <AiOutlineClose />
            </button>
            <h4>Preview do Histórico</h4>
            <div className="preview-details">
              <p>
                <strong>Tipo:</strong>{" "}
                {previewItem.config.generatorType === "qrcode"
                  ? "QR Code"
                  : "Código de Barras"}
              </p>
              <p>
                <strong>Conteúdo:</strong> {previewItem.config.text}
              </p>
              <p>
                <strong>Cor:</strong>{" "}
                <span
                  className="color-preview"
                  style={{ backgroundColor: previewItem.config.fgColor }}
                ></span>{" "}
                {previewItem.config.fgColor}
              </p>
              <p>
                <strong>Fundo:</strong>{" "}
                <span
                  className="color-preview"
                  style={{ backgroundColor: previewItem.config.bgColor }}
                ></span>{" "}
                {previewItem.config.bgColor}
              </p>
            </div>
            <button
              onClick={() => {
                loadItem(previewItem);
                setPreviewItem(null);
              }}
              className="btn btn-primary"
            >
              Carregar Configuração
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default HistoryPanel;
