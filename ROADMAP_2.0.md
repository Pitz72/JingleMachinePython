# Roadmap di Sviluppo per Runtime Radio Advanced Jingle Machine v2.0

Questa roadmap delinea le fasi di sviluppo per la creazione di "Runtime Radio Advanced Jingle Machine v2.0", basandosi sullo stack tecnologico **Tauri/React** e sull'architettura e feature list definite.

---

## Fase 1: Fondamenta e Core Audio (MVP 1)

**Obiettivo:** Creare le fondamenta del progetto e implementare la funzionalità di riproduzione audio di base.

1.  **Setup del Progetto:**
    -   Inizializzare un nuovo progetto Tauri con un template React + TypeScript.
    -   Configurare la struttura delle directory.
2.  **Sviluppo del Backend (Rust):**
    -   Implementare il motore audio di base.
    -   Creare il gestore di stato centrale (`AppState`).
    -   Esportare i comandi Tauri di base (`load_config`, `play_audio`, `stop_audio`).
3.  **Sviluppo del Frontend (React):**
    -   Creare i componenti UI di base (`JingleGrid` 6x8, `JingleButton`).
    -   Collegare la UI ai comandi Tauri.
    -   Implementare lo store Zustand di base.
4.  **Obiettivo di Fase:** Avere una griglia 6x8 di pulsanti che possono caricare e riprodurre un file audio.

---

## Fase 2: Logica di Riproduzione Avanzata (MVP 2)

**Obiettivo:** Implementare la logica di business che rende l'applicazione uno strumento professionale.

1.  **Sviluppo del Backend (Rust):**
    -   Implementare la state machine di riproduzione (`mainTrack`, `overlayTracks`, `queuedTracks`).
    -   Emettere eventi dal backend per notificare i cambi di stato.
    -   Estendere il motore audio per la riproduzione simultanea.
2.  **Sviluppo del Frontend (React):**
    -   Implementare gli event listeners per aggiornare lo stato della UI.
    -   Implementare il feedback visivo completo sui pulsanti.
3.  **Obiettivo di Fase:** L'applicazione gestisce correttamente le modalità `Restart`, `Continue`, `Overlay` e `Queue`.

---

## Fase 3: Configurazione, Personalizzazione e Dati

**Obiettivo:** Rendere l'applicazione pienamente configurabile e portabile.

1.  **Sviluppo del Backend (Rust):**
    -   Implementare la gestione dei profili e dei percorsi relativi.
    -   Sviluppare la funzione di migrazione delle vecchie configurazioni.
2.  **Sviluppo del Frontend (React):**
    -   Implementare il `SettingsDialog` completo.
    -   Creare la UI per la gestione dei profili e della migrazione.
3.  **Obiettivo di Fase:** L'utente può personalizzare l'app, salvare il lavoro in profili portabili e importare le vecchie configurazioni.

---

## Fase 4: Funzionalità "Premium" e QoL

**Obiettivo:** Aggiungere le funzionalità avanzate che distinguono il prodotto.

1.  **Sviluppo del Backend (Rust):**
    -   Implementare la logica per dissolvenze e gruppi di esclusione.
    -   Sviluppare il modulo per la gestione di input da Tastiera e MIDI.
2.  **Sviluppo del Frontend (React):**
    -   Aggiungere le opzioni per fades e gruppi nel `SettingsDialog`.
    -   Creare la UI per il mapping degli input esterni.
    -   Implementare il Drag and Drop.
3.  **Obiettivo di Fase:** L'applicazione supporta dissolvenze, gruppi di esclusione e controllo esterno.

---

## Fase 5: Finalizzazione e Distribuzione

**Obiettivo:** Preparare l'applicazione per il rilascio pubblico.

1.  **Sviluppo Generale:**
    -   Integrare il sistema di traduzione (i18n) per le 8 lingue richieste.
    -   Eseguire test approfonditi e bug fixing.
    -   Ottimizzare le performance.
2.  **Packaging e Distribuzione:**
    -   Creare e integrare le icone e il branding finale, inclusa la `WelcomeDialog` con il testo ufficiale.
    -   Configurare la build pipeline per gli installer nativi.
    -   Configurare e testare gli aggiornamenti automatici.
3.  **Obiettivo di Fase:** Avere una versione 2.0 stabile, performante e pronta per la distribuzione.
