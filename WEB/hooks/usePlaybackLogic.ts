import React, { useCallback } from 'react';
import { ButtonConfig, PlaybackMode } from '../types';
import { DEFAULT_FADE_DURATION } from '../constants';

interface UsePlaybackLogicProps {
  mainTrackId: number | null;
  setMainTrackId: (id: number | null) => void;
  pausedTrackId: number | null;
  setPausedTrackId: (id: number | null) => void;
  overlayTrackIds: number[];
  setOverlayTrackIds: (ids: number[] | ((prev: number[]) => number[])) => void;
  queuedTrackIds: number[];
  setQueuedTrackIds: (ids: number[] | ((prev: number[]) => number[])) => void;
  fadingOutTrackIds: number[];
  setFadingOutTrackIds: (ids: number[] | ((prev: number[]) => number[])) => void;
  fadingInTrackId: number | null;
  setFadingInTrackId: (id: number | null) => void;
  fadeOutTimer: React.MutableRefObject<any>;
  clearFades: () => void;
}

export const usePlaybackLogic = ({
  mainTrackId,
  setMainTrackId,
  pausedTrackId,
  setPausedTrackId,
  overlayTrackIds,
  setOverlayTrackIds,
  queuedTrackIds,
  setQueuedTrackIds,
  fadingOutTrackIds,
  setFadingOutTrackIds,
  fadingInTrackId,
  setFadingInTrackId,
  fadeOutTimer,
  clearFades,
}: UsePlaybackLogicProps) => {

  const playNextInQueue = useCallback(() => {
    if (queuedTrackIds.length > 0) {
      const nextId = queuedTrackIds[0];
      setQueuedTrackIds((prev) => prev.slice(1));
      setMainTrackId(nextId);
      setPausedTrackId(null);
    } else {
      setMainTrackId(null);
    }
  }, [queuedTrackIds, setQueuedTrackIds, setMainTrackId, setPausedTrackId]);

  const handleButtonClick = useCallback(
    (id: number, buttons: ButtonConfig[]) => {
      const config = buttons.find((b) => b.id === id);
      if (!config || !config.fileName) return;

      const prevMainTrackId = mainTrackId;
      const isSwitchingTrack =
        (config.playbackMode === PlaybackMode.Restart || config.playbackMode === PlaybackMode.Continue) &&
        prevMainTrackId !== null &&
        prevMainTrackId !== id;
      const shouldFade = config.crossfade && isSwitchingTrack;

      if (shouldFade && prevMainTrackId !== null) {
        clearFades();
        setFadingOutTrackIds([prevMainTrackId]);
        setFadingInTrackId(id);

        fadeOutTimer.current = setTimeout(() => {
          setFadingOutTrackIds((prev) => prev.filter((trackId) => trackId !== prevMainTrackId));
          fadeOutTimer.current = null;
        }, DEFAULT_FADE_DURATION);

        setTimeout(() => {
          setFadingInTrackId(null);
        }, DEFAULT_FADE_DURATION);
      } else {
        if (!isSwitchingTrack) {
          clearFades();
        }
      }

      switch (config.playbackMode) {
        case PlaybackMode.Overlay:
          setOverlayTrackIds((prev) => [...prev.filter((oid) => oid !== id), id]);
          break;

        case PlaybackMode.Queue:
          if (mainTrackId === null && pausedTrackId === null) {
            setMainTrackId(id);
            setPausedTrackId(null);
          } else {
            setQueuedTrackIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
          }
          break;

        case PlaybackMode.Continue:
          if (mainTrackId === id) {
            // Same button is active
            if (pausedTrackId === id) {
              // It's currently paused, so resume
              setPausedTrackId(null);
            } else {
              // It's currently playing, so pause
              setPausedTrackId(id);
            }
          } else {
            // A new button is pressed, or another was playing
            if (queuedTrackIds.length > 0) setQueuedTrackIds([]);
            setMainTrackId(id);
            setPausedTrackId(null);
          }
          break;

        case PlaybackMode.Restart:
        default:
          // If this button is already playing (and not paused), restart it.
          if (mainTrackId === id && !pausedTrackId) {
            // To force a restart in the child component, we toggle the playing state off then on again.
            // Setting mainTrackId to null will cause the JingleButton effect to fire, resetting currentTime.
            setMainTrackId(null);
            // Then immediately schedule it to play again using a timeout.
            setTimeout(() => {
              setMainTrackId(id);
            }, 0);
          } else {
            // If it's a new button, or the current track is paused, just play it from the start.
            if (queuedTrackIds.length > 0) setQueuedTrackIds([]);
            setMainTrackId(id);
            setPausedTrackId(null);
          }
          break;
      }
    },
    [
      mainTrackId,
      pausedTrackId,
      queuedTrackIds,
      clearFades,
      setFadingOutTrackIds,
      setFadingInTrackId,
      fadeOutTimer,
      setOverlayTrackIds,
      setQueuedTrackIds,
      setMainTrackId,
      setPausedTrackId,
    ]
  );

  const handleStopAll = useCallback(() => {
    // Stop queued and paused tracks immediately
    setQueuedTrackIds([]);
    setPausedTrackId(null);

    const tracksToFadeOut = [
      ...(mainTrackId !== null && mainTrackId !== pausedTrackId ? [mainTrackId] : []),
      ...overlayTrackIds,
    ];

    // Immediately stop the main track if it was paused
    if (mainTrackId !== null && mainTrackId === pausedTrackId) {
      setMainTrackId(null);
    }

    if (tracksToFadeOut.length > 0) {
      if (fadeOutTimer.current) clearTimeout(fadeOutTimer.current);

      setFadingInTrackId(null);
      setFadingOutTrackIds((currentFading) => [
        ...currentFading,
        ...tracksToFadeOut,
      ].filter((v, i, a) => a.indexOf(v) === i));

      fadeOutTimer.current = setTimeout(() => {
        // This will clean up everything after the fade
        setMainTrackId(null);
        setOverlayTrackIds([]);
        setFadingOutTrackIds([]);
        fadeOutTimer.current = null;
      }, DEFAULT_FADE_DURATION);
    }
  }, [
    mainTrackId,
    overlayTrackIds,
    pausedTrackId,
    fadeOutTimer,
    setQueuedTrackIds,
    setPausedTrackId,
    setMainTrackId,
    setFadingInTrackId,
    setFadingOutTrackIds,
    setOverlayTrackIds,
  ]);

  const handleButtonEnded = useCallback(
    (id: number) => {
      if (fadingOutTrackIds.includes(id)) {
        return; // Don't process 'ended' event for a track that is being faded out by the system
      }
      if (overlayTrackIds.includes(id)) {
        setOverlayTrackIds((prev) => prev.filter((oid) => oid !== id));
        return;
      }
      if (mainTrackId === id) {
        setPausedTrackId(null);
        playNextInQueue();
      }
    },
    [mainTrackId, overlayTrackIds, playNextInQueue, fadingOutTrackIds, setOverlayTrackIds, setPausedTrackId]
  );

  return {
    handleButtonClick,
    handleStopAll,
    handleButtonEnded,
  };
};