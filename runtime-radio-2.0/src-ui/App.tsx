// Main Application Component for Runtime Radio 2.0
// Finalizing the types to match the backend configuration.

import React, { useState, useEffect } from 'react';
import { JingleGrid } from './components/JingleGrid';
import { WelcomeDialog } from './components/WelcomeDialog';
// import { SettingsDialog } from './components/SettingsDialog'; // Would be used here
import { invoke } from '@tauri-apps/api/tauri';
import { listen } from '@tauri-apps/api/event';

// --- Types ---
export enum PlaybackMode {
    Restart = "Restart",
    Continue = "Continue",
    Overlay = "Overlay",
    Queue = "Queue",
}

export enum FadeType {
    Crossfade = "Crossfade",
    Duckfade = "Duckfade",
}

export interface ButtonConfig {
    id: string;
    name: string;
    color: string;
    volume: number;
    audio_file_path?: string;
    playback_mode: PlaybackMode;
    is_loop: boolean;
    fade_type: FadeType;
    fade_duration_ms: number;
}

export enum PlaybackStatus {
    Idle = 'Idle',
    Playing = 'Playing',
    Queued = 'Queued',
}

type StatusMap = { [key: string]: PlaybackStatus };

export const App: React.FC = () => {
    const [isFirstLaunch, setIsFirstLaunch] = useState(false);
    const [buttons, setButtons] = useState<ButtonConfig[]>([]);
    const [statuses, setStatuses] = useState<StatusMap>({});
    // const [editingButton, setEditingButton] = useState<ButtonConfig | null>(null);

    useEffect(() => {
        const setupListeners = async () => {
            await listen<string>('playback-started', (event) => setStatuses(prev => ({ ...prev, [event.payload]: PlaybackStatus.Playing })));
            await listen<string>('playback-stopped', (event) => setStatuses(prev => ({ ...prev, [event.payload]: PlaybackStatus.Idle })));
            await listen<string>('track-queued', (event) => setStatuses(prev => ({ ...prev, [event.payload]: PlaybackStatus.Queued })));
            await listen('all-stopped', () => setStatuses({}));
            await listen('queue-cleared', () => setStatuses(prev => {
                const next = {...prev};
                Object.keys(next).forEach(key => {
                    if (next[key] === PlaybackStatus.Queued) {
                        next[key] = PlaybackStatus.Idle;
                    }
                });
                return next;
            }));
        };
        setupListeners();
    }, []);

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
            {/* {editingButton && <SettingsDialog config={editingButton} ... />} */}

            <header>
                <h1>Runtime Radio Advanced Jingle Machine v2.0</h1>
            </header>

            <main>
                <JingleGrid configs={buttons} statuses={statuses} />
            </main>
        </div>
    );
};
