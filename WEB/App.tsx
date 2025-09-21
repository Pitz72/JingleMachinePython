import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ButtonConfig, PlaybackMode } from './types';
import { TOTAL_BUTTONS, LOCAL_STORAGE_KEY, PRESET_TEMPLATES } from './constants';
import GlobalSettingsDialog from './components/GlobalSettingsDialog';
import { SettingsIcon, PlaylistIcon } from './components/icons';
import JingleGrid from './components/JingleGrid';
import SettingsDialog from './components/SettingsDialog';
import WelcomeDialog from './components/WelcomeDialog';
import { db } from './db';
import { useTranslations } from './contexts/LanguageContext';
import { LanguageSelectionDialog } from './components/LanguageSelectionDialog';
import { useHistory } from './hooks';
import { UndoIcon, RedoIcon, VolumeUpIcon, DownloadIcon, UploadIcon } from './components/icons';

const MASTER_VOLUME_KEY = 'jingle_machine_master_volume';
const SAVE_FILE_VERSION = '1.6.0';

interface JingleMachineSaveFile {
  version: string;
  config: {
    buttons: ButtonConfig[];
    masterVolume: number;
  };
  audioData: { [key: number]: string };
}

const keyToButtonIdMap: { [key: string]: number } = {
    '1': 0, '2': 1, '3': 2, '4': 3, '5': 4, '6': 5,
    'q': 6, 'w': 7, 'e': 8, 'r': 9, 't': 10, 'y': 11,
    'a': 12, 's': 13, 'd': 14, 'f': 15, 'g': 16, 'h': 17,
    'z': 18, 'x': 19, 'c': 20, 'v': 21, 'b': 22, 'n': 23,
};


