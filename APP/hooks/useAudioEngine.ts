import { useRef, useEffect, useState } from 'react';
import { ButtonConfig } from '../types';
import { useDatabase } from '../contexts/DatabaseContext';
import { DEFAULT_FADE_DURATION, STEP_TIME } from '../constants';
import AudioEngine from '../services/AudioEngine';

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
  const fadeIntervalRef = useRef<any>(null);
  const [progress, setProgress] = useState(0);
  const [audioSrc, setAudioSrc] = useState<string | null>(null);

  // Local volume state for fading (multiplier 0.0 to 1.0)
  const [fadeMultiplier, setFadeMultiplier] = useState(1.0);

  // Load audio data from IndexedDB
  useEffect(() => {
    let isMounted = true;
    if (config.fileName) {
      setAudioSrc(null);
      database.getAudio(config.id).then(data => {
        if (isMounted && data) {
          try {
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
      });
    } else {
      setAudioSrc(null);
    }
    return () => { isMounted = false; };
  }, [config.id, config.fileName, database]);

  // Register with AudioEngine and handle updates
  useEffect(() => {
    const audio = audioRef.current;
    if (audio && audioSrc) {
      // Only set src if different to avoid reloading
      if (audio.src !== audioSrc) {
        audio.src = audioSrc;
        // Register channel with AudioEngine
        AudioEngine.getInstance().registerChannel(config.id, audio, config);
      }

      // Update Master Volume
      AudioEngine.getInstance().setMasterVolume(masterVolume);

      // Update Channel Settings (including fade multiplier)
      AudioEngine.getInstance().updateChannelSettings(
        config.id,
        config,
        fadeMultiplier,
        isSoloActive,
        config.solo
      );

      audio.loop = config.isLoop;

      const handleTimeUpdate = () => {
        if (audio.duration > 0) {
          setProgress(audio.currentTime / audio.duration);
        }
      };

      const handleEnded = () => {
        setProgress(0);
      };

      audio.addEventListener('timeupdate', handleTimeUpdate);
      audio.addEventListener('ended', handleEnded);

      return () => {
        audio.removeEventListener('timeupdate', handleTimeUpdate);
        audio.removeEventListener('ended', handleEnded);
        // We don't unregister immediately on re-render to avoid audio glitches,
        // but we should if the component unmounts. 
        // However, React strict mode mounts/unmounts rapidly.
        // For now, let's trust AudioEngine's registerChannel to handle cleanup if called again.
      };
    }

    // Cleanup on unmount (if audioSrc is removed)
    return () => {
      // AudioEngine.getInstance().unregisterChannel(config.id); 
      // Commented out to prevent cutting off tails or rapid unmount/mount issues.
      // Ideally, we unregister when the button is deleted or the app closes.
    };
  }, [audioSrc, config, masterVolume, isSoloActive, fadeMultiplier]);

  // Handle Playback Control
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !audioSrc) return;

    if (isPlaying) {
      if (audio.paused && !isPaused) {
        // Resume AudioContext if needed (browsers auto-suspend)
        AudioEngine.getInstance().getContext();
        audio.play().catch(e => console.error("Audio play failed:", e));
      }
    } else {
      if (isPaused) {
        audio.pause();
      } else {
        audio.pause();
        audio.currentTime = 0;
        setProgress(0);
      }
    }
  }, [isPlaying, isPaused, audioSrc]);


  // Handle Fading Logic (updates fadeMultiplier)
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    if (fadeIntervalRef.current) {
      clearInterval(fadeIntervalRef.current);
      fadeIntervalRef.current = null;
    }

    const fadeOutDuration = config.fadeOutDuration || DEFAULT_FADE_DURATION;
    const fadeInDuration = config.fadeInDuration || DEFAULT_FADE_DURATION;
    const stepTime = STEP_TIME;

    if (isFadingOut) {
      if (audio.paused) return;

      const steps = fadeOutDuration / stepTime;
      const stepValue = 1.0 / steps;

      // Start from current multiplier
      let currentFade = fadeMultiplier;

      fadeIntervalRef.current = setInterval(() => {
        currentFade -= stepValue;
        if (currentFade <= 0) {
          setFadeMultiplier(0);
          audio.pause();
          clearInterval(fadeIntervalRef.current!);
          fadeIntervalRef.current = null;
        } else {
          setFadeMultiplier(currentFade);
        }
      }, stepTime);
      return;
    }

    if (isPlaying) {
      if (isFadingIn && audio.currentTime < 0.1) {
        // Start Fade In
        setFadeMultiplier(0);
        if (audio.paused) audio.play().catch(e => console.error("Audio play failed:", e));

        const steps = fadeInDuration / stepTime;
        const stepValue = 1.0 / steps;
        let currentFade = 0;

        fadeIntervalRef.current = setInterval(() => {
          currentFade += stepValue;
          if (currentFade >= 1.0) {
            setFadeMultiplier(1.0);
            clearInterval(fadeIntervalRef.current!);
            fadeIntervalRef.current = null;
          } else {
            setFadeMultiplier(currentFade);
          }
        }, stepTime);

      } else {
        // Normal Play (restore volume if not fading)
        if (!isFadingOut) {
          setFadeMultiplier(1.0);
        }
      }
    } else {
      // Reset fade on stop
      setFadeMultiplier(1.0);
    }

    return () => {
      if (fadeIntervalRef.current) clearInterval(fadeIntervalRef.current);
    };
  }, [isPlaying, isPaused, isFadingIn, isFadingOut, config.fadeOutDuration, config.fadeInDuration]);

  return {
    audioRef,
    progress,
  };
};