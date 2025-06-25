# 🍎 Istruzioni per macOS - Advanced Jingle Machine v1.5

## 🚀 Metodo Rapido (Consigliato)

### 1. **Rendi eseguibile lo script**
```bash
chmod +x start_macos.sh
```

### 2. **Avvia lo script automatico**
```bash
./start_macos.sh
```

Lo script farà tutto automaticamente:
- ✅ Controlla se Python3 è installato
- ✅ Installa le dipendenze necessarie
- ✅ Avvia Advanced Jingle Machine

---

## 🔧 Installazione Manuale

### 1. **Installa Python 3**

#### Metodo A: Python.org (Consigliato)
1. Vai su [python.org/downloads](https://www.python.org/downloads/)
2. Scarica **Python 3.8 o superiore per macOS**
3. Apri il file `.pkg` e segui l'installazione

#### Metodo B: Homebrew
```bash
# Installa Homebrew se non ce l'hai
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Installa Python
brew install python
```

### 2. **Apri il Terminale**
- **Spotlight**: Cmd + Spazio → "Terminal"
- **Finder**: Applicazioni → Utility → Terminale

### 3. **Naviga nella cartella**
```bash
cd /path/to/AJM-free
```
*Sostituisci con il percorso reale dove hai estratto i file*

### 4. **Installa le dipendenze**
```bash
pip3 install -r requirements.txt
```

### 5. **Avvia il software**
```bash
python3 main.py
```

---

## 🛡️ Permessi e Sicurezza macOS

### Gatekeeper e Notarizzazione
Se appare un messaggio di sicurezza:

1. **Apri Preferenze di Sistema** → **Sicurezza e Privacy**
2. Nella scheda **Generale**, clicca **"Consenti comunque"**
3. Oppure nel Terminale:
```bash
sudo spctl --master-disable
```
**(Ricorda di riabilitarlo dopo: `sudo spctl --master-enable`)**

### Permessi Microfono/Audio
Il sistema potrebbe chiedere permessi per l'audio:
1. **Consenti** quando richiesto
2. Oppure vai in **Preferenze di Sistema** → **Sicurezza e Privacy** → **Privacy** → **Microfono**
3. Aggiungi il **Terminale** alla lista

---

## 🎯 Prima Configurazione

### Al primo avvio:
1. **Schermata di benvenuto** con informazioni sul software
2. Clicca **"🚀 AVVIA SOFTWARE"** per entrare
3. **Interface principale** con 88 pulsanti (griglia 8x11)

### Per caricare audio:
1. **Click destro** (o Ctrl+Click) su un pulsante vuoto
2. **"Carica Audio"** → seleziona file MP3, WAV o OGG
3. **Click sinistro** per riprodurre

---

## 🆘 Risoluzione Problemi macOS

### "python3: command not found"
**Soluzione 1**: Installa da python.org
**Soluzione 2**: Usa Homebrew
```bash
brew install python
```

### "pip3: command not found"
```bash
python3 -m ensurepip --upgrade
```

### Problemi con PyQt6 su Apple Silicon (M1/M2)
```bash
# Disinstalla e reinstalla con versione compatibile
pip3 uninstall PyQt6
pip3 install PyQt6 --force-reinstall
```

### "Operation not permitted" durante l'installazione
```bash
pip3 install --user -r requirements.txt
```

### Audio non funziona
1. Verifica **Preferenze di Sistema** → **Suono**
2. Controlla che l'**uscita audio** sia corretta
3. Chiudi altre app audio (Spotify, iTunes, etc.)

### Errori di dipendenze su vecchie versioni macOS
```bash
# Per macOS < 10.15
pip3 install PyQt6==6.2.3
```

---

## 💡 Suggerimenti per macOS

### Performance Ottimali:
- **Chiudi app inutili** prima dell'uso live
- **Disabilita Spotlight** temporaneamente durante eventi critici
- Usa **file audio ottimizzati** (non troppo grandi)

### Compatibilità:
- ✅ **macOS 10.15 Catalina** e superiori (consigliato)
- ✅ **Apple Silicon** (M1/M2) supportato
- ⚠️ **macOS < 10.15** (potrebbero servire versioni specifiche di PyQt6)

### Backup e Sincronizzazione:
- **Time Machine**: Includi la cartella AJM-free nel backup
- **iCloud**: Evita di mettere file audio grandi su iCloud Drive

---

## 🔄 Shortcuts macOS Utili

### Terminale:
- **Cmd + T**: Nuovo tab
- **Cmd + K**: Pulisci schermata
- **Tab**: Autocompletamento percorsi

### Nel software:
- **Cmd + Q**: Chiudi applicazione
- **Cmd + M**: Minimizza finestra
- **Cmd + W**: Chiudi finestra (se supportato)

---

## 📞 Supporto macOS

**Problemi specifici macOS?**
- Aggiorna **Xcode Command Line Tools**: `xcode-select --install`
- Verifica **macOS aggiornato** tramite App Store
- Controlla **Console.app** per errori specifici

**Per sviluppatori**:
```bash
# Controlla versione Python
python3 --version

# Controlla pacchetti installati
pip3 list

# Reinstallazione completa
pip3 uninstall PyQt6 pygame
pip3 install -r requirements.txt
```

---

## 🎉 Tutto Pronto!

Una volta avviato Advanced Jingle Machine v1.5:
- **88 pulsanti** per il tuo audio
- **Sistema coda automatico**
- **Effetti speciali** in colonna 8
- **Personalizzazione completa**

**Perfetto per podcast, radio e DJ set su Mac!** 🎙️✨ 