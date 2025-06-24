# 🎙️ RUNTIME RADIO v1.5 - Guida Utente

## Cos'è RUNTIME RADIO?

**RUNTIME RADIO** è un software professionale progettato per **stazioni radio, podcast e DJ** che permette di gestire **jingle, effetti sonori e sottofondo musicale** in modo semplice e automatico.

Immagina di avere una **console con 88 pulsanti** davanti a te: ogni pulsante può contenere un suono diverso (jingle, effetto, musica) che puoi far partire istantaneamente con un clic.

## 🎯 A Cosa Serve?

### Per Radio e Podcast:
- **Jingle di apertura/chiusura** trasmissioni
- **Effetti sonori** per enfatizzare momenti  
- **Musiche di sottofondo** durante le pause
- **Pubblicità e promo** preregistrati
- **Colonne sonore** per segmenti tematici

### Per DJ e Eventi:
- **Campioni audio** per remix live
- **Effetti di transizione** tra brani
- **Drop e air horn** per animazione
- **Bed musicali** per presentazioni

## 🔧 Come Funziona?

### 1. **La Griglia di Pulsanti**
- **88 pulsanti** organizzati in 8 colonne e 11 righe
- Ogni pulsante può contenere **un file audio** (MP3, WAV, OGG, etc.)
- **Colore personalizzabile** per ogni pulsante
- **Nome personalizzato** per riconoscere rapidamente i contenuti

### 2. **Tre Modalità di Riproduzione**
Ogni pulsante può funzionare in tre modi diversi:

#### 🔄 **LOOP (Continuo)**
- Il suono **si ripete all'infinito** fino a che non lo fermi
- Perfetto per: *musiche di sottofondo, atmosfere, bed musicali*
- **Come usare**: Clicca per avviare, clicca di nuovo per fermare

#### ⏯️ **CONTINUA (Pausa/Riprendi)**  
- Puoi **mettere in pausa e riprendere** dal punto dove hai fermato
- Perfetto per: *long-form content, interviste registrate, monologhi*
- **Come usare**: Clicca per avviare, clicca per pausare, clicca ancora per riprendere

#### ▶️ **DA CAPO (Play/Stop)**
- Ogni volta che clicchi il suono **riparte dall'inizio**
- Perfetto per: *jingle, effetti, drop, spot pubblicitari*
- **Come usare**: Clicca per avviare, clicca di nuovo per fermare e ripartire da capo

### 3. **Sistema Intelligente Automatico** ⚡

#### 🎪 **Colonna Effetti Speciali (Colonna 8)**
- I pulsanti della **colonna più a destra** sono speciali
- I loro suoni **si sovrappongono sempre** a tutto il resto
- Perfetti per: *effetti sonori, drop, air horn, applausi*
- **Non si fermano mai** quando premi altri pulsanti

#### 🎵 **Gestione Automatica Tracce Principali**
Il software **gestisce automaticamente** le tracce musicali:

**PRIORITÀ INTELLIGENTE:**
- Se sta suonando una **musica di sottofondo** (loop) e premi un **jingle normale**, il jingle **interrompe automaticamente** la musica
- Questo ti permette di **parlare sopra il jingle** senza dover fermare manualmente la musica

**CODA AUTOMATICA:**
- Se premi un secondo jingle mentre ne sta già suonando uno, il secondo **va in coda**
- Il pulsante in coda **lampeggia blu/azzurro** per farti sapere che è in attesa  
- Quando il primo jingle finisce, il secondo **parte automaticamente**
- Se cambi idea, clicca di nuovo sul pulsante lampeggiante per **rimuoverlo dalla coda**

## 🚀 Come Iniziare

