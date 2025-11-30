import AudioEngine from './AudioEngine';

class MIDIManager {
    private static instance: MIDIManager;
    private access: MIDIAccess | null = null;
    private inputs: Map<string, MIDIInput> = new Map();
    private isInitialized: boolean = false;

    private constructor() { }

    public static getInstance(): MIDIManager {
        if (!MIDIManager.instance) {
            MIDIManager.instance = new MIDIManager();
        }
        return MIDIManager.instance;
    }

    public async initialize(): Promise<boolean> {
        if (this.isInitialized) return true;

        if (!navigator.requestMIDIAccess) {
            console.warn("Web MIDI API not supported in this environment.");
            return false;
        }

        try {
            this.access = await navigator.requestMIDIAccess();
            this.setupInputs();

            this.access.onstatechange = (e) => {
                this.setupInputs();
            };

            this.isInitialized = true;
            console.log("MIDI Manager Initialized");
            return true;
        } catch (err) {
            console.error("Failed to access MIDI devices:", err);
            return false;
        }
    }

    private setupInputs() {
        if (!this.access) return;

        this.inputs.clear();
        const inputs = this.access.inputs.values();

        for (let input of inputs) {
            this.inputs.set(input.id, input);
            input.onmidimessage = this.handleMIDIMessage.bind(this);
            console.log(`MIDI Input Connected: ${input.name}`);
        }
    }

    private handleMIDIMessage(event: MIDIMessageEvent) {
        const [command, note, velocity] = event.data;

        // Simple mapping for now:
        // Note On (144-159) -> Trigger Button
        // Control Change (176-191) -> Volume/Fader

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
