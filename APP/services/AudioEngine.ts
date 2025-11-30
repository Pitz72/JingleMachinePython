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
    private compressor: DynamicsCompressorNode | null = null;
    private channels: Map<number, ChannelNodes> = new Map();

    // Recorder
    private recorderDestination: MediaStreamAudioDestinationNode | null = null;
    private mediaRecorder: MediaRecorder | null = null;
    private recordedChunks: Blob[] = [];
    private isRecording: boolean = false;

    private constructor() { }

    public static getInstance(): AudioEngine {
        if (!AudioEngine.instance) {
            AudioEngine.instance = new AudioEngine();
        }
        return AudioEngine.instance;
    }

    public getContext(): AudioContext {
        if (!this.context) {
            const AudioContextClass = (window.AudioContext || (window as any).webkitAudioContext);
            this.context = new AudioContextClass();

            // Master Chain: MasterGain -> Compressor -> Destination
            this.masterGain = this.context.createGain();
            this.compressor = this.context.createDynamicsCompressor();

            // Recorder Destination (sidechain from MasterGain)
            this.recorderDestination = this.context.createMediaStreamDestination();

            // Wiring
            this.masterGain.connect(this.compressor);
            this.compressor.connect(this.context.destination);

            // Connect Master to Recorder as well
            this.compressor.connect(this.recorderDestination);

            // Compressor Settings (Limiter-like)
            this.compressor.threshold.value = -1;
            this.compressor.knee.value = 10;
            this.compressor.ratio.value = 20;
            this.compressor.attack.value = 0.005;
            this.compressor.release.value = 0.050;
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
        // Placeholder for future global ducking logic if needed
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

    // Recorder Methods
    public startRecording(): boolean {
        if (this.isRecording || !this.recorderDestination) return false;

        try {
            const stream = this.recorderDestination.stream;
            // Prefer high bitrate Opus or PCM if available (WebM container)
            const options = { mimeType: 'audio/webm;codecs=opus', audioBitsPerSecond: 256000 };

            this.mediaRecorder = new MediaRecorder(stream, options);
            this.recordedChunks = [];

            this.mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) {
                    this.recordedChunks.push(e.data);
                }
            };

            this.mediaRecorder.start();
            this.isRecording = true;
            console.log("Recording started");
            return true;
        } catch (e) {
            console.error("Failed to start recording:", e);
            return false;
        }
    }

    public async stopRecording(): Promise<Blob | null> {
        if (!this.isRecording || !this.mediaRecorder) return null;

        return new Promise((resolve) => {
            if (!this.mediaRecorder) return resolve(null);

            this.mediaRecorder.onstop = () => {
                const blob = new Blob(this.recordedChunks, { type: 'audio/webm' });
                this.recordedChunks = [];
                this.isRecording = false;
                console.log("Recording stopped, blob size:", blob.size);
                resolve(blob);
            };

            this.mediaRecorder.stop();
        });
    }

    public getIsRecording(): boolean {
        return this.isRecording;
    }
}

export default AudioEngine;
