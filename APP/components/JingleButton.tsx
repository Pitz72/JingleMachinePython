import React, { useEffect } from 'react';
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
  onFileDrop: (id: number, file: File) => void;
  isTalkoverActive: boolean;
  isMidiLearnMode: boolean;
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
  isSoloActive,
  onFileDrop,
  isTalkoverActive,
  isMidiLearnMode
}) => {
  const { audioRef, progress } = useAudioEngine({
    config,
    masterVolume,
    isPlaying,
    isPaused,
    isFadingIn,
    isFadingOut,
    isSoloActive,
    isTalkoverActive
  });

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    onSettings(config.id);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      // Basic audio type check
      if (file.type.startsWith('audio/') || file.name.match(/\.(mp3|wav|ogg|m4a|aac)$/i)) {
        onFileDrop(config.id, file);
      }
    }
  };

  const getModeIcon = () => {
    const iconClass = "w-4 h-4 text-gray-300";
    switch (config.playbackMode) {
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

  // Define handlePlay to be used by both click and MIDI listener
  const handlePlay = async () => {
    if (isMidiLearnMode) {
      // Import dynamically to avoid circular dependency if possible, or just use global
      const MIDIManager = (await import('../services/MIDIManager')).default;
      MIDIManager.getInstance().prepareToLearn(config.id);
      // Visual feedback could be handled by local state or toast
      alert(`Waiting for MIDI Note for Button ${config.id + 1}... Press a key on your controller.`);
      return;
    }

    if (hasAudio) {
      onClick(config.id);
    } else {
      onSettings(config.id); // If no audio, left-click opens settings
    }
  };

  // MIDI Listener
  useEffect(() => {
    const handleMidiTrigger = (e: CustomEvent) => {
      // Assuming config.id is 0-based index or we map it somehow.
      // If config.id matches the MIDI index
      if (e.detail.index === config.id) {
        if (e.detail.type === 'down') {
          handlePlay();
        }
        // Handle 'up' for momentary mode if implemented later
      }
    };

    window.addEventListener('midi-trigger' as any, handleMidiTrigger);
    return () => window.removeEventListener('midi-trigger' as any, handleMidiTrigger);
  }, [config.id, handlePlay]);

  return (
    <div
      onClick={handlePlay}
      onContextMenu={handleContextMenu}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
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

      {/* Waveform Visualization */}
      {config.waveform && config.waveform.length > 0 && (
        <div className="absolute inset-0 z-0 opacity-40 pointer-events-none flex items-center justify-center">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full text-white fill-current">
            <path d={`
                    M 0 50 
                    ${config.waveform.map((v, i) => {
              const x = (i / (config.waveform!.length - 1)) * 100;
              const y = 50 - (v * 40); // Amplitude scaling
              return `L ${x} ${y}`;
            }).join(' ')}
                    ${config.waveform.slice().reverse().map((v, i) => {
              const x = ((config.waveform!.length - 1 - i) / (config.waveform!.length - 1)) * 100;
              const y = 50 + (v * 40); // Mirror
              return `L ${x} ${y}`;
            }).join(' ')}
                    Z
                `} />
          </svg>
        </div>
      )}

      {/* Progress Bar */}
      <div className="absolute top-0 left-0 h-full bg-black bg-opacity-30 z-0" style={progressStyle}></div>

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
