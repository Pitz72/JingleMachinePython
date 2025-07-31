// JingleButton Component
// This is a "dumb" presentation component. It only:
// 1. Receives its configuration and current state (e.g., isPlaying) via props.
// 2. Renders the button with the correct style (color, border, progress).
// 3. On user interaction (click), it calls a function passed down via props,
//    which will ultimately invoke a command in the Rust backend.

import React from 'react';
import { invoke } from '@tauri-apps/api/tauri';

// Placeholder for props type
type JingleButtonProps = {
    config: {
        id: string;
        name: string;
        color: string;
    };
    // In a real app, state like isPlaying, isQueued would be passed here
};

export const JingleButton: React.FC<JingleButtonProps> = ({ config }) => {

    const handleClick = () => {
        console.log(`Button ${config.id} clicked. Invoking backend...`);
        // Invoke a Tauri command to the Rust backend
        invoke('play_audio', { buttonId: config.id });
    };

    const buttonStyle = {
        backgroundColor: config.color,
        // Other styles for border, etc., would be applied here based on state
    };

    return (
        <button
            className="jingle-button"
            style={buttonStyle}
            onClick={handleClick}
        >
            {config.name}
        </button>
    );
};
