import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { translations } from '../i18n';

type Language = 'en' | 'it' | 'fr' | 'de' | 'es' | 'pt' | 'ru' | 'zh';
type TranslationKey = keyof typeof translations;

interface LanguageContextType {
  language: Language | null;
  setLanguage: (language: Language) => void;
  t: (key: TranslationKey, replacements?: { [key: string]: string | number }) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const LANGUAGE_STORAGE_KEY = 'jingle_machine_language';

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language | null>(() => {
    return (localStorage.getItem(LANGUAGE_STORAGE_KEY) as Language) || null;
  });

  const setLanguage = (lang: Language) => {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
    setLanguageState(lang);
  };
  
  const t = (key: TranslationKey, replacements?: { [key: string]: string | number }): string => {
      const lang = language || 'en';
      let text = translations[key]?.[lang] || translations[key]?.['en'] || key;
      
      if (replacements) {
        Object.keys(replacements).forEach(rKey => {
            text = text.replace(`{${rKey}}`, String(replacements[rKey]));
        });
      }
      return text;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslations = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useTranslations must be used within a LanguageProvider');
  }
  return context;
};
