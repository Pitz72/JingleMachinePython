import { useState, useEffect } from 'react';

export interface AudioDevice {
    deviceId: string;
    label: string;
}

export const useAudioDevices = () => {
    const [devices, setDevices] = useState<AudioDevice[]>([]);
    const [permissionGranted, setPermissionGranted] = useState(false);

    useEffect(() => {
        const getDevices = async () => {
            try {
                // Request permission first (required to get labels on some browsers)
                // In Electron, this might be handled differently, but standard API is good start.
                // We only ask for audio permission if we haven't got labels.

                const enumerate = async () => {
                    const devs = await navigator.mediaDevices.enumerateDevices();
                    const audioOutputs = devs
                        .filter(d => d.kind === 'audiooutput')
                        .map(d => ({
                            deviceId: d.deviceId,
                            label: d.label || `Speaker ${d.deviceId.slice(0, 5)}...` // Fallback if no label
                        }));
                    setDevices(audioOutputs);

                    // Check if we have labels. If not, we might need to trigger permission prompt.
                    // However, triggering getUserMedia just for output enumeration can be intrusive.
                    // For now, we assume Electron or user interaction context allows it.
                    if (audioOutputs.some(d => d.label)) {
                        setPermissionGranted(true);
                    }
                };

                await enumerate();

                navigator.mediaDevices.addEventListener('devicechange', enumerate);
                return () => {
                    navigator.mediaDevices.removeEventListener('devicechange', enumerate);
                };
            } catch (err) {
                console.error("Error enumerating devices:", err);
            }
        };

        getDevices();
    }, []);

    return { devices, permissionGranted };
};
