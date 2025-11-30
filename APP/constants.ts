
import { Preset, PlaybackMode } from './types';

export const GRID_ROWS = 8;
export const GRID_COLS = 11;
export const TOTAL_BUTTONS = GRID_ROWS * GRID_COLS;
export const LOCAL_STORAGE_KEY = 'jingle_machine_config_v2.0_pro';
export const APP_VERSION = '1.3.1';

// Audio and timing constants
export const DEFAULT_FADE_DURATION = 2000; // ms
export const STEP_TIME = 50; // ms for fade intervals
export const AUTO_SAVE_DELAY = 100; // ms
export const SAVE_FILE_VERSION = '1.6.0';

// Audio processing constants
export const EQ_LOW_FREQUENCY = 250; // Hz
export const EQ_MID_FREQUENCY = 1000; // Hz
export const EQ_HIGH_FREQUENCY = 4000; // Hz
export const EQ_MID_Q = 1; // Quality factor

// UI constants
export const VOLUME_STEP = 0.05;
export const MAX_VOLUME = 1;
export const MIN_VOLUME = 0;
export const CUE_ATTENUATION = 0.1; // -10dB for cue mode

// Keyboard shortcuts
export const VOLUME_ADJUST_STEP = 0.05;

export const PRESET_TEMPLATES: Preset[] = [
  {
    name: 'Radio Classica',
    config: Array.from({ length: TOTAL_BUTTONS }, (_, i) => ({
      id: i,
      name: `Jingle ${i + 1}`,
      color: '#4b5563',
      volume: 0.8,
      playbackMode: PlaybackMode.Restart,
      isLoop: false,
      crossfade: true,
      fileName: null,
      eqLow: 5,
      eqMid: 0,
      eqHigh: -5,
      pan: 0,
      solo: false,
      mute: false,
      cue: false,
      fadeInDuration: 1000,
      fadeOutDuration: 1000,
      isSpecialEffect: false,
    })),
  },
  {
    name: 'Podcast Vocale',
    config: Array.from({ length: TOTAL_BUTTONS }, (_, i) => ({
      id: i,
      name: `Voce ${i + 1}`,
      color: '#22c55e',
      volume: 1,
      playbackMode: PlaybackMode.Continue,
      isLoop: false,
      crossfade: false,
      fileName: null,
      eqLow: -5,
      eqMid: 5,
      eqHigh: 5,
      pan: 0,
      solo: false,
      mute: false,
      cue: false,
      fadeInDuration: 500,
      fadeOutDuration: 500,
      isSpecialEffect: false,
    })),
  },
  {
    name: 'DJ Elettronica',
    config: Array.from({ length: TOTAL_BUTTONS }, (_, i) => ({
      id: i,
      name: `Beat ${i + 1}`,
      color: '#8b5cf6',
      volume: 0.9,
      playbackMode: PlaybackMode.Overlay,
      isLoop: true,
      crossfade: true,
      fileName: null,
      eqLow: 10,
      eqMid: -10,
      eqHigh: 10,
      pan: i % 2 === 0 ? -0.5 : 0.5,
      solo: false,
      mute: false,
      cue: false,
      fadeInDuration: 2000,
      fadeOutDuration: 2000,
      isSpecialEffect: i >= 80, // last row special
    })),
  },
  {
    name: 'Evento Live',
    config: Array.from({ length: TOTAL_BUTTONS }, (_, i) => ({
      id: i,
      name: `Effetto ${i + 1}`,
      color: '#f97316',
      volume: 0.7,
      playbackMode: PlaybackMode.Queue,
      isLoop: false,
      crossfade: false,
      fileName: null,
      eqLow: 0,
      eqMid: 0,
      eqHigh: 0,
      pan: 0,
      solo: false,
      mute: false,
      cue: false,
      fadeInDuration: 100,
      fadeOutDuration: 100,
      isSpecialEffect: false,
    })),
  },
  {
    name: 'Emergenza',
    config: Array.from({ length: TOTAL_BUTTONS }, (_, i) => ({
      id: i,
      name: `Allarme ${i + 1}`,
      color: '#ef4444',
      volume: 1,
      playbackMode: PlaybackMode.Restart,
      isLoop: true,
      crossfade: false,
      fileName: null,
      eqLow: 20,
      eqMid: 10,
      eqHigh: 0,
      pan: 0,
      solo: false,
      mute: false,
      cue: false,
      fadeInDuration: 100,
      fadeOutDuration: 100,
      isSpecialEffect: true,
    })),
  },
  {
    name: 'Talk Show Radio',
    config: Array.from({ length: TOTAL_BUTTONS }, (_, i) => ({
      id: i,
      name: `Talk ${i + 1}`,
      color: '#059669',
      volume: 0.85,
      playbackMode: PlaybackMode.Continue,
      isLoop: false,
      crossfade: false,
      fileName: null,
      eqLow: -2,
      eqMid: 3,
      eqHigh: 2,
      pan: 0,
      solo: false,
      mute: false,
      cue: false,
      fadeInDuration: 200,
      fadeOutDuration: 200,
      isSpecialEffect: false,
    })),
  },
  {
    name: 'Sports Commentary',
    config: Array.from({ length: TOTAL_BUTTONS }, (_, i) => ({
      id: i,
      name: `Sports ${i + 1}`,
      color: '#dc2626',
      volume: 0.95,
      playbackMode: PlaybackMode.Queue,
      isLoop: false,
      crossfade: true,
      fileName: null,
      eqLow: 5,
      eqMid: 0,
      eqHigh: -3,
      pan: i % 3 === 0 ? -0.3 : i % 3 === 1 ? 0.3 : 0,
      solo: false,
      mute: false,
      cue: false,
      fadeInDuration: 150,
      fadeOutDuration: 150,
      isSpecialEffect: i >= 85, // last rows special
    })),
  },
  {
    name: 'News Broadcast',
    config: Array.from({ length: TOTAL_BUTTONS }, (_, i) => ({
      id: i,
      name: `News ${i + 1}`,
      color: '#2563eb',
      volume: 0.9,
      playbackMode: PlaybackMode.Restart,
      isLoop: false,
      crossfade: false,
      fileName: null,
      eqLow: -5,
      eqMid: 4,
      eqHigh: 3,
      pan: 0,
      solo: false,
      mute: false,
      cue: false,
      fadeInDuration: 100,
      fadeOutDuration: 100,
      isSpecialEffect: false,
    })),
  },
  {
    name: 'Music Production',
    config: Array.from({ length: TOTAL_BUTTONS }, (_, i) => ({
      id: i,
      name: `Track ${i + 1}`,
      color: '#7c3aed',
      volume: 0.8,
      playbackMode: PlaybackMode.Overlay,
      isLoop: i < 80, // most tracks loop
      crossfade: true,
      fileName: null,
      eqLow: i % 4 === 0 ? 8 : 0, // bass heavy on some
      eqMid: i % 4 === 1 ? 6 : 0, // mid heavy on others
      eqHigh: i % 4 === 2 ? 4 : 0, // treble heavy on others
      pan: (i % 5 - 2) * 0.2, // varied panning
      solo: false,
      mute: false,
      cue: false,
      fadeInDuration: 1000,
      fadeOutDuration: 1000,
      isSpecialEffect: i >= 80,
    })),
  },
];