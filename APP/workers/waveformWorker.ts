// Web Worker for generating waveform data

self.onmessage = async (e) => {
    const { audioBuffer, samples = 100 } = e.data;

    if (!audioBuffer) {
        self.postMessage({ error: 'No audio buffer provided' });
        return;
    }

    try {
        // We receive the raw channel data (Float32Array) directly to avoid cloning the entire AudioBuffer which is not transferable
        const channelData = audioBuffer;
        const blockSize = Math.floor(channelData.length / samples);
        const waveform = new Float32Array(samples);

        for (let i = 0; i < samples; i++) {
            const start = i * blockSize;
            let sum = 0;
            for (let j = 0; j < blockSize; j++) {
                sum += Math.abs(channelData[start + j]);
            }
            waveform[i] = sum / blockSize;
        }

        // Normalize
        const max = Math.max(...waveform);
        if (max > 0) {
            for (let i = 0; i < samples; i++) {
                waveform[i] = waveform[i] / max;
            }
        }

        self.postMessage({ waveform });
    } catch (error) {
        self.postMessage({ error: (error as Error).message });
    }
};
