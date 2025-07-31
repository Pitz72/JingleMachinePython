// JingleGrid Component
// This component is responsible for:
// 1. Subscribing to the button configuration from the Zustand store.
// 2. Rendering the 6x8 grid of JingleButton components.
// 3. Passing the configuration and state for each button down as props.

import React from 'react';
import { JingleButton } from './JingleButton';

// Placeholder for button configuration type
type ButtonConfig = {
    id: string;
    name: string;
    color: string;
    // ... other properties
};

const GRID_ROWS = 8;
const GRID_COLS = 6;

export const JingleGrid: React.FC = () => {
    // Placeholder: In a real app, this would come from a Zustand store
    const buttons: ButtonConfig[] = Array.from({ length: GRID_ROWS * GRID_COLS }, (_, i) => ({
        id: `btn_${i}`,
        name: `Button ${i + 1}`,
        color: '#333',
    }));

    const gridStyle = {
        display: 'grid',
        gridTemplateColumns: `repeat(${GRID_COLS}, 1fr)`,
        gap: '10px',
    };

    return (
        <div style={gridStyle}>
            {buttons.map(config => (
                <JingleButton key={config.id} config={config} />
            ))}
        </div>
    );
};
