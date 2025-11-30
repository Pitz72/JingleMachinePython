import AudioEngine from './AudioEngine';

class MIDIManager {
    private static instance: MIDIManager;
    private access: MIDIAccess | null = null;
    private inputs: Map<string, MIDIInput> = new Map();
    private isInitialized: boolean = false;

    // Mapping: Note Number -> Button ID
    private midiMapping: Map<number, number> = new Map();

    // Learn Mode State
    private isLearnMode: boolean = false;
    private pendingButtonId: number | null = null;

    private constructor() {
        this.loadMapping();
    }

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

        const cmd = command & 0xf0; // Mask channel

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
        if (this.isLearnMode && this.pendingButtonId !== null) {
            // Learn Mapping
            this.midiMapping.set(note, this.pendingButtonId);
            this.saveMapping();
            console.log(`Mapped Note ${note} to Button ${this.pendingButtonId}`);

            // Notify UI that learning is done for this button
            window.dispatchEvent(new CustomEvent('midi-learn-complete', {
                detail: { note, buttonId: this.pendingButtonId }
            }));

            this.pendingButtonId = null;
            return;
        }

        // Normal Operation
        const buttonIndex = this.midiMapping.get(note);

        // Fallback to default linear mapping if no custom mapping exists
        // Default: C1 (36) -> Button 0
        const effectiveButtonIndex = buttonIndex !== undefined ? buttonIndex : (note - 36);

        if (effectiveButtonIndex >= 0 && effectiveButtonIndex < 24) {
            window.dispatchEvent(new CustomEvent('midi-trigger', {
                detail: { index: effectiveButtonIndex, type: 'down', velocity }
            }));
        }
    }

    private handleNoteOff(note: number) {
        if (this.isLearnMode) return;

        const buttonIndex = this.midiMapping.get(note);
        const effectiveButtonIndex = buttonIndex !== undefined ? buttonIndex : (note - 36);

        if (effectiveButtonIndex >= 0 && effectiveButtonIndex < 24) {
            window.dispatchEvent(new CustomEvent('midi-trigger', {
                detail: { index: effectiveButtonIndex, type: 'up' }
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

    // Learn Mode API
    public setLearnMode(active: boolean) {
        this.isLearnMode = active;
        this.pendingButtonId = null;
        console.log(`MIDI Learn Mode: ${active ? 'ON' : 'OFF'}`);
    }

    public prepareToLearn(buttonId: number) {
        if (!this.isLearnMode) return;
        this.pendingButtonId = buttonId;
        console.log(`Waiting for MIDI Note for Button ${buttonId}...`);
    }

    public getIsLearnMode(): boolean {
        return this.isLearnMode;
    }

    // Persistence
    private saveMapping() {
        const mappingObj = Object.fromEntries(this.midiMapping);
        localStorage.setItem('midi_mapping', JSON.stringify(mappingObj));
    }

    private loadMapping() {
        const saved = localStorage.getItem('midi_mapping');
        if (saved) {
            try {
                const mappingObj = JSON.parse(saved);
                this.midiMapping = new Map(
                    Object.entries(mappingObj).map(([k, v]) => [Number(k), Number(v)])
                );
            } catch (e) {
                console.error("Failed to load MIDI mapping", e);
            }
        }
    }

    public clearMapping() {
        this.midiMapping.clear();
        this.saveMapping();
    }
}

export default MIDIManager;
