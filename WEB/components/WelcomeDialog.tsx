import React, { useState } from 'react';
import { useTranslations } from '../contexts/LanguageContext';
import FeaturesDialog from './FeaturesDialog';

interface WelcomeDialogProps {
  onStart: () => void;
}

const WelcomeDialog: React.FC<WelcomeDialogProps> = ({ onStart }) => {
  const { t } = useTranslations();
  const [showFeatures, setShowFeatures] = useState(false);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-gray-800 text-white rounded-lg shadow-2xl p-8 max-w-2xl w-full border border-gray-700">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-cyan-400">{t('welcome_title')}</h1>
          <p className="text-lg text-gray-300 mt-2">{t('welcome_subtitle')}</p>
        </div>
        <div className="text-gray-300 space-y-4 my-8">
          <p>{t('welcome_p1')}</p>
          <p>{t('welcome_p2')}</p>
          <p className="font-semibold text-cyan-400">{t('welcome_p3')}</p>
        </div>
        <div className="text-center mt-8 space-y-4">
          <button
            onClick={onStart}
            className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-3 px-8 rounded-lg text-xl transition-transform transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-cyan-300"
          >
            {t('welcome_start_button')}
          </button>
          <div>
            <button
              onClick={() => setShowFeatures(true)}
              className="bg-gray-600 hover:bg-gray-500 text-white font-semibold py-2 px-6 rounded-lg text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              🔍 Scopri tutte le Features v1.1.0
            </button>
          </div>
        </div>
        <div className="text-center text-xs text-gray-500 mt-8">
            <p>{t('welcome_footer')}</p>
        </div>
      </div>

      {showFeatures && (
        <FeaturesDialog onClose={() => setShowFeatures(false)} />
      )}
    </div>
  );
};

export default WelcomeDialog;
