# Architettura Software - Advanced Jingle Machine v1.5

Questo documento descrive le componenti principali dell'applicazione **Advanced Jingle Machine v1.5** - Console audio professionale con sistema di coda automatico, priorità intelligenti e schermata di benvenuto.

**Autore**: Simone Pizzi (sviluppo sperimentale con LLM)

## Panoramica

L'applicazione è costruita attorno a quattro classi principali che interagiscono tra loro:
- `WelcomeDialog(QDialog)`: La schermata di benvenuto iniziale.
- `JingleMachine(QMainWindow)`: La finestra principale e orchestratore.
- `JingleButton(QPushButton)`: Il componente atomico della griglia, che gestisce un singolo jingle.
- `ButtonSettingsDialog(QDialog)`: La finestra di dialogo per modificare le impostazioni di un `JingleButton`.

## Diagramma di Interazione (Aggiornato)

```
[Utente] -> Avvio Applicazione
    -> [WelcomeDialog] -> Mostra informazioni autore, licenza, donazioni
        -> Pulsante "AVVIA SOFTWARE"
            -> [JingleMachine] -> Finestra principale
                -> Griglia 8x11 [JingleButton]
                    -> Click: Gestisce priorità e coda
                    -> Click Destro: Apre [ButtonSettingsDialog]
                -> Interazione con [pygame.mixer] (128 canali)
                -> Salvataggio in [jingle_config.json]
```

## Dettaglio Classi

### `WelcomeDialog(QDialog)` **[NUOVA]**
- **Responsabilità:**
  - Mostrare la schermata di benvenuto all'avvio dell'applicazione
  - Visualizzare informazioni complete su autore, versione e licenza
  - Fornire links cliccabili per donazioni e sito web
  - Gestire l'icona del software e l'interfaccia professionale
  - Permettere l'avvio del software principale tramite pulsante dedicato
- **Proprietà Chiave:**
  - `icon_path`: Percorso dell'icona del software (`../AJM-free/advjingle.png`)
  - Dimensioni finestra: 700x650 pixel per ottimale visualizzazione
- **Metodi Chiave:**
  - `__init__()`: Inizializza la schermata con layout verticale, carica l'icona, configura tutti i widget informativi
  - Layout responsive con word wrap per testo lungo
  - Gestione fallback emoji 🎵 se l'icona non è disponibile
- **Caratteristiche:**
  - **Tema scuro** coerente con l'applicazione principale
  - **Links esterni** per PayPal (paypal.me/runtimeradio) e sito web (pizzisimone.runtimeradio.it)
  - **Finestra modale** che deve essere accettata per procedere
  - **Pulsante styled** con effetti hover per l'avvio

### `JingleMachine(QMainWindow)` **[AGGIORNATA]**
- **Responsabilità:**
  - Inizializzare la finestra principale dell'applicazione (1700x550px, tema scuro)
  - **Gestire l'icona del software** nella finestra principale e taskbar
  - Creare e gestire la griglia 8x11 (88 pulsanti totali) di `JingleButton`
  - Inizializzare il sistema audio Pygame con 128 canali simultanei
  - Fornire il pulsante globale "STOP ALL SOUNDS" per fermare tutti i suoni
  - Coordinare il salvataggio/caricamento della configurazione generale (**senza messaggi popup**)
  - Gestire la chiusura pulita dell'applicazione
- **Proprietà Chiave:**
  - `active_main_track_button (JingleButton | None)`: Mantiene un riferimento al pulsante della traccia principale attualmente in riproduzione
  - `queued_main_track_button (JingleButton | None)`: Mantiene un riferimento al pulsante in coda, in attesa di essere riprodotto
  - **Nome finestra**: "Advanced Jingle Machine v1.5"
  - **Icona**: Caricata da `../AJM-free/advjingle.png` con fallback sicuro
- **Metodi Chiave:**
  - `__init__()`: Inizializza PyGame mixer, **imposta icona**, crea il layout verticale con pulsante STOP ALL e griglia di pulsanti, applica il tema scuro, carica la configurazione **silenziosamente**
  - `handle_button_press()`: Metodo centrale che gestisce la pressione di un pulsante. Contiene tutta la logica di priorità (Non-Loop vs Loop) e di accodamento
  - `stop_all_sounds()`: Itera su tutti i pulsanti della griglia, ferma ogni suono attivo, resetta gli indicatori visivi e lo stato di riproduzione
  - `save_config()`: Serializza la configurazione di tutti i pulsanti in formato JSON nel file `jingle_config.json`
  - `load_config()`: Deserializza la configurazione dal file JSON e applica le impostazioni a ogni pulsante **senza messaggi popup**
  - `on_playback_finished(button)`: Slot che riceve il segnale `playback_finished`. Controlla se c'è un brano in coda e, in caso affermativo, lo avvia
  - `closeEvent()`: Gestisce la chiusura dell'applicazione salvando automaticamente la configurazione e terminando PyGame

