import React from 'react';
import { useTranslations } from '../contexts/LanguageContext';

interface FeaturesDialogProps {
  onClose: () => void;
}

const FeaturesDialog: React.FC<FeaturesDialogProps> = ({ onClose }) => {
  const { t } = useTranslations();

  const features = [
    {
      category: "🖥️ Native Desktop Experience",
      items: [
        "Finestra 16:9 fissa ottimizzata",
        "Nessuna barra dei menu o distrazioni",
        "Integrazione Taskbar nativa",
        "Performance superiori (Electron)"
      ]
    },
    {
      category: "🎙️ Advanced Recording Studio",
      items: [
        "Integrazione Microfono USB/XLR",
        "Registrazione Mix completo (.webm)",
        "Monitoraggio audio in tempo reale",
        "Controlli volume Mic dedicati"
      ]
    },
    {
      category: "💾 Pro Data Management",
      items: [
        "Nuovo formato .rrlm proprietario",
        "Preset rapidi (Talk, Music, Podcast)",
        "Salvataggio/Caricamento istantaneo",
        "Compatibilità retroattiva JSON"
      ]
    },
    {
      category: "🎨 Premium Dark Interface",
      items: [
        "Tema 'Zinc-950' Pro Dark",
        "Nessuna scrollbar visibile",
        "Layout Dashboard unificato",
        "Feedback visivo migliorato"
      ]
    },
    {
      category: "🎹 Integrazione MIDI",
      items: [
        "Supporto controller hardware",
        "Mappatura note (36-96)",
        "Zero-latency trigger",
        "Plug & Play automatico"
      ]
    },
    {
      category: "🎛️ Audio Engine Avanzato",
      items: [
        "88 Pad configurabili (11x8)",
        "Equalizzatore 3-Bande ±20dB",
        "Controlli Fade In/Out",
        "Modalità Loop & Overlay"
      ]
    }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-gray-800 text-white rounded-lg shadow-2xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-700" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-3xl font-bold text-cyan-400">Runtime Radio Live Machine v1.4.1 Public Beta</h2>
            <p className="text-lg text-gray-300 mt-1">Premium Desktop Production Suite</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl font-bold"
            aria-label="Chiudi dialog"
          >
            ×
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <div key={index} className="bg-gray-700 rounded-lg p-4 border border-gray-600">
              <h3 className="text-lg font-semibold text-cyan-300 mb-3 flex items-center">
                <span className="mr-2">{feature.category.split(' ')[0]}</span>
                <span>{feature.category.substring(feature.category.indexOf(' ') + 1)}</span>
              </h3>
              <ul className="space-y-2">
                {feature.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="text-sm text-gray-300 flex items-start">
                    <span className="text-green-400 mr-2 mt-1">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-8 p-4 bg-gray-700 rounded-lg border border-gray-600">
          <h3 className="text-lg font-semibold text-cyan-300 mb-2">🎯 Use Cases Supportati</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <div className="text-2xl mb-1">📻</div>
              <div className="text-gray-300">Radio Broadcasting</div>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-1">🎙️</div>
              <div className="text-gray-300">Podcast Production</div>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-1">🎪</div>
              <div className="text-gray-300">Live Events</div>
            </div>
            <div className="text-center">
              <div className="text-2xl mb-1">🎵</div>
              <div className="text-gray-300">Music Production</div>
            </div>
          </div>
        </div>

        <div className="mt-6 p-4 bg-cyan-900 bg-opacity-50 rounded-lg border border-cyan-700">
          <h3 className="text-lg font-semibold text-cyan-300 mb-2">📊 Metriche Performance</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div className="text-center">
              <div className="text-xl font-bold text-white">622KB</div>
              <div className="text-gray-300">Bundle Size</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-white">{"<500ms"}</div>
              <div className="text-gray-300">Load Time</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-white">95%</div>
              <div className="text-gray-300">WCAG Score</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-white">100%</div>
              <div className="text-gray-300">PWA Score</div>
            </div>
          </div>
        </div>

        <div className="text-center mt-8">
          <button
            onClick={onClose}
            className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-2 px-6 rounded-lg transition-colors"
          >
            Chiudi e Inizia
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeaturesDialog;