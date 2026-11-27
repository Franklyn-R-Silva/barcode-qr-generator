// src/components/generator/HistoryButton.jsx
import React, { useState, useEffect } from "react";
import { AiOutlineHistory } from "react-icons/ai";

const HistoryButton = () => {
  const [historyCount, setHistoryCount] = useState(0);

  useEffect(() => {
    // shortcut: polls the window.* channel HistoryPanel exposes; lift history into App state if this grows.
    const updateCount = () => {
      if (window.getHistoryCount) setHistoryCount(window.getHistoryCount());
    };
    updateCount();
    const interval = setInterval(updateCount, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <button
      type="button"
      onClick={() => window.openHistoryPanel?.()}
      className="btn btn-ghost btn-history"
      aria-label={`Histórico, ${historyCount} ${historyCount === 1 ? "item" : "itens"}`}
    >
      <AiOutlineHistory aria-hidden="true" />
      <span className="btn-history-label">Histórico</span>
      {historyCount > 0 && <span className="history-badge" aria-hidden="true">{historyCount}</span>}
    </button>
  );
};

export default HistoryButton;
