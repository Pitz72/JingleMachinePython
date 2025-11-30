import React, { useState } from 'react';
import { useTranslations } from '../contexts/LanguageContext';
import { useMidi } from '../hooks/useMidi';

interface GlobalSettingsDialogProps {
  onClose: () => void;
  crossfader: number;
  onCrossfaderChange: (value: number) => void;
  playlistMode: boolean;
  onPlaylistModeChange: (enabled: boolean) => void;
  onMidiTrigger?: (buttonId: number) => void;
}

const GlobalSettingsDialog: React.FC<GlobalSettingsDialogProps> = ({
  onClose,
  crossfader,
  onCrossfaderChange,
  playlistMode,
  onPlaylistModeChange,
  onMidiTrigger,
}) => {
  const { t } = useTranslations();
  const { isMidiSupported, connectedDevices, requestMidiAccess } = useMidi(onMidiTrigger || (() => {}));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-40" onClick={onClose}>
      <div className="bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md border border-gray-700" onClick={e => e.stopPropagation()}>
        <h2 className="text-2xl font-bold text-white mb-4">{t('global_settings_title')}</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300">{t('label_crossfader')}: {crossfader > 0 ? `R ${crossfader}` : crossfader < 0 ? `L ${Math.abs(crossfader)}` : 'C'}</label>
            <input
              type="range"
              min="-1"
              max="1"
              step="0.1"
              value={crossfader}
              onChange={e => onCrossfaderChange(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />
          </div>

          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={playlistMode}
              onChange={e => onPlaylistModeChange(e.target.checked)}
              className="w-4 h-4 text-cyan-600 bg-gray-700 border-gray-600 rounded focus:ring-cyan-500 accent-cyan-500"
            />
            <span className="text-gray-300">{t('label_playlist_mode')}</span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-gray-300">MIDI Support</span>
              <button
                onClick={requestMidiAccess}
                disabled={!isMidiSupported}
                className="px-3 py-1 text-sm bg-purple-600 hover:bg-purple-500 disabled:bg-gray-600 text-white rounded transition-colors"
              >
                {isMidiSupported ? 'Enable MIDI' : 'Not Supported'}
              </button>
            </div>
            {connectedDevices.length > 0 && (
              <div className="text-xs text-gray-400">
                Connected: {connectedDevices.map(d => d.name).join(', ')}
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button onClick={onClose} className="py-2 px-4 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-md">{t('close_button')}</button>
        </div>
      </div>
    </div>
  );
};

export default GlobalSettingsDialog;