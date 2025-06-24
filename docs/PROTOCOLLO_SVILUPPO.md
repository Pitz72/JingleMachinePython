# PROTOCOLLO DI SVILUPPO UMANO-LLM - RUNTIME RADIO

Questo documento definisce le regole della nostra collaborazione per lo sviluppo di "RUNTIME RADIO". Lo scopo è garantire un processo strutturato, prevenire la regressione e massimizzare l'efficacia del lavoro congiunto tra l'umano (Architetto) e l'LLM (Esecutore).

## PRINCIPIO 1: La Fonte Unica della Verità (Single Source of Truth)

- La cartella `docs/` (che creeremo) e i documenti di design in essa contenuti sono la nostra unica e assoluta fonte di verità.
- L'LLM non deve mai fare supposizioni. Ogni azione deve essere basata sulla documentazione fornita.
- L'umano (Simone Pizzi) è responsabile di mantenere questa documentazione aggiornata. L'LLM è responsabile di chiederla e di segnalare eventuali incongruenze tra codice e documenti.

## PRINCIPIO 2: Sviluppo Incrementale e Atomico

- **A Piccoli Passi**: Ogni task di sviluppo deve essere il più piccolo possibile, ma completo e testabile (es. "Aggiungere un cursore per il volume globale", non "Rifare tutta la UI").
- **Un Task, un Commit**: Ogni task completato deve corrispondere a un commit Git con un messaggio chiaro.
- **Prima il Design, Poi il Codice**: Per ogni nuovo task, aggiorneremo o creeremo un documento di design (anche breve, in un file `TASK_NOME.md`) prima di scrivere il codice.

## PRINCIPIO 3: Il Rituale del Reset del Contesto

**Problema**: La memoria dell'LLM è volatile.

**Soluzione (Il Rituale)**: All'inizio di ogni nuovo task, l'umano deve eseguire questo "rituale":

1. **Inizializzazione**: "Ciao, oggi lavoriamo al task [NOME_TASK]. L'obiettivo è [OBIETTIVO_DEL_TASK]."
2. **Caricamento Contesto**: "Per farlo, fai riferimento ai seguenti file: main.py, docs/ARCHITETTURA.md, docs/TASK_NOME.md" (allegando il contenuto).
3. **Conferma dell'LLM**: L'LLM deve rispondere con una sintesi dell'obiettivo e confermare di aver assimilato il contesto.

## PRINCIPIO 4: Il Protocollo Anti-Regressione

- **Definizione del Test**: Dopo aver completato un task, aggiungeremo un nuovo Test Case al file `docs/ANTI_REGRESSION_TESTS.md`.
- **Documento dei Test**: Il file `docs/ANTI_REGRESSION_TESTS.md` è il registro ufficiale di tutti i test manuali.
- **Testing di Regressione**: Periodicamente, e sempre prima di un commit importante, l'umano eseguirà (o chiederà all'LLM di simulare l'esecuzione) dei test critici da quel file per assicurarsi che le nuove modifiche non abbiano rotto funzionalità esistenti.

## PRINCIPIO 5: Definizione dei Ruoli

- **L'Umano (Simone Pizzi)**: È il Project Manager, l'Architetto del Software, l'UX Designer e il Quality Assurance (QA). Prende le decisioni, definisce i piani, guida il processo e valida il risultato.
- **L'LLM (Cursor/ChatGPT)**: È il Programmatore, il Technical Writer e il Pair Programmer. Scrive il codice su istruzioni precise, scrive e formatta la documentazione, suggerisce soluzioni tecniche e aiuta a identificare errori. Non prende mai iniziative di design.

## PRINCIPIO 6: Gestione della Configurazione (jingle_config.json)

- **Struttura Stabile**: La struttura del file `jingle_config.json` è sacra. Ogni modifica alla sua struttura deve essere documentata e richiede un aggiornamento delle funzioni `get_config` e `set_config` in `main.py`.
- **Retrocompatibilità**: Se si modifica la struttura, la funzione `load_config` deve essere in grado di gestire (o almeno di non crashare con) le versioni precedenti del file di configurazione, avvisando l'utente.
- **Robustezza**: Le funzioni di salvataggio e caricamento devono sempre essere racchiuse in blocchi `try...except` per gestire errori di I/O o JSON malformati.

## PRINCIPIO 7: Aggiornamento della Documentazione

- **Regola Fondamentale**: SEMPRE aggiornare i documenti rilevanti ad ogni task completato.
- **Documenti Chiave da Mantenere Sincronizzati**:
  - `README.md`: Per l'utente finale.
  - `docs/DEVELOPMENT_LOG.md`: Log tecnico delle decisioni.
  - `docs/ANTI_REGRESSION_TESTS.md`: Aggiungere nuovi test.
  - `docs/ARCHITETTURA.md`: Se vengono modificate le classi o le loro interazioni. 