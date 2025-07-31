// Main Application Component for Runtime Radio 2.0
// This component will:
// 1. Initialize the connection with the Tauri backend.
// 2. Listen for events from the backend (e.g., state changes).
// 3. Manage the global UI state (e.g., open modals) using Zustand.
// 4. Render the main layout, including the JingleGrid and WelcomeDialog.

import React, { useState, useEffect } from 'react';
import { JingleGrid } from './components/JingleGrid';
import { WelcomeDialog } from './components/WelcomeDialog';

export const App: React.FC = () => {
    // In a real app, this would be determined by checking localStorage
    const [isFirstLaunch, setIsFirstLaunch] = useState(true);

    console.log("Runtime Radio 2.0 UI Initialized");

    const handleWelcomeClose = () => {
        // In a real app, we would set a flag in localStorage here
        setIsFirstLaunch(false);
    };

    return (
        <div className="app-container">
            {isFirstLaunch && <WelcomeDialog onClose={handleWelcomeClose} />}

            <header>
                <h1>Runtime Radio Advanced Jingle Machine v2.0</h1>
                {/* Global controls like Stop All, Profile Selector, etc. will go here */}
            </header>

            <main>
                <JingleGrid />
            </main>
        </div>
    );
};
