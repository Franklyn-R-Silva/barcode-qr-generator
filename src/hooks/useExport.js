// src/hooks/useExport.js
import { useState, useCallback } from "react";
import exportFactory from "../services/export/ExportFactory";

/**
 * Custom Hook para exportação de imagens
 */
export const useExport = () => {
  const [exporting, setExporting] = useState(false);
  const [lastExport, setLastExport] = useState(null);

  const exportImage = useCallback(async (format, canvas, options = {}) => {
    try {
      setExporting(true);

      if (!canvas) {
        throw new Error("Canvas element is required");
      }

      const result = await exportFactory.export(format, canvas, options);

      setLastExport({
        format,
        timestamp: new Date().toISOString(),
        success: result.success,
      });

      return result;
    } catch (error) {
      console.error("Export error:", error);
      return { success: false, error: error.message };
    } finally {
      setExporting(false);
    }
  }, []);

  const exportMultipleFormats = useCallback(
    async (formats, canvas, options = {}) => {
      const results = [];

      for (const format of formats) {
        const result = await exportImage(format, canvas, options);
        results.push({ format, ...result });
      }

      return results;
    },
    [exportImage]
  );

  const getAvailableFormats = useCallback(() => {
    return exportFactory.getAvailableFormats();
  }, []);

  const isFormatSupported = useCallback((format) => {
    return exportFactory.isFormatSupported(format);
  }, []);

  const getFormatsInfo = useCallback(() => {
    return exportFactory.getStrategiesInfo();
  }, []);

  return {
    exporting,
    lastExport,
    exportImage,
    exportMultipleFormats,
    getAvailableFormats,
    isFormatSupported,
    getFormatsInfo,
  };
};
