import { useState } from 'react';

export const usePlaybackState = () => {
  const [mainTrackId, setMainTrackId] = useState<number | null>(null);
  const [pausedTrackId, setPausedTrackId] = useState<number | null>(null);
  const [overlayTrackIds, setOverlayTrackIds] = useState<number[]>([]);
  const [queuedTrackIds, setQueuedTrackIds] = useState<number[]>([]);

  return {
    mainTrackId,
    setMainTrackId,
    pausedTrackId,
    setPausedTrackId,
    overlayTrackIds,
    setOverlayTrackIds,
    queuedTrackIds,
    setQueuedTrackIds,
  };
};