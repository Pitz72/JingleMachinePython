// JingleGrid Component
// This component now receives button configurations as a prop
// and renders the grid dynamically.

import React from 'react';
import { JingleButton } from './JingleButton';
import { ButtonConfig } from '../App'; // Import the shared type

type JingleGridProps = {
    configs: ButtonConfig[];
};

const GRID_COLS = 6;

export const JingleGrid: React.FC<JingleGridProps> = ({ configs }) => {

    const gridStyle = {
        display: 'grid',
        gridTemplateColumns: `repeat(${GRID_COLS}, 1fr)`,
        gap: '10px',
    };

    return (
        <div style={gridStyle}>
            {configs.map(config => (
                <JingleButton key={config.id} config={config} />
            ))}
        </div>
    );
};
