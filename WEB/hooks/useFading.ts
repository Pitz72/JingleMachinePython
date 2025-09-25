import { useState, useRef, useCallback } from 'react';

export const useFading = () => {
  const [fadingOutTrackIds, setFadingOutTrackIds] = useState<number[]>([]);
  const [fadingInTrackId, setFadingInTrackId] = useState<number | null>(null);
  const fadeOutTimer = useRef<any>(null);
  const fadeInTimer = useRef<any>(null);

  const clearFades = useCallback(() => {
    if (fadeOutTimer.current) clearTimeout(fadeOutTimer.current);
    if (fadeInTimer.current) clearTimeout(fadeInTimer.current);
    fadeOutTimer.current = null;
    fadeInTimer.current = null;
    setFadingOutTrackIds([]);
    setFadingInTrackId(null);
  }, []);

  return {
    fadingOutTrackIds,
    fadingInTrackId,
    fadeOutTimer,
    fadeInTimer,
    clearFades,
    setFadingOutTrackIds,
    setFadingInTrackId,
  };
};