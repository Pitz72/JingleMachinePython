# 🐧 Istruzioni per Linux - Advanced Jingle Machine v1.5

## 🚀 Metodo Rapido (Consigliato)

### 1. **Rendi eseguibile lo script**
```bash
chmod +x start_linux.sh
```

### 2. **Avvia lo script automatico**
```bash
./start_linux.sh
```

Lo script farà tutto automaticamente:
- ✅ Controlla se Python3 è installato
- ✅ Installa le dipendenze di sistema necessarie
- ✅ Installa le dipendenze Python
- ✅ Avvia Advanced Jingle Machine

---

## 🔧 Installazione Manuale per Distro

### 🔶 Ubuntu / Debian / Linux Mint

#### 1. **Aggiorna il sistema**
```bash
sudo apt update && sudo apt upgrade
```

#### 2. **Installa Python e dipendenze di sistema**
```bash
sudo apt install python3 python3-pip python3-pyqt6 python3-pyqt6.qtmultimedia
```

#### 3. **Installa dipendenze Python**
```bash
pip3 install -r requirements.txt --user
```

#### 4. **Avvia il software**
```bash
python3 main.py
```

---

### 🔴 Fedora / CentOS / RHEL

#### 1. **Aggiorna il sistema**
```bash
sudo dnf update
```

#### 2. **Installa Python e dipendenze**
```bash
sudo dnf install python3 python3-pip python3-qt6 python3-qt6-base
```

#### 3. **Installa dipendenze Python**
```bash
pip3 install -r requirements.txt --user
```

#### 4. **Avvia il software**
```bash
python3 main.py
```

---

### 🔵 Arch Linux / Manjaro

#### 1. **Aggiorna il sistema**
```bash
sudo pacman -Syu
```

#### 2. **Installa Python e dipendenze**
```bash
sudo pacman -S python python-pip python-pyqt6 python-pygame
```

#### 3. **Avvia il software**
```bash
python main.py
```

---

### 🟢 openSUSE

#### 1. **Installa dipendenze**
```bash
sudo zypper install python3 python3-pip python3-qt6
```

#### 2. **Installa dipendenze Python**
```bash
pip3 install -r requirements.txt --user
```

---

## 🎯 Prima Configurazione

### Al primo avvio:
1. **Schermata di benvenuto** con informazioni sul software
2. Clicca **"🚀 AVVIA SOFTWARE"** per entrare
3. **Interface principale** con 88 pulsanti (griglia 8x11)

### Per caricare audio:
1. **Click destro** su un pulsante vuoto
2. **"Carica Audio"** → seleziona file MP3, WAV o OGG
3. **Click sinistro** per riprodurre

---

## 🆘 Risoluzione Problemi Linux

### "python3: command not found"
**Ubuntu/Debian**: `sudo apt install python3`
**Fedora**: `sudo dnf install python3`
**Arch**: `sudo pacman -S python`

### "pip3: command not found"
**Ubuntu/Debian**: `sudo apt install python3-pip`
**Fedora**: `sudo dnf install python3-pip`
**Arch**: `sudo pacman -S python-pip`

### Errori con PyQt6
```bash
# Metodo 1: Pacchetti di sistema
sudo apt install python3-pyqt6  # Ubuntu/Debian
sudo dnf install python3-qt6    # Fedora
sudo pacman -S python-pyqt6     # Arch

# Metodo 2: pip con flag
pip3 install --user PyQt6 --force-reinstall
```

### Audio non funziona

#### PulseAudio (più comune):
```bash
# Verifica PulseAudio
pulseaudio --check
# Se non risponde:
pulseaudio --start
```

#### ALSA:
```bash
# Installa mixer ALSA
sudo apt install alsamixer  # Ubuntu/Debian
alsamixer  # Controlla volumi
```

#### Pipewire (distro moderne):
```bash
systemctl --user status pipewire
```

### Problemi di permessi audio
```bash
# Aggiungi il tuo utente al gruppo audio
sudo usermod -a -G audio $USER
# Riavvia o rilogga
```

### Errori "ModuleNotFoundError"
```bash
# Reinstallazione completa
pip3 uninstall PyQt6 pygame
pip3 install --user -r requirements.txt
```

---

## 🔧 Configurazioni Avanzate Linux

### Desktop Environment ottimali:
- ✅ **KDE Plasma** (migliore compatibilità PyQt6)
- ✅ **GNOME** (buona compatibilità)
- ✅ **XFCE** (leggero, stabile)
- ⚠️ **Window managers** (potrebbero richiedere configurazioni aggiuntive)

### Audio Server:
- ✅ **PulseAudio** (supporto standard)
- ✅ **Pipewire** (moderno, performante)
- ⚠️ **ALSA** (potrebbe richiedere configurazioni extra)

### Performance ottimali:
```bash
# Installa pacchetti per performance audio
sudo apt install linux-lowlatency  # Ubuntu
# Oppure
sudo dnf install kernel-rt  # Fedora (Real Time)
```

---

## 💡 Suggerimenti Linux

### File Manager e percorsi:
- **Nautilus** (GNOME): Facile navigazione
- **Dolphin** (KDE): Anteprima file audio
- **Thunar** (XFCE): Leggero e veloce

### Terminale migliorato:
- **fish**: `sudo apt install fish` (autocompletamento intelligente)
- **zsh + oh-my-zsh**: Shell avanzata con temi

### Monitoring sistema:
```bash
# Controlla uso CPU durante l'uso
htop
# Controlla audio in tempo reale
pavucontrol  # PulseAudio
```

---

## 🐧 Distribzioni Testate

### ✅ **Completamente Supportate**:
- Ubuntu 20.04+ e derivate
- Fedora 35+
- Arch Linux
- openSUSE Leap 15.4+

### ⚠️ **Supporto Parziale**:
- CentOS 7 (Python troppo vecchio, serve aggiornamento)
- Debian 10 (potrebbero servire backports)

### ❌ **Non Supportate**:
- Distribuzioni con Python < 3.8
- Sistemi embedded senza GUI

---

## 📞 Supporto Linux

**Problemi specifici della tua distro?**
- Controlla **wiki della distribuzione** per PyQt6
- Usa **AUR** su Arch per pacchetti specifici
- Considera **Flatpak** se i pacchetti di sistema non funzionano

**Per gli esperti**:
```bash
# Debug completo ambiente
python3 -c "import sys; print(sys.version)"
python3 -c "import PyQt6; print('PyQt6 OK')"
python3 -c "import pygame; print('Pygame OK')"
```

---

## 🎉 Tutto Pronto!

Advanced Jingle Machine v1.5 su Linux offre:
- **Performance eccellenti** su hardware modesto
- **Stabilità** per sessioni lunghe
- **Personalizzazione totale** dell'ambiente

**Perfect choice per il tuo studio Linux!** 🎙️🐧✨ 