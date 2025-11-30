import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ButtonConfig, PlaybackMode } from './types';
import { TOTAL_BUTTONS, LOCAL_STORAGE_KEY, PRESET_TEMPLATES, AUTO_SAVE_DELAY } from './constants';
import GlobalSettingsDialog from './components/GlobalSettingsDialog';
import { SettingsIcon, PlaylistIcon } from './components/icons';
import JingleGrid from './components/JingleGrid';
import AudioEngine from './services/AudioEngine';
import MIDIManager from './services/MIDIManager';
import RecorderControl from './components/RecorderControl';
import SettingsDialog from './components/SettingsDialog';
import WelcomeDialog from './components/WelcomeDialog';
import { LanguageSelectionDialog } from './components/LanguageSelectionDialog';
import { useDatabase } from './contexts/DatabaseContext';
import { useTranslations } from './contexts/LanguageContext';
import { useTheme } from './contexts/ThemeContext';
import { useHistory } from './hooks';
import { useMasterVolume } from './hooks/useMasterVolume';
import { useGlobalSettings } from './hooks/useGlobalSettings';
import { useConfiguration } from './hooks/useConfiguration';
import { useAudioPlayback } from './hooks/useAudioPlayback';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { UndoIcon, RedoIcon, VolumeUpIcon, DownloadIcon, UploadIcon, SunIcon, MoonIcon } from './components/icons';
import TopBar from './components/layout/TopBar';
import ControlDeck from './components/layout/ControlDeck';
import MainGrid from './components/layout/MainGrid';

const LANGUAGE_STORAGE_KEY = 'jingle_machine_language';

