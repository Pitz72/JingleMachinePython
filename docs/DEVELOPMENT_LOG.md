# Log di Sviluppo - RUNTIME RADIO

Questo documento traccia le decisioni chiave e i progressi durante lo sviluppo di RUNTIME RADIO.

## Inizio Progetto

*   **Obiettivo:** Creare una Jingle Machine con interfaccia grafica per la riproduzione di file audio.
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

---
*Questo log verrà aggiornato man mano che lo sviluppo procede.* 