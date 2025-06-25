# Log di Sviluppo - Advanced Jingle Machine

Questo documento traccia le decisioni chiave e i progressi durante lo sviluppo di Advanced Jingle Machine.

**Autore**: Simone Pizzi (sviluppo sperimentale con LLM)

## Inizio Progetto

*   **Obiettivo:** Creare una Console Audio con interfaccia grafica per la riproduzione di file audio.
*   **Tecnologie Scelte:**
    *   Linguaggio: Python
    *   GUI: PyQt6 (per la sua completezza e buon supporto per temi scuri).
    *   Audio: Pygame.mixer (per la semplicità d'uso nella riproduzione audio).
*   **Requisiti Utente Iniziali:**
    1.  Griglia di pulsanti 8x16 (poi modificata a 8x14, infine 8x11).
    2.  Caricamento file audio standard per pulsante.
    3.  Riproduzione audio interna all'applicazione.
    4.  Visualizzazione/Modifica nome file sul pulsante.
    5.  Impostazione colore per pulsante.
    6.  Volume di riproduzione normalizzato.
    7.  Opzioni per pulsante: loop, continua, da capo.
    8.  Regolazione volume per singolo pulsante.
    9.  Salvataggio e ripristino configurazione all'avvio/chiusura.

## Fase 1: Struttura Base e Interfaccia Iniziale

*   Creato file `requirements.txt` con `PyQt6` e `pygame`.
*   Sviluppato `main.py` con:
    *   Classe `JingleButton(QPushButton)` per gestire le proprietà e azioni di ogni pulsante.
    *   Classe `JingleMachine(QMainWindow)` per la finestra principale.
    *   Classe `ButtonSettingsDialog(QDialog)` per centralizzare le impostazioni dei pulsanti.
    *   Inizializzazione di `pygame.mixer`.
    *   Creazione griglia 8x11 di `JingleButton`.
    *   Implementazione tema scuro base.
    *   Implementazione `save_config()` e `load_config()` per `jingle_config.json`.
    *   Gestione `closeEvent` per salvare la configurazione.
*   Modifiche Utente Iterative:
    *   Riduzione righe griglia a 11.
    *   Titolo finestra: "RUNTIME RADIO".
    *   Dimensioni pulsanti: 200x35.
*   Implementazione menu contestuale per pulsante (Carica Audio, Impostazioni Pulsante, Rimuovi Audio).
*   Indicatore visivo per pulsanti con audio in riproduzione (bordo verde).
*   Aggiunta funzionalità "STOP ALL SOUNDS" (pulsante rosso, senza conferma).
*   Sostituzione di `print` con `QMessageBox` per feedback utente ed errori.
*   Implementazione di tooltip dettagliati per ogni pulsante.
*   Gestione delle opzioni di riproduzione (Loop, Continua, Da Capo) con logica di play/stop/pausa/resume.
*   Memorizzazione e ricalcolo della durata dell'audio (`audio_duration`) al caricamento e dalla configurazione.

## Fase 2: Finalizzazione Progress Bar e Indicatore Fine Traccia

*   **Obiettivo:** Rendere funzionante la progress bar e l'indicatore di fine traccia.
*   **Sviluppo e Debugging:**
    *   Sovrascrittura di `JingleButton.paintEvent` per disegnare la progress bar (sfondo e parte attiva).
    *   Utilizzo di `QTimer` (`playback_check_timer`) per aggiornare `progress_ratio` e forzare il ridisegno.
    *   **Problema Iniziale:** `audio_duration` non veniva caricata correttamente dalla configurazione o non ricalcolata. Corretto in `JingleButton.set_config` dando priorità al ricalcolo dal file.
    *   **Problema Successivo:** `pygame.time.get_ticks()` restituiva `0` in `_check_playback_status`. Risolto aggiungendo `pygame.init()` all'inizio dello script `main.py`.
    *   **Problema Finale:** `self.playback_start_time_ms` veniva resettato a `0` erroneamente subito dopo essere stato impostato nella funzione `play_audio` per la modalità "Da Capo". Corretta la logica di impostazione di `playback_start_time_ms` e `paused_at_ms` per le varie modalità di riproduzione.
    *   Aggiustamenti ai colori e all'altezza della progress bar per renderla più visibile.
    *   Verifica del corretto funzionamento dell'indicatore di fine traccia (lampeggio bordo) basato su `progress_ratio`.
*   **Risultato:** Progress bar e indicatore di fine traccia funzionanti come previsto.
*   Rimosse le istruzioni di `print` usate per il debug.

## Fase 3: Sistema Coda e Priorità Intelligenti

*   **Obiettivo:** Implementare sistema di coda automatico con priorità tra tracce loop e non-loop.
*   **Sviluppo:**
    *   Aggiunta gestione centralizzata della pressione pulsanti in `JingleMachine.handle_button_press()`
    *   Implementazione regole di priorità: tracce non-loop hanno priorità su loop
    *   Sistema di accodamento per tracce non-loop quando altra traccia non-loop è attiva
    *   Colonna effetti speciali (colonna 8) che si sovrappone sempre
    *   Feedback visivo per pulsanti in coda (lampeggio blu/ciano)
*   **Caratteristiche Aggiunte:**
    *   `active_main_track_button` e `queued_main_track_button` in `JingleMachine`
    *   Segnale `playback_finished` per gestione automatica della coda
    *   Stato `is_queued` per `JingleButton`
    *   Lampeggio visivo differenziato per fine traccia vs coda

## Fase 4: Rebranding e Schermata di Benvenuto

*   **Obiettivo:** Trasformare il software da "RUNTIME RADIO" a "Advanced Jingle Machine" con schermata professionale.
*   **Modifiche Sostanziali:**
    *   **Cambio Nome:** Da "RUNTIME RADIO v1.5" a "Advanced Jingle Machine v1.5"
    *   **Nuova Classe:** `WelcomeDialog(QDialog)` per schermata di benvenuto
    *   **Icona Software:** Integrazione di `AJM-free/advjingle.png` con fallback emoji 🎵
    *   **Informazioni Complete:**
        *   Autore: Simone Pizzi
        *   Sviluppo sperimentale con LLM
        *   Software gratuito e liberamente scaricabile
        *   Links per donazioni (paypal.me/runtimeradio)
        *   Sito web (pizzisimone.runtimeradio.it)
*   **Miglioramenti UX:**
    *   Rimozione popup "Configurazione caricata" per avvio più pulito
    *   Schermata modale che deve essere accettata per procedere
    *   Layout responsive con word wrap per testi lunghi
    *   Dimensioni ottimizzate: 700x650px per visualizzazione completa
*   **Gestione Percorsi:**
    *   Percorso icona relativo: `../AJM-free/advjingle.png` per esecuzione da `src/`
    *   Fallback graceful per icona mancante
*   **Flow di Avvio:**
    1. Schermata benvenuto con informazioni
    2. Pulsante "🚀 AVVIA SOFTWARE"
    3. Caricamento applicazione principale
    4. Uscita se schermata chiusa senza accettazione

## Stato Attuale

Il software è ora completamente funzionante come **Advanced Jingle Machine v1.5** con:
- ✅ Sistema coda automatico e priorità intelligenti
- ✅ Schermata di benvenuto professionale
- ✅ Branding completo e informazioni legali
- ✅ Interfaccia utente ottimizzata
- ✅ 88 pulsanti personalizzabili con feedback visivo avanzato
- ✅ 128 canali audio simultanei
- ✅ Persistenza configurazione silente

**Prossimi Sviluppi:** Da definire in base alle esigenze utente.

---
*Log aggiornato per Advanced Jingle Machine v1.5 - Simone Pizzi* 