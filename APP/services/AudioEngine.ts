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
        isSoloed: boolean = false,
        isDucked: boolean = false
    ) {
        const nodes = this.channels.get(id);
        if (!nodes) return;

        const ctx = this.getContext();
        const now = ctx.currentTime;

        // Volume Calculation
        let volume = config.volume * channelVolumeMultiplier;
        if (config.mute || (isSoloActive && !isSoloed)) volume = 0;
        if (config.cue) volume *= CUE_ATTENUATION;
        if (isDucked) volume *= 0.2; // Ducking attenuation (-14dB)

        // Apply with ramp to prevent clicks
        nodes.gain.gain.setTargetAtTime(volume, now, 0.01);

        // EQ & Pan
        nodes.lowFilter.gain.setTargetAtTime(config.eqLow, now, 0.01);
        nodes.midFilter.gain.setTargetAtTime(config.eqMid, now, 0.01);
        nodes.highFilter.gain.setTargetAtTime(config.eqHigh, now, 0.01);
        nodes.panner.pan.setTargetAtTime(config.pan, now, 0.01);
    }

    public applyDucking(active: boolean) {
        const ctx = this.getContext();
        const now = ctx.currentTime;
        const DUCKED_VOLUME = 0.2; // -14dB approx

        this.channels.forEach((nodes, id) => {
            // We need to know if this channel is a talkover channel to avoid ducking it
            // But we don't store config in nodes. 
            // We will rely on the caller to update individual channel volumes or 
            // we can store a "isTalkover" flag in the nodes if we refactor.

            // For now, let's implement a global ducking state in AudioEngine 
            // and re-apply it in updateChannelSettings?
            // Better: The React layer (useAudioPlayback) knows which buttons are playing.
            // It should call updateChannelSettings with a lower volume multiplier for music.
        });
    }

    public async setSinkId(deviceId: string) {
        const ctx = this.getContext();
        // Check if setSinkId is supported (it is in Electron/Chrome)
        if ((ctx as any).setSinkId) {
            try {
                await (ctx as any).setSinkId(deviceId);
                console.log(`Audio Output set to device: ${deviceId}`);
            } catch (err) {
                console.error("Failed to set audio sink ID:", err);
            }
        } else {
            console.warn("AudioContext.setSinkId is not supported in this environment.");
        }
    }

    public getChannelNodes(id: number) {
        return this.channels.get(id);
    }

    public async generateWaveform(audioSrc: string): Promise<number[]> {
        const ctx = this.getContext();
        try {
            const response = await fetch(audioSrc);
            const arrayBuffer = await response.arrayBuffer();
            const audioBuffer = await ctx.decodeAudioData(arrayBuffer);

            return new Promise((resolve, reject) => {
                const worker = new Worker(new URL('../workers/waveformWorker.ts', import.meta.url), { type: 'module' });

                worker.onmessage = (e) => {
                    if (e.data.error) {
                        reject(new Error(e.data.error));
                    } else {
                        resolve(e.data.waveform);
                    }
                    worker.terminate();
                };

                worker.onerror = (e) => {
                    reject(new Error('Worker error'));
                    worker.terminate();
                };

                // Send channel data (first channel only for mono visualization)
                worker.postMessage({
                    audioBuffer: audioBuffer.getChannelData(0),
                    samples: 100
                });
            });
        } catch (error) {
            console.error("Error generating waveform:", error);
            return [];
        }
    }
}

export default AudioEngine;
