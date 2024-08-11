import { createContext } from "react"

export type LanguageContextType = {
  language: "ar" | "tr";
  setLanguage: (language: string) => void;
};

export const LangContext = createContext<LanguageContextType | undefined>({language: "ar", setLanguage: () => {}});