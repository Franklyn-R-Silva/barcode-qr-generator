import { createContext, useCallback, useContext } from "react";
import pt from "./locales/pt";

/** Current UI language, "pt" or "en"; App provides it around the whole app. */
export const LangContext = createContext("en");

/**
 * English text is the key: translate("pt", "Download {format}", { format: "PNG" }).
 * Portuguese comes from locales/pt.js; a missing entry falls back to the English
 * text. `{name}` placeholders are filled from `vars`.
 */
export const translate = (lang, text, vars) =>
  ((lang === "pt" && pt[text]) || text).replace(/\{(\w+)\}/g, (match, name) =>
    vars && name in vars ? vars[name] : match
  );

/** Returns t(text, vars) for the current language. */
export const useT = () => {
  const lang = useContext(LangContext);
  return useCallback((text, vars) => translate(lang, text, vars), [lang]);
};
