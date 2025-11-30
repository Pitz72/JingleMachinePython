import React from 'react';
import { ButtonConfig, PlaybackMode } from '../types';
import { LoopIcon, QueueIcon, OverlayIcon, ContinueIcon, MusicNoteIcon, CheckCircleIcon } from './icons';
import { useAudioEngine } from '../hooks/useAudioEngine';

interface JingleButtonProps {
  config: ButtonConfig;
  onClick: (id: number) => void;
  onEnded: (id: number) => void;
  onSettings: (id: number) => void;
  isPlaying: boolean;
  isPaused: boolean;
  isQueued: boolean;
  isFadingIn: boolean;
  isFadingOut: boolean;
  masterVolume: number;
  isSoloActive: boolean;
}

const JingleButton: React.FC<JingleButtonProps> = ({
  config,
  onClick,
  onEnded,
  onSettings,
  isPlaying,
  isPaused,
  isQueued,
  isFadingIn,
  isFadingOut,
  masterVolume,
  isSoloActive
}) => {
  const { audioRef, progress } = useAudioEngine({
    config,
    masterVolume,
    isPlaying,
    isPaused,
    isFadingIn,
    isFadingOut,
    isSoloActive,
  });

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    onSettings(config.id);
  };
  
  const getModeIcon = () => {
    const iconClass = "w-4 h-4 text-gray-300";
    switch(config.playbackMode){
        case PlaybackMode.Queue: return <QueueIcon className={iconClass} />;
        case PlaybackMode.Overlay: return <OverlayIcon className={iconClass} />;
        case PlaybackMode.Continue: return <ContinueIcon className={iconClass} />;
        default: return null;
    }
  };

  const buttonStyle = {
    backgroundColor: config.color,
  };
  
  const progressStyle = {
    width: `${progress * 100}%`,
  };

  const hasAudio = !!config.fileName;
  const buttonText = config.name || `Button ${config.id + 1}`;

  // Build comprehensive ARIA label
  const getAriaLabel = () => {
    let label = `${buttonText}`;
    if (hasAudio) {
      label += `, ${config.playbackMode} mode`;
      if (isPlaying && !isPaused) label += ', playing';
      else if (isPaused) label += ', paused';
      else if (isQueued) label += ', queued';
      if (config.isLoop) label += ', loop enabled';
      if (config.crossfade) label += ', crossfade enabled';
    } else {
      label += ', no audio loaded';
    }
    return label;
  };

  return (
    <div
      onClick={() => {
        if (hasAudio) {
          onClick(config.id);
        } else {
          onSettings(config.id); // If no audio, left-click opens settings
        }
      }}
      onContextMenu={handleContextMenu}
      className={`relative rounded-lg shadow-md flex flex-col justify-between items-center p-2 transition-all duration-150 transform h-24
        ${hasAudio ? 'cursor-pointer hover:scale-105 active:scale-95' : 'cursor-pointer opacity-60 hover:opacity-75'}
        ${isPlaying && !isPaused ? 'ring-4 ring-offset-2 ring-offset-gray-900 ring-cyan-400' : ''}
        ${isPaused ? 'ring-4 ring-offset-2 ring-offset-gray-900 ring-amber-400' : ''}
        ${isQueued ? 'animate-pulse ring-2 ring-gray-400' : ''}
      `}
      style={buttonStyle}
      role="button"
      tabIndex={0}
      aria-label={getAriaLabel()}
      aria-pressed={isPlaying && !isPaused}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          if (hasAudio) {
            onClick(config.id);
          } else {
            onSettings(config.id);
          }
        }
      }}
    >
      <audio ref={audioRef} />

      {/* Progress Bar */}
      <div className="absolute top-0 left-0 h-full bg-black bg-opacity-30" style={progressStyle}></div>

      {/* Button Content */}
      <div className="relative z-10 w-full h-full flex flex-col justify-between">
        <div className="flex justify-between items-start w-full">
            <div className="flex items-center space-x-1">
                <span className="text-xs font-mono bg-black bg-opacity-50 px-1 rounded">{config.id + 1}</span>
                {hasAudio && <CheckCircleIcon className="w-4 h-4 text-green-400" />}
            </div>
            <div className="flex items-center space-x-1 bg-black bg-opacity-50 p-1 rounded-full">
             {config.isLoop && <LoopIcon className="w-4 h-4 text-gray-300" />}
             {getModeIcon()}
            </div>
        </div>
        
        <div className="flex-grow flex items-center justify-center">
          {!hasAudio && <MusicNoteIcon className="w-8 h-8 text-white opacity-20" />}
          <p className="text-white font-bold text-center break-words text-sm leading-tight [text-shadow:_1px_1px_2px_rgb(0_0_0_/_80%)]">
            {buttonText}
          </p>
        </div>
        
        <div className="h-4"></div>
      </div>
    </div>
  );
};

export default JingleButton;
