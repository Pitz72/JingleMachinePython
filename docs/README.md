# Advanced Jingle Machine - Console Audio Professionale

Advanced Jingle Machine è un'applicazione desktop per la gestione e la riproduzione di jingle audio, pensata per un utilizzo semplice e intuitivo durante dirette radiofoniche, podcast o streaming.

**Autore**: Simone Pizzi  
**Sviluppo**: Sperimentale con LLM  
**Website**: [pizzisimone.runtimeradio.it](https://pizzisimone.runtimeradio.it)

## Funzionalità Principali

*   **Schermata di Benvenuto:** All'avvio, il software mostra una schermata professionale con informazioni complete su autore, licenza e donazioni.
*   **Griglia Personalizzabile:** Interfaccia con una griglia di pulsanti (8 colonne x 11 righe = 88 pulsanti totali).
*   **Caricamento Audio:** Ogni pulsante può caricare file audio nei formati più comuni (mp3, wav, ogg, ecc.) tramite un menu contestuale (click destro sul pulsante).
*   **Riproduzione Istantanea:** Cliccando un pulsante, il file audio associato viene riprodotto immediatamente.
*   **Visualizzazione Nome:** I pulsanti mostrano il nome del file audio caricato o un nome personalizzato.
*   **Personalizzazione Pulsante:** Tramite un menu contestuale (click destro) si accede a "Impostazioni Pulsante..." che permette di:
    *   Impostare un **nome personalizzato**.
    *   Scegliere un **colore diverso** per il pulsante.
    *   Regolare il **volume specifico** del pulsante (da 0.0 a 1.0).
    *   Selezionare **opzioni di riproduzione** esclusive:
        *   **Loop:** Riproduzione continua. Click per avviare, click successivo per fermare.
        *   **Continua:** Click per avviare/riprendere, click successivo per mettere in pausa.
        *   **Da Capo (Default):** Click per avviare da inizio, click successivo per fermare. Un ulteriore click riavvia da capo.
*   **Sistema Coda Automatico:** Gestione intelligente delle priorità di riproduzione con accodamento automatico.
*   **Colonna Effetti Speciali:** La colonna 8 (ultima) è dedicata agli effetti che si sovrappongono sempre alle altre tracce.
*   **Rimozione Audio:** Dal menu contestuale è possibile rimuovere un file audio da un pulsante, resettandolo.
*   **Feedback Visivo:**
    *   **In Riproduzione:** Bordo del pulsante diventa verde.
    *   **In Pausa:** Il bordo verde scompare.
    *   **In Coda:** Lampeggio blu/ciano per indicare l'accodamento.
    *   **Progress Bar Audio:** Una barra di progresso orizzontale (sotto il testo del pulsante) mostra l'avanzamento della traccia audio (visibile solo se in play, non in pausa e non in loop).
    *   **Indicatore Fine Traccia:** Il bordo del pulsante lampeggia (giallo/arancione) quando una traccia audio (non in loop) è negli ultimi secondi della sua durata (circa 15%).
*   **Tooltip Dettagliati:** Passando il mouse su un pulsante vengono mostrate informazioni su nome, file, stato (Pronto, In Riproduzione, In Pausa), opzioni attive e volume.
*   **Stop Tutti i Suoni:** Un pulsante rosso "STOP ALL SOUNDS" in cima all'interfaccia permette di fermare immediatamente tutte le riproduzioni audio attive.
*   **Salvataggio Configurazione:** Lo stato dell'applicazione (file caricati, nomi, colori, volumi, opzioni di riproduzione) viene salvato automaticamente alla chiusura e ricaricato all'avvio da `jingle_config.json`.
*   **Tema Scuro:** L'applicazione utilizza un tema scuro professionale per l'interfaccia.
*   **Icona Personalizzata:** Il software include un'icona professionale visibile nella finestra e nella taskbar.

## Tecnologie Utilizzate

*   **Python:** Linguaggio di programmazione principale (versione 3.8+).
*   **PyQt6:** Libreria per l'interfaccia grafica.
*   **Pygame:** Libreria per la gestione e riproduzione dell'audio (128 canali simultanei).

## Installazione

1.  Assicurarsi di avere Python 3.8+ installato.
2.  Clonare il repository o scaricare i file del progetto.
3.  Aprire un terminale nella directory del progetto.
4.  Installare le dipendenze con il comando:
    ```bash
    pip install -r requirements.txt
    ```

## Avvio

Per avviare l'applicazione, eseguire il seguente comando dalla directory del progetto:

```bash
python src/main.py
```

## Struttura del Progetto

*   `src/main.py`: File principale dell'applicazione, contiene la logica dell'interfaccia (classi `WelcomeDialog`, `JingleMachine`, `JingleButton`, `ButtonSettingsDialog`) e la gestione degli eventi.
*   `AJM-free/advjingle.png`: Icona ufficiale del software.
*   `requirements.txt`: Elenca le dipendenze Python del progetto (`PyQt6`, `pygame`).
*   `jingle_config.json`: File generato automaticamente per salvare la configurazione dei pulsanti.
*   `README.md`: File principale di documentazione.
*   `docs/`: Cartella contenente tutta la documentazione tecnica.
*   `RUNTIME_RADIO_v1.5_Distribution/`: Versione pronta per la distribuzione con guide specifiche per ogni sistema operativo.

## Software Gratuito e Donazioni

Advanced Jingle Machine è **completamente gratuito** e liberamente scaricabile. Anche se sviluppato mediante l'uso massiccio di LLM, ha comunque richiesto ingegno, impegno e ore di lavoro.

Se trovi utile questo software, considera l'ipotesi di fare una donazione su [paypal.me/runtimeradio](https://paypal.me/runtimeradio).

Visita il sito web ufficiale: [pizzisimone.runtimeradio.it](https://pizzisimone.runtimeradio.it) 