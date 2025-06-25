# Documento Test Anti-Regressione - Advanced Jingle Machine

Questo documento elenca i test da eseguire per verificare che le funzionalità principali di Advanced Jingle Machine continuino a funzionare correttamente dopo ogni modifica significativa al codice.

**Autore**: Simone Pizzi (sviluppo sperimentale con LLM)

## Test Suite

**Ambiente di Test:**
*   OS: (Specificare es. Windows 10, macOS Monterey, Ubuntu 22.04)
*   Python Version: (Specificare es. 3.10.4)
*   PyQt6 Version: (Come da requirements.txt)
*   Pygame Version: (Come da requirements.txt)

**Preparazione:**
*   Assicurarsi che le dipendenze siano installate (`pip install -r requirements.txt`).
*   Eventualmente, cancellare `jingle_config.json` per partire da una configurazione pulita.

### 0. Schermata di Benvenuto e Avvio [NUOVO]

| ID Test | Descrizione                                                                 | Passi                                                                                                | Risultato Atteso                                                                                                                               | Stato   |
| :------ | :-------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------- | :------ |
| TC_WS_001 | Visualizzazione schermata di benvenuto.                                       | 1. Eseguire `python src/main.py`.                                                                      | Appare la schermata di benvenuto "Advanced Jingle Machine v1.5" con icona, informazioni autore, links e pulsante "AVVIA SOFTWARE".          | Pass/Fail |
| TC_WS_002 | Links cliccabili nella schermata di benvenuto.                               | 1. Nella schermata di benvenuto, cliccare sui link PayPal e sito web.                               | I link si aprono nel browser predefinito indirizzando a paypal.me/runtimeradio e pizzisimone.runtimeradio.it.                             | Pass/Fail |
| TC_WS_003 | Avvio applicazione tramite pulsante.                                         | 1. Nella schermata di benvenuto, cliccare "🚀 AVVIA SOFTWARE".                                       | La schermata di benvenuto si chiude e appare la finestra principale "Advanced Jingle Machine v1.5" con griglia 8x11.                      | Pass/Fail |
| TC_WS_004 | Chiusura schermata di benvenuto senza avvio.                                 | 1. Nella schermata di benvenuto, cliccare la X per chiudere la finestra.                            | L'applicazione termina completamente senza aprire la finestra principale.                                                                   | Pass/Fail |
| TC_WS_005 | Icona software visibile.                                                      | 1. Avviare l'applicazione e osservare la schermata di benvenuto e la finestra principale.          | L'icona personalizzata del software è visibile nella barra del titolo di entrambe le finestre e nella taskbar. Se manca, appare emoji 🎵. | Pass/Fail |

### 1. Avvio e Chiusura Applicazione

| ID Test | Descrizione                                                                 | Passi                                                                                                | Risultato Atteso                                                                                                                               | Stato   |
| :------ | :-------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------- | :------ |
| TC_AC_001 | Avvio corretto dell'applicazione principale.                               | 1. Superare la schermata di benvenuto cliccando "AVVIA SOFTWARE".                                   | L'applicazione principale si avvia, la finestra "Advanced Jingle Machine v1.5" appare con la griglia 8x11 di pulsanti. Nessun errore in console. | Pass/Fail |
| TC_AC_002 | Chiusura corretta e salvataggio configurazione silenzioso.                 | 1. Avviare l'app principale.
2. Chiudere l'app tramite il pulsante di chiusura della finestra.    | L'applicazione si chiude. Un file `jingle_config.json` viene creato/aggiornato. Nessun popup di conferma. Nessun errore in console.       | Pass/Fail |
| TC_AC_003 | Caricamento configurazione all'avvio silenzioso (griglia 8x11).           | 1. Configurare alcuni pulsanti.
2. Chiudere l'app.
3. Riavviare l'app.                         | L'applicazione si avvia silenziosamente e ripristina lo stato dei pulsanti. Nessun popup "Configurazione caricata".                      | Pass/Fail |

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
3. Riprodurre, pausare, fermare l'audio.  | Appare un tooltip con: Nome, File, Stato (Pronto/In Riproduzione/In Pausa/In Coda), Opzioni attive, Volume. Il tooltip si aggiorna dinamicamente. | Pass/Fail |
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
| TC_PB_010 | Indicatore Coda (Lampeggio blu/ciano). [NUOVO] | 1. Avviare traccia non-loop A.
2. Premere traccia non-loop B per accodarla.
3. Osservare il pulsante B.
4. Premere B di nuovo per rimuoverlo dalla coda. | 1. Il pulsante B inizia a lampeggiare blu/ciano.
2. B smette di lampeggiare quando esce dalla coda.                    | Pass/Fail |

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
| TC_GF_003 | Feedback Configurazione Solo per Errori. [AGGIORNATO] | 1. Avviare app (senza config), chiudere. Riavviare.
2. Modificare config, chiudere. Riavviare.
3. Cancellare config.json, avviare.  | Appaiono QMessageBox SOLO per "Nessuna configurazione" ed errori. Nessun popup per "Configurazione caricata".                              | Pass/Fail |
| TC_GF_004 | Dialogo "Impostazioni Pulsante" (Salva/Annulla).| 1. Click dx su pulsante -> "Impostazioni Pulsante...".
2. Verificare valori iniziali.
3. Modificare tutto, cliccare OK.
4. Verificare applicazione modifiche.
5. Riaprire, modificare, cliccare Annulla. | Dialogo si apre con valori corretti. Modifiche con OK applicate e persistono. Modifiche con Annulla scartate, stato precedente mantenuto. | Pass/Fail |

### 5. Regole di Riproduzione Avanzate

| ID Test   | Descrizione                                           | Passi                                                                                                                                                                | Risultato Atteso                                                                                                                              | Stato   |
| :-------- | :---------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------- | :------ |
| TC_RP_001 | Riproduzione sovrapposta per colonna effetti.         | 1. Caricare e avviare un audio lungo su un pulsante in una colonna principale (0-6). <br> 2. Mentre il primo audio è in riproduzione, caricare e premere un pulsante nella colonna 7 (effetti). | L'audio della colonna 7 viene riprodotto immediatamente, sovrapponendosi all'audio principale senza interromperlo. L'audio principale continua la sua riproduzione. | Pass/Fail |
| TC_RP_002 | Priorità Non-Loop su Loop.                          | 1. Avviare un audio in modalità "Loop" su un pulsante A (traccia principale). <br> 2. Mentre A è in riproduzione, premere un pulsante B (traccia principale) in modalità "Da Capo". | L'audio del pulsante A si ferma istantaneamente. L'audio del pulsante B inizia a suonare immediatamente.                                          | Pass/Fail |
| TC_RP_003 | Accodamento di traccia Non-Loop.                      | 1. Avviare un audio non-loop (A). <br> 2. Mentre A è in riproduzione, premere un altro pulsante non-loop (B). <br> 3. Premere di nuovo B mentre è in coda. | Al passo 2, A continua a suonare, B inizia a lampeggiare (in coda). <br> Al passo 3, B smette di lampeggiare e viene rimosso dalla coda. | Pass/Fail |
| TC_RP_004 | Riproduzione automatica dalla coda.                   | 1. Avviare un audio non-loop (A). <br> 2. Mentre A è in riproduzione, premere un altro pulsante non-loop (B) per metterlo in coda. <br> 3. Attendere la fine naturale dell'audio A. | Non appena A finisce, l'audio di B inizia a suonare automaticamente. B diventa la nuova traccia attiva.                                    | Pass/Fail |

---
*Documento aggiornato per Advanced Jingle Machine v1.5 - Test suite completa con schermata di benvenuto e funzionalità avanzate.* 