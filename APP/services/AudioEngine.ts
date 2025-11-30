import { ButtonConfig } from '../types';
import { EQ_LOW_FREQUENCY, EQ_MID_FREQUENCY, EQ_HIGH_FREQUENCY, EQ_MID_Q, CUE_ATTENUATION } from '../constants';

interface ChannelNodes {
    source: MediaElementAudioSourceNode;
    gain: GainNode;
    lowFilter: BiquadFilterNode;
    midFilter: BiquadFilterNode;
    highFilter: BiquadFilterNode;
    panner: StereoPannerNode;
}

class AudioEngine {
    private static instance: AudioEngine;
    private context: AudioContext | null = null;
    private masterGain: GainNode | null = null;
    private channels: Map<number, ChannelNodes> = new Map();

    private constructor() { }

    public static getInstance(): AudioEngine {
        if (!AudioEngine.instance) {
            AudioEngine.instance = new AudioEngine();
        }
        return AudioEngine.instance;
    }

    public getContext(): AudioContext {
        if (!this.context) {
            this.context = new (window.AudioContext || (window as any).webkitAudioContext)();
            this.masterGain = this.context.createGain();
            this.masterGain.connect(this.context.destination);
        }
        if (this.context.state === 'suspended') {
            this.context.resume();
        }
        return this.context;
    }

    public setMasterVolume(volume: number) {
        const ctx = this.getContext(); // Ensure context exists
        if (this.masterGain) {
            this.masterGain.gain.setTargetAtTime(volume, ctx.currentTime, 0.01);
        }
    }

    public registerChannel(id: number, audioElement: HTMLAudioElement, config: ButtonConfig) {
        const ctx = this.getContext();

        // If channel exists, disconnect it first (cleanup)
        if (this.channels.has(id)) {
            this.unregisterChannel(id);
        }

        // Create nodes
        const source = ctx.createMediaElementSource(audioElement);
        const gain = ctx.createGain();
        const lowFilter = ctx.createBiquadFilter();
        const midFilter = ctx.createBiquadFilter();
        const highFilter = ctx.createBiquadFilter();
        const panner = ctx.createStereoPanner();

        // Configure Filters
        lowFilter.type = 'lowshelf';
        lowFilter.frequency.value = EQ_LOW_FREQUENCY;

        midFilter.type = 'peaking';
        midFilter.frequency.value = EQ_MID_FREQUENCY;
        midFilter.Q.value = EQ_MID_Q;

        highFilter.type = 'highshelf';
        highFilter.frequency.value = EQ_HIGH_FREQUENCY;

        // Connect Graph: Source -> Low -> Mid -> High -> Panner -> Gain -> Master
        source.connect(lowFilter);
        lowFilter.connect(midFilter);
        midFilter.connect(highFilter);
        highFilter.connect(panner);
        panner.connect(gain);
        gain.connect(this.masterGain!);

        // Store nodes
        const nodes: ChannelNodes = {
            source,
            gain,
            lowFilter,
            midFilter,
            highFilter,
            panner
        };

        this.channels.set(id, nodes);

        // Apply initial settings
        this.updateChannelSettings(id, config, 1.0, false, false); // Master volume handled by masterGain

        return nodes;
    }

    public unregisterChannel(id: number) {
        const nodes = this.channels.get(id);
        if (nodes) {
            nodes.source.disconnect();
            nodes.lowFilter.disconnect();
            nodes.midFilter.disconnect();
            nodes.highFilter.disconnect();
            nodes.panner.disconnect();
            nodes.gain.disconnect();
            this.channels.delete(id);
        }
    }

    public updateChannelSettings(
        id: number,
        config: ButtonConfig,
        channelVolumeMultiplier: number = 1.0, // For faders/automation
        isSoloActive: boolean = false,
        isSoloed: boolean = false
    ) {
        const nodes = this.channels.get(id);
        if (!nodes) return;

        const ctx = this.getContext();
        const now = ctx.currentTime;

        // Volume Calculation
        let volume = config.volume * channelVolumeMultiplier;
        if (config.mute || (isSoloActive && !isSoloed)) volume = 0;
        if (config.cue) volume *= CUE_ATTENUATION;

        // Apply with ramp to prevent clicks
        nodes.gain.gain.setTargetAtTime(volume, now, 0.01);

        // EQ & Pan
        nodes.lowFilter.gain.setTargetAtTime(config.eqLow, now, 0.01);
        nodes.midFilter.gain.setTargetAtTime(config.eqMid, now, 0.01);
        nodes.highFilter.gain.setTargetAtTime(config.eqHigh, now, 0.01);
        nodes.panner.pan.setTargetAtTime(config.pan, now, 0.01);
    }

    public getChannelNodes(id: number) {
        return this.channels.get(id);
    }
}

export default AudioEngine;