### 🖥️ **Su WINDOWS:**
1. **Doppio click** su `AVVIA_RUNTIME_RADIO.bat` - **IL PIÙ SEMPLICE!**
2. Se non funziona → Installa Python da [python.org](https://www.python.org/downloads/)
3. Durante installazione Python, spunta **"Add Python to PATH"**

### 🍎 **Su macOS:**
1. Apri **Terminale** (cerca "Terminal" in Spotlight)
2. Naviga alla cartella: `cd /percorso/alla/cartella`
3. Rendi eseguibile: `chmod +x avvia_runtime_radio.sh` (solo prima volta)
4. Avvia: `./avvia_runtime_radio.sh`

### 🐧 **Su Linux:**
1. Apri **Terminale**
2. Naviga alla cartella: `cd /percorso/alla/cartella`
3. Rendi eseguibile: `chmod +x avvia_runtime_radio.sh` (solo prima volta)
4. Avvia: `./avvia_runtime_radio.sh`

### 🛠️ **Metodo Manuale (Tutti i Sistemi):**
```bash
# Windows/Mac/Linux
pip install -r requirements.txt
python src/main.py

# Su alcuni Mac/Linux potrebbe servire:
pip3 install -r requirements.txt
python3 src/main.py
```

### Primo Utilizzo:
1. **Click destro** su un pulsante vuoto
2. Scegli **"Carica Audio"** e seleziona il tuo file
3. **Click destro** → **"Impostazioni Pulsante"** per personalizzare:
   - Nome personalizzato
   - Colore del pulsante  
   - Volume specifico
   - Modalità di riproduzione
4. **Click sinistro** per far partire il suono!

## 🎨 Interfaccia Visiva

### Colori dei Bordi:
- **Verde**: Il pulsante sta suonando
- **Blu lampeggiante**: Il pulsante è in coda
- **Giallo lampeggiante**: Il suono sta per finire (ultimi 15%)
- **Grigio**: Pulsante fermo

### Progress Bar:
- **Barra verde** sotto il pulsante mostra il **progresso di riproduzione**
- Appare solo per suoni con inizio e fine (non per i loop)

### Tooltip Informativi:
- **Passa il mouse** sopra un pulsante per vedere tutte le informazioni:
  - Nome del file
  - Stato attuale (riproduzione/pausa/fermo)
  - Modalità impostata
  - Volume

## 🆘 Pulsante di Emergenza

### "STOP ALL SOUNDS"
- **Pulsante rosso** in alto ferma **istantaneamente tutti i suoni**
- Utile in caso di emergenza o per **reset completo**
- Non cancella le configurazioni, ferma solo la riproduzione

## 💡 Consigli per l'Uso Professionale

### Organizzazione Suggerita:
- **Colonne 1-3**: Jingle e spot (modalità "Da Capo")
- **Colonne 4-6**: Musiche e bed (modalità "Loop") 
- **Colonna 7**: Effetti e transizioni (modalità "Da Capo")
- **Colonna 8**: Effetti speciali sempre sovrapposti

### Workflow Radio Tipico:
1. **Avvia musica di sottofondo** (loop)
2. **Premi jingle** quando serve (interrompe automaticamente la musica)
3. **Usa effetti** dalla colonna 8 per enfatizzare
4. **Metti in coda** il prossimo contenuto mentre parli
5. **Lascia che il sistema gestisca** automaticamente le transizioni

## 📋 Requisiti di Sistema

### 🖥️ **Windows:**
- **Windows 10** o successivo (Windows 11 consigliato)
- **Python 3.8+** da [python.org](https://www.python.org/downloads/)
- **4GB RAM** (minimo 2GB)

### 🍎 **macOS:**
- **macOS 10.14** (Mojave) o successivo
- **Python 3.8+** (installa con Homebrew: `brew install python`)
- **4GB RAM** (minimo 2GB)

### 🐧 **Linux:**
- **Ubuntu 18.04+**, **Fedora 30+**, **Debian 10+** o equivalenti
- **Python 3.8+** (usa il package manager: `sudo apt install python3`)
- **4GB RAM** (minimo 2GB)
- **PulseAudio** o **ALSA** per l'audio

## 🔧 Risoluzione Problemi

### 🚫 **"Python non riconosciuto" (Windows):**
1. Reinstalla Python da [python.org](https://www.python.org/downloads/)
2. Durante installazione, **spunta "Add Python to PATH"**
3. Riavvia il computer
4. Testa con: `python --version` nel prompt

### 🐧🍎 **Problemi Python su Mac/Linux:**
```bash
# Prova questi comandi in ordine:
python --version     # Se non funziona...
python3 --version    # Prova questo
which python3        # Trova dove è installato
```

### 🔊 **Il suono non parte:**
- **Windows**: Controlla che Windows abbia accesso al microfono/audio per Python
- **macOS**: Autorizza l'app nelle Preferenze Sistema → Sicurezza → Privacy → Microfono
- **Linux**: Verifica che il tuo utente sia nel gruppo `audio`: `sudo usermod -a -G audio $USER`
- Verifica formati supportati: **MP3, WAV, OGG, FLAC**

### ⚡ **Lentezza o lag:**
- **File audio**: Max 10MB per file, preferisci MP3 a 128kbps
- **RAM**: Chiudi browser e altre app pesanti
- **CPU**: Su sistemi vecchi, riduci il numero di audio simultanei

### 💾 **Configurazione persa:**
- Il software salva automaticamente in `jingle_config.json`
- **Backup**: Copia questo file per salvare le tue impostazioni
- **Ripristino**: Incolla il file nella cartella del software

---

**RUNTIME RADIO v1.5** è progettato per essere **intuitivo ma potente**, perfetto per **uso professionale** ma facile da imparare. Sperimenta con i diversi pulsanti e modalità per trovare il flusso di lavoro che funziona meglio per te! 🎙️✨ 