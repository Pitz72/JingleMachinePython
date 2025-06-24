# 🍎 RUNTIME RADIO v1.5 - Istruzioni per macOS

## 🚀 AVVIO RAPIDO

### Metodo 1: Con Script ⭐
1. Apri **Terminale** (Cmd+Spazio → cerca "Terminal")
2. Vai alla cartella: `cd /percorso/alla/cartella`  
3. Prima volta: `chmod +x avvia_runtime_radio.sh`
4. Avvia: `./avvia_runtime_radio.sh`

### Metodo 2: Manuale
```bash
# 1. Installa dipendenze
pip3 install -r requirements.txt

# 2. Avvia
python3 src/main.py
```

## 🔧 Installazione Python su macOS

### Con Homebrew (Consigliato)
```bash
# Installa Homebrew se non ce l'hai
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Installa Python
brew install python
```

### Download Manuale
1. Vai su **[python.org/downloads](https://www.python.org/downloads/)**
2. Scarica **Python 3.11+** per macOS
3. Installa il file `.pkg` scaricato

## 🔧 Se Non Funziona

### "command not found: python"
```bash
# Prova questi in ordine:
python3 --version
which python3
/usr/bin/python3 --version

# Se nessuno funziona, installa Python con Homebrew (sopra)
```

### Errori di permessi
```bash
# Usa pip3 invece di pip
pip3 install --user -r requirements.txt

# O installa in modalità utente
python3 -m pip install --user -r requirements.txt
```

### Il suono non parte
1. **Preferenze di Sistema** → **Sicurezza e Privacy** → **Privacy** → **Microfono**
2. Aggiungi **Terminal** o **Python** alla lista
3. Riavvia l'applicazione

### "Pygame non funziona"
```bash
# Installa SDL2 (necessario per pygame su Mac)
brew install sdl2 sdl2_image sdl2_mixer sdl2_ttf

# Poi reinstalla pygame
pip3 install --upgrade pygame
```

## 💡 Consigli macOS

- **Performance**: Usa Activity Monitor per chiudere app che usano CPU/RAM
- **File Audio**: Finder → Preferenze → Avanzate → "Mostra tutte le estensioni"  
- **Backup Config**: `cp jingle_config.json ~/Desktop/` per salvare impostazioni
- **Versione macOS**: Testato su macOS 10.14+ (Mojave e successivi)

---
**Tutto funziona? Leggi `GUIDA_UTENTE.md` per imparare a usare RUNTIME RADIO!** 🎙️ 