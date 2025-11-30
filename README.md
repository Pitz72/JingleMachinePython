# 📻 Runtime Radio Live Machine Pro
> *Ex "JingleMachinePython"*

![Version](https://img.shields.io/badge/version-1.3.1-blue.svg)
![Tech](https://img.shields.io/badge/tech-React_19_|_Electron_|_TypeScript-61DAFB.svg)
![Status](https://img.shields.io/badge/status-Production_Ready-success.svg)

**La cartigliera digitale professionale per il broadcast radiofonico e lo streaming live.**

---

## 📖 Introduzione: Che cos'è?

**Runtime Radio Live Machine Pro** è un software di **Cartwall** (cartigliera audio) progettato per registi radiofonici, podcaster e streamer. Permette di riprodurre jingle, effetti sonori, basi e contributi audio istantanei con latenza zero, fondamentale per la diretta.

Nato inizialmente come esperimento in Python (da cui il nome legacy del repository), il progetto si è evoluto in una **Progressive Web App (PWA)** moderna e performante, incapsulata in **Electron** per garantire l'integrazione nativa con il sistema operativo.

### ⚡ Perché è diversa?
A differenza dei player musicali standard, questa "macchina" è ottimizzata per:
*   **Latenza Zero:** Utilizza la Web Audio API per un trigger istantaneo dei suoni.
*   **Affidabilità:** Architettura React 19 robusta con gestione errori avanzata.
*   **Controllo Fisico:** Integrazione MIDI bidirezionale per usare controller hardware reali.

---

## 🛠️ Caratteristiche Principali

### 🎛️ Motore Audio & Interfaccia
*   **88 Pad Programmabili:** Griglia 8x11 completamente personalizzabile.
*   **Gestione Volumi Indipendente:** Volume per singolo pad + Master generale.
*   **Modalità Loop & Fade:** Configurazione granulare per ogni traccia (Loop, Fade-In, Fade-Out).
*   **Drag & Drop:** Caricamento file intuitivo (supporto MP3, WAV, OGG).
*   **Temi Visivi:** Supporto nativo per Dark Mode e temi ad alto contrasto per studi bui.

### 🎹 Integrazione Hardware (Novità v1.3)
Il nuovo **MIDIManager** trasforma l'app in uno strumento fisico:
*   **Plug & Play:** Riconoscimento automatico dei controller MIDI USB.
*   **MIDI Learn:** Assegna qualsiasi pad fisico a un jingle cliccando "Impara MIDI".
*   **Feedback Visivo:** I pad su schermo si illuminano quando premi i tasti fisici.
*   **Controllo Fader:** Usa i fader del tuo controller per gestire il volume Master (CC 7).

### 💻 Tecnologia "Sotto il Cofano"
*   **Core:** React 19 + TypeScript + Vite.
*   **Desktop:** Electron (per build Windows .exe).
*   **Storage:** IndexedDB (via `idb`) per salvare configurazioni e file audio localmente nel browser/app senza database esterni.
*   **Testing:** Suite di test automatizzati con Vitest per prevenire regressioni.

---

## 🚀 Per Iniziare

### Requisiti
*   Node.js (v18 o superiore)
*   npm

### Installazione e Avvio (Sviluppo)

1.  **Clona il repository:**
    ```bash
    git clone https://github.com/Utente/JingleMachinePython.git
    cd JingleMachinePython
    ```

2.  **Installa le dipendenze:**
    ```bash
    npm install
    ```

3.  **Avvia in modalità Web (Browser):**
    ```bash
    npm run dev
    ```
    *L'app sarà accessibile su `http://localhost:5173`*

4.  **Avvia in modalità Desktop (Electron):**
    ```bash
    npm run electron
    ```

---

## 📚 Documentazione Completa

La documentazione dettagliata del progetto è disponibile nella cartella `documentazione`.

*   **[INDICE GENERALE](documentazione/INDICE.md)**: Il punto di partenza per esplorare tutta la documentazione.
*   **[Analisi Strategica](documentazione/ANALISI_STRATEGICA.md)**: Visione del prodotto e roadmap.
---

> **Nota:** Sebbene il repository si chiami `JingleMachinePython`, **non contiene codice Python**. È un'applicazione 100% TypeScript/React. Il nome è mantenuto per continuità storica.