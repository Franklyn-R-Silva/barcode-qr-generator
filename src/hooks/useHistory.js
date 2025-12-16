// src/hooks/useHistory.js
import { useState, useEffect, useCallback } from "react";
import historyService from "../services/storage/historyService";

/**
 * Custom Hook para gerenciar histórico
 */
export const useHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statistics, setStatistics] = useState({
    total: 0,
    qrCodes: 0,
    barcodes: 0,
    lastGenerated: null,
  });

  // Carregar histórico inicial
  useEffect(() => {
    loadHistory();
  }, []);

  // Atualizar estatísticas quando histórico mudar
  useEffect(() => {
    setStatistics(historyService.getStatistics());
  }, [history]);

  const loadHistory = useCallback(() => {
    try {
      setLoading(true);
      const data = historyService.getHistory();
      setHistory(data);
    } catch (error) {
      console.error("Error loading history:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  const addToHistory = useCallback((config) => {
    try {
      const newItem = historyService.addToHistory(config);
      if (newItem) {
        setHistory((prev) => [newItem, ...prev].slice(0, 20));
        return newItem;
      }
    } catch (error) {
      console.error("Error adding to history:", error);
      return null;
    }
  }, []);

  const removeFromHistory = useCallback((id) => {
    try {
      const success = historyService.removeFromHistory(id);
      if (success) {
        setHistory((prev) => prev.filter((item) => item.id !== id));
      }
      return success;
    } catch (error) {
      console.error("Error removing from history:", error);
      return false;
    }
  }, []);

  const clearHistory = useCallback(() => {
    try {
      const success = historyService.clearHistory();
      if (success) {
        setHistory([]);
      }
      return success;
    } catch (error) {
      console.error("Error clearing history:", error);
      return false;
    }
  }, []);

  const filterByType = useCallback((type) => {
    return historyService.filterByType(type);
  }, []);

  const exportHistory = useCallback(() => {
    try {
      return historyService.exportHistory();
    } catch (error) {
      console.error("Error exporting history:", error);
      return null;
    }
  }, []);

  const importHistory = useCallback(
    (jsonData) => {
      try {
        const success = historyService.importHistory(jsonData);
        if (success) {
          loadHistory();
        }
        return success;
      } catch (error) {
        console.error("Error importing history:", error);
        return false;
      }
    },
    [loadHistory]
  );

  return {
    history,
    loading,
    statistics,
    addToHistory,
    removeFromHistory,
    clearHistory,
    filterByType,
    exportHistory,
    importHistory,
    reload: loadHistory,
  };
};
