// JingleButton Component
// This component now receives a `status` prop and changes its
// style dynamically to provide visual feedback.

import React from 'react';
import { invoke } from '@tauri-apps/api/tauri';
import { ButtonConfig, PlaybackStatus } from '../App'; // Import shared types

type JingleButtonProps = {
    config: ButtonConfig;
    status: PlaybackStatus;
};

export const JingleButton: React.FC<JingleButtonProps> = ({ config, status }) => {

    const handleClick = () => {
        console.log(`Button ${config.id} clicked. Invoking backend...`);
        invoke('play_audio_command', { buttonId: config.id });
    };

    const getBorderColor = () => {
        switch (status) {
            case PlaybackStatus.Playing:
                return '2px solid #00FF00'; // Green for playing
            case PlaybackStatus.Queued:
                return '2px solid #00FFFF'; // Cyan for queued
            default:
                return '2px solid #555555'; // Default border
        }
    };

    const buttonStyle = {
        backgroundColor: config.color,
        border: getBorderColor(),
        color: 'white',
        padding: '10px',
        textAlign: 'center' as const,
        transition: 'border-color 0.2s',
    };

    return (
        <button
            className="jingle-button"
            style={buttonStyle}
            onClick={handleClick}
        >
            {config.name}
            <br />
            <small>({status})</small>
        </button>
    );
};