const App: React.FC = () => {
  const { state: buttons, setState: setButtons, setInitialState: setButtonsInitial, undo, redo, canUndo, canRedo } = useHistory<ButtonConfig[]>([]);
  const [editingButtonId, setEditingButtonId] = useState<number | null>(null);
  
  const [mainTrackId, setMainTrackId] = useState<number | null>(null);
  const [pausedTrackId, setPausedTrackId] = useState<number | null>(null);
  const [overlayTrackIds, setOverlayTrackIds] = useState<number[]>([]);
  const [queuedTrackIds, setQueuedTrackIds] = useState<number[]>([]);

  const [fadingOutTrackIds, setFadingOutTrackIds] = useState<number[]>([]);
  const [fadingInTrackId, setFadingInTrackId] = useState<number | null>(null);
  const fadeOutTimer = useRef<any>(null);
  const fadeInTimer = useRef<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [showWelcome, setShowWelcome] = useState(false);
  const { language, t } = useTranslations();
  const [masterVolume, setMasterVolume] = useState(1);
  const [showGlobalSettings, setShowGlobalSettings] = useState(false);
  const [crossfader, setCrossfader] = useState(0);
  const [playlistMode, setPlaylistMode] = useState(false);

  const getDefaultButtonConfig = useCallback((id: number): ButtonConfig => {
    return {
      id: id,
      name: `${t('default_jingle_name')} ${id + 1}`,
      color: '#4b5563',
      volume: 1,
      playbackMode: PlaybackMode.Restart,
      isLoop: false,
      crossfade: false,
      fileName: null,
      eqLow: 0,
      eqMid: 0,
      eqHigh: 0,
      pan: 0,
      solo: false,
      mute: false,
      cue: false,
      fadeInDuration: 100,
      fadeOutDuration: 100,
      isSpecialEffect: false,
    };
  }, [t]);

  // Load master volume from local storage
  useEffect(() => {
    const savedVolume = localStorage.getItem(MASTER_VOLUME_KEY);
    if (savedVolume !== null) {
      setMasterVolume(parseFloat(savedVolume));
    }
  }, []);

  // Save master volume to local storage
  useEffect(() => {
    localStorage.setItem(MASTER_VOLUME_KEY, String(masterVolume));
  }, [masterVolume]);

  // Initialize and load from localStorage
  useEffect(() => {
    if (!language) return; // Wait for language selection

    const savedConfig = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (savedConfig) {
      try {
        let parsedConfig = JSON.parse(savedConfig);

        // MIGRATION: Handle multiple potential legacy formats
        if (Array.isArray(parsedConfig) && parsedConfig.length > 0) {
            let needsMigration = false;
            const firstBtn = parsedConfig[0];
            // Check for legacy audioSrc, missing isLoop/crossfade, or old Italian playback modes
            if (firstBtn.hasOwnProperty('audioSrc') ||
                !firstBtn.hasOwnProperty('isLoop') ||
                !firstBtn.hasOwnProperty('crossfade') ||
                ['Da Capo', 'Continua', 'Accoda'].includes(firstBtn.playbackMode) ||
                !firstBtn.hasOwnProperty('eqLow')) {
                needsMigration = true;
            }

            if(needsMigration) {
                console.warn("Old configuration format detected. Migrating to new format.");
                alert(t('migration_alert'));
                parsedConfig = parsedConfig.map((btn: any) => {
                    const { audioSrc, ...rest } = btn;
                    let newPlaybackMode = btn.playbackMode;
                    switch(btn.playbackMode) {
                        case 'Da Capo': newPlaybackMode = PlaybackMode.Restart; break;
                        case 'Continua': newPlaybackMode = PlaybackMode.Continue; break;
                        case 'Accoda': newPlaybackMode = PlaybackMode.Queue; break;
                        case 'Loop': // Old loop-only mode
                            newPlaybackMode = PlaybackMode.Restart;
                            btn.isLoop = true;
                            break;
                    }
                    return {
                        ...getDefaultButtonConfig(rest.id),
                        ...rest,
                        name: rest.name || getDefaultButtonConfig(rest.id).name,
                        playbackMode: newPlaybackMode,
                        isLoop: btn.isLoop || btn.playbackMode === 'Loop',
                        crossfade: btn.crossfade || false,
                    };
                });
                localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(parsedConfig));
            }
        }

        if (parsedConfig.length !== TOTAL_BUTTONS) {
            const defaultButtons = Array.from({ length: TOTAL_BUTTONS }, (_, i) => getDefaultButtonConfig(i));
            setButtonsInitial(defaultButtons);
            setShowWelcome(true);
        } else {
            setButtonsInitial(parsedConfig);
        }
      } catch (e) {
        console.error("Failed to parse saved config:", e);
        const defaultButtons = Array.from({ length: TOTAL_BUTTONS }, (_, i) => getDefaultButtonConfig(i));
        setButtonsInitial(defaultButtons);
      }
    } else {
      const defaultButtons = Array.from({ length: TOTAL_BUTTONS }, (_, i) => getDefaultButtonConfig(i));
      setButtonsInitial(defaultButtons);
      setShowWelcome(true); // Show welcome screen only on first visit
    }
  }, [getDefaultButtonConfig, language, setButtonsInitial, t]);


  // Save to localStorage asynchronously
  useEffect(() => {
    if (buttons.length > 0) {
      const handler = setTimeout(() => {
        try {
          // Filter out audioSrc before saving to avoid quota issues if migration failed
          const configToSave = buttons.map(({...rest }) => rest);
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(configToSave));
        } catch (e) {
          console.error("Failed to save configuration to localStorage:", e);
        }
      }, 100);

      return () => clearTimeout(handler);
    }
  }, [buttons]);

  const handleButtonSettings = (id: number) => {
    setEditingButtonId(id);
  };

  const handleCloseSettings = () => {
    setEditingButtonId(null);
  };

  const handleSaveSettings = (newConfig: ButtonConfig, newAudioData?: string | null) => {
    if (newAudioData) {
      db.setAudio(newConfig.id, newAudioData).catch(e => {
        console.error("Failed to save audio to IndexedDB:", e);
      });
    }
    setButtons(prev => prev.map(b => b.id === newConfig.id ? newConfig : b));
  };
  
  const handleRemoveAudio = (id: number) => {
    db.deleteAudio(id).catch(e => console.error("Failed to delete audio from IndexedDB:", e));
    setButtons(prev => prev.map(b => b.id === id ? {...b, fileName: null} : b));
  };

  const handleClearButton = (id: number) => {
    db.deleteAudio(id).catch(e => console.error("Failed to delete audio from IndexedDB:", e));
    setButtons(prev => prev.map(b => (b.id === id ? getDefaultButtonConfig(id) : b)));
  };

  const playNextInQueue = useCallback(() => {
    if (queuedTrackIds.length > 0) {
      const nextId = queuedTrackIds[0];
      setQueuedTrackIds(prev => prev.slice(1));
      setMainTrackId(nextId);
      setPausedTrackId(null);
    } else {
      setMainTrackId(null);
    }
  }, [queuedTrackIds]);

  const handleButtonEnded = useCallback((id: number) => {
    if (fadingOutTrackIds.includes(id)) {
        return; // Don't process 'ended' event for a track that is being faded out by the system
    }
    if (overlayTrackIds.includes(id)) {
      setOverlayTrackIds(prev => prev.filter(oid => oid !== id));
      return;
    }
    if (mainTrackId === id) {
        setPausedTrackId(null);
        playNextInQueue();
    }
  }, [mainTrackId, overlayTrackIds, playNextInQueue, fadingOutTrackIds]);

  const clearFades = useCallback(() => {
    if (fadeOutTimer.current) clearTimeout(fadeOutTimer.current);
    if (fadeInTimer.current) clearTimeout(fadeInTimer.current);
    fadeOutTimer.current = null;
    fadeInTimer.current = null;
    setFadingOutTrackIds([]);
    setFadingInTrackId(null);
  }, []);

  const handleButtonClick = useCallback((id: number) => {
    const config = buttons.find(b => b.id === id);
    if (!config || !config.fileName) return;

    const prevMainTrackId = mainTrackId;
    const isSwitchingTrack = (config.playbackMode === PlaybackMode.Restart || config.playbackMode === PlaybackMode.Continue) && prevMainTrackId !== null && prevMainTrackId !== id;
    const shouldFade = config.crossfade && isSwitchingTrack;

    if (shouldFade && prevMainTrackId !== null) {
      clearFades();
      setFadingOutTrackIds([prevMainTrackId]);
      setFadingInTrackId(id);
      
      fadeOutTimer.current = setTimeout(() => {
        setFadingOutTrackIds(prev => prev.filter(trackId => trackId !== prevMainTrackId));
        fadeOutTimer.current = null;
      }, 2000);

      fadeInTimer.current = setTimeout(() => {
        setFadingInTrackId(null);
        fadeInTimer.current = null;
      }, 2000);
    } else {
        if (!isSwitchingTrack) {
             clearFades();
        }
    }


    switch (config.playbackMode) {
      case PlaybackMode.Overlay:
        setOverlayTrackIds(prev => [...prev.filter(oid => oid !== id), id]);
        break;
      
      case PlaybackMode.Queue:
        if (mainTrackId === null && pausedTrackId === null) {
          setMainTrackId(id);
          setPausedTrackId(null);
        } else {
          setQueuedTrackIds(prev => prev.includes(id) ? prev : [...prev, id]);
        }
        break;

      case PlaybackMode.Continue:
        if (mainTrackId === id) { // Same button is active
          if (pausedTrackId === id) { // It's currently paused, so resume
            setPausedTrackId(null);
          } else { // It's currently playing, so pause
            setPausedTrackId(id);
          }
        } else { // A new button is pressed, or another was playing
          if (queuedTrackIds.length > 0) setQueuedTrackIds([]);
          setMainTrackId(id);
          setPausedTrackId(null);
        }
        break;
        
      case PlaybackMode.Restart:
      default:
        // If this button is already playing (and not paused), restart it.
        if (mainTrackId === id && !pausedTrackId) {
          // To force a restart in the child component, we toggle the playing state off then on again.
          // Setting mainTrackId to null will cause the JingleButton effect to fire, resetting currentTime.
          setMainTrackId(null);
          // Then immediately schedule it to play again using a timeout.
          setTimeout(() => {
            setMainTrackId(id);
          }, 0);
        } else {
          // If it's a new button, or the current track is paused, just play it from the start.
          if (queuedTrackIds.length > 0) setQueuedTrackIds([]);
          setMainTrackId(id);
          setPausedTrackId(null);
        }
        break;
    }
  }, [buttons, mainTrackId, pausedTrackId, queuedTrackIds, clearFades]);

  const handleStopAll = useCallback(() => {
    // Stop queued and paused tracks immediately
    setQueuedTrackIds([]);
    setPausedTrackId(null);

    const tracksToFadeOut = [
      ...(mainTrackId !== null && mainTrackId !== pausedTrackId ? [mainTrackId] : []),
      ...overlayTrackIds
    ];

    // Immediately stop the main track if it was paused
    if (mainTrackId !== null && mainTrackId === pausedTrackId) {
        setMainTrackId(null);
    }
    
    if (tracksToFadeOut.length > 0) {
      if (fadeOutTimer.current) clearTimeout(fadeOutTimer.current);
      if (fadeInTimer.current) clearTimeout(fadeInTimer.current);
      
      setFadingInTrackId(null);
      setFadingOutTrackIds(currentFading => [...currentFading, ...tracksToFadeOut].filter((v, i, a) => a.indexOf(v) === i));

      fadeOutTimer.current = setTimeout(() => {
        // This will clean up everything after the fade
        setMainTrackId(null);
        setOverlayTrackIds([]);
        setFadingOutTrackIds([]);
        fadeOutTimer.current = null;
      }, 2000);
    }
  }, [mainTrackId, overlayTrackIds, pausedTrackId]);

  const handleSaveConfig = useCallback(async () => {
    handleStopAll(); // Stop all audio to prevent issues during save
    const audioData: { [key: number]: string } = {};
    for (const button of buttons) {
        if (button.fileName) {
            const data = await db.getAudio(button.id);
            if (data) {
                audioData[button.id] = data;
            }
        }
    }

    const saveData: JingleMachineSaveFile = {
        version: SAVE_FILE_VERSION,
        config: {
            buttons: buttons,
            masterVolume: masterVolume,
        },
        audioData: audioData,
    };

    const jsonString = JSON.stringify(saveData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'jingle-machine-config.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, [buttons, masterVolume, handleStopAll]);

  const handleLoadClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleLoadPreset = useCallback((presetIndex: number) => {
    const preset = PRESET_TEMPLATES[presetIndex];
    if (preset) {
      handleStopAll();
      setButtonsInitial(preset.config);
    }
  }, [handleStopAll, setButtonsInitial]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
        try {
            const text = e.target?.result;
            if (typeof text !== 'string') throw new Error('File is not readable');
            
            const data = JSON.parse(text) as JingleMachineSaveFile;

            // Basic validation
            if (!data.version || !data.config || !data.config.buttons || !data.audioData) {
                throw new Error('Invalid configuration file format.');
            }
            
            handleStopAll(); // Stop everything before loading

            // Update state
            setButtonsInitial(data.config.buttons);
            setMasterVolume(data.config.masterVolume ?? 1);

            // Update IndexedDB
            const audioLoadPromises: Promise<void>[] = [];
            // First clear all existing audio
            for (let i = 0; i < TOTAL_BUTTONS; i++) {
                audioLoadPromises.push(db.deleteAudio(i));
            }
            await Promise.all(audioLoadPromises);

            const audioSavePromises: Promise<void>[] = [];
            for (const id in data.audioData) {
                if (Object.prototype.hasOwnProperty.call(data.audioData, id)) {
                    audioSavePromises.push(db.setAudio(Number(id), data.audioData[id]));
                }
            }
            await Promise.all(audioSavePromises);
            
            alert(t('load_config_success_alert'));

        } catch (error) {
            console.error('Failed to load configuration:', error);
            alert(t('load_config_error_alert'));
        } finally {
            // Reset file input to allow loading the same file again
            if (event.target) {
                event.target.value = '';
            }
        }
    };
    reader.readAsText(file);
  };

  // Keyboard shortcuts effect
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't trigger shortcuts if a dialog is open and we are typing in an input.
      if (editingButtonId !== null && (event.target as HTMLElement).tagName === 'INPUT') {
          if (event.key === 'Escape') {
              handleCloseSettings();
          }
          return;
      }
      
      // Handle shortcuts that don't depend on dialogs first.
      if (event.key === 'Escape') {
          if (editingButtonId !== null) {
            handleCloseSettings();
          } else {
            handleStopAll();
          }
          return;
      }
      
      // If any dialog is open, disable other shortcuts.
      if (editingButtonId !== null) return;
      
      const key = event.key.toLowerCase();

      // Ctrl/Cmd shortcuts
      if (event.ctrlKey || event.metaKey) {
        switch (key) {
          case 'z':
            event.preventDefault();
            if (canUndo) undo();
            break;
          case 'y':
            event.preventDefault();
            if (canRedo) redo();
            break;
          case 's':
            event.preventDefault();
            handleSaveConfig();
            break;
          case 'o':
            event.preventDefault();
            handleLoadClick();
            break;
        }
        return;
      }

      // Volume Controls
      if (key === 'arrowup') {
        event.preventDefault();
        setMasterVolume(v => Math.min(1, v + 0.05));
      } else if (key === 'arrowdown') {
        event.preventDefault();
        setMasterVolume(v => Math.max(0, v - 0.05));
      }

      // Jingle playback / settings
      if (keyToButtonIdMap.hasOwnProperty(key)) {
        event.preventDefault();
        const buttonId = keyToButtonIdMap[key];
        if (event.shiftKey) {
          handleButtonSettings(buttonId);
        } else {
          handleButtonClick(buttonId);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [
    editingButtonId, 
    handleStopAll, 
    canUndo, 
    undo, 
    canRedo, 
    redo, 
    handleSaveConfig, 
    handleLoadClick, 
    handleButtonClick,
  ]);


  const isSoloActive = buttons.some(b => b.solo);

  const editingButton = buttons.find(b => b.id === editingButtonId);

  if (!language) {
      return <LanguageSelectionDialog />;
  }

  return (
    <div className="bg-gray-900 min-h-screen text-white font-sans">
      {showWelcome && <WelcomeDialog onStart={() => setShowWelcome(false)} />}
      <header className="bg-gray-800 p-4 text-center shadow-lg">
        <h1 className="text-2xl font-bold text-cyan-400">{t('app_title')}</h1>
        <div className="flex items-center justify-center space-x-2 md:space-x-4 mt-3">
            <button
              onClick={undo}
              disabled={!canUndo}
              className="bg-gray-600 hover:bg-gray-500 text-white font-semibold py-2 px-4 rounded-lg flex items-center transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label={t('undo_button')}
              title={t('undo_button')}
            >
              <UndoIcon className="w-5 h-5" />
            </button>
            <button
                onClick={handleStopAll}
                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-red-500"
            >
                {t('stop_all_audio')}
            </button>
              <button
              onClick={redo}
              disabled={!canRedo}
              className="bg-gray-600 hover:bg-gray-500 text-white font-semibold py-2 px-4 rounded-lg flex items-center transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label={t('redo_button')}
              title={t('redo_button')}
            >
              <RedoIcon className="w-5 h-5" />
            </button>
            <div className="h-6 border-l border-gray-600 mx-2"></div>
            <button
              onClick={() => setShowGlobalSettings(true)}
              className="bg-gray-600 hover:bg-gray-500 text-white font-semibold py-2 px-4 rounded-lg flex items-center transition-opacity"
              aria-label={t('global_settings_title')}
              title={t('global_settings_title')}
            >
              <SettingsIcon className="w-5 h-5" />
            </button>
            <button
              onClick={() => setPlaylistMode(!playlistMode)}
              className={`font-semibold py-2 px-4 rounded-lg flex items-center transition-opacity ${playlistMode ? 'bg-cyan-600 hover:bg-cyan-500' : 'bg-gray-600 hover:bg-gray-500'}`}
              aria-label={t('label_playlist_mode')}
              title={t('label_playlist_mode')}
            >
              <PlaylistIcon className="w-5 h-5" />
            </button>
            <div className="h-6 border-l border-gray-600 mx-2"></div>
            <button
              onClick={handleSaveConfig}
              className="bg-gray-600 hover:bg-gray-500 text-white font-semibold py-2 px-4 rounded-lg flex items-center transition-opacity"
              aria-label={t('save_config_button')}
              title={t('save_config_button')}
            >
              <DownloadIcon className="w-5 h-5" />
            </button>
              <button
              onClick={handleLoadClick}
              className="bg-gray-600 hover:bg-gray-500 text-white font-semibold py-2 px-4 rounded-lg flex items-center transition-opacity"
              aria-label={t('load_config_button')}
              title={t('load_config_button')}
            >
              <UploadIcon className="w-5 h-5" />
            </button>
            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".json" className="hidden" />
        </div>
        <div className="max-w-xs mx-auto mt-4 flex items-center space-x-3 text-gray-300">
          <VolumeUpIcon className="w-6 h-6" />
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={masterVolume}
            onChange={(e) => setMasterVolume(parseFloat(e.target.value))}
            className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            aria-label={t('master_volume_label')}
            title={t('master_volume_label')}
          />
          <span className="w-12 text-sm font-mono">{Math.round(masterVolume * 100)}%</span>
        </div>
        <div className="max-w-xs mx-auto mt-2">
          <select
            onChange={(e) => handleLoadPreset(parseInt(e.target.value))}
            className="w-full bg-gray-700 border border-gray-600 rounded-md text-white p-2 focus:ring-cyan-500 focus:border-cyan-500"
            defaultValue=""
          >
            <option value="" disabled>{t('select_preset')}</option>
            {PRESET_TEMPLATES.map((preset, index) => (
              <option key={index} value={index}>{preset.name}</option>
            ))}
          </select>
        </div>
      </header>
      <main>
        <JingleGrid
          buttons={buttons}
          onButtonClick={handleButtonClick}
          onButtonEnded={handleButtonEnded}
          onButtonSettings={handleButtonSettings}
          mainTrackId={mainTrackId}
          overlayTrackIds={overlayTrackIds}
          queuedTrackIds={queuedTrackIds}
          pausedTrackId={pausedTrackId}
          fadingOutTrackIds={fadingOutTrackIds}
          fadingInTrackId={fadingInTrackId}
          masterVolume={masterVolume}
          isSoloActive={isSoloActive}
        />
      </main>
      {editingButton && (
        <SettingsDialog
          buttonConfig={editingButton}
          onClose={handleCloseSettings}
          onSave={handleSaveSettings}
          onRemoveAudio={handleRemoveAudio}
          onClear={handleClearButton}
        />
      )}
      {showGlobalSettings && (
        <GlobalSettingsDialog
          onClose={() => setShowGlobalSettings(false)}
          crossfader={crossfader}
          onCrossfaderChange={setCrossfader}
          playlistMode={playlistMode}
          onPlaylistModeChange={setPlaylistMode}
        />
      )}
    </div>
  );
};

export default App;