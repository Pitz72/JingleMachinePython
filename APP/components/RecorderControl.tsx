import React, { useState, useEffect } from 'react';
import AudioEngine from '../services/AudioEngine';
import { useTranslations } from '../contexts/LanguageContext';

const RecorderControl: React.FC = () => {
    const { t } = useTranslations();
    const [isRecording, setIsRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);

    useEffect(() => {
        let interval: any;
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

    const handleToggleRecording = async () => {
        const engine = AudioEngine.getInstance();

        if (isRecording) {
            // Stop Recording
            const blob = await engine.stopRecording();
            setIsRecording(false);

            if (blob) {
                // Create download link
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;
                // Generate filename with timestamp
                const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
                a.download = `recording-${timestamp}.webm`;
                document.body.appendChild(a);
                a.click();

                // Cleanup
                setTimeout(() => {
                    document.body.removeChild(a);
                    window.URL.revokeObjectURL(url);
                }, 100);
            }
        } else {
            // Start Recording
            const started = engine.startRecording();
            if (started) {
                setIsRecording(true);
            }
        }
    };

    return (
        <div className="flex items-center space-x-3 bg-gray-800 p-2 rounded-lg border border-gray-700">
            <button
                onClick={handleToggleRecording}
                className={`flex items-center space-x-2 px-3 py-1.5 rounded-md font-bold transition-colors ${isRecording
                        ? 'bg-red-600 hover:bg-red-700 text-white animate-pulse'
                        : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                    }`}
                title={isRecording ? "Stop Recording" : "Start Recording"}
            >
                <div className={`w-3 h-3 rounded-full ${isRecording ? 'bg-white' : 'bg-red-500'}`}></div>
                <span>{isRecording ? 'REC' : 'REC'}</span>
            </button>

            <div className="font-mono text-xl text-cyan-400 min-w-[60px] text-center">
                {formatTime(recordingTime)}
            </div>
        </div>
    );
};

export default RecorderControl;
