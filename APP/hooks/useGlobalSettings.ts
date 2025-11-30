import { useState } from 'react';

export const useGlobalSettings = () => {
  const [crossfader, setCrossfader] = useState(0);
  const [playlistMode, setPlaylistMode] = useState(false);

  return {
    crossfader,
    setCrossfader,
    playlistMode,
    setPlaylistMode,
  };
};