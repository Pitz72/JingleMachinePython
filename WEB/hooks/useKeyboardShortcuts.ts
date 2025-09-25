import { useEffect } from 'react';
import { VOLUME_ADJUST_STEP } from '../constants';

const keyToButtonIdMap: { [key: string]: number } = {
  '1': 0, '2': 1, '3': 2, '4': 3, '5': 4, '6': 5,
  'q': 6, 'w': 7, 'e': 8, 'r': 9, 't': 10, 'y': 11,
  'a': 12, 's': 13, 'd': 14, 'f': 15, 'g': 16, 'h': 17,
  'z': 18, 'x': 19, 'c': 20, 'v': 21, 'b': 22, 'n': 23,
};

export const useKeyboardShortcuts = (
  editingButtonId: number | null,
  canUndo: boolean,
  canRedo: boolean,
  undo: () => void,
  redo: () => void,
  handleSaveConfig: () => void,
  handleLoadConfig: () => void,
  handleButtonClick: (id: number) => void,
  handleButtonSettings: (id: number) => void,
  handleStopAll: () => void,
  handleCloseSettings: () => void,
  setMasterVolume: (volume: number | ((prev: number) => number)) => void
) => {
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
            handleLoadConfig();
            break;
        }
        return;
      }

      // Volume Controls
      if (key === 'arrowup') {
        event.preventDefault();
        setMasterVolume((v) => Math.min(1, v + VOLUME_ADJUST_STEP));
      } else if (key === 'arrowdown') {
        event.preventDefault();
        setMasterVolume((v) => Math.max(0, v - VOLUME_ADJUST_STEP));
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
    handleLoadConfig,
    handleButtonClick,
    handleButtonSettings,
    handleCloseSettings,
    setMasterVolume,
  ]);
};