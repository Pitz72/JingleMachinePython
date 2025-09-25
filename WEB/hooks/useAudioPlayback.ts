import { usePlaybackState } from './usePlaybackState';
import { useFading } from './useFading';
import { usePlaybackLogic } from './usePlaybackLogic';

export const useAudioPlayback = () => {
  // Use smaller, focused hooks
  const playbackState = usePlaybackState();
  const fading = useFading();

  const playbackLogic = usePlaybackLogic({
    ...playbackState,
    ...fading,
  });

  return {
    ...playbackState,
    ...fading,
    ...playbackLogic,
  };
};