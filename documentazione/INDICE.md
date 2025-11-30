# � Indice Documentazione - Runtime Radio Live Machine Pro

## 🎯 **Panoramica**
Questa documentazione fornisce una guida completa per lo sviluppo, deployment e utilizzo di Runtime Radio Live Machine Pro.

**Versione Corrente**: v1.3.1
**Data Rilascio**: 2025-11-30
**Stato**: Production Ready

---

## 📁 **Documentazione Strategica**
Analisi di alto livello sul progetto, la sua identità e il suo futuro.

- **[ANALISI_STRATEGICA.md](ANALISI_STRATEGICA.md)** - Visione del prodotto, roadmap verso la versione "Pro" e analisi React vs Native.
- **[ANALISI_CRITICA.md](ANALISI_CRITICA.md)** - Audit dello stato del codice, debito tecnico e piano di azione correttivo.

---

## � **Storico e Modifiche** (`documentazione/changelog/`)
Tracciamento dettagliato dell'evoluzione del software.

- **[CHANGELOG.md](changelog/CHANGELOG.md)** - File principale con lo storico completo.
- **[1.3.1_hotfix.md](changelog/1.3.1_hotfix.md)** - Dettagli sull'ultimo hotfix di stabilità.
- **[1.3.0.md](changelog/1.3.0.md)** - Dettagli sulla Major Release "Hardware Integration" (MIDI).

---

## � **Qualità e Testing** (`documentazione/anti-regressione/`)
Procedure per garantire la stabilità del software.

- **[ANTI_REGRESSION_TESTS.md](anti-regressione/ANTI_REGRESSION_TESTS.md)** - Checklist completa di test manuali per PWA, MIDI e UI.

---

## � **Guide Utente e Tecniche**
Manuali per l'uso e lo sviluppo.

- **[MINI_GUIDE.txt](guide/MINI_GUIDE.txt)** - Guida rapida essenziale per l'utente finale (Italiano).
- **[README.md](../APP/README.md)** - Manuale Tecnico Approfondito (Inglese - v1.1.0 Legacy). *Contiene dettagli su architettura PWA e accessibilità.*

---

## � **Sezioni in Sviluppo / Placeholder**
Le seguenti sezioni sono predisposte nella struttura delle cartelle ma attualmente non contengono documentazione specifica.

- `documentazione/api/` - API Reference (Web Audio, MIDI)
- `documentazione/deployment/` - Guide di deploy
- `documentazione/contributing/` - Linee guida per contributori

---

## � **Riferimenti Rapidi Codice**

### **Core Application**
- **[App.tsx](../APP/App.tsx)**: Entry point logico.
- **[constants.ts](../APP/constants.ts)**: Configurazioni globali e preset.
- **[MIDIManager.ts](../APP/services/MIDIManager.ts)**: Gestione integrazione hardware.

### **Configurazione**
- **[package.json](../APP/package.json)**: Dipendenze e script.
- **[manifest.json](../APP/public/manifest.json)**: Configurazione PWA.

---

**Ultimo Aggiornamento Indice**: 2025-11-30