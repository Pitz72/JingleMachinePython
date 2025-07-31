# Feature List Completa per Runtime Radio 2.0

Questo documento definisce l'elenco completo delle funzionalità per "Runtime Radio 2.0". La lista è una fusione delle migliori caratteristiche dei prototipi esistenti (desktop e web) e dei nuovi miglioramenti proposti per creare un prodotto di livello professionale.

## 1. Gestione dei Pulsanti e della Griglia

-   **Griglia Configurabile:** Griglia di pulsanti (il numero, es. 8x11 o personalizzabile, sarà definito nelle impostazioni).
-   **Caricamento Audio:**
    -   Caricamento di file audio (MP3, WAV, OGG, FLAC) per ogni pulsante.
    -   Supporto per il **Drag and Drop** di file audio direttamente su un pulsante.
-   **Personalizzazione Pulsante (tramite `SettingsDialog`):**
    -   **Nome Personalizzato:** Assegnare un nome visualizzato sul pulsante.
    -   **Colore:** Scegliere un colore di sfondo per il pulsante.
    -   **Volume Specifico:** Regolare il volume di riproduzione (0-100%).
    -   **Modalità di Riproduzione:**
        -   `Restart` (Da Capo): Ferma tutto e parte. Se premuto di nuovo, riparte da capo.
        -   `Continue` (Pausa/Riprendi): Mette in pausa/riprende la traccia.
        -   `Overlay`: Suona in sovrapposizione senza interferire.
        -   `Queue`: Si accoda alla traccia principale.
    -   **Opzioni Aggiuntive:**
        -   `Loop`: Abilita/disabilita la riproduzione continua.
        -   `Crossfade`: Imposta la durata della dissolvenza incrociata in entrata (in ms) quando questo pulsante ne interrompe un altro.
        -   `Fade Out`: Imposta la durata della dissolvenza in uscita (in ms) quando questo pulsante viene fermato.
-   **Copia/Incolla Impostazioni:** Funzionalità nel menu contestuale per copiare e incollare la configurazione da un pulsante all'altro.

## 2. Logica di Riproduzione Audio (Audio Engine)

-   **Motore Audio Performante (Rust):** Bassa latenza e basso consumo di CPU/RAM.
-   **Playback Multi-Canale:** Capacità di riprodurre più suoni contemporaneamente (per `Overlay` e `Crossfade`).
-   **Dissolvenze (Fades):**
    -   **Crossfade:** Transizione morbida tra due tracce principali (`Restart` o `Continue`).
    -   **Fade-in/Fade-out:** Dissolvenza in entrata all'avvio e in uscita all'arresto (configurabile per pulsante).
-   **Regolazione Volume in Tempo Reale:** Le modifiche al volume devono essere applicate istantaneamente, anche durante la riproduzione.
-   **Gruppi di Esclusione (Mute Groups):**
    -   Possibilità di assegnare pulsanti a un "gruppo".
    -   Quando un pulsante di un gruppo viene avviato, tutti gli altri pulsanti dello stesso gruppo vengono fermati (con fade-out, se configurato).
-   **Pulsante Globale "Stop All":** Ferma immediatamente (o con un fade-out globale configurabile) tutti i suoni.

## 3. Gestione della Configurazione e dei Dati

-   **Percorsi Relativi:** Tutti i percorsi dei file audio saranno salvati in modo relativo a una cartella "Media" definita dall'utente, garantendo la portabilità del progetto.
-   **Gestione Profili:**
    -   Possibilità di creare, salvare, caricare ed eliminare più "profili" o "set" di configurazione della griglia.
    -   Un menu a tendina permetterà di passare rapidamente da un profilo all'altro.
-   **Migrazione Automatica:**
    -   Il sistema rileverà automaticamente i file di configurazione dei vecchi prototipi (`jingle_config.json` di Python, `localStorage` della web app).
    -   Proporrà all'utente di importare e convertire la vecchia configurazione nel nuovo formato 2.0.
-   **Storage Robusto:**
    -   **Configurazione (JSON):** I file di profilo `.json` conterranno tutti i metadati dei pulsanti.
    -   **Audio (File System):** L'applicazione non userà più IndexedDB o Base64, ma leggerà i file audio direttamente dal file system per massime prestazioni, come un'applicazione nativa.

## 4. Interfaccia Utente e User Experience (UI/UX)

-   **Tema Scuro Moderno:** Interfaccia pulita e professionale basata su TailwindCSS.
-   **Feedback Visivo Chiaro:**
    -   Indicatori di stato sui pulsanti (bordo colorato per play, pausa, coda).
    -   **Progress Bar** fluida per mostrare l'avanzamento della traccia.
    -   Animazioni per crossfade e fade-out.
-   **Notifiche Non Bloccanti:**
    -   Errori (es. "file non trovato") e informazioni verranno mostrati in una **status bar** o tramite "toast" non invasivi, senza mai bloccare l'interfaccia con popup.
-   **Internazionalizzazione (i18n):**
    -   Supporto per più lingue (italiano, inglese come minimo).
    -   Finestra di dialogo per la selezione della lingua al primo avvio.
-   **Schermata di Benvenuto:** Una modale di benvenuto guiderà i nuovi utenti.

## 5. Integrazioni Esterne

-   **Controllo tramite Tastiera:**
    -   Possibilità di mappare i tasti della tastiera ai pulsanti della griglia per un controllo rapido.
    -   Interfaccia dedicata per la gestione dei mapping.
-   **Controllo tramite Controller MIDI:**
    -   Supporto per controller MIDI generici (es. Akai APC, Novation Launchpad).
    -   Rilevamento automatico dei dispositivi MIDI collegati.
    -   Modalità "Learn" per associare facilmente un pad/pulsante MIDI a un pulsante della griglia.

## 6. Packaging e Distribuzione

-   **Installer Nativo:** L'applicazione sarà distribuita con installer nativi per Windows (.msi), macOS (.dmg) e Linux (.deb/.AppImage).
-   **Aggiornamenti Automatici:** Il framework Tauri include un modulo per gestire gli aggiornamenti automatici, notificando l'utente della disponibilità di una nuova versione e gestendo l'installazione.
