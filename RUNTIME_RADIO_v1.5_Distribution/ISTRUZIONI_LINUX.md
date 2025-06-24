# 🐧 RUNTIME RADIO v1.5 - Istruzioni per LINUX

## 🚀 AVVIO RAPIDO

### Metodo 1: Con Script ⭐
```bash
# Vai alla cartella di RUNTIME RADIO
cd /percorso/alla/cartella

# Prima volta: rendi eseguibile
chmod +x avvia_runtime_radio.sh

# Avvia
./avvia_runtime_radio.sh
```

### Metodo 2: Manuale
```bash
# 1. Installa dipendenze
pip3 install -r requirements.txt

# 2. Avvia
python3 src/main.py
```

## 🔧 Installazione Python per Distribuzione

### Ubuntu/Debian
```bash
sudo apt update
sudo apt install python3 python3-pip python3-venv
```

### Fedora/RHEL/CentOS
```bash
sudo dnf install python3 python3-pip
# O su versioni vecchie:
sudo yum install python3 python3-pip
```

### Arch Linux
```bash
sudo pacman -S python python-pip
```

### openSUSE
```bash
sudo zypper install python3 python3-pip
```

## 🔧 Risoluzione Problemi Linux

### Errori di permessi audio
```bash
# Aggiungi il tuo utente al gruppo audio
sudo usermod -a -G audio $USER

# Logout e login per applicare
# O riavvia il computer
```

### "No module named pygame"
```bash
# Installa le librerie di sviluppo SDL2
# Ubuntu/Debian:
sudo apt install libsdl2-dev libsdl2-image-dev libsdl2-mixer-dev libsdl2-ttf-dev

# Fedora:
sudo dnf install SDL2-devel SDL2_image-devel SDL2_mixer-devel SDL2_ttf-devel

# Poi reinstalla pygame
pip3 install --user pygame
```

### Sistema audio (PulseAudio/ALSA)
```bash
# Verifica che l'audio funzioni
aplay /usr/share/sounds/alsa/Front_Left.wav

# Se non funziona, installa PulseAudio
sudo apt install pulseaudio  # Ubuntu/Debian
sudo dnf install pulseaudio  # Fedora
```

### Errori di permessi pip
```bash
# Installa in modalità utente
pip3 install --user -r requirements.txt

# O crea un virtual environment
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### Display/GUI non funziona
```bash
# Se usi SSH, abilita X11 forwarding
ssh -X utente@server

# O installa un display manager se manca
sudo apt install xorg  # Ubuntu/Debian
```

## 💡 Consigli Linux

### Performance
- **htop**: Monitora CPU/RAM usage
- **pavucontrol**: Controlla mixer audio PulseAudio
- Chiudi browser/app pesanti per migliori prestazioni

### File System
```bash
# Metti file audio in ~/Music o ~/Audio
mkdir -p ~/Music/RUNTIME_RADIO

# Backup configurazione
cp jingle_config.json ~/backup_jingle_config.json
```

### Distribuzioni Testate
- ✅ **Ubuntu 20.04+** (LTS)
- ✅ **Fedora 35+**  
- ✅ **Debian 11+**
- ✅ **Arch Linux** (rolling)
- ✅ **openSUSE Leap 15.3+**

---
**Tutto funziona? Leggi `GUIDA_UTENTE.md` per imparare a usare RUNTIME RADIO!** 🎙️ 