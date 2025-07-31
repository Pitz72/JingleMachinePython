# Post-mortem: Esperimento con Tauri per Runtime Radio 2.0

## Data
31 Luglio 2025

## Contesto
Nell'ambito della progettazione di "Runtime Radio 2.0", è stata presa la decisione iniziale di utilizzare uno stack tecnologico considerato "premium" per applicazioni desktop moderne: **Tauri con un backend in Rust e un frontend in React**.

L'obiettivo era ottenere un'applicazione estremamente performante, leggera e multi-piattaforma, sfruttando al contempo le moderne tecnologie web per l'interfaccia utente.

## Cosa è Successo?
È stata creata un'architettura dettagliata, una roadmap e uno scheletro di progetto basato su Tauri. Tuttavia, durante la fase di configurazione dell'ambiente di sviluppo locale da parte dell'utente, sono emersi una serie di ostacoli bloccanti e di difficile risoluzione.

### Problemi Riscontrati

1.  **Conflitti di Dipendenze (`Dependency Hell`):** Il problema principale è stato l'impossibilità per il gestore di pacchetti Rust (`Cargo`) di risolvere le versioni delle dipendenze di Tauri. Si è verificato un disallineamento tra le versioni della CLI di Tauri (installata tramite `npm`), della libreria Rust `tauri` e della libreria di build `tauri-build`. Nonostante molteplici tentativi di allineare le versioni a valori specifici (2.7.1, 2.7.0, ecc.), ogni tentativo portava a un nuovo errore di versione non trovata per un altro pacchetto.

2.  **Complessità dell'Ambiente di Compilazione (Windows):** Il secondo ostacolo significativo è stato la necessità di una toolchain C++ (MSVC) correttamente configurata. Su Windows, questo richiede l'installazione di Visual Studio Build Tools e l'avvio dell'ambiente di sviluppo da un terminale specifico (il "Developer Command Prompt for VS 2022") per rendere il linker (`link.exe`) disponibile nel PATH. Questa procedura, sebbene standard per lo sviluppo C++/Rust, si è rivelata poco intuitiva e ha aggiunto un notevole livello di complessità alla configurazione iniziale.

3.  **Mancata Corrispondenza tra Feature e Versioni:** L'ultimo errore bloccante ha rivelato che una specifica feature (`shell-open`) non era disponibile nella versione della libreria `tauri` che stavamo tentando di usare, indicando un'ulteriore discrepanza nell'ecosistema di Tauri.

## Analisi della Causa Radice
La causa principale del fallimento non è stata la mancanza di capacità dell'LLM o dell'utente, ma una **sottovalutazione della complessità intrinseca dell'ecosistema Tauri/Rust** e della sua fragilità rispetto a disallineamenti di versione e configurazioni di sistema.

L'approccio "ultra premium" si è scontrato con la realtà pratica, dove la configurazione dell'ambiente è diventata un ostacolo più grande dello sviluppo dell'applicazione stessa.

## Decisione Strategica
Dopo numerosi tentativi falliti, è stata presa la decisione di **abbandonare lo stack Tauri/Rust** per questo progetto.

La lezione appresa è che la scelta tecnologica deve essere guidata non solo dalla performance teorica, ma anche dalla **praticità, velocità di sviluppo e manutenibilità** nel contesto specifico del team di lavoro.

Si è quindi deciso di pivotare verso un'architettura **Python + Eel + React**, che unisce tecnologie già padroneggiate dall'utente, eliminando completamente la complessità della compilazione e garantendo un percorso di sviluppo molto più rapido e prevedibile.

## Conclusione
L'esperimento con Tauri, sebbene non abbia portato a un risultato positivo, è stato un'esperienza di apprendimento fondamentale. Ha permesso di chiarire i requisiti non funzionali del progetto (come la semplicità dell'ambiente di sviluppo) e ha portato a una scelta tecnologica finale più consapevole e adatta agli obiettivi a lungo termine del progetto.
