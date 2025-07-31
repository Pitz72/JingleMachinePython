# Valutazione dello Stack Tecnologico per Runtime Radio 2.0 (Revisione)

Questo documento descrive la scelta tecnologica definitiva per lo sviluppo di "Runtime Radio 2.0", a seguito di una fase di sperimentazione e di una rivalutazione strategica.

## 1. Contesto e Decisione Strategica

Inizialmente, per puntare alla massima qualità tecnica, era stato scelto un approccio basato su **Tauri e Rust**. Questa scelta si è però scontrata con una notevole complessità legata alla configurazione dell'ambiente di compilazione (toolchain C++/Rust, dipendenze specifiche per OS), che ha bloccato lo sviluppo.

Si è quindi deciso di fare un **passo indietro strategico** per privilegiare la **praticità, la velocità di sviluppo e la manutenibilità**, senza sacrificare le funzionalità del prodotto finale.

La nuova architettura si basa sul principio di **unire le tecnologie che già conosciamo e padroneggiamo**.

## 2. Stack Tecnologico Scelto: Python + Eel + React

Lo stack definitivo è una soluzione ibrida che sfrutta il meglio di entrambi i mondi (desktop e web):

-   **Backend: Python 3**
    -   **Motivazione:** Il prototipo originale era in Python e la sua logica audio con `pygame` è solida e performante per le nostre necessità. È un ambiente di sviluppo rapido e che già padroneggiamo. Tutta la logica pesante (gestione file, stato di riproduzione, code) risiederà qui.
    -   **Librerie Chiave:** `pygame` per l'audio, `Eel` per la comunicazione con il frontend.

-   **Frontend: React**
    -   **Motivazione:** Permette di creare un'interfaccia utente moderna, reattiva e complessa in modo molto più efficiente rispetto a framework GUI tradizionali come PyQt. Possiamo riutilizzare tutta la progettazione e la logica del prototipo web.
    -   **Librerie Chiave:** `React`, `Vite` come build tool, `TailwindCSS` per lo stile.

-   **Il Ponte (Bridge): Eel**
    -   **Motivazione:** `Eel` è una libreria Python minimalista che semplifica drasticamente la creazione di app ibride. Fa due cose fondamentali:
        1.  Avvia un web server locale per servire l'interfaccia React.
        2.  Crea un canale di comunicazione bi-direzionale che permette al JavaScript di chiamare funzioni Python e viceversa, in modo quasi trasparente.
    -   **Vantaggio:** Elimina completamente la necessità di compilatori C++/Rust e le complesse configurazioni di build di Tauri.

## 3. Vantaggi di Questo Approccio

-   **Semplicità:** L'ambiente di sviluppo richiede solo Python e Node.js, che sono già stati configurati.
-   **Velocità:** Lo sviluppo è estremamente rapido, permettendoci di concentrarci sulle funzionalità invece che sulla configurazione.
-   **Robustezza:** L'architettura è solida. La logica core è gestita da un linguaggio maturo come Python, mentre l'interfaccia beneficia della modernità di React.
-   **Manutenibilità:** Il codice è nettamente separato tra backend (Python) e frontend (React), rendendo facili gli aggiornamenti futuri.
-   **Prodotto Finale:** L'applicazione viene comunque pacchettizzata come un eseguibile desktop nativo (tramite `pyinstaller` o strumenti simili abbinati a Eel), quindi l'esperienza per l'utente finale non cambia.

Questa scelta rappresenta il miglior compromesso tra ambizione tecnologica e realizzabilità pratica, garantendo di poter arrivare a un prodotto finito, stabile e di alta qualità nei tempi previsti.
