// Main Application Component for Runtime Radio 2.0
// This component now handles loading the configuration from the backend
// and managing the application's state.

import React, { useState, useEffect } from 'react';
import { JingleGrid } from './components/JingleGrid';
import { WelcomeDialog } from './components/WelcomeDialog';
import { invoke } from '@tauri-apps/api/tauri';

// --- Types ---
// These types should ideally be in a shared file, but for simulation they are here.
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


export const App: React.FC = () => {
    const [isFirstLaunch, setIsFirstLaunch] = useState(false); // Default to false, check on load
    const [buttons, setButtons] = useState<ButtonConfig[]>([]);

    // Load configuration from the backend when the component mounts
    useEffect(() => {
        console.log("[Frontend] App mounted. Attempting to load profile...");
        invoke<ButtonConfig[]>('load_profile_command')
            .then(loadedButtons => {
                console.log("[Frontend] Successfully loaded config:", loadedButtons);
                setButtons(loaded_buttons);
                // If config is empty or default, it might be the first launch
                if (loadedButtons.length === 0) {
                    setIsFirstLaunch(true);
                }
            })
            .catch(error => {
                console.error("[Frontend] Failed to load config:", error);
                // Could show an error message to the user
                setIsFirstLaunch(true); // Show welcome/setup if config fails
            });
    }, []);

    const handleWelcomeClose = () => {
        setIsFirstLaunch(false);
    };

    return (
        <div className="app-container">
            {isFirstLaunch && <WelcomeDialog onClose={handleWelcomeClose} />}

            <header>
                <h1>Runtime Radio Advanced Jingle Machine v2.0</h1>
            </header>

            <main>
                <JingleGrid configs={buttons} />
            </main>
        </div>
    );
};
