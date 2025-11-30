import { describe, it, vi, beforeEach } from 'vitest';
import { render, fireEvent, screen } from '@testing-library/react';
import React from 'react';
import App from './App';
import { LanguageProvider } from './contexts/LanguageContext';
import { DatabaseProvider } from './contexts/DatabaseContext';
import { ThemeProvider } from './contexts/ThemeContext';

// Mock services using async import to avoid hoisting issues
vi.mock('./services/AudioEngine', async () => {
    const AudioEngineMock = (await import('./test/mocks/AudioEngineMock')).default;
    return { default: AudioEngineMock };
});

vi.mock('./services/MIDIManager', async () => {
    const MIDIManagerMock = (await import('./test/mocks/MIDIManagerMock')).default;
    return { default: MIDIManagerMock };
});

// Mock database
vi.mock('./db', () => {
    class AudioDBMock {
        getAllAudioFiles = vi.fn().mockResolvedValue([]);
        saveAudioFile = vi.fn();
        deleteAudioFile = vi.fn();
    }
    return {
        AudioDB: AudioDBMock,
        db: new AudioDBMock(),
    };
});

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: vi.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(), // deprecated
        removeListener: vi.fn(), // deprecated
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn(),
    })),
});

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
    observe: vi.fn(),
    unobserve: vi.fn(),
    disconnect: vi.fn(),
}));

describe('App', () => {
    beforeEach(() => {
        // Clear localStorage
        localStorage.clear();
        // Set language to skip selection screen
        localStorage.setItem('jingle_machine_language', 'en');
    });

    it('renders without crashing', () => {
        render(
            <ThemeProvider>
                <DatabaseProvider>
                    <LanguageProvider>
                        <App />
                    </LanguageProvider>
                </DatabaseProvider>
            </ThemeProvider>
        );
    });

    it('interacts with buttons without crashing', async () => {
        const { container } = render(
            <ThemeProvider>
                <DatabaseProvider>
                    <LanguageProvider>
                        <App />
                    </LanguageProvider>
                </DatabaseProvider>
            </ThemeProvider>
        );

        // Find all buttons
        const buttons = container.querySelectorAll('button');

        // Click the first few buttons if available
        if (buttons.length > 0) {
            fireEvent.click(buttons[0]);
        }

        // Try right click (context menu) on a button to open settings
        // Assuming the grid buttons are among the first ones
        if (buttons.length > 0) {
            fireEvent.contextMenu(buttons[0]);
        }

        // Check if settings dialog opened (by looking for text "Settings")
        // Note: This depends on translations, but we set language to 'en'
        // "Settings: Button"
        // await screen.findByText(/Settings:/); 
    });
});
