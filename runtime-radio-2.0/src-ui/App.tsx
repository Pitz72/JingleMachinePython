// Main Application Component for Runtime Radio 2.0
// This component now listens for real-time events from the backend
// to update the UI's playback status.

import React, { useState, useEffect } from 'react';
import { JingleGrid } from './components/JingleGrid';
import { WelcomeDialog } from './components/WelcomeDialog';
import { invoke } from '@tauri-apps/api/tauri';
import { listen } from '@tauri-apps/api/event';

// --- Types ---
export enum PlaybackMode {
    Restart = "Restart",
    Continue = "Continue",
    Overlay = "Overlay",
    Queue = "Queue",
}

export interface ButtonConfig {
    id: string;
    name: string;
    color: string;
    volume: number;
    audio_file_path?: string;
    playback_mode: PlaybackMode;
    is_loop: boolean;
    crossfade_ms: number;
    fade_out_ms: number;
}

export enum PlaybackStatus {
    Idle = 'Idle',
    Playing = 'Playing',
    Queued = 'Queued',
}

// Type for the playback status map
type StatusMap = { [key: string]: PlaybackStatus };

export const App: React.FC = () => {
    const [isFirstLaunch, setIsFirstLaunch] = useState(false);
    const [buttons, setButtons] = useState<ButtonConfig[]>([]);
    const [statuses, setStatuses] = useState<StatusMap>({});

    // --- Event Listeners ---
    useEffect(() => {
        const setupListeners = async () => {
            await listen<string>('playback-started', (event) => {
                console.log('[EVENT] Playback Started:', event.payload);
                setStatuses(prev => ({ ...prev, [event.payload]: PlaybackStatus.Playing }));
            });

            await listen<string>('playback-stopped', (event) => {
                console.log('[EVENT] Playback Stopped:', event.payload);
                setStatuses(prev => ({ ...prev, [event.payload]: PlaybackStatus.Idle }));
            });

            await listen<string>('track-queued', (event) => {
                console.log('[EVENT] Track Queued:', event.payload);
                setStatuses(prev => ({ ...prev, [event.payload]: PlaybackStatus.Queued }));
            });

            await listen('all-stopped', () => {
                console.log('[EVENT] All Stopped');
                setStatuses({}); // Reset all statuses
            });
        };
        setupListeners();
    }, []);

    // --- Data Loading ---
    useEffect(() => {
        invoke<ButtonConfig[]>('load_profile_command')
            .then(loadedButtons => {
                setButtons(loaded_buttons);
                if (loadedButtons.length === 0) setIsFirstLaunch(true);
            })
            .catch(error => {
                console.error("Failed to load config:", error);
                setIsFirstLaunch(true);
            });
    }, []);

    const handleWelcomeClose = () => setIsFirstLaunch(false);

    return (
        <div className="app-container">
            {isFirstLaunch && <WelcomeDialog onClose={handleWelcomeClose} />}
            <header>
                <h1>Runtime Radio Advanced Jingle Machine v2.0</h1>
            </header>
            <main>
                <JingleGrid configs={buttons} statuses={statuses} />
            </main>
        </div>
    );
};
