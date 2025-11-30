import React, { useState, useEffect } from 'react';
import { useTranslations } from '../contexts/LanguageContext';
import { useMidi } from '../hooks/useMidi';
import { useAudioDevices } from '../hooks/useAudioDevices';
import AudioEngine from '../services/AudioEngine';

interface GlobalSettingsDialogProps {
  onClose: () => void;
  crossfader: number;
  onCrossfaderChange: (value: number) => void;
  playlistMode: boolean;
  onPlaylistModeChange: (enabled: boolean) => void;
  onMidiTrigger?: (buttonId: number) => void;
  isMidiLearnMode?: boolean;
  onMidiLearnModeChange?: (active: boolean) => void;
}

const GlobalSettingsDialog: React.FC<GlobalSettingsDialogProps> = ({
  onClose,
  crossfader,
  onCrossfaderChange,
  playlistMode,
  onPlaylistModeChange,
  onMidiTrigger,
  isMidiLearnMode = false,
  onMidiLearnModeChange,
}) => {
  const { t } = useTranslations();
  const { isMidiSupported, connectedDevices, requestMidiAccess } = useMidi(onMidiTrigger || (() => { }));
  const { devices } = useAudioDevices();
  const [selectedDeviceId, setSelectedDeviceId] = useState<string>('default');

  const handleDeviceChange = (deviceId: string) => {
    setSelectedDeviceId(deviceId);
    AudioEngine.getInstance().setSinkId(deviceId);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-40" onClick={onClose}>
      <div className="bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md border border-gray-700" onClick={e => e.stopPropagation()}>
        <h2 className="text-2xl font-bold text-white mb-4">{t('global_settings_title')}</h2>

        <div className="space-y-4">
          {/* Audio Output Selector */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Audio Output Device</label>
            <select
              value={selectedDeviceId}
              onChange={(e) => handleDeviceChange(e.target.value)}
              className="w-full bg-gray-700 text-white rounded p-2 text-sm border border-gray-600 focus:ring-cyan-500 focus:border-cyan-500"
            >
              <option value="default">Default System Output</option>
              {devices.map(device => (
                <option key={device.deviceId} value={device.deviceId}>
                  {device.label}
                </option>
              ))}
            </select>
          </div>

          <hr className="border-gray-600" />

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

            {/* MIDI Learn Controls */}
            {isMidiSupported && (
              <div className="mt-2 p-3 bg-gray-700 rounded-lg border border-gray-600">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-white">MIDI Mapping</span>
                  <div className="flex items-center space-x-2">
                    <span className={`text-xs ${isMidiLearnMode ? 'text-green-400 animate-pulse' : 'text-gray-400'}`}>
                      {isMidiLearnMode ? 'LEARNING MODE ACTIVE' : 'Normal Mode'}
                    </span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={isMidiLearnMode}
                        onChange={(e) => onMidiLearnModeChange && onMidiLearnModeChange(e.target.checked)}
                      />
                      <div className="w-9 h-5 bg-gray-600 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-purple-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                  </div>
                </div>
                <div className="text-xs text-gray-400 mb-2">
                  {isMidiLearnMode
                    ? "Click a Jingle Button, then press a key on your MIDI controller."
                    : "Enable 'Learn Mode' to map buttons to your controller."}
                </div>
                <button
                  onClick={async () => {
                    const MIDIManager = (await import('../services/MIDIManager')).default;
                    MIDIManager.getInstance().clearMapping();
                    alert("MIDI Mappings Cleared!");
                  }}
                  className="w-full py-1 text-xs bg-red-900 hover:bg-red-800 text-red-100 rounded border border-red-700 transition-colors"
                >
                  Clear All Mappings
                </button>
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