# Roadmap di Sviluppo per Runtime Radio 2.0

Questa roadmap delinea le fasi di sviluppo per la creazione di "Runtime Radio 2.0", basandosi sullo stack tecnologico **Tauri/React** e sull'architettura e feature list definite.

---

## Fase 1: Fondamenta e Core Audio (MVP 1)

**Obiettivo:** Creare le fondamenta del progetto e implementare la funzionalità di riproduzione audio di base.

1.  **Setup del Progetto:**
    -   Inizializzare un nuovo progetto Tauri con un template React + TypeScript.
    -   Configurare la struttura delle directory sia per il frontend (`src-ui`) che per il backend (`src-tauri`).
    -   Impostare gli strumenti di sviluppo (ESLint, Prettier, ecc.).

2.  **Sviluppo del Backend (Rust):**
    -   **Modulo Audio:** Implementare il motore audio di base usando `rodio` o `cpal`. Deve essere in grado di caricare un file audio dal disco e riprodurlo.
    -   **Gestore di Stato:** Creare lo stato centrale dell'applicazione (`AppState`) per contenere la configurazione dei pulsanti e lo stato di riproduzione.
    -   **Comandi Tauri:** Esportare i comandi di base al frontend: `load_config`, `play_audio`, `stop_audio`.

3.  **Sviluppo del Frontend (React):**
    -   **UI di Base:** Creare i componenti principali della UI: `JingleGrid` e `JingleButton`.
    -   **Comunicazione:** Collegare la UI ai comandi Tauri. Un click su un `JingleButton` deve invocare il comando `play_audio` nel backend.
    -   **Stato UI:** Implementare lo store Zustand di base per gestire la configurazione dei pulsanti caricata dal backend.

4.  **Obiettivo di Fase:** Avere una griglia di pulsanti che possono caricare e riprodurre un file audio. Nessuna logica complessa, solo play/stop.

---

## Fase 2: Logica di Riproduzione Avanzata (MVP 2)

**Obiettivo:** Implementare la logica di business che rende l'applicazione uno strumento professionale.

1.  **Sviluppo del Backend (Rust):**
    -   **State Machine:** Implementare la logica di riproduzione completa nel `Core Application`: gestione di `mainTrack`, `overlayTracks`, `queuedTracks`.
    -   **Eventi dal Backend:** Il backend deve emettere eventi per notificare al frontend i cambi di stato (`playback_started`, `playback_finished`, `track_queued`, etc.).
    -   **Motore Audio Avanzato:** Estendere il motore audio per supportare la riproduzione simultanea di più tracce (per overlay).

2.  **Sviluppo del Frontend (React):**
    -   **Event Listeners:** Il frontend deve ascoltare gli eventi dal backend e aggiornare lo store di Zustand di conseguenza.
    -   **Feedback Visivo:** Il `JingleButton` deve ora mostrare lo stato corretto (play, coda, overlay) basandosi sullo stato globale. Implementare la `Progress Bar`.

3.  **Obiettivo di Fase:** L'applicazione ora gestisce correttamente le modalità `Restart`, `Continue`, `Overlay` e `Queue`.

---

## Fase 3: Configurazione, Personalizzazione e Dati

**Obiettivo:** Rendere l'applicazione pienamente configurabile e portabile.

1.  **Sviluppo del Backend (Rust):**
    -   **Modulo Configurazione:** Implementare la logica per salvare e caricare i **profili** di configurazione.
    -   **Percorsi Relativi:** Implementare la gestione dei percorsi relativi alla cartella dei media.
    -   **Migrazione Dati:** Sviluppare la funzione per importare e convertire le configurazioni delle vecchie versioni.

2.  **Sviluppo del Frontend (React):**
    -   **SettingsDialog:** Implementare la finestra di dialogo completa per la personalizzazione dei pulsanti (nome, colore, volume, modalità, etc.).
    -   **Gestione Profili:** Creare la UI per creare, cambiare e gestire i profili.
    -   **UI per Migrazione:** Creare la UI per guidare l'utente nel processo di migrazione.

3.  **Obiettivo di Fase:** L'utente può personalizzare ogni aspetto dell'applicazione, salvare il proprio lavoro in profili portabili e importare le vecchie configurazioni.

---

## Fase 4: Funzionalità "Premium" e QoL

**Obiettivo:** Aggiungere le funzionalità avanzate che distinguono il prodotto.

1.  **Sviluppo del Backend (Rust):**
    -   **Dissolvenze:** Implementare la logica per `crossfade` e `fade-out` nel motore audio.
    -   **Mute Groups:** Implementare la logica per i gruppi di esclusione.
    -   **Input Manager:** Sviluppare il modulo per la gestione degli input da **Tastiera** e **MIDI**.

2.  **Sviluppo del Frontend (React):**
    -   **UI per Fades e Gruppi:** Aggiungere le opzioni relative a dissolvenze e gruppi nel `SettingsDialog`.
    -   **UI per Input Mapping:** Creare una nuova finestra di dialogo per mappare i tasti della tastiera e i controller MIDI ai pulsanti della griglia.
    -   **Drag and Drop:** Implementare il drag and drop dei file audio sui pulsanti.

3.  **Obiettivo di Fase:** L'applicazione supporta dissolvenze, gruppi di esclusione e controllo esterno tramite tastiera/MIDI.

---

## Fase 5: Finalizzazione e Distribuzione

**Obiettivo:** Preparare l'applicazione per il rilascio pubblico.

1.  **Sviluppo Generale:**
    -   **Internazionalizzazione (i18n):** Integrare un sistema di traduzione (es. `i18next`) e tradurre la UI in italiano e inglese.
    -   **Testing:** Eseguire test approfonditi su tutte le funzionalità e su tutte le piattaforme (Windows, macOS, Linux).
    -   **Bug Fixing:** Risolvere i bug emersi durante i test.
    -   **Ottimizzazione delle Performance:** Profilare l'applicazione e ottimizzare le aree critiche.

2.  **Packaging e Distribuzione:**
    -   **Icone e Branding:** Creare e integrare le icone finali dell'applicazione.
    -   **Build Pipeline:** Configurare la pipeline di build di Tauri per generare gli **installer nativi** per ogni sistema operativo.
    -   **Aggiornamenti Automatici:** Configurare e testare il sistema di aggiornamenti automatici.

3.  **Obiettivo di Fase:** Avere una versione 2.0 stabile, performante, pacchettizzata e pronta per essere distribuita agli utenti.
