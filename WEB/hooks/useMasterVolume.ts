import { useState, useEffect } from 'react';

const MASTER_VOLUME_KEY = 'jingle_machine_master_volume';

export const useMasterVolume = () => {
  const [masterVolume, setMasterVolume] = useState(1);

  // Load master volume from local storage
  useEffect(() => {
    const savedVolume = localStorage.getItem(MASTER_VOLUME_KEY);
    if (savedVolume !== null) {
      setMasterVolume(parseFloat(savedVolume));
    }
  }, []);

  // Save master volume to local storage
  useEffect(() => {
    localStorage.setItem(MASTER_VOLUME_KEY, String(masterVolume));
  }, [masterVolume]);

  return { masterVolume, setMasterVolume };
};