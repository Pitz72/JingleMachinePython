import React, { useEffect, useState } from 'react';
import { VolumeUpIcon, UndoIcon, RedoIcon, MicIcon, MicOffIcon } from '../icons';
import { useTranslations } from '../../contexts/LanguageContext';
import AudioEngine from '../../services/AudioEngine';

interface ControlDeckProps {
    masterVolume: number;
    setMasterVolume: (val: number) => void;
    onStopAll: () => void;
    onUndo: () => void;
    onRedo: () => void;
    canUndo: boolean;
    canRedo: boolean;
}

const ControlDeck: React.FC<ControlDeckProps> = ({
    masterVolume,
    setMasterVolume,
    onStopAll,
    onUndo,
    onRedo,
    canUndo,
    canRedo
}) => {
    const { t } = useTranslations();
    const [micEnabled, setMicEnabled] = useState(false);
    const [micVolume, setMicVolume] = useState(1.0);
    const [micDevices, setMicDevices] = useState<MediaDeviceInfo[]>([]);
    const [selectedMicId, setSelectedMicId] = useState<string>('');
    const [isMicMonitoring, setIsMicMonitoring] = useState(false);
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);

    // Recording Timer
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isRecording) {
            interval = setInterval(() => {
                setRecordingTime(prev => prev + 1);
            }, 1000);
        } else {
            setRecordingTime(0);
        }
        return () => clearInterval(interval);
    }, [isRecording]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const toggleRecording = async () => {
        if (isRecording) {
            const blob = await AudioEngine.getInstance().stopRecording();
            setIsRecording(false);
            if (blob) {
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;
                a.download = `recording_${new Date().toISOString().replace(/[:.]/g, '-')}.webm`;
                document.body.appendChild(a);
                a.click();
                setTimeout(() => {
                    document.body.removeChild(a);
                    window.URL.revokeObjectURL(url);
                }, 100);
            }
        } else {
            const started = AudioEngine.getInstance().startRecording();
            if (started) {
                setIsRecording(true);
            } else {
                alert("Failed to start recording.");
            }
        }
    };

    // Load Mic Devices
    useEffect(() => {
        navigator.mediaDevices.enumerateDevices().then(devices => {
            const audioInputs = devices.filter(d => d.kind === 'audioinput');
            setMicDevices(audioInputs);
            if (audioInputs.length > 0) {
                setSelectedMicId(audioInputs[0].deviceId);
            }
        });
    }, []);

    const toggleMic = async () => {
        if (micEnabled) {
            AudioEngine.getInstance().stopMicrophone();
            setMicEnabled(false);
        } else {
            if (selectedMicId) {
                try {
                    await AudioEngine.getInstance().startMicrophone(selectedMicId);
                    setMicEnabled(true);
                    // Apply current volume
                    AudioEngine.getInstance().setMicrophoneVolume(micVolume);
                    AudioEngine.getInstance().setMicrophoneMonitoring(isMicMonitoring);
                } catch (e) {
                    alert("Failed to start microphone. Check permissions.");
                }
            }
        }
    };

    const handleMicVolumeChange = (val: number) => {
        setMicVolume(val);
        AudioEngine.getInstance().setMicrophoneVolume(val);
    };

    const toggleMicMonitor = () => {
        const newState = !isMicMonitoring;
        setIsMicMonitoring(newState);
        AudioEngine.getInstance().setMicrophoneMonitoring(newState);
    };

    return (
        <footer className="h-24 bg-zinc-900 border-t border-zinc-800 flex items-center justify-between px-6 select-none">
            {/* Left: Microphone Control */}
            <div className="flex items-center space-x-4 w-1/3">
                <div className="flex flex-col space-y-1">
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={toggleMic}
                            className={`p-3 rounded-full transition-all ${micEnabled ? 'bg-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.5)]' : 'bg-zinc-800 text-zinc-500 hover:bg-zinc-700'}`}
                        >
                            {micEnabled ? <MicIcon className="w-6 h-6" /> : <MicOffIcon className="w-6 h-6" />}
                        </button>
                        <select
                            value={selectedMicId}
                            onChange={(e) => setSelectedMicId(e.target.value)}
                            className="bg-zinc-800 text-zinc-300 text-xs rounded p-1 max-w-[150px] border-none focus:ring-1 focus:ring-cyan-500"
                            disabled={micEnabled}
                        >
                            {micDevices.map(d => (
                                <option key={d.deviceId} value={d.deviceId}>{d.label || `Mic ${d.deviceId.slice(0, 5)}...`}</option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Mic Fader */}
                <div className="flex flex-col w-32">
                    <span className="text-[10px] text-zinc-500 uppercase tracking-widest mb-1">Mic Vol</span>
                    <input
                        type="range"
                        min="0"
                        max="1.5"
                        step="0.01"
                        value={micVolume}
                        onChange={(e) => handleMicVolumeChange(parseFloat(e.target.value))}
                        className="w-full h-1 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-red-500"
                    />
                </div>

                {/* Monitor Toggle */}
                <button
                    onClick={toggleMicMonitor}
                    className={`text-xs px-2 py-1 rounded border ${isMicMonitoring ? 'bg-yellow-500/20 border-yellow-500 text-yellow-500' : 'border-zinc-700 text-zinc-500'}`}
                >
                    MON
                </button>
            </div>

            {/* Center: Transport */}
            <div className="flex items-center justify-center space-x-6 w-1/3">
                <button
                    onClick={onUndo}
                    disabled={!canUndo}
                    className="p-2 text-zinc-500 hover:text-zinc-300 disabled:opacity-30 transition-colors"
                >
                    <UndoIcon className="w-6 h-6" />
                </button>

                <button
                    onClick={onStopAll}
                    className="bg-zinc-800 hover:bg-zinc-700 text-red-500 font-bold py-3 px-6 rounded-xl border border-red-900/30 transition-all"
                >
                    STOP ALL
                </button>

                {/* REC Button */}
                <div className="flex flex-col items-center">
                    <button
                        onClick={toggleRecording}
                        className={`w-14 h-14 rounded-full flex items-center justify-center border-4 transition-all ${isRecording ? 'bg-red-600 border-red-800 shadow-[0_0_20px_rgba(220,38,38,0.6)] animate-pulse' : 'bg-zinc-800 border-zinc-700 hover:border-red-900'}`}
                    >
                        <div className={`w-4 h-4 rounded-sm ${isRecording ? 'bg-white' : 'bg-red-600 rounded-full'}`} />
                    </button>
                    {isRecording && <span className="text-xs text-red-500 font-mono mt-1">{formatTime(recordingTime)}</span>}
                </div>

                <button
                    onClick={onRedo}
                    disabled={!canRedo}
                    className="p-2 text-zinc-500 hover:text-zinc-300 disabled:opacity-30 transition-colors"
                >
                    <RedoIcon className="w-6 h-6" />
                </button>
            </div>

            {/* Right: Master Output */}
            <div className="flex items-center justify-end space-x-4 w-1/3">
                <div className="flex flex-col w-48">
                    <div className="flex justify-between mb-1">
                        <span className="text-[10px] text-zinc-500 uppercase tracking-widest">Master</span>
                        <span className="text-[10px] text-cyan-400 font-mono">{Math.round(masterVolume * 100)}%</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <VolumeUpIcon className="w-5 h-5 text-zinc-500" />
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={masterVolume}
                            onChange={(e) => setMasterVolume(parseFloat(e.target.value))}
                            className="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                        />
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default ControlDeck;
