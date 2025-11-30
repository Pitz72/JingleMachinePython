# Analisi Strategica: Runtime Radio Live Machine Pro

## 1. Valutazione del Framework (React vs Altri)
**Domanda:** React è adatto per un'applicazione audio professionale "Pro"?
**Risposta:** **Sì, con riserve gestibili.**

*   **Perché Sì:**
    *   **Interfaccia Reattiva:** React 19 è eccellente per gestire lo stato complesso di 88 pulsanti, volumi e impostazioni in tempo reale.
    *   **Web Audio API:** Il motore audio non è "React", ma la Web Audio API del browser, che è scritta in C++ e altamente ottimizzata. React agisce solo come "telecomando".
    *   **Portabilità:** Il codice attuale può girare su Web, Windows, Mac e Linux senza modifiche sostanziali.
*   **Alternative (C++/JUCE, C#):** Offrirebbero latenza leggermente inferiore (millisecondi) e accesso diretto ai driver ASIO, ma richiederebbero una **riscrittura totale** (mesi di lavoro).
*   **Verdetto:** Per una "Jingle Machine" (non una DAW completa per registrazione multitraccia), **React + Electron** è la scelta strategica migliore per bilanciare prestazioni e tempo di sviluppo.

## 2. Analisi Funzionale: Gap verso il "Premium"
Attualmente l'app gestisce bene la riproduzione base. Per diventare "Pro" e competere con software come *Cartwall* o *RadioDJ*, mancano funzionalità critiche:

### A. Criticità Mancanti (Must-Have)
1.  **Routing Audio Avanzato:**
    *   *Attuale:* Usa l'uscita di default del sistema.
    *   *Necessario:* Selezione dispositivo di uscita specifico (es. Scheda Audio Esterna Canale 1/2 per Main, Canale 3/4 per Preascolto/CUE).
2.  **Visualizzazione Waveform:**
    *   *Attuale:* Nessuna visualizzazione.
    *   *Necessario:* Vedere la forma d'onda per capire visivamente "quanto manca" o dove sono i picchi.
3.  **Drag & Drop Nativo:**
    *   *Attuale:* Caricamento file macchinoso.
    *   *Necessario:* Trascinare file audio direttamente da Esplora Risorse sui pad.

### B. Funzionalità "Wow" (Premium)
1.  **Auto-Ducking (Talkover):** Abbassare automaticamente il volume della musica quando si preme un tasto "Microfono" o "Voce".
2.  **Registratore Integrato:** Registrare l'intero show (Mix in uscita) su file locale.
3.  **Integrazione VST (Opzionale ma Pro):** Applicare effetti VST (compressori, limiter) al master. (Complesso in Web, ma simulabile con effetti Web Audio).

## 3. Piano di Stabilizzazione e Sviluppo
Il percorso per "Runtime Radio Live Machine Pro":

1.  **Fase 1: Fondamenta (Attuale)**
    *   Riparare UI (Tailwind).
    *   Impacchettare in Electron (Windows .exe).
    *   Rinominare tutto in "Pro".

2.  **Fase 2: Core Audio Pro**
    *   Implementare selezione Output Device (Audio Context Sink ID).
    *   Implementare Drag & Drop nativo (tramite Electron).

3.  **Fase 3: Visual & Workflow**
    *   Aggiungere Waveform sui tasti (o in un pannello ispettore).
    *   Implementare Ducking automatico.

## Conclusione
Non serve cambiare tecnologia. Serve sfruttare Electron per rompere i limiti del browser (accesso file system, driver audio) e curare l'UX per renderla indistinguibile da un'app nativa.
