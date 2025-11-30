


import React from 'react';
import { ButtonConfig } from '../types';
import JingleButton from './JingleButton';

interface JingleGridProps {
  buttons: ButtonConfig[];
  onButtonClick: (id: number) => void;
  onButtonEnded: (id: number) => void;
  onButtonSettings: (id: number) => void;
  mainTrackId: number | null;
  overlayTrackIds: number[];
  queuedTrackIds: number[];
  pausedTrackId: number | null;
  fadingOutTrackIds: number[];
  fadingInTrackId: number | null;
  masterVolume: number;
  isSoloActive: boolean;
  onFileDrop: (id: number, file: File) => void;
  isTalkoverActive: boolean;
  isMidiLearnMode: boolean;
}

const JingleGrid: React.FC<JingleGridProps> = ({
  buttons,
  onButtonClick,
  onButtonEnded,
  onButtonSettings,
  mainTrackId,
  overlayTrackIds,
  queuedTrackIds,
  pausedTrackId,
  fadingOutTrackIds,
  fadingInTrackId,
  masterVolume,
  isSoloActive,
  onFileDrop,
  isTalkoverActive,
  isMidiLearnMode
}) => {


  return (
    <div className="grid grid-cols-11 grid-rows-8 gap-2 w-full h-full">
      {buttons.map(button => {
        const isPlaying = mainTrackId === button.id || overlayTrackIds.includes(button.id) || fadingOutTrackIds.includes(button.id);
        const isPaused = pausedTrackId === button.id;
        const isQueued = queuedTrackIds.includes(button.id);
        const isFadingIn = fadingInTrackId === button.id;
        const isFadingOut = fadingOutTrackIds.includes(button.id);

        return (
          <JingleButton
            key={button.id}
            config={button}
            onClick={onButtonClick}
            onEnded={onButtonEnded}
            onSettings={onButtonSettings}
            isPlaying={isPlaying}
            isPaused={isPaused}
            isQueued={isQueued}
            isFadingIn={isFadingIn}
            isFadingOut={isFadingOut}
            masterVolume={masterVolume}
            isSoloActive={isSoloActive}
            onFileDrop={onFileDrop}
            isTalkoverActive={isTalkoverActive}
            isMidiLearnMode={isMidiLearnMode}
          />
        );
      })}
    </div>
  );
};

export default JingleGrid;