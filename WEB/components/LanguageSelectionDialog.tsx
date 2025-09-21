import React from 'react';
import { useTranslations } from '../contexts/LanguageContext';

const languages = [
  { code: 'en', name: 'English', flag: 'fi fi-gb' },
  { code: 'it', name: 'Italiano', flag: 'fi fi-it' },
  { code: 'fr', name: 'Français', flag: 'fi fi-fr' },
  { code: 'de', name: 'Deutsch', flag: 'fi fi-de' },
  { code: 'es', name: 'Español', flag: 'fi fi-es' },
  { code: 'pt', name: 'Português', flag: 'fi fi-pt' },
  { code: 'ru', name: 'Русский', flag: 'fi fi-ru' },
  { code: 'zh', name: '中文', flag: 'fi fi-cn' },
] as const;

export const LanguageSelectionDialog: React.FC = () => {
    const { setLanguage, t } = useTranslations();

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
      <div className="bg-gray-800 text-white rounded-lg shadow-2xl p-8 max-w-3xl w-full border border-gray-700">
        <h1 className="text-3xl font-bold text-center text-cyan-400 mb-6">{t('select_language')}</h1>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {languages.map(lang => (
            <button
              key={lang.code}
              onClick={() => setLanguage(lang.code)}
              className="bg-gray-700 hover:bg-cyan-600 text-white font-semibold py-4 px-2 rounded-lg text-lg transition-all transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-cyan-400 flex items-center justify-center"
            >
              <span className={`fi ${lang.flag} mr-3`} role="img" aria-label={`${lang.name} flag`}></span>
              <span>{lang.name}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};