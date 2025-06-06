# Documento Test Anti-Regressione - RUNTIME RADIO

Questo documento elenca i test da eseguire per verificare che le funzionalità principali di RUNTIME RADIO continuino a funzionare correttamente dopo ogni modifica significativa al codice.

## Test Suite

**Ambiente di Test:**
*   OS: (Specificare es. Windows 10, macOS Monterey, Ubuntu 22.04)
*   Python Version: (Specificare es. 3.10.4)
*   PyQt6 Version: (Come da requirements.txt)
*   Pygame Version: (Come da requirements.txt)

**Preparazione:**
*   Assicurarsi che le dipendenze siano installate (`pip install -r requirements.txt`).
*   Eventualmente, cancellare `jingle_config.json` per partire da una configurazione pulita.

### 1. Avvio e Chiusura Applicazione

| ID Test | Descrizione                                                                 | Passi                                                                                                | Risultato Atteso                                                                                                                               | Stato   |
| :------ | :-------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------- | :------ |
| TC_AC_001 | Avvio corretto dell'applicazione.                                              | 1. Eseguire `python main.py`.                                                                          | L'applicazione si avvia, la finestra "RUNTIME RADIO" appare con la griglia 8x11 di pulsanti. Nessun errore in console.                         | Pass/Fail |
| TC_AC_002 | Chiusura corretta e salvataggio configurazione.                               | 1. Avviare l'app.
2. Chiudere l'app tramite il pulsante di chiusura della finestra.          | L'applicazione si chiude. Un file `jingle_config.json` viene creato/aggiornato. Nessun errore in console.                                  | Pass/Fail |
| TC_AC_003 | Caricamento configurazione all'avvio (griglia 8x11).                         | 1. Configurare alcuni pulsanti (assegnare file audio, nomi, colori, opzioni).
2. Chiudere l'app.
3. Riavviare l'app. | L'applicazione si avvia e ripristina lo stato dei pulsanti come configurato precedentemente.                                     | Pass/Fail |

### 2. Funzionalità Pulsanti (Menu Contestuale e Dialogo Impostazioni)

| ID Test | Descrizione                                      | Passi                                                                                                                               | Risultato Atteso                                                                                                                                                                                                                            | Stato   |
| :------ | :----------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | :------ |
| TC_PB_001 | Caricamento Audio tramite Menu.                  | 1. Click destro su un pulsante -> "Carica Audio".
2. Selezionare un file audio valido.
3. Cliccare il pulsante.              | Il file audio viene caricato e riprodotto al click. Il nome del file appare sul pulsante (se non c'è nome custom).                             | Pass/Fail |
| TC_PB_002 | Nome Custom tramite Dialogo Impostazioni.        | 1. Caricare audio.
2. Click destro -> "Impostazioni Pulsante...".
3. Inserire un nome custom, cliccare OK.
4. Osservare il pulsante. | Il pulsante mostra il nome custom. Il tooltip lo riflette.                                                                                     | Pass/Fail |
| TC_PB_003 | Cambio Colore tramite Dialogo Impostazioni.      | 1. Click destro -> "Impostazioni Pulsante...".
2. Scegliere un colore, cliccare OK.
3. Osservare il pulsante.                 | Il pulsante appare con il colore specificato.                                                                                                                                                                                             | Pass/Fail |
| TC_PB_004 | Salvataggio e Ripristino (Audio, Nome, Colore).  | 1. Caricare audio, impostare nome custom e colore.
2. Chiudere e riavviare l'app.
3. Cliccare il pulsante.                     | L'audio viene riprodotto, il nome custom e il colore sono mantenuti.                                                                         | Pass/Fail |
| TC_PB_005 | Rimozione Audio tramite Menu.                    | 1. Caricare audio, impostare nome e colore.
2. Click destro -> "Rimuovi Audio".
3. Chiudere e riavviare l'app.              | Il pulsante torna allo stato di default (testo vuoto, colore #3E3E3E). Audio non riprodotto. Conferma QMessageBox. Configurazione salvata. | Pass/Fail |
| TC_PB_006 | Tooltip su Pulsante Aggiornato.                | 1. Caricare audio, impostare opzioni, volume.
2. Passare il mouse sul pulsante.
3. Riprodurre, pausare, fermare l'audio.  | Appare un tooltip con: Nome, File, Stato (Pronto/In Riproduzione/In Pausa), Opzioni attive, Volume. Il tooltip si aggiorna dinamicamente. | Pass/Fail |
| TC_PB_007 | Indicatore Visivo Riproduzione/Pausa.          | 1. Caricare audio, cliccare per riprodurre.
2. Cliccare di nuovo (se in mod. "Continua" per pausare, o "Da Capo" per stoppare).
3. Riprendere/Riavviare.                                               | 1. Bordo verde appare.
2. Bordo verde scompare.
3. Bordo verde riappare.                                                              | Pass/Fail |
| TC_PB_008 | Progress Bar (Audio non-loop).                 | 1. Caricare audio (non breve, non loop), opzione "Da Capo" o "Continua", avviare riproduzione.
2. Osservare il pulsante.
3. Mettere in pausa (se "Continua"), riprendere.
4. Lasciare finire. | 1. Barra di progresso verde visibile sotto il testo, avanza.
2. Scompare se in pausa/fermo.
3. Si aggiorna. Scompare a fine traccia. | Pass/Fail |
| TC_PB_009 | Indicatore Fine Traccia (Audio non-loop).      | 1. Caricare audio (non breve, non loop), avviare riproduzione.
2. Osservare verso la fine.
3. Lasciare finire o fermare.      | 1. Negli ultimi ~15%, il bordo lampeggia giallo/arancione.
2. Lampeggio cessa e bordo torna normale.                                 | Pass/Fail |

### 3. Opzioni di Riproduzione (Dialogo Impostazioni)

| ID Test | Descrizione                               | Passi                                                                                                                                  | Risultato Atteso                                                                                                                             | Stato   |
| :------ | :---------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------- | :------ |
| TC_RO_001 | Riproduzione in Loop.                     | 1. Caricare audio. Aprire Impostazioni -> selezionare "Loop", OK.
2. Cliccare il pulsante.
3. Cliccare di nuovo.                         | L'audio viene riprodotto continuamente. Secondo click ferma il loop. Progress bar non visibile.                                       | Pass/Fail |
| TC_RO_002 | Volume specifico pulsante (Dialogo).       | 1. Caricare audio. Aprire Impostazioni -> impostare volume a 0.5, OK.
2. Cliccare il pulsante.                                         | L'audio viene riprodotto a volume ridotto.                                                                                                | Pass/Fail |
| TC_RO_003 | Test opzione "Continua" (Pausa/Ripresa).   | 1. Caricare audio. Aprire Impostazioni -> selezionare "Continua", OK.
2. Click: audio parte.
3. Click: audio in pausa (bordo non verde, progress bar ferma).
4. Click: audio riprende (bordo verde, progress bar riprende). | L'audio si comporta come descritto. Stato `is_paused` corretto.                                                                       | Pass/Fail |
| TC_RO_004 | Test opzione "Da Capo" (Play/Stop/Play). | 1. Caricare audio. Aprire Impostazioni -> selezionare "Da Capo", OK.
2. Click: audio parte.
3. Click: audio si ferma.
4. Click: audio riparte da capo.   | L'audio si comporta come Play/Stop/Play da capo. Indicatore visivo e progress bar si aggiornano.                                      | Pass/Fail |
| TC_RO_005 | Mutua Esclusività Opzioni Riproduzione.  | 1. Caricare audio.
2. Aprire Impostazioni: Loop è checkato. Selezionare Continua. OK.
3. Riaprire Impostazioni: Continua è checkato, Loop e Da Capo non lo sono. | Le opzioni radio nel dialogo sono mutuamente esclusive. L'opzione scelta viene applicata.                                         | Pass/Fail |

### 4. Funzionalità Globali

| ID Test | Descrizione                                      | Passi                                                                                                                               | Risultato Atteso                                                                                                                                                                                                                            | Stato   |
| :------ | :----------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | :------ |
| TC_GF_001 | Pulsante "STOP ALL SOUNDS".                   | 1. Avviare la riproduzione di più audio (alcuni in loop, altri con progress bar attiva).
2. Cliccare "STOP ALL SOUNDS".         | Tutti i suoni fermati. Indicatori visivi (bordi, progress bar) resettati. Nessuna QMessageBox.                                                  | Pass/Fail |
| TC_GF_002 | Gestione Errori QMessageBox (File Audio).  | 1. Provare a caricare un file non audio o corrotto tramite "Carica Audio".                                                        | Appare una QMessageBox di errore specifica per il caricamento audio. L'app non crasha.                                                        | Pass/Fail |
| TC_GF_003 | Feedback Salvataggio/Caricamento Config.       | 1. Avviare app (senza config), chiudere. Riavviare.
2. Modificare config, chiudere. Riavviare.
3. Cancellare config.json, avviare.  | Appaiono QMessageBox informative sullo stato del caricamento/salvataggio della configurazione.                                              | Pass/Fail |
| TC_GF_004 | Dialogo "Impostazioni Pulsante" (Salva/Annulla).| 1. Click dx su pulsante -> "Impostazioni Pulsante...".
2. Verificare valori iniziali.
3. Modificare tutto, cliccare OK.
4. Verificare applicazione modifiche.
5. Riaprire, modificare, cliccare Annulla. | Dialogo si apre con valori corretti. Modifiche con OK applicate e persistono. Modifiche con Annulla scartate, stato precedente mantenuto. | Pass/Fail |

---
*Questo documento verrà espanso con nuovi test man mano che le funzionalità vengono aggiunte.* 