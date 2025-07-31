// WelcomeDialog Component
// This modal dialog is shown on the first launch
// to introduce the user to the application.

import React from 'react';

type WelcomeDialogProps = {
    onClose: () => void;
};

export const WelcomeDialog: React.FC<WelcomeDialogProps> = ({ onClose }) => {
    return (
        <div className="modal-backdrop">
            <div className="modal-content">
                <h2>Runtime Radio Advanced Jingle Machine v2.0</h2>
                <h3>Broadcast Edition</h3>

                <p>
                    Benvenuti nella Jingle Machine progettata da Runtime Radio, la Web Radio Geek,
                    uno strumento professionale per conduttori radiofonici, podcaster, DJ ed eventi dal vivo.
                </p>
                <p>
                    Questa applicazione fornisce una griglia di pulsanti personalizzabili per la riproduzione
                    audio istantanea. Puoi assegnare un file audio, un nome, un colore, un volume e una
                    modalità di riproduzione a ciascun pulsante. Tutte le configurazioni vengono salvate
                    automaticamente.
                </p>
                <p>
                    Per iniziare, clicca su un pulsante vuoto o fai clic con il tasto destro su un
                    pulsante configurato per accedere alle sue impostazioni.
                </p>

                <footer>
                    (C) 2025 Runtime Radio by Simone Pizzi
                </footer>

                <button onClick={onClose}>Inizia</button>
            </div>
        </div>
    );
};
