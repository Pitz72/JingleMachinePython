# Architettura di Runtime Radio 2.0 (Python + Eel Edition)

Questo documento descrive l'architettura software per "Runtime Radio 2.0", basata sullo stack **Python (backend) + Eel (bridge) + React (frontend)**.

## 1. Principi Architetturali

-   **Architettura Ibrida:** L'applicazione è un ibrido. Un processo principale Python gestisce tutta la logica di business e l'audio. Questo processo apre una finestra che renderizza un'interfaccia utente costruita con tecnologie web (React).
-   **Comunicazione tramite WebSocket:** La libreria `Eel` crea un canale di comunicazione WebSocket tra il backend Python e il frontend JavaScript. Questo permette una comunicazione bi-direzionale e in tempo reale.
-   **Separazione delle Responsabilità:**
    -   **Backend (Python):** Ha la piena responsabilità della logica core. Gestisce lo stato di riproduzione, l'interazione con il file system, il caricamento/salvataggio dei profili e il controllo del motore audio (`pygame`).
    -   **Frontend (React):** È responsabile al 100% della presentazione. Mostra lo stato dell'applicazione, cattura l'input dell'utente e lo invia al backend. Non contiene alcuna logica di business.

## 2. Diagramma di Alto Livello

```
+-------------------------------------------------+
|              Frontend (React in Web View)       |
|                                                 |
| +------------------+   +----------------------+ |
| |   UI Componenti  |   | Gestore Stato (Zustand)|
| | (JingleGrid,    |   |                      | |
| |  SettingsDialog) |<->| (Stato UI, Cache)    | |
| +------------------+   +----------------------+ |
|         ^                       |               |
|         | Funzioni JS           | Chiamate a    |
|         | esposte a Python      | Funzioni Python
|         v                       v               |
+-------------------------------------------------+
|              Eel WebSocket Bridge               |
+-------------------------------------------------+
|                Backend (Python)                 |
|                                                 |
| +------------------+   +----------------------+ |
| | Funzioni esposte |   |  Core Application    | |
| | a JS (@eel.expose)|<->|  (State Machine)     | |
| +------------------+   +----------------------+ |
|         |                       ^               |
|         |                       |               |
|         v                       v               |
| +------------------+   +----------------------+ |
| |   Motore Audio   |   | Gestore Configurazione| |
| | (Pygame)         |<->| (JSON, File System)  | |
| +------------------+   +----------------------+ |
|                                                 |
+-------------------------------------------------+
```

## 3. Componenti Dettagliati

### 3.1. Backend (Python)

-   **`app.py` (Entry Point):**
    -   Il file principale che inizializza `Eel`.
    -   Inizializza le classi del core (es. `AudioEngine`, `ConfigManager`).
    -   Definisce le funzioni che saranno "esposte" al JavaScript tramite il decoratore `@eel.expose`.
    -   Avvia la finestra principale con `eel.start()`.
-   **`audio_engine.py`:**
    -   Una classe che incapsula tutta la logica di `pygame.mixer`.
    -   Gestirà la riproduzione, la pausa, lo stop, il volume e le dissolvenze.
    -   Manterrà uno stato dei canali audio occupati.
-   **`config_manager.py`:**
    -   Una classe responsabile del caricamento e salvataggio dei file di profilo `.json`.
    -   Gestirà la logica dei percorsi relativi.
-   **Funzioni Esposte (`@eel.expose`):**
    -   Saranno le porte di accesso del backend. Esempi:
        -   `@eel.expose\ndef load_profile(): ...`
        -   `@eel.expose\ndef play_button(button_id): ...`
        -   `@eel.expose\ndef save_button_settings(button_id, new_config): ...`

### 3.2. Frontend (React)

-   **Comunicazione con Python:**
    -   `Eel` espone un oggetto `eel` globale nel JavaScript. Per chiamare una funzione Python, si usa `eel.nome_funzione(arg1, arg2)(callback_opzionale)`.
    -   Esempio: `eel.play_button('btn_1')`
-   **Aggiornamenti dal Backend:**
    -   Python può chiamare funzioni JavaScript esposte. Creeremo una funzione globale in React (es. `update_ui(new_state)`) e la esporremo a Eel.
    -   Python chiamerà `eel.update_ui(nuovo_stato)` ogni volta che lo stato di riproduzione cambia. Questa funzione aggiornerà lo store di Zustand, che a sua volta aggiornerà l'interfaccia.
-   **Struttura Componenti:**
    -   La struttura dei componenti React (`App.tsx`, `JingleGrid.tsx`, etc.) rimane identica a quella progettata per la versione Tauri. La differenza è *come* comunicano con il backend (chiamate `eel` invece di `invoke`).

## 4. Flusso di un'Azione Utente (Esempio: Click su un Pulsante)

1.  **Utente clicca** sul componente `JingleButton` in React.
2.  L'handler `onClick` del pulsante esegue la chiamata: `eel.play_button(config.id)`.
3.  Il **bridge di Eel** riceve la chiamata e la inoltra alla funzione Python `play_button(button_id)` decorata con `@eel.expose`.
4.  La funzione **`play_button` in Python**:
    a. Esegue la logica di business (decide cosa fermare, cosa accodare, etc.).
    b. Chiama il `AudioEngine` per riprodurre fisicamente il suono.
    c. Modifica lo stato interno dell'applicazione.
    d. Prepara un dizionario con il nuovo stato della UI.
    e. Chiama la funzione JavaScript per notificare il frontend: `eel.update_playback_status(nuovo_stato)`.
5.  La funzione **`update_playback_status` in JavaScript** riceve i dati.
6.  Questa funzione aggiorna lo **store di Zustand**.
7.  I componenti React si ri-renderizzano per mostrare il nuovo stato (es. bordo del pulsante che diventa verde).
