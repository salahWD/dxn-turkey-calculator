import React, { createContext } from "react"

export type LanguageContextType = {
  language: "ar" | "tr";
  setLanguage: (language: "ar" | "tr") => void;
};

export const LangContext = createContext<LanguageContextType>({
  language: "ar",
  setLanguage: () => {}
});