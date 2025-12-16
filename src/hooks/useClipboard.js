// src/hooks/useClipboard.js
import { useState, useCallback } from "react";
import { copyToClipboard } from "../utils/helpers";

/**
 * Custom Hook para operações com clipboard
 */
export const useClipboard = () => {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(async (text) => {
    const success = await copyToClipboard(text);

    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }

    return success;
  }, []);

  const reset = useCallback(() => {
    setCopied(false);
  }, []);

  return { copied, copy, reset };
};