### `JingleButton(QPushButton)` **[INVARIATA]**
- **Responsabilità:**
  - Rappresentare un singolo jingle audio con stato completo e autonomo
  - Gestire tre modalità di riproduzione: Loop (continuo), Continua (pausa/riprendi), Da Capo (stop/restart)
  - Visualizzare feedback visivo avanzato: colori personalizzati, bordi colorati per stato, progress bar in tempo reale, lampeggio per fine traccia e coda
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
  - `is_queued (bool)`: Se `True`, il pulsante è in coda e in attesa di essere riprodotto (**con lampeggio blu/ciano**)

### `ButtonSettingsDialog(QDialog)` **[INVARIATA]**
- **Responsabilità:**
  - Fornire un'interfaccia grafica centralizzata per modificare tutte le impostazioni di un `JingleButton`
  - Organizzare le opzioni in gruppi logici: Nome, Colore, Volume, Modalità di Riproduzione
  - Validare l'input utente e garantire la coerenza delle impostazioni
  - Calcolare automaticamente colori di testo contrastanti per l'anteprima colore
  - Gestire la mutua esclusività delle opzioni di riproduzione tramite RadioButton

## Flusso di Avvio (Aggiornato)

1. **Inizializzazione Pygame**: `pygame.init()` per tutti i moduli
2. **Creazione QApplication**: Inizializzazione dell'interfaccia Qt
3. **Schermata di Benvenuto**: 
   - Creazione e visualizzazione `WelcomeDialog`
   - Caricamento icona software
   - Attesa input utente (AVVIA SOFTWARE)
4. **Applicazione Principale**:
   - Se accettato: creazione `JingleMachine`
   - Caricamento configurazione silenzioso
   - Visualizzazione finestra principale
   - Avvio event loop Qt
5. **Uscita Alternativa**: Se schermata chiusa senza accettazione, terminazione immediata

## Flusso di Dati e Persistenza

### Configurazione (`jingle_config.json`)
- **Struttura**: Array bidimensionale 11x8 che rispecchia la griglia di pulsanti
- **Contenuto per pulsante**: `audio_file`, `custom_name`, modalità di riproduzione, `volume`, `color`, `audio_duration`, `paused_at_ms`
- **Gestione Errori**: Try-catch per IO e JSON malformato con QMessageBox informativi
- **Retrocompatibilità**: Validazione della struttura (11x8) e gestione graceful di configurazioni incomplete
- **Caricamento Silenzioso**: Nessun popup di conferma all'avvio

### Sistema Audio
- **Engine**: Pygame Mixer con 128 canali simultanei
- **Gestione Canali**: Ogni `JingleButton` mantiene il proprio `current_sound_channel`
- **Calcolo Progresso**: Basato su `pygame.time.get_ticks()` per precisione temporale
- **Cleanup**: Stop automatico su rimozione audio e chiusura applicazione

### Gestione Icone
- **Percorso relativo**: `../AJM-free/advjingle.png` per esecuzione da directory `src/`
- **Fallback graceful**: Emoji 🎵 se l'icona non è disponibile
- **Applicazione multipla**: Icona su schermata benvenuto E finestra principale

## Pattern Architetturali Utilizzati

1. **Component Pattern**: Ogni `JingleButton` è un componente autonomo e riusabile
2. **Observer Pattern**: QTimer per aggiornamenti periodici dello stato audio
3. **State Pattern**: Gestione esplicita degli stati di riproduzione (playing/paused/stopped/queued)
4. **MVC Variants**: `JingleMachine` come controller, `JingleButton` come model+view, dialoghi come view specializzate
5. **Serialization Pattern**: Metodi `get_config()`/`set_config()` per persistenza dello stato
6. **Welcome Screen Pattern**: `WelcomeDialog` per onboarding e informazioni legali/commerciali
7. **Modal Dialog Pattern**: Schermata bloccante per flow di avvio controllato

## Informazioni di Branding

- **Nome Software**: Advanced Jingle Machine
- **Versione**: 1.5
- **Autore**: Simone Pizzi
- **Metodologia**: Sviluppo sperimentale con LLM
- **Licenza**: Software gratuito
- **Donazioni**: paypal.me/runtimeradio
- **Website**: pizzisimone.runtimeradio.it
- **Icona**: AJM-free/advjingle.png 