// JingleGrid Component
// This component now also receives the status map and passes
// the correct status to each JingleButton.

import React from 'react';
import { JingleButton } from './JingleButton';
import { ButtonConfig, PlaybackStatus } from '../App'; // Import shared types

type JingleGridProps = {
    configs: ButtonConfig[];
    statuses: { [key: string]: PlaybackStatus };
};

const GRID_COLS = 6;

export const JingleGrid: React.FC<JingleGridProps> = ({ configs, statuses }) => {

    const gridStyle = {
        display: 'grid',
        gridTemplateColumns: `repeat(${GRID_COLS}, 1fr)`,
        gap: '10px',
    };

    return (
        <div style={gridStyle}>
            {configs.map(config => (
                <JingleButton
                    key={config.id}
                    config={config}
                    status={statuses[config.id] || PlaybackStatus.Idle}
                />
            ))}
        </div>
    );
};
