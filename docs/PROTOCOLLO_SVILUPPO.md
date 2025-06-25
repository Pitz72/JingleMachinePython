# Protocollo di Sviluppo - Advanced Jingle Machine

**Autore**: Simone Pizzi (sviluppo sperimentale con LLM)

Questo documento stabilisce linee guida e best practices per lo sviluppo e manutenzione di Advanced Jingle Machine.

## Obiettivi del Software

Advanced Jingle Machine è una console audio professionale progettata per:
- **Radio**: Gestione jingle, spot e basi musicali
- **Podcast**: Effetti sonori, intro e outro
- **DJ Set**: Sample, drop e transizioni
- **Eventi Live**: Effetti speciali e applausi

## Principi di Sviluppo

### 1. Usabilità Prima di Tutto
- Interfaccia intuitiva con feedback visivo immediato
- Shortcut e workflow ottimizzati per l'uso dal vivo
- Gestione errori graceful senza interruzioni

### 2. Affidabilità Audio
- Sistema audio robusto con 128 canali simultanei
- Gestione priorità e accodamento intelligente
- Latenza minima per uso professionale

### 3. Personalizzazione Totale
- Ogni pulsante completamente configurabile
- Persistenza automatica delle configurazioni
- Temi e colori personalizzabili

### 4. Codice Pulito e Manutenibile
- Separazione chiara delle responsabilità
- Documentazione completa di classi e metodi
- Test di regressione per funzionalità critiche

## Struttura del Codice

### Classi Principali
- `WelcomeDialog`: Schermata di benvenuto e branding
- `JingleMachine`: Controller principale e orchestratore
- `JingleButton`: Componente audio autonomo
- `ButtonSettingsDialog`: Configurazione pulsanti

### Pattern Utilizzati
- **Component Pattern**: Ogni pulsante è autonomo
- **Observer Pattern**: Timer per aggiornamenti stato
- **State Pattern**: Gestione stati riproduzione
- **Modal Pattern**: Schermata benvenuto bloccante

## Workflow di Sviluppo

### 1. Analisi Requisiti
- Identificare esigenze utente specifiche
- Valutare impatto su performance audio
- Considerare compatibilità con configurazioni esistenti

### 2. Implementazione
- Sviluppo incrementale con test frequenti
- Mantenimento retrocompatibilità configurazioni
- Documentazione simultanea delle modifiche

### 3. Testing
- Test funzionali manuali (vedi ANTI_REGRESSION_TESTS.md)
- Verifica performance audio sotto carico
- Test compatibilità multi-piattaforma

### 4. Rilascio
- Aggiornamento documentazione completa
- Versionamento semantico
- Note di rilascio dettagliate

## Best Practices

### Gestione Audio
- Sempre verificare stato canali prima di operazioni
- Cleanup automatico delle risorse audio
- Gestione eccezioni per errori hardware

### Interfaccia Utente
- Feedback visivo per ogni azione utente
- Tooltip informativi e messaggi di errore chiari
- Layout responsive e accessibile

### Persistenza Dati
- Salvataggio automatico trasparente
- Validazione robusta dati di configurazione
- Backup e recovery per configurazioni importanti

## Versionamento

### Schema Versioni
- **Major**: Cambiamenti architetturali significativi
- **Minor**: Nuove funzionalità non breaking
- **Patch**: Bug fix e miglioramenti minori

### Versione Corrente: 1.5
- Schermata di benvenuto professionale
- Rebranding da "RUNTIME RADIO" ad "Advanced Jingle Machine"
- Sistema coda automatico e priorità intelligenti
- Interfaccia utente ottimizzata

## Note per LLM Development

### Vantaggi Osservati
- Rapid prototyping di interfacce complesse
- Generazione automatica di codice boilerplate
- Debugging assistito e ottimizzazioni

### Sfide e Soluzioni
- **Coerenza architetturale**: Documentazione dettagliata dell'architettura
- **Testing**: Protocolli di test manuali specifici
- **Manutenibilità**: Commenti esplicativi e naming convention

### Raccomandazioni
- Mantenere sempre documentazione aggiornata
- Test approfonditi dopo ogni modifica significativa
- Backup frequenti del codice funzionante

---

*Protocollo mantenuto aggiornato per Advanced Jingle Machine v1.5* 