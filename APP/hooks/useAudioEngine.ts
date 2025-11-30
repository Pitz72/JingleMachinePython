import { useRef, useEffect, useState } from 'react';
import { ButtonConfig } from '../types';
import { useDatabase } from '../contexts/DatabaseContext';
import { DEFAULT_FADE_DURATION, STEP_TIME, EQ_LOW_FREQUENCY, EQ_MID_FREQUENCY, EQ_HIGH_FREQUENCY, EQ_MID_Q, CUE_ATTENUATION } from '../constants';

interface UseAudioEngineProps {
  config: ButtonConfig;
  masterVolume: number;
  isPlaying: boolean;
  isPaused: boolean;
  isFadingIn: boolean;
  isFadingOut: boolean;
  isSoloActive: boolean;
}

export const useAudioEngine = ({
  config,
  masterVolume,
  isPlaying,
  isPaused,
  isFadingIn,
  isFadingOut,
  isSoloActive,
}: UseAudioEngineProps) => {
  const database = useDatabase();
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

  // Load audio data from IndexedDB
  useEffect(() => {
    let isMounted = true;
    if (config.fileName) {
      setAudioSrc(null); // Reset src while loading new audio
      database.getAudio(config.id).then(data => {
        if (isMounted && data) {
          try {
            // Validate that the data is a valid data URL
            if (typeof data === 'string' && data.startsWith('data:audio/')) {
              setAudioSrc(data);
            } else {
              console.error(`Invalid audio data format for button ${config.id}`);
            }
          } catch (error) {
            console.error(`Error processing audio data for button ${config.id}:`, error);
          }
        }
      }).catch(e => {
        console.error(`Failed to load audio for button ${config.id}:`, e);
        // Could emit an error event here for UI feedback
      });
    } else {
      setAudioSrc(null); // Clear src if there's no file
    }
    return () => { isMounted = false; };
  }, [config.id, config.fileName, database]);

  // Audio element setup and event listeners
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
          lowFilterRef.current.frequency.value = EQ_LOW_FREQUENCY;
          lowFilterRef.current.gain.value = config.eqLow;
        }

        if (!midFilterRef.current) {
          midFilterRef.current = audioContext.createBiquadFilter();
          midFilterRef.current.type = 'peaking';
          midFilterRef.current.frequency.value = EQ_MID_FREQUENCY;
          midFilterRef.current.Q.value = EQ_MID_Q;
          midFilterRef.current.gain.value = config.eqMid;
        }

        if (!highFilterRef.current) {
          highFilterRef.current = audioContext.createBiquadFilter();
          highFilterRef.current.type = 'highshelf';
          highFilterRef.current.frequency.value = EQ_HIGH_FREQUENCY;
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
        // onEnded will be called from parent
      };

      audio.addEventListener('timeupdate', handleTimeUpdate);
      audio.addEventListener('ended', handleEnded);

      return () => {
        audio.removeEventListener('timeupdate', handleTimeUpdate);
        audio.removeEventListener('ended', handleEnded);
      };
    }

    // Cleanup function to close audio context
    return () => {
      if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
        audioContextRef.current.close().catch(e => console.error('Error closing audio context:', e));
      }
    };
  }, [audioSrc, config.volume, config.isLoop, config.id, masterVolume, config.eqLow, config.eqMid, config.eqHigh, config.pan]);

  // Update audio parameters
  useEffect(() => {
    if (gainNodeRef.current) {
      let volume = config.volume * masterVolume;
      if (config.mute || (isSoloActive && !config.solo)) volume = 0;
      if (config.cue) volume *= CUE_ATTENUATION; // -10dB for cue
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

  // Handle fading and playback
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Cleanup previous interval if it exists
    if (fadeIntervalRef.current) {
        clearInterval(fadeIntervalRef.current);
        fadeIntervalRef.current = null;
    }

    const effectiveVolume = config.volume * masterVolume;
    const fadeOutDuration = config.fadeOutDuration || DEFAULT_FADE_DURATION;
    const fadeInDuration = config.fadeInDuration || DEFAULT_FADE_DURATION;
    const stepTime = STEP_TIME;

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
  }, [isPlaying, isPaused, isFadingIn, isFadingOut, config.volume, masterVolume, config.fadeOutDuration, config.fadeInDuration]);

  return {
    audioRef,
    progress,
  };
};