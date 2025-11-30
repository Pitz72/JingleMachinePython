export enum PlaybackMode {
  Restart = 'Restart',
  Continue = 'Continue',
  Overlay = 'Overlay',
  Queue = 'Queue',
}

export interface ButtonConfig {
  id: number;
  name: string;
  color: string;
  volume: number; // 0 to 1
  playbackMode: PlaybackMode;
  isLoop: boolean;
  crossfade: boolean;
  fileName: string | null;
  filePath?: string; // Absolute path for Electron local loading
  waveform?: number[]; // Normalized waveform data (0-1)
  // Equalizer
  eqLow: number; // dB, -20 to 20
  eqMid: number; // dB, -20 to 20
  eqHigh: number; // dB, -20 to 20
  // Mixer
  pan: number; // -1 (left) to 1 (right)
  solo: boolean;
  mute: boolean;
  cue: boolean; // cue/preview mode
  // Fade durations in ms
  fadeInDuration: number;
  fadeOutDuration: number;
  // Special effects (always overlay)
  isSpecialEffect: boolean;
  isTalkover?: boolean; // Triggers auto-ducking on other channels
}

export interface Preset {
  name: string;
  config: ButtonConfig[];
}
