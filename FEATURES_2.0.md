# Feature List Completa per Runtime Radio Advanced Jingle Machine v2.0

Questo documento definisce l'elenco completo delle funzionalità per "Runtime Radio Advanced Jingle Machine v2.0". La lista è una fusione delle migliori caratteristiche dei prototipi esistenti e dei nuovi miglioramenti proposti.

## 1. Gestione dei Pulsanti e della Griglia

-   **Griglia 6x8:** Una griglia fissa di 6 colonne per 8 righe (48 pulsanti totali).
-   **Caricamento Audio:**
    -   Caricamento di file audio (MP3, WAV, OGG, FLAC) per ogni pulsante.
    -   Supporto per il **Drag and Drop** di file audio direttamente su un pulsante.
-   **Personalizzazione Pulsante (tramite `SettingsDialog`):**
    -   **Nome Personalizzato:** Assegnare un nome visualizzato sul pulsante.
    -   **Colore:** Scegliere un colore di sfondo per il pulsante.
    -   **Volume Specifico:** Regolare il volume di riproduzione (0-100%).
    -   **Modalità di Riproduzione:** `Restart`, `Continue`, `Overlay`, `Queue`.
    -   **Opzioni Aggiuntive:** `Loop`, `Crossfade`, `Fade Out`.
-   **Copia/Incolla Impostazioni:** Funzionalità nel menu contestuale per copiare e incollare la configurazione.

## 2. Logica di Riproduzione Audio (Audio Engine)

-   **Motore Audio Performante (Rust):** Bassa latenza e basso consumo di CPU/RAM.
-   **Playback Multi-Canale:** Capacità di riprodurre più suoni contemporaneamente.
-   **Dissolvenze (Fades):** Crossfade, Fade-in/Fade-out.
-   **Regolazione Volume in Tempo Reale.**
-   **Gruppi di Esclusione (Mute Groups).**
-   **Pulsante Globale "Stop All".**

## 3. Gestione della Configurazione e dei Dati

-   **Percorsi Relativi:** Salvataggio dei percorsi audio in modo relativo a una cartella "Media" definita dall'utente.
-   **Gestione Profili:** Creare, salvare, caricare ed eliminare più "profili" di configurazione.
-   **Migrazione Automatica:** Rilevamento e conversione delle configurazioni dei vecchi prototipi.
-   **Storage Robusto:** Configurazione in file `.json`, lettura audio diretta dal file system.

## 4. Interfaccia Utente e User Experience (UI/UX)

-   **Tema Scuro Moderno.**
-   **Feedback Visivo Chiaro:** Indicatori di stato, progress bar, animazioni.
-   **Notifiche Non Bloccanti.**
-   **Internazionalizzazione (i18n):**
    -   Supporto per 8 lingue: **Inglese, Italiano, Francese, Tedesco, Portoghese, Spagnolo, Russo, Cinese Semplificato**.
    -   Finestra di dialogo per la selezione della lingua al primo avvio.
-   **Schermata di Benvenuto:** Una modale di benvenuto (`WelcomeDialog`) con il testo ufficiale del progetto.

## 5. Integrazioni Esterne

-   **Controllo tramite Tastiera:** Mapping dei tasti ai pulsanti della griglia.
-   **Controllo tramite Controller MIDI:** Supporto per controller MIDI generici con modalità "Learn".

## 6. Packaging e Distribuzione

-   **Installer Nativo:** `.msi` (Windows), `.dmg` (macOS), `.deb`/`.AppImage` (Linux).
-   **Aggiornamenti Automatici.**
