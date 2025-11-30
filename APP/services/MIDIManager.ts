const cmd = command & 0xf0; // Mask channel
const channel = command & 0x0f;

if (cmd === 144 && velocity > 0) {
    // Note On
    this.handleNoteOn(note, velocity);
} else if (cmd === 128 || (cmd === 144 && velocity === 0)) {
    // Note Off
    this.handleNoteOff(note);
} else if (cmd === 176) {
    // Control Change
    this.handleControlChange(note, velocity);
}
    }

    private handleNoteOn(note: number, velocity: number) {
    // Map notes to button IDs (e.g., C1 = 36 -> Button 0)
    // Let's assume a linear mapping for now starting from C1 (36)
    const buttonIndex = note - 36;
    if (buttonIndex >= 0 && buttonIndex < 24) { // Assuming 24 buttons
        // We need a way to trigger the button in React.
        // Dispatching a custom event that the App or Grid can listen to.
        window.dispatchEvent(new CustomEvent('midi-trigger', {
            detail: { index: buttonIndex, type: 'down', velocity }
        }));
    }
}

    private handleNoteOff(note: number) {
    const buttonIndex = note - 36;
    if (buttonIndex >= 0 && buttonIndex < 24) {
        window.dispatchEvent(new CustomEvent('midi-trigger', {
            detail: { index: buttonIndex, type: 'up' }
        }));
    }
}

    private handleControlChange(cc: number, value: number) {
    // Map CC to Master Volume (e.g., CC 7)
    if (cc === 7) {
        const volume = value / 127;
        AudioEngine.getInstance().setMasterVolume(volume);
        // Also notify UI
        window.dispatchEvent(new CustomEvent('midi-cc', {
            detail: { cc, value: volume }
        }));
    }
}
}

export default MIDIManager;
