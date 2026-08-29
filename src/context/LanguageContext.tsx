import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { da } from "../i18n/da";
import { en } from "../i18n/en";
import type {
  Language,
  TranslationDictionary,
  TranslationKey,
} from "../i18n/types";

const translations = {
  da,
  en,
} satisfies Record<Language, TranslationDictionary>;

type LanguageContextType = {
  language: Language;
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
  t: (key: TranslationKey) => string;
};

const LANGUAGE_COOKIE_NAME = "cv-site-language";
const LANGUAGE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;
const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    const savedLanguage = getLanguageCookie();
    return savedLanguage === "da" || savedLanguage === "en"
      ? savedLanguage
      : "da";
  });

  useEffect(() => {
    setLanguageCookie(language);
    document.documentElement.lang = language;
  }, [language]);

  const value = useMemo<LanguageContextType>(
    () => ({
      language,
      setLanguage,
      toggleLanguage: () => {
        setLanguage((currentLanguage) =>
          currentLanguage === "en" ? "da" : "en",
        );
      },
      t: (key) => translations[language][key],
    }),
    [language],
  );

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);

  if (!context) {
    throw new Error("useLanguage must be used inside LanguageProvider");
  }

  return context;
}

function getLanguageCookie() {
  const cookie = document.cookie
    .split("; ")
    .find((entry) => entry.startsWith(`${LANGUAGE_COOKIE_NAME}=`));

  return cookie?.split("=")[1];
}

function setLanguageCookie(language: Language) {
  document.cookie = [
    `${LANGUAGE_COOKIE_NAME}=${language}`,
    "path=/",
    `max-age=${LANGUAGE_COOKIE_MAX_AGE}`,
    "SameSite=Lax",
  ].join("; ");
}
