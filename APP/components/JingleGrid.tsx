


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
  isTalkoverActive
}) => {
  return (
    <div className="p-2 sm:p-4 grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-11 gap-2 sm:gap-3 bg-gray-900">
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
          />
        );
      })}
    </div>
  );
};

export default JingleGrid;