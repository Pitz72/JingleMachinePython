# Architettura Software - RUNTIME RADIO v1.5

Questo documento descrive le componenti principali dell'applicazione **RUNTIME RADIO v1.5** - Jingle Machine professionale con sistema di coda automatico e priorità intelligenti.

## Panoramica

L'applicazione è costruita attorno a tre classi principali che interagiscono tra loro:
- `JingleMachine(QMainWindow)`: La finestra principale e orchestratore.
- `JingleButton(QPushButton)`: Il componente atomico della griglia, che gestisce un singolo jingle.
- `ButtonSettingsDialog(QDialog)`: La finestra di dialogo per modificare le impostazioni di un `JingleButton`.

## Diagramma di Interazione (Semplificato)

```
[Utente] -> Clicca/Click Destro su [JingleButton]
[JingleButton] -> Gestisce l'evento
    - Click: Chiama `play_audio()`
    - Click Destro: Apre `QMenu`
[JingleButton] -> `play_audio()` -> Interagisce con [pygame.mixer] per riprodurre/fermare/mettere in pausa il suono.
[JingleButton] -> Apre [ButtonSettingsDialog] per modificare le sue proprietà.
[JingleMachine] -> Gestisce la griglia di [JingleButton] e le azioni globali (es. "STOP ALL SOUNDS").
[JingleMachine] -> Salva/Carica la configurazione di tutti i [JingleButton] da/verso `jingle_config.json`.
```

## Dettaglio Classi

### `JingleMachine(QMainWindow)`
- **Responsabilità:**
  - Inizializzare la finestra principale dell'applicazione (1700x550px, tema scuro)
  - Creare e gestire la griglia 8x11 (88 pulsanti totali) di `JingleButton`
  - Inizializzare il sistema audio Pygame con 128 canali simultanei
  - Fornire il pulsante globale "STOP ALL SOUNDS" per fermare tutti i suoni
  - Coordinare il salvataggio/caricamento della configurazione generale
  - Gestire la chiusura pulita dell'applicazione
- **Proprietà Chiave:**
  - `active_main_track_button (JingleButton | None)`: Mantiene un riferimento al pulsante della traccia principale attualmente in riproduzione
  - `queued_main_track_button (JingleButton | None)`: Mantiene un riferimento al pulsante in coda, in attesa di essere riprodotto
- **Metodi Chiave:**
  - `__init__()`: Inizializza PyGame mixer, crea il layout verticale con pulsante STOP ALL e griglia di pulsanti, applica il tema scuro, carica la configurazione esistente
  - `handle_button_press()`: Metodo centrale che gestisce la pressione di un pulsante. Contiene tutta la logica di priorità (Non-Loop vs Loop) e di accodamento
  - `stop_all_sounds()`: Itera su tutti i pulsanti della griglia, ferma ogni suono attivo, resetta gli indicatori visivi e lo stato di riproduzione
  - `save_config()`: Serializza la configurazione di tutti i pulsanti in formato JSON nel file `jingle_config.json`
  - `load_config()`: Deserializza la configurazione dal file JSON e applica le impostazioni a ogni pulsante
  - `on_playback_finished(button)`: Slot che riceve il segnale `playback_finished`. Controlla se c'è un brano in coda e, in caso affermativo, lo avvia
  - `closeEvent()`: Gestisce la chiusura dell'applicazione salvando automaticamente la configurazione e terminando PyGame

### `JingleButton(QPushButton)`
- **Responsabilità:**
  - Rappresentare un singolo jingle audio con stato completo e autonomo
  - Gestire tre modalità di riproduzione: Loop (continuo), Continua (pausa/riprendi), Da Capo (stop/restart)
  - Visualizzare feedback visivo avanzato: colori personalizzati, bordi colorati per stato, progress bar in tempo reale, lampeggio per fine traccia
  - Gestire il proprio menu contestuale per caricamento audio e impostazioni
  - Mantenere e sincronizzare il proprio stato interno con la configurazione
  - Calcolare e visualizzare il progresso di riproduzione per tracce non-loop
- **Proprietà Chiave:**
  - `audio_file`: Percorso del file audio caricato
  - `custom_name`: Nome personalizzato del pulsante (sovrascrive il nome del file)
  - `loop`, `continue_playback`, `play_from_start`: Modalità di riproduzione mutuamente esclusive
  - `volume`: Volume specifico del pulsante (0.0-1.0)
  - `color`, `original_color`: Colori personalizzati del pulsante
  - `audio_duration`: Durata totale dell'audio in secondi
  - `progress_ratio`: Rapporto di progresso per la progress bar (0.0-1.0)
  - `current_sound_channel`: Riferimento al canale Pygame attivo
  - `is_playing_visual_indicator`, `is_paused`: Stati per il feedback visivo
  - `playback_start_time_ms`, `paused_at_ms`: Timestamp per calcolo preciso del progresso
  - `is_overlay_effect`: Se `True`, il pulsante appartiene alla colonna degli effetti speciali e la sua riproduzione si sovrappone alle altre
  - `is_queued (bool)`: Se `True`, il pulsante è in coda e in attesa di essere riprodotto
- **Metodi Chiave:**
  - `play_audio()`: Logica complessa che gestisce play/pausa/stop basata sulla modalità selezionata, gestisce i canali Pygame, calcola i timestamp per il progresso
  - `stop_audio()`: Ferma forzatamente la riproduzione e resetta lo stato visivo del pulsante
  - `paintEvent()`: Sovrascrive l'evento di disegno per renderizzare la progress bar verde con sfondo semi-trasparente quando appropriato
  - `_check_playback_status()`: Callback del QTimer (50ms) che aggiorna il progresso di riproduzione, gestisce gli indicatori visivi e controlla lo stato dei canali audio
  - `contextMenuEvent()`: Gestisce il menu contestuale con opzioni "Carica Audio", "Impostazioni Pulsante", "Rimuovi Audio"
  - `get_config()` / `set_config()`: Serializzazione/deserializzazione completa dello stato del pulsante, inclusa gestione retrocompatibilità
  - `_update_style()`: Aggiorna dinamicamente l'aspetto del pulsante basato sullo stato (bordo verde per riproduzione, lampeggio giallo/arancione per fine traccia)
  - `update_tooltip()`: Genera tooltip dinamici con informazioni dettagliate su nome, file, stato, opzioni e volume
  - `enforce_playback_option_exclusivity()`: Garantisce che solo una modalità di riproduzione sia attiva, con fallback sicuro a "Da Capo"

#### Segnali
- `playback_finished(object)`: Emesso quando la riproduzione di un suono termina naturalmente. Trasmette un riferimento al pulsante stesso

### `ButtonSettingsDialog(QDialog)`
- **Responsabilità:**
  - Fornire un'interfaccia grafica centralizzata per modificare tutte le impostazioni di un `JingleButton`
  - Organizzare le opzioni in gruppi logici: Nome, Colore, Volume, Modalità di Riproduzione
  - Validare l'input utente e garantire la coerenza delle impostazioni
  - Calcolare automaticamente colori di testo contrastanti per l'anteprima colore
  - Gestire la mutua esclusività delle opzioni di riproduzione tramite RadioButton
- **Metodi Chiave:**
  - `__init__(button_data, parent)`: Popola il dialogo con le impostazioni correnti del pulsante, crea i gruppi di controlli (QGroupBox), configura i RadioButton per le modalità di riproduzione
  - `get_settings()`: Restituisce un dizionario con tutte le nuove impostazioni selezionate dall'utente
  - `_choose_color()`: Apre il QColorDialog e aggiorna l'anteprima del colore selezionato
  - `_update_color_label()`: Aggiorna l'etichetta di anteprima colore con background e testo contrastante
  - `_get_contrasting_text_color()`: Calcola automaticamente il colore del testo (nero/bianco) basato sulla luminanza del background

## Flusso di Dati e Persistenza

### Configurazione (`jingle_config.json`)
- **Struttura**: Array bidimensionale 11x8 che rispecchia la griglia di pulsanti
- **Contenuto per pulsante**: `audio_file`, `custom_name`, modalità di riproduzione, `volume`, `color`, `audio_duration`, `paused_at_ms`
- **Gestione Errori**: Try-catch per IO e JSON malformato con QMessageBox informativi
- **Retrocompatibilità**: Validazione della struttura (11x8) e gestione graceful di configurazioni incomplete

### Sistema Audio
- **Engine**: Pygame Mixer con 128 canali simultanei
- **Gestione Canali**: Ogni `JingleButton` mantiene il proprio `current_sound_channel`
- **Calcolo Progresso**: Basato su `pygame.time.get_ticks()` per precisione temporale
- **Cleanup**: Stop automatico su rimozione audio e chiusura applicazione

## Pattern Architetturali Utilizzati

1. **Component Pattern**: Ogni `JingleButton` è un componente autonomo e riusabile
2. **Observer Pattern**: QTimer per aggiornamenti periodici dello stato audio
3. **State Pattern**: Gestione esplicita degli stati di riproduzione (playing/paused/stopped)
4. **MVC Variants**: `JingleMachine` come controller, `JingleButton` come model+view, `ButtonSettingsDialog` come view specializzata
5. **Serialization Pattern**: Metodi `get_config()`/`set_config()` per persistenza dello stato 