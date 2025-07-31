# Feature List Completa per Runtime Radio Advanced Jingle Machine v2.0

Questo documento definisce l'elenco completo delle funzionalità per "Runtime Radio Advanced Jingle Machine v2.0".

## 1. Gestione dei Pulsanti e della Griglia

-   **Griglia 6x8:** 48 pulsanti totali.
-   **Caricamento Audio:** Drag and Drop supportato.
-   **Personalizzazione Pulsante:**
    -   Nome, Colore, Volume.
    -   **Modalità di Riproduzione:** `Restart`, `Continue`, `Overlay`, `Queue`.
    -   **Opzioni Aggiuntive:**
        -   `Loop`: Abilita/disabilita la riproduzione continua.
        -   **Tipo di Dissolvenza:** Scelta tra `Crossfade` (dissolvenza incrociata) e `Duckfade` (la traccia in uscita sfuma, quella in entrata parte netta).
        -   **Durata Dissolvenza:** Impostazione in ms per la durata della transizione.
-   **Copia/Incolla Impostazioni.**

## 2. Logica di Riproduzione Audio (Audio Engine)

-   **Motore Audio Performante (Rust).**
-   **Playback Multi-Canale.**
-   **Dissolvenze Avanzate:** Implementazione di `Crossfade` e `Duckfade`.
-   **Regolazione Volume in Tempo Reale.**
-   **Gruppi di Esclusione (Mute Groups).**
-   **Pulsante Globale "Stop All".**

## 3. Gestione della Configurazione e dei Dati

-   **Percorsi Relativi.**
-   **Gestione Profili.**
-   **Migrazione Automatica da versioni precedenti.**
-   **Storage Robusto (JSON + File System).**

## 4. Interfaccia Utente e User Experience (UI/UX)

-   **Tema Scuro Moderno.**
-   **Feedback Visivo Chiaro.**
-   **Notifiche Non Bloccanti.**
-   **Internazionalizzazione (i18n):** Supporto per 8 lingue.
-   **Schermata di Benvenuto.**

## 5. Integrazioni Esterne

-   **Controllo tramite Tastiera.**
-   **Controllo tramite Controller MIDI.**

## 6. Packaging e Distribuzione

-   **Installer Nativo.**
-   **Aggiornamenti Automatici.**
