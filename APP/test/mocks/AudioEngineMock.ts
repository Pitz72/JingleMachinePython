import { ButtonConfig } from '../../types';

class AudioEngineMock {
    private static instance: AudioEngineMock;

    public static getInstance(): AudioEngineMock {
        if (!AudioEngineMock.instance) {
            AudioEngineMock.instance = new AudioEngineMock();
        }
        return AudioEngineMock.instance;
    }

    public registerChannel(id: number, element: HTMLAudioElement, config: ButtonConfig) { }
    public unregisterChannel(id: number) { }
    public updateChannelSettings(id: number, config: ButtonConfig, fadeMultiplier: number, isSoloActive: boolean, isSolo: boolean, isTalkoverActive: boolean) { }
    public setMasterVolume(volume: number) { }
    public setSinkId(sinkId: string) { }
    public getContext() { return { state: 'running', resume: async () => { } }; }
    public generateWaveform(audioSrc: string): Promise<number[]> { return Promise.resolve([]); }
}

export default AudioEngineMock;
