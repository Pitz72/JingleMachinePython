# Architettura di Runtime Radio 2.0

Questo documento descrive l'architettura software proposta per "Runtime Radio 2.0", basata sullo stack tecnologico raccomandato: **Tauri (backend in Rust) e React (frontend in TypeScript)**.

## 1. Principi Architetturali

-   **Separazione delle Responsabilità (SoC):** Il frontend (React) è responsabile solo della presentazione e della cattura dell'input utente. Il backend (Rust) gestisce tutta la logica di business, l'elaborazione audio e la comunicazione con il sistema operativo.
-   **Comunicazione tramite Eventi:** Frontend e backend comunicano in modo asincrono tramite un sistema di eventi e comandi gestito da Tauri. Il frontend invia "comandi" (es. `play_audio`, `update_settings`) e il backend emette "eventi" per notificare al frontend i cambiamenti di stato (es. `playback_started`, `track_finished`, `config_updated`).
-   **Stato Reattivo:** Lo stato dell'interfaccia utente è gestito interamente in React. Lo stato del "core" dell'applicazione (ciò che sta suonando, le code, le configurazioni) risiede nel backend Rust e viene sincronizzato con il frontend tramite eventi.
-   **Modularità:** Sia il backend Rust che il frontend React saranno suddivisi in moduli (o "crate" in Rust) con responsabilità specifiche (audio, configurazione, stato, UI, etc.).

## 2. Diagramma di Alto Livello

```
+-------------------------------------------------+
|              Frontend (React + TS)              |
|                                                 |
| +------------------+   +----------------------+ |
| |   UI Componenti  |   | Gestore Stato (Zustand)|
| | (JingleGrid,    |   |                      | |
| |  SettingsDialog) |<->| (Stato UI, Cache)    | |
| +------------------+   +----------------------+ |
|         ^                       |               |
|         | Eventi (es.          | Comandi (es.  |
|         | playback_started)     | play_audio)   |
|         v                       v               |
+-------------------------------------------------+
|                  Tauri API Layer                |
+-------------------------------------------------+
|                Backend (Rust)                   |
|                                                 |
| +------------------+   +----------------------+ |
| |  Gestore Comandi |   |  Core Application    | |
| |  (Tauri Commands)|<->|  (State Machine)     | |
| +------------------+   +----------------------+ |
|         |                       ^               |
|         |                       |               |
|         v                       v               |
| +------------------+   +----------------------+ |
| |   Modulo Audio   |   | Modulo Configurazione| |
| | (Rodio/Cpal)     |<->| (Serde, File System) | |
| +------------------+   +----------------------+ |
|                                                 |
+-------------------------------------------------+
```

## 3. Componenti Dettagliati

### 3.1. Frontend (React + TypeScript)

-   **UI Components:**
    -   Componenti di presentazione puri (stateless) che ricevono dati e callback tramite props.
    -   Esempi: `JingleGrid`, `JingleButton`, `SettingsDialog`, `StatusBar`.
    -   `JingleButton` non conterrà alcuna logica audio. Si limiterà a visualizzare lo stato (colore, progresso) e a invocare comandi (`invoke('play_button', { id: ... })`) al click.
-   **State Management (Zustand):**
    -   Utilizzeremo una libreria di gestione dello stato leggera come **Zustand** (o Redux Toolkit).
    -   Lo store conterrà:
        -   La configurazione dei pulsanti (una cache dello stato del backend).
        -   Lo stato della UI (es. quale modale è aperto).
        -   Lo stato di riproduzione corrente (ID delle tracce attive, in pausa, in coda), sincronizzato tramite eventi dal backend.
-   **Event Listeners:**
    -   Il componente principale `App.tsx` si metterà in ascolto degli eventi provenienti dal backend Rust (es. `appWindow.listen('playback-started', ...)`).
    -   Quando un evento viene ricevuto, aggiornerà lo store di Zustand, causando un re-render reattivo dei componenti interessati.

### 3.2. Backend (Rust)

Il backend sarà strutturato in diversi moduli ("crate" o "mod") per manutenibilità.

-   **Gestore Comandi (`tauri::command`):**
    -   Funzioni Rust esposte al frontend. Saranno il punto di ingresso per tutte le richieste.
    -   Esempi: `#[tauri::command] fn play_audio(id: String, state: State<AppState>)`, `#[tauri::command] fn save_settings(...)`.
    -   Queste funzioni delegheranno il lavoro ai moduli del core.
-   **Core Application (`main_state.rs`):**
    -   Il "cervello" del backend.
    -   Contiene lo **stato centrale dell'applicazione** (`AppState`), gestito tramite un `Mutex` o `RwLock` per garantire la sicurezza tra thread.
    -   Lo stato include: la configurazione completa (`Vec<ButtonConfig>`), le code di riproduzione, i riferimenti alle tracce audio attive, ecc.
    -   Implementa la logica di business principale (la state machine che decide cosa fare quando un pulsante viene premuto).
-   **Modulo Audio (`audio_engine.rs`):**
    -   Responsabile di tutta l'interazione con l'hardware audio.
    -   Utilizzerà una cassa Rust come **`rodio`** (più semplice) o **`cpal`** (più controllo a basso livello) per la riproduzione.
    -   Gestirà più "voci" o "tracce" simultaneamente per permettere overlay e crossfade.
    -   Implementerà la logica per fade-in, fade-out e la gestione del volume.
-   **Modulo Configurazione (`config_manager.rs`):**
    -   Gestirà il caricamento e il salvataggio della configurazione dell'applicazione.
    -   Utilizzerà **`serde`** per serializzare/deserializzare le struct Rust da/a JSON.
    -   Implementerà la logica per la gestione dei percorsi relativi e la migrazione da vecchi formati di configurazione (sia dalla versione Python che da quella web).
-   **Modulo MIDI/Tastiera (`input_manager.rs`):**
    -   Un modulo opzionale da aggiungere in seguito.
    -   Utilizzerà casse come `midir` per ascoltare gli input MIDI e li tradurrà in comandi interni, che verranno poi inviati al Core Application.

## 4. Flusso di un'Azione Utente (Esempio: Click su un Pulsante)

1.  **Utente clicca** sul componente `JingleButton` in React.
2.  Il componente `JingleButton` invoca il suo `onClick` handler, che chiama una funzione proveniente dal componente `App.tsx`.
3.  La funzione in `App.tsx` esegue: `invoke('play_audio', { buttonId: '...' })`.
4.  La **Tauri API** riceve il comando e lo instrada alla funzione Rust `#[tauri::command] fn play_audio(...)`.
5.  La funzione `play_audio` nel **backend Rust**:
    a. Accede allo stato centrale (`AppState`) in modo sicuro.
    b. Applica la logica di business (es. "c'è una traccia principale? devo fare un crossfade? devo accodare?").
    c. Invia i comandi necessari al **Modulo Audio** (es. "riproduci questo file", "sfuma quest'altro").
    d. Modifica lo `AppState` (es. imposta il nuovo `mainTrackId`).
    e. Emette un evento al frontend: `window.emit('playback_started', { buttonId: '...', ... })`.
6.  L'**Event Listener** in `App.tsx` (React) riceve l'evento.
7.  L'handler dell'evento aggiorna lo **store di Zustand**.
8.  Zustand notifica i componenti sottoscritti del cambiamento.
9.  Il componente `JingleButton` (e altri) si ri-renderizza per mostrare il nuovo stato (es. bordo verde, animazione di progresso).
