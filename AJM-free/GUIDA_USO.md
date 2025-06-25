# 📖 Guida Completa all'Uso - Advanced Jingle Machine v1.5

## 🎯 Introduzione Rapida

Advanced Jingle Machine è una console audio con **88 pulsanti** (griglia 8x11) che ti permette di riprodurre file audio istantaneamente. Perfetta per radio, podcast, DJ set e eventi live.

---

## 🚀 Primo Avvio

### 1. Avvio dell'Applicazione
```bash
python src/main.py
```

### 2. Schermata di Benvenuto
Al primo avvio vedrai:
- **Logo** del software
- **Informazioni sull'autore** (Simone Pizzi)
- **Links** per donazioni e sito web
- **Pulsante "🚀 AVVIA SOFTWARE"**

Clicca il pulsante per entrare nell'applicazione principale.

### 3. Interfaccia Principale
- **Griglia 8x11** = 88 pulsanti audio
- **Pulsante "STOP ALL SOUNDS"** rosso in alto
- **Colonna 8** (ultima a destra) = effetti speciali

---

## 🎵 Gestione Audio

### Caricare un File Audio
1. **Click destro** su un pulsante vuoto
2. Seleziona **"Carica Audio"**
3. Scegli il file audio (MP3, WAV, OGG)
4. Il nome del file apparirà sul pulsante

### Riprodurre Audio
- **Click sinistro** sul pulsante = avvia riproduzione
- **Bordo verde** = audio in riproduzione
- **Progress bar** = avanzamento traccia (se non loop)

### Fermare Audio
- **Pulsante rosso** "STOP ALL SOUNDS" = ferma tutto
- **Click sul pulsante attivo** = ferma quello specifico (dipende dalla modalità)

---

## ⚙️ Personalizzazione Pulsanti

### Aprire le Impostazioni
1. **Click destro** su un pulsante con audio
2. Seleziona **"Impostazioni Pulsante..."**

### Opzioni Disponibili

#### 📝 Nome Personalizzato
- Inserisci un nome custom
- Sovrascrive il nome del file
- Utile per organizzazione (es. "Intro Show", "Jingle 1")

#### 🎨 Colore Pulsante
- Clicca **"Scegli Colore..."**
- Seleziona dalla palette
- Utile per categorizzare (es. rosso=urgente, blu=jingle)

#### 🔊 Volume
- Slider da **0.0** (muto) a **1.0** (massimo)
- Volume specifico per ogni pulsante
- Default: 1.0

#### 🎛️ Modalità di Riproduzione

| Modalità | Comportamento | Ideale per |
|----------|---------------|------------|
| **Da Capo** | Click = play, Click = stop, Click = riplay | Jingle, spot |
| **Continua** | Click = play, Click = pausa, Click = riprendi | Podcast, speech |
| **Loop** | Click = avvia loop, Click = ferma loop | Sottofondo, atmosfere |

---

## 🎪 Sistema Coda Automatico

### Come Funziona
Il software gestisce automaticamente le priorità di riproduzione:

#### Regola 1: Priorità Non-Loop
- **Tracce normali** hanno priorità su **tracce loop**
- Se premi un pulsante normale mentre un loop è attivo → il loop si ferma

#### Regola 2: Accodamento Intelligente
- Se premi un pulsante normale mentre un altro normale è attivo → va in **coda**
- **Lampeggio blu/ciano** = pulsante in coda
- Quando la traccia attiva finisce → quella in coda parte automaticamente

#### Regola 3: Effetti Sovrapposti
- **Colonna 8** (ultima a destra) = effetti speciali
- Si sovrappongono sempre alle altre tracce
- Non interferiscono con il sistema di coda

### Gestione Coda
- **Premere di nuovo** un pulsante in coda = lo rimuove dalla coda
- **Un solo pulsante** può essere in coda alla volta
- **Tracce loop** non vanno in coda

