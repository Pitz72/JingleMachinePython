import React, { useState, useEffect } from 'react';
import { ButtonConfig, PlaybackMode } from '../types';
import { useTranslations } from '../contexts/LanguageContext';

interface SettingsDialogProps {
  buttonConfig: ButtonConfig;
  onClose: () => void;
  onSave: (newConfig: ButtonConfig, newAudioData?: string | null) => void;
  onRemoveAudio: (id: number) => void;
  onClear: (id: number) => void;
}

const COLOR_PALETTE = [
  '#4b5563', // gray-600 (default)
  '#581c87', // purple-900 (special)
  '#ef4444', // red-500
  '#f97316', // orange-500
  '#eab308', // yellow-500
  '#22c55e', // green-500
  '#06b6d4', // cyan-500
  '#3b82f6', // blue-500
  '#8b5cf6', // violet-500
  '#d946ef', // fuchsia-500
  '#ec4899', // pink-500
  '#78716c', // stone-500
];

const SettingsDialog: React.FC<SettingsDialogProps> = ({ buttonConfig, onClose, onSave, onRemoveAudio, onClear }) => {
  const [config, setConfig] = useState<ButtonConfig>(buttonConfig);
  const [newAudioData, setNewAudioData] = useState<string | null>(null);
  const { t } = useTranslations();

  useEffect(() => {
    setConfig(buttonConfig);
    setNewAudioData(null);
  }, [buttonConfig]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (loadEvent) => {
        const base64 = loadEvent.target?.result as string;
        setNewAudioData(base64);

        const fileNameWithoutExt = file.name.split('.').slice(0, -1).join('.') || file.name;

        setConfig(prev => {
          const isDefaultName = prev.name.startsWith(t('default_jingle_name')) || prev.name === '';
          return {
            ...prev,
            fileName: file.name,
            name: isDefaultName ? fileNameWithoutExt : prev.name
          };
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    onSave(config, newAudioData);
    onClose();
  };

  const handleRemove = () => {
    onRemoveAudio(config.id);
    onClose();
  };

  const handleClear = () => {
    onClear(config.id);
    onClose();
  };

  const playbackModes = Object.values(PlaybackMode);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-40" onClick={onClose}>
      <div className="bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md border border-gray-700" onClick={e => e.stopPropagation()}>
        <h2 className="text-2xl font-bold text-white mb-4">{t('settings_title')} {buttonConfig.id + 1}</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300">{t('label_button_name')}</label>
            <input
              type="text"
              value={config.name}
              onChange={e => setConfig(prev => ({ ...prev, name: e.target.value }))}
              className="mt-1 block w-full bg-gray-700 border-gray-600 rounded-md shadow-sm text-white p-2 focus:ring-cyan-500 focus:border-cyan-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">{t('label_color')}</label>
            <div className="grid grid-cols-6 gap-2">
              {COLOR_PALETTE.map(color => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setConfig(prev => ({ ...prev, color }))}
                  className={`w-10 h-10 rounded-full border-2 transition-transform transform hover:scale-110
                            ${config.color === color ? 'ring-2 ring-offset-2 ring-offset-gray-800 ring-white' : 'border-transparent'}
                        `}
                  style={{ backgroundColor: color }}
                  aria-label={`Select color ${color}`}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">{t('label_volume')}: {Math.round(config.volume * 100)}%</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={config.volume}
              onChange={e => setConfig(prev => ({ ...prev, volume: parseFloat(e.target.value) }))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">{t('label_playback_mode')}</label>
            <div className="grid grid-cols-2 gap-2">
              {playbackModes.map(mode => (
                <label key={mode} className={`flex items-center space-x-2 p-2 rounded-md cursor-pointer ${config.playbackMode === mode ? 'bg-cyan-600' : 'bg-gray-700'}`}>
                  <input
                    type="radio"
                    name="playbackMode"
                    value={mode}
                    checked={config.playbackMode === mode}
                    onChange={() => setConfig(prev => ({ ...prev, playbackMode: mode }))}
                    className="hidden"
                  />
                  <span className="text-white text-sm">{t(`playback_mode_${mode.toLowerCase()}` as any)}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex space-x-6">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={config.isLoop}
                onChange={e => setConfig(prev => ({ ...prev, isLoop: e.target.checked }))}
                className="w-4 h-4 text-cyan-600 bg-gray-700 border-gray-600 rounded focus:ring-cyan-500 accent-cyan-500"
              />
              <span className="text-gray-300">{t('label_loop_playback')}</span>
            </label>
            <label className="flex items-center space-x-3 cursor-pointer" title={t('label_crossfade_desc')}>
              <input
                type="checkbox"
                checked={config.crossfade}
                onChange={e => setConfig(prev => ({ ...prev, crossfade: e.target.checked }))}
                className="w-4 h-4 text-cyan-600 bg-gray-700 border-gray-600 rounded focus:ring-cyan-500 accent-cyan-500"
              />
              <span className="text-gray-300">{t('label_crossfade')}</span>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">{t('label_fade_durations')}</label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-400">{t('label_fade_in')}: {config.fadeInDuration}ms</label>
                <input
                  type="range"
                  min="100"
                  max="5000"
                  step="100"
                  value={config.fadeInDuration}
                  onChange={e => setConfig(prev => ({ ...prev, fadeInDuration: parseInt(e.target.value) }))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400">{t('label_fade_out')}: {config.fadeOutDuration}ms</label>
                <input
                  type="range"
                  min="100"
                  max="5000"
                  step="100"
                  value={config.fadeOutDuration}
                  onChange={e => setConfig(prev => ({ ...prev, fadeOutDuration: parseInt(e.target.value) }))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">{t('label_equalizer')}</label>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs text-gray-400">{t('label_eq_low')}: {config.eqLow}dB</label>
                <input
                  type="range"
                  min="-20"
                  max="20"
                  step="1"
                  value={config.eqLow}
                  onChange={e => setConfig(prev => ({ ...prev, eqLow: parseInt(e.target.value) }))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400">{t('label_eq_mid')}: {config.eqMid}dB</label>
                <input
                  type="range"
                  min="-20"
                  max="20"
                  step="1"
                  value={config.eqMid}
                  onChange={e => setConfig(prev => ({ ...prev, eqMid: parseInt(e.target.value) }))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400">{t('label_eq_high')}: {config.eqHigh}dB</label>
                <input
                  type="range"
                  min="-20"
                  max="20"
                  step="1"
                  value={config.eqHigh}
                  onChange={e => setConfig(prev => ({ ...prev, eqHigh: parseInt(e.target.value) }))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">{t('label_mixer')}</label>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-400">{t('label_pan')}: {config.pan > 0 ? `R ${config.pan}` : config.pan < 0 ? `L ${Math.abs(config.pan)}` : 'C'}</label>
                <input
                  type="range"
                  min="-1"
                  max="1"
                  step="0.1"
                  value={config.pan}
                  onChange={e => setConfig(prev => ({ ...prev, pan: parseFloat(e.target.value) }))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                />
              </div>
              <div className="flex space-x-6">
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.solo}
                    onChange={e => setConfig(prev => ({ ...prev, solo: e.target.checked }))}
                    className="w-4 h-4 text-cyan-600 bg-gray-700 border-gray-600 rounded focus:ring-cyan-500 accent-cyan-500"
                  />
                  <span className="text-gray-300">{t('label_solo')}</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.mute}
                    onChange={e => setConfig(prev => ({ ...prev, mute: e.target.checked }))}
                    className="w-4 h-4 text-cyan-600 bg-gray-700 border-gray-600 rounded focus:ring-cyan-500 accent-cyan-500"
                  />
                  <span className="text-gray-300">{t('label_mute')}</span>
                </label>
                <label className="flex items-center space-x-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={config.cue}
                    onChange={e => setConfig(prev => ({ ...prev, cue: e.target.checked }))}
                    className="w-4 h-4 text-cyan-600 bg-gray-700 border-gray-600 rounded focus:ring-cyan-500 accent-cyan-500"
                  />
                  <span className="text-gray-300">{t('label_cue')}</span>
                </label>
              </div>
              <div className="flex space-x-6 pt-2">
                <label className="flex items-center space-x-3 cursor-pointer" title="Ducks other channels when playing">
                  <input
                    type="checkbox"
                    checked={config.isTalkover || false}
                    onChange={e => setConfig(prev => ({ ...prev, isTalkover: e.target.checked }))}
                    className="w-4 h-4 text-amber-500 bg-gray-700 border-gray-600 rounded focus:ring-amber-500 accent-amber-500"
                  />
                  <span className="text-amber-400 font-semibold">Talkover / Mic</span>
                </label>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">{t('label_audio_file')}</label>
            <div className="mt-1 flex items-center space-x-2">
              <label className="w-full cursor-pointer bg-gray-700 hover:bg-gray-600 text-white text-sm py-2 px-3 rounded-md text-center">
                {config.fileName || t('choose_file')}
                <input type="file" accept="audio/*" className="hidden" onChange={handleFileChange} />
              </label>
              {config.fileName && (
                <button onClick={handleRemove} className="bg-amber-600 hover:bg-amber-700 text-white text-sm py-2 px-3 rounded-md">{t('remove_audio')}</button>
              )}
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-between items-center">
          <button onClick={handleClear} className="py-2 px-4 bg-red-800 hover:bg-red-700 text-white rounded-md font-semibold">{t('clear_button')}</button>
          <div className="space-x-3">
            <button onClick={onClose} className="py-2 px-4 bg-gray-600 hover:bg-gray-500 text-white rounded-md">{t('cancel_button')}</button>
            <button onClick={handleSave} className="py-2 px-4 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-md">{t('save_button')}</button>
          </div>
        </div>
      </div >
    </div >
  );
};

export default SettingsDialog;
