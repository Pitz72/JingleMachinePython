import React, { useRef, useEffect, useState } from 'react';
import { ButtonConfig, PlaybackMode } from '../types';
import { LoopIcon, QueueIcon, OverlayIcon, ContinueIcon, MusicNoteIcon, CheckCircleIcon } from './icons';
import { db } from '../db';

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

const JingleButton: React.FC<JingleButtonProps> = ({ config, onClick, onEnded, onSettings, isPlaying, isPaused, isQueued, isFadingIn, isFadingOut, masterVolume, isSoloActive }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const lowFilterRef = useRef<BiquadFilterNode | null>(null);
  const midFilterRef = useRef<BiquadFilterNode | null>(null);
  const highFilterRef = useRef<BiquadFilterNode | null>(null);
  const pannerRef = useRef<StereoPannerNode | null>(null);
  const fadeIntervalRef = useRef<any>(null);
  const [progress, setProgress] = useState(0);
  const [audioSrc, setAudioSrc] = useState<string | null>(null);

  // Effect to load audio data from IndexedDB
  useEffect(() => {
    let isMounted = true;
    if (config.fileName) {
      setAudioSrc(null); // Reset src while loading new audio
      db.getAudio(config.id).then(data => {
        if (isMounted && data) {
          setAudioSrc(data);
        }
      }).catch(e => console.error(`Failed to load audio for button ${config.id}`, e));
    } else {
      setAudioSrc(null); // Clear src if there's no file
    }
    return () => { isMounted = false; };
  }, [config.id, config.fileName]);

  // Effect for audio element setup and event listeners
  useEffect(() => {
    const audio = audioRef.current;
    if (audio && audioSrc) {
      if (audio.src !== audioSrc) {
        audio.src = audioSrc;
        // Initialize Web Audio API
        if (!audioContextRef.current) {
          audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        const audioContext = audioContextRef.current;

        if (!sourceRef.current) {
          sourceRef.current = audioContext.createMediaElementSource(audio);
        }

        if (!gainNodeRef.current) {
          gainNodeRef.current = audioContext.createGain();
          gainNodeRef.current.gain.value = config.volume * masterVolume;
        }

        // EQ Filters
        if (!lowFilterRef.current) {
          lowFilterRef.current = audioContext.createBiquadFilter();
          lowFilterRef.current.type = 'lowshelf';
          lowFilterRef.current.frequency.value = 250;
          lowFilterRef.current.gain.value = config.eqLow;
        }

        if (!midFilterRef.current) {
          midFilterRef.current = audioContext.createBiquadFilter();
          midFilterRef.current.type = 'peaking';
          midFilterRef.current.frequency.value = 1000;
          midFilterRef.current.Q.value = 1;
          midFilterRef.current.gain.value = config.eqMid;
        }

        if (!highFilterRef.current) {
          highFilterRef.current = audioContext.createBiquadFilter();
          highFilterRef.current.type = 'highshelf';
          highFilterRef.current.frequency.value = 4000;
          highFilterRef.current.gain.value = config.eqHigh;
        }

        // Panner
        if (!pannerRef.current) {
          pannerRef.current = audioContext.createStereoPanner();
          pannerRef.current.pan.value = config.pan;
        }

        // Connect nodes: source -> low -> mid -> high -> panner -> gain -> destination
        sourceRef.current.disconnect();
        sourceRef.current.connect(lowFilterRef.current);
        lowFilterRef.current.connect(midFilterRef.current);
        midFilterRef.current.connect(highFilterRef.current);
        highFilterRef.current.connect(pannerRef.current);
        pannerRef.current.connect(gainNodeRef.current);
        gainNodeRef.current.connect(audioContext.destination);
      }

      audio.loop = config.isLoop;

      const handleTimeUpdate = () => {
        if (audio.duration > 0) {
          setProgress(audio.currentTime / audio.duration);
        }
      };

      const handleEnded = () => {
        setProgress(0);
        onEnded(config.id);
      };

      audio.addEventListener('timeupdate', handleTimeUpdate);
      audio.addEventListener('ended', handleEnded);

      return () => {
        audio.removeEventListener('timeupdate', handleTimeUpdate);
        audio.removeEventListener('ended', handleEnded);
      };
    }
  }, [audioSrc, config.volume, config.isLoop, config.id, onEnded, masterVolume, config.eqLow, config.eqMid, config.eqHigh, config.pan]);

  // Update audio parameters
  useEffect(() => {
    if (gainNodeRef.current) {
      let volume = config.volume * masterVolume;
      if (config.mute || (isSoloActive && !config.solo)) volume = 0;
      if (config.cue) volume *= 0.1; // -10dB for cue
      gainNodeRef.current.gain.value = volume;
    }
    if (lowFilterRef.current) {
      lowFilterRef.current.gain.value = config.eqLow;
    }
    if (midFilterRef.current) {
      midFilterRef.current.gain.value = config.eqMid;
    }
    if (highFilterRef.current) {
      highFilterRef.current.gain.value = config.eqHigh;
    }
    if (pannerRef.current) {
      pannerRef.current.pan.value = config.pan;
    }
  }, [config.volume, masterVolume, config.eqLow, config.eqMid, config.eqHigh, config.pan, config.mute, config.cue, isSoloActive, config.solo]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Cleanup previous interval if it exists
    if (fadeIntervalRef.current) {
        clearInterval(fadeIntervalRef.current);
        fadeIntervalRef.current = null;
    }
    
    const effectiveVolume = config.volume * masterVolume;
    const fadeOutDuration = config.fadeOutDuration || 2000;
    const fadeInDuration = config.fadeInDuration || 2000;
    const stepTime = 50;

    if (isFadingOut) {
        if (audio.paused) return; // Can't fade out if not playing

        const startVolume = gainNodeRef.current ? gainNodeRef.current.gain.value : audio.volume;
        const steps = fadeOutDuration / stepTime;
        const volumeStep = startVolume / steps;

        fadeIntervalRef.current = setInterval(() => {
            const newVolume = (gainNodeRef.current ? gainNodeRef.current.gain.value : audio.volume) - volumeStep;
            if (newVolume <= 0) {
                if (gainNodeRef.current) gainNodeRef.current.gain.value = 0;
                audio.pause();
                clearInterval(fadeIntervalRef.current!);
                fadeIntervalRef.current = null;
            } else {
                if (gainNodeRef.current) gainNodeRef.current.gain.value = newVolume;
            }
        }, stepTime);
        return; // Don't process other logic if fading out
    }

    if (isPlaying) {
      if (isFadingIn && audio.currentTime < 0.1) { // fade in only if at start
          if (gainNodeRef.current) gainNodeRef.current.gain.value = 0;
          if (audio.paused) audio.play().catch(e => console.error("Audio play failed:", e));

          const targetVolume = effectiveVolume;
          const steps = fadeInDuration / stepTime;
          const volumeStep = targetVolume / steps;

          fadeIntervalRef.current = setInterval(() => {
              const currentVolume = gainNodeRef.current ? gainNodeRef.current.gain.value : audio.volume;
              const newVolume = currentVolume + volumeStep;
              if (newVolume >= targetVolume) {
                  if (gainNodeRef.current) gainNodeRef.current.gain.value = targetVolume;
                  clearInterval(fadeIntervalRef.current!);
                  fadeIntervalRef.current = null;
              } else {
                  if (gainNodeRef.current) gainNodeRef.current.gain.value = newVolume;
              }
          }, stepTime);

      } else {
          // Normal play
          if (gainNodeRef.current) gainNodeRef.current.gain.value = effectiveVolume; // Set volume unless it's currently fading
          if (audio.paused && !isPaused) audio.play().catch(e => console.error("Audio play failed:", e));
      }
    } else {
      // It's supposed to be stopped or paused
      if (isPaused) {
        audio.pause();
      } else {
        audio.pause();
        audio.currentTime = 0;
        setProgress(0);
      }
    }
    
    return () => {
        if (fadeIntervalRef.current) {
            clearInterval(fadeIntervalRef.current);
        }
    };
  }, [isPlaying, isPaused, isFadingIn, isFadingOut, config.volume, masterVolume]);

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