---

## 🎯 Feedback Visivo

### Indicatori Pulsanti

| Stato | Aspetto | Significato |
|-------|---------|-------------|
| **Inattivo** | Grigio normale | Nessun audio caricato |
| **Pronto** | Colore personalizzato | Audio caricato, pronto |
| **In riproduzione** | Bordo verde | Audio attivo |
| **In coda** | Lampeggio blu/ciano | In attesa di riproduzione |
| **Fine traccia** | Lampeggio giallo/arancione | Ultimi 15% della traccia |

### Progress Bar
- **Barra verde** sotto il testo del pulsante
- Mostra avanzamento per tracce **non-loop**
- Scompare quando in pausa o fermata

### Tooltip Informativi
Passa il mouse su un pulsante per vedere:
- **Nome** (file o custom)
- **Stato** attuale
- **Opzioni** attive
- **Volume** impostato

---

## 🎧 Scenari d'Uso Pratici

### 📻 Radio/Podcast
1. **Colonne 1-7**: Jingle, spot, intro, outro
2. **Colonna 8**: Effetti sonori (applausi, campanelle)
3. **Modalità "Da Capo"** per jingle
4. **Modalità "Loop"** per sottofondo musicale

### 🎵 DJ Set
1. **Tracce principali** in modalità "Continua"
2. **Sample e drop** in colonna 8
3. **Transizioni** con sistema coda
4. **Effetti speciali** sovrapposti

### 🎪 Eventi Live
1. **Musica d'ingresso** in loop
2. **Jingle presentazione** in coda
3. **Effetti pubblico** in colonna 8
4. **Musica di chiusura** con priority

---

## 💾 Salvataggio e Configurazione

### Salvataggio Automatico
- Tutte le impostazioni si salvano **automaticamente** alla chiusura
- File di configurazione: `jingle_config.json`
- Include: audio caricati, nomi, colori, volumi, modalità

### Backup Configurazione
- Copia il file `jingle_config.json` per backup
- Spostalo su altri computer per trasferire la configurazione

---

## 🆘 Risoluzione Problemi

### Audio non si sente
1. Controlla **volume sistema** e **volume pulsante**
2. Verifica che il **file audio** non sia corrotto
3. Prova con un **formato diverso** (MP3, WAV)

### Pulsante non risponde
1. **Click destro** → "Rimuovi Audio" → ricarica
2. Controlla che il **file esista ancora** nel percorso
3. Riavvia l'applicazione

### Performance lente
1. **Chiudi altri programmi** audio
2. Usa **file audio ottimizzati** (non troppo grandi)
3. Verifica **spazio disco** disponibile

### Configurazione persa
1. Controlla che `jingle_config.json` esista
2. Se danneggiato, cancellalo per reset completo
3. Ricarica manualmente i file audio

---

## 🎛️ Shortcuts e Trucchi

### Organizzazione Efficace
- **Colori** per categorie (rosso=urgente, verde=ok, blu=speciale)
- **Nomi custom** brevi e chiari
- **Prima riga** per elementi più usati

### Uso Professionale
- **Testa sempre** i file prima dell'uso live
- **Backup** della configurazione prima di eventi importanti
- **Volume uniforme** tra i vari pulsanti

### Workflow Consigliato
1. **Pianifica** la struttura prima di caricare
2. **Organizza** per tipo di contenuto
3. **Testa** il sistema di coda in anticipo
4. **Prepara** effetti speciali in colonna 8

---

## 📞 Supporto

**Problemi tecnici?**
- Documentazione completa nella cartella `docs/`
- Website: [pizzisimone.runtimeradio.it](https://pizzisimone.runtimeradio.it)

**Ti piace il software?**
- Considera una donazione: [paypal.me/runtimeradio](https://paypal.me/runtimeradio)

---

**🎉 Buon lavoro con Advanced Jingle Machine!** 🎙️✨ 