import { useEffect, useCallback, useState } from 'react';

interface MidiMessage {
  data: [number, number, number]; // [command, note, velocity]
}

export const useMidi = (onButtonTrigger: (buttonId: number) => void) => {
  const [isMidiSupported, setIsMidiSupported] = useState(false);
  const [midiAccess, setMidiAccess] = useState<MIDIAccess | null>(null);
  const [connectedDevices, setConnectedDevices] = useState<MIDIInput[]>([]);

  // Request MIDI access
  const requestMidiAccess = useCallback(async () => {
    if (!navigator.requestMIDIAccess) {
      console.warn('Web MIDI API not supported');
      return;
    }

    try {
      const access = await navigator.requestMIDIAccess();
      setMidiAccess(access);
      setIsMidiSupported(true);

      // Listen for device connections
      access.onstatechange = (event) => {
        console.log('MIDI device state changed:', event.port.name, event.port.state);
        updateConnectedDevices(access);
      };

      updateConnectedDevices(access);
    } catch (error) {
      console.error('Failed to get MIDI access:', error);
    }
  }, []);

  const updateConnectedDevices = (access: MIDIAccess) => {
    const inputs = Array.from(access.inputs.values());
    setConnectedDevices(inputs);
  };

  // Handle MIDI messages
  const handleMidiMessage = useCallback((message: MidiMessage) => {
    const [command, note, velocity] = message.data;

    // Note on (144-159) or note off (128-143)
    if (command >= 144 && command <= 159 && velocity > 0) {
      // Map MIDI note to button ID (adjust mapping as needed)
      // Using a simple mapping: note 36-96 maps to buttons 0-60
      const buttonId = Math.max(0, Math.min(87, note - 36));

      if (buttonId >= 0 && buttonId < 88) {
        onButtonTrigger(buttonId);
      }
    }
  }, [onButtonTrigger]);

  // Setup MIDI input listeners
  useEffect(() => {
    if (!midiAccess) return;

    const inputs = midiAccess.inputs.values();

    for (const input of inputs) {
      input.onmidimessage = (event) => {
        handleMidiMessage(event as any);
      };
    }

    return () => {
      // Cleanup listeners
      for (const input of inputs) {
        input.onmidimessage = null;
      }
    };
  }, [midiAccess, handleMidiMessage]);

  return {
    isMidiSupported,
    connectedDevices,
    requestMidiAccess,
  };
};