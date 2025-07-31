// SettingsDialog Component
// A modal for editing all properties of a JingleButton.

import React from 'react';
import { ButtonConfig, PlaybackMode } from '../App'; // Import shared types

// In a real app, we'd also import FadeType
// enum FadeType { Crossfade = 'Crossfade', Duckfade = 'Duckfade' }

type SettingsDialogProps = {
    config: ButtonConfig;
    onSave: (newConfig: ButtonConfig) => void;
    onClose: () => void;
};

export const SettingsDialog: React.FC<SettingsDialogProps> = ({ config, onSave, onClose }) => {
    // For simulation, we'll just display the info.
    // A real implementation would use controlled inputs (useState) to manage form state.

    const handleSave = () => {
        // In a real app, you would gather the new values from the form state
        // and call onSave with the new config object.
        console.log("Saving changes for", config.id);
        onSave(config); // Placeholder save
    };

    return (
        <div className="modal-backdrop">
            <div className="modal-content">
                <h3>Impostazioni per: {config.name}</h3>

                {/* --- Form fields would go here --- */}
                <div className="form-group">
                    <label>Nome:</label>
                    <input type="text" defaultValue={config.name} />
                </div>
                <div className="form-group">
                    <label>Colore:</label>
                    <input type="color" defaultValue={config.color} />
                </div>
                <div className="form-group">
                    <label>Tipo di Dissolvenza:</label>
                    <select>
                        <option value="Crossfade">Crossfade</option>
                        <option value="Duckfade">Duckfade</option>
                    </select>
                </div>
                 <div className="form-group">
                    <label>Durata Dissolvenza (ms):</label>
                    <input type="number" defaultValue={300} />
                </div>

                <div className="dialog-actions">
                    <button onClick={onClose}>Annulla</button>
                    <button onClick={handleSave}>Salva</button>
                </div>
            </div>
        </div>
    );
};