const App: React.FC = () => {
  const database = useDatabase();
  const { state: buttons, setState: setButtons, setInitialState: setButtonsInitial, undo, redo, canUndo, canRedo } = useHistory<ButtonConfig[]>([]);
  const [editingButtonId, setEditingButtonId] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { language, t } = useTranslations();
  const { theme, toggleTheme } = useTheme();

  // App flow states - initialize based on saved language
  const [appState, setAppState] = useState<'language' | 'welcome' | 'main'>(() => {
    const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    return savedLanguage ? 'welcome' : 'language';
  });


  // Custom hooks
  const { masterVolume, setMasterVolume } = useMasterVolume();
  const { crossfader, setCrossfader, playlistMode, setPlaylistMode } = useGlobalSettings();
  const {
    mainTrackId,
    pausedTrackId,
    overlayTrackIds,
    queuedTrackIds,
    fadingOutTrackIds,
    fadingInTrackId,
    handleButtonClick,
    handleStopAll,
    handleButtonEnded,
  } = useAudioPlayback();
  const { handleSaveConfig, handleLoadConfig } = useConfiguration(buttons, masterVolume, handleStopAll);

  const handleLoadConfigWithCallback = useCallback(() => {
    handleLoadConfig((loadedButtons, loadedMasterVolume) => {
      setButtonsInitial(loadedButtons);
      setMasterVolume(loadedMasterVolume);
    });
  }, [handleLoadConfig, setButtonsInitial, setMasterVolume]);

  const [showGlobalSettings, setShowGlobalSettings] = useState(false);
  const [isMidiLearnMode, setIsMidiLearnMode] = useState(false);

  // Sync MIDI Learn Mode
  const toggleMidiLearnMode = (active: boolean) => {
    setIsMidiLearnMode(active);
    MIDIManager.getInstance().setLearnMode(active);
  };

  // Button settings handlers
  const handleButtonSettings = (id: number) => {
    setEditingButtonId(id);
  };

  const handleCloseSettings = () => {
    setEditingButtonId(null);
  };

  // Configuration handlers
  const handleLoadClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  // Wrapper for keyboard shortcuts to match expected signature
  const handleButtonClickForKeyboard = useCallback((id: number) => {
    handleButtonClick(id, buttons);
  }, [handleButtonClick, buttons]);

  // Wrapper for JingleGrid to match expected signature
  const handleButtonClickForGrid = useCallback((id: number) => {
    handleButtonClick(id, buttons);
  }, [handleButtonClick, buttons]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    handleLoadConfigWithCallback();
  };

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

          if (needsMigration) {
            console.warn("Old configuration format detected. Migrating to new format.");
            alert(t('migration_alert'));
            parsedConfig = parsedConfig.map((btn: any) => {
              const { audioSrc, ...rest } = btn;
              let newPlaybackMode = btn.playbackMode;
              switch (btn.playbackMode) {
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
    }
  }, [language, setButtonsInitial, t]);

  // Save to localStorage asynchronously
  useEffect(() => {
    if (buttons.length > 0) {
      const handler = setTimeout(() => {
        try {
          // Filter out audioSrc before saving to avoid quota issues if migration failed
          const configToSave = buttons.map(({ ...rest }) => rest);
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(configToSave));
        } catch (e) {
          console.error("Failed to save configuration to localStorage:", e);
        }
      }, AUTO_SAVE_DELAY);

      return () => clearTimeout(handler);
    }
  }, [buttons]);

  // Keyboard shortcuts
  useKeyboardShortcuts(
    editingButtonId,
    canUndo,
    canRedo,
    undo,
    redo,
    handleSaveConfig,
    handleLoadConfigWithCallback,
    handleButtonClickForKeyboard,
    handleButtonSettings,
    handleStopAll,
    handleCloseSettings,
    setMasterVolume
  );

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

  const handleSaveSettings = (newConfig: ButtonConfig, newAudioData?: string | null) => {
    if (newAudioData) {
      database.setAudio(newConfig.id, newAudioData).catch(e => {
        console.error("Failed to save audio to IndexedDB:", e);
      });
    }
    setButtons(prev => prev.map(b => b.id === newConfig.id ? newConfig : b));
  };

  const handleRemoveAudio = (id: number) => {
    database.deleteAudio(id).catch(e => console.error("Failed to delete audio from IndexedDB:", e));
    setButtons(prev => prev.map(b => b.id === id ? { ...b, fileName: null } : b));
  };

  const handleClearButton = (id: number) => {
    database.deleteAudio(id).catch(e => console.error("Failed to delete audio from IndexedDB:", e));
    setButtons(prev => prev.map(b => (b.id === id ? getDefaultButtonConfig(id) : b)));
  };

  const handleLoadPreset = useCallback((presetIndex: number) => {
    const preset = PRESET_TEMPLATES[presetIndex];
    if (preset) {
      handleStopAll();
      setButtonsInitial(preset.config);
    }
  }, [handleStopAll, setButtonsInitial]);

  const handleFileDrop = useCallback(async (id: number, file: File) => {
    // Check for Electron path (absolute path)
    const filePath = (file as any).path;
    let audioSrc = '';
    let fileDataUrl = '';

    if (filePath) {
      // Electron: Use absolute path
      audioSrc = `file://${filePath}`;
    } else {
      // Web Fallback: Read as Data URL
      try {
        fileDataUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
        audioSrc = fileDataUrl;
      } catch (e) {
        console.error("Failed to read file:", e);
        return;
      }
    }

    // Generate Waveform (non-blocking via Worker)
    let waveform: number[] = [];
    try {
      // Import AudioEngine dynamically if needed or use the global one
      const AudioEngine = (await import('./services/AudioEngine')).default;
      waveform = await AudioEngine.getInstance().generateWaveform(audioSrc);
    } catch (e) {
      console.error("Failed to generate waveform:", e);
    }

    if (filePath) {
      // Electron: Update state with filePath and waveform
      setButtons(prev => prev.map(b => {
        if (b.id === id) {
          return {
            ...b,
            fileName: file.name,
            filePath: filePath,
            waveform: waveform
          };
        }
        return b;
      }));
    } else {
      // Web: Save to DB and update state
      handleSaveSettings({
        ...buttons.find(b => b.id === id)!,
        fileName: file.name,
        waveform: waveform
      }, fileDataUrl);
    }
  }, [buttons, handleSaveSettings]);

  const isSoloActive = buttons.some(b => b.solo);
  const editingButton = buttons.find(b => b.id === editingButtonId);

  // App flow: Language -> Welcome -> Main App
  const savedLanguage = localStorage.getItem(LANGUAGE_STORAGE_KEY);

  // Always show language selection if no language is saved
  if (!savedLanguage) {
    return <LanguageSelectionDialog />;
  }

  // Always show welcome screen after language selection
  if (appState === 'language' || appState === 'welcome') {
    return (
      <div className={`${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'} min-h-screen font-sans`}>
        {/* Screen reader announcements */}
        <div aria-live="polite" aria-atomic="true" className="sr-only" id="audio-status">
          {mainTrackId !== null && `Playing button ${mainTrackId + 1}`}
          {pausedTrackId !== null && `Paused button ${pausedTrackId + 1}`}
          {overlayTrackIds.length > 0 && `Overlay playing: ${overlayTrackIds.map(id => id + 1).join(', ')}`}
          {queuedTrackIds.length > 0 && `Queued: ${queuedTrackIds.map(id => id + 1).join(', ')}`}
        </div>
        <WelcomeDialog onStart={() => {
          setAppState('main');
          // Save language preference
          localStorage.setItem(LANGUAGE_STORAGE_KEY, language || 'en');
        }} />
      </div>
    );
  }



  return (
    <div className={`flex flex-col h-screen w-screen overflow-hidden ${theme === 'dark' ? 'bg-zinc-950 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <TopBar
        appTitle={t('app_title')}
        theme={theme}
        toggleTheme={toggleTheme}
        onSettingsClick={() => setShowGlobalSettings(true)}
        playlistMode={playlistMode}
        onPlaylistModeChange={setPlaylistMode}
        onSaveConfig={() => {
          // Custom Save Logic for .rrlm
          const configToSave = buttons.map(({ ...rest }) => rest);
          const blob = new Blob([JSON.stringify(configToSave)], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `config_${new Date().toISOString().slice(0, 10)}.rrlm`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        }}
        onLoadConfig={handleLoadClick}
        onLoadPreset={handleLoadPreset}
        presets={PRESET_TEMPLATES}
      />

      <MainGrid>
        <JingleGrid
          buttons={buttons}
          onButtonClick={handleButtonClickForGrid}
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
          onFileDrop={handleFileDrop}
          isTalkoverActive={buttons.some(b =>
            b.isTalkover && (
              mainTrackId === b.id ||
              overlayTrackIds.includes(b.id) ||
              fadingOutTrackIds.includes(b.id)
            )
          )}
          isMidiLearnMode={isMidiLearnMode}
        />
      </MainGrid>

      <ControlDeck
        masterVolume={masterVolume}
        setMasterVolume={setMasterVolume}
        onStopAll={handleStopAll}
        onUndo={undo}
        onRedo={redo}
        canUndo={canUndo}
        canRedo={canRedo}
      />

      {/* Hidden File Input */}
      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept=".json,.rrlm" className="hidden" />

      {/* Dialogs */}
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
          onMidiTrigger={handleButtonClickForGrid}
          isMidiLearnMode={isMidiLearnMode}
          onMidiLearnModeChange={toggleMidiLearnMode}
        />
      )}
    </div>
  );
};

export default App;