// src/hooks/useLocalStorage.js
import { useState, useEffect } from "react";
import localStorageService from "../services/storage/localStorageService";

/**
 * Custom Hook para gerenciar localStorage
 */
export const useLocalStorage = (key, initialValue) => {
  // Estado para armazenar o valor
  const [storedValue, setStoredValue] = useState(() => {
    return localStorageService.getItem(key, initialValue);
  });

  // Retornar uma versão modificada da função setter
  const setValue = (value) => {
    try {
      // Permitir que value seja uma função como o useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;

      setStoredValue(valueToStore);
      localStorageService.setItem(key, valueToStore);
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  // Remover item
  const removeValue = () => {
    try {
      setStoredValue(initialValue);
      localStorageService.removeItem(key);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue, removeValue];
};
