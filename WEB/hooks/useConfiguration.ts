import { useCallback } from 'react';
import { ButtonConfig } from '../types';
import { TOTAL_BUTTONS, SAVE_FILE_VERSION } from '../constants';
import { db } from '../db';

interface JingleMachineSaveFile {
  version: string;
  config: {
    buttons: ButtonConfig[];
    masterVolume: number;
  };
  audioData: { [key: number]: string };
}

export const useConfiguration = (
  buttons: ButtonConfig[],
  masterVolume: number,
  handleStopAll: () => void
) => {
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

  const handleLoadConfig = useCallback(
    (onLoadSuccess: (buttons: ButtonConfig[], masterVolume: number) => void) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.json';
      input.onchange = (event) => {
        const file = (event.target as HTMLInputElement).files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.name.endsWith('.json')) {
          alert('Please select a valid JSON configuration file.');
          return;
        }

        // Validate file size (reasonable limit for config files)
        if (file.size > 50 * 1024 * 1024) { // 50MB
          alert('Configuration file is too large. Please select a smaller file.');
          return;
        }

        const reader = new FileReader();
        reader.onload = async (e) => {
          try {
            const text = e.target?.result;
            if (typeof text !== 'string') throw new Error('File content is not readable as text');

            const data = JSON.parse(text) as JingleMachineSaveFile;

            // Enhanced validation
            if (!data.version) {
              throw new Error('Configuration file is missing version information.');
            }
            if (!data.config || !Array.isArray(data.config.buttons)) {
              throw new Error('Configuration file has invalid button data.');
            }
            if (!data.audioData || typeof data.audioData !== 'object') {
              throw new Error('Configuration file has invalid audio data.');
            }
            if (data.config.buttons.length !== TOTAL_BUTTONS) {
              throw new Error(
                `Configuration file contains ${data.config.buttons.length} buttons, but ${TOTAL_BUTTONS} are expected.`
              );
            }

            handleStopAll(); // Stop everything before loading

            // Update IndexedDB with error handling
            const audioLoadPromises: Promise<void>[] = [];
            // First clear all existing audio
            for (let i = 0; i < TOTAL_BUTTONS; i++) {
              audioLoadPromises.push(db.deleteAudio(i).catch((e) => console.warn(`Failed to clear audio for button ${i}:`, e)));
            }
            await Promise.all(audioLoadPromises);

            const audioSavePromises: Promise<void>[] = [];
            for (const id in data.audioData) {
              if (Object.prototype.hasOwnProperty.call(data.audioData, id)) {
                const buttonId = Number(id);
                if (isNaN(buttonId) || buttonId < 0 || buttonId >= TOTAL_BUTTONS) {
                  console.warn(`Invalid button ID ${id} in audio data, skipping.`);
                  continue;
                }
                audioSavePromises.push(
                  db.setAudio(buttonId, data.audioData[id]).catch((e) =>
                    console.error(`Failed to load audio for button ${buttonId}:`, e)
                  )
                );
              }
            }
            await Promise.all(audioSavePromises);

            onLoadSuccess(data.config.buttons, data.config.masterVolume ?? 1);
            alert('Configuration loaded successfully!');

          } catch (error) {
            console.error('Failed to load configuration:', error);
            const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
            alert(`${'Load config error'}: ${errorMessage}`);
          }
        };

        reader.onerror = () => {
          alert('Failed to read the configuration file. The file may be corrupted or inaccessible.');
        };

        reader.readAsText(file);
      };
      input.click();
    },
    [handleStopAll]
  );

  return { handleSaveConfig, handleLoadConfig };
};