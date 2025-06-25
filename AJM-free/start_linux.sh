#!/bin/bash

clear
echo "===================================================="
echo "   🎙️ ADVANCED JINGLE MACHINE v1.5 🎙️"
echo "===================================================="
echo ""
echo "Autore: Simone Pizzi"
echo "Website: pizzisimone.runtimeradio.it"
echo "Donazioni: paypal.me/runtimeradio"
echo ""
echo "===================================================="
echo ""

# Verifica se Python è installato
if ! command -v python3 &> /dev/null; then
    echo "❌ ERRORE: Python3 non trovato!"
    echo ""
    echo "📥 Ubuntu/Debian: sudo apt install python3 python3-pip"
    echo "📥 Fedora/CentOS: sudo dnf install python3 python3-pip"
    echo "📥 Arch Linux: sudo pacman -S python python-pip"
    echo ""
    read -p "Premi Invio per continuare..."
    exit 1
fi

# Verifica se pip è disponibile
if ! command -v pip3 &> /dev/null; then
    echo "❌ ERRORE: pip3 non trovato!"
    echo ""
    echo "🔧 Ubuntu/Debian: sudo apt install python3-pip"
    echo "🔧 Fedora/CentOS: sudo dnf install python3-pip"
    echo "🔧 Arch Linux: sudo pacman -S python-pip"
    echo ""
    read -p "Premi Invio per continuare..."
    exit 1
fi

# Installa dipendenze di sistema per PyQt6 se necessario
echo "🔍 Controllo dipendenze di sistema..."
if command -v apt &> /dev/null; then
    # Ubuntu/Debian
    if ! dpkg -l | grep -q python3-pyqt6; then
        echo "📦 Installazione dipendenze di sistema (Ubuntu/Debian)..."
        sudo apt update
        sudo apt install -y python3-pyqt6 python3-pyqt6.qtmultimedia
    fi
elif command -v dnf &> /dev/null; then
    # Fedora/CentOS
    if ! rpm -qa | grep -q python3-qt6; then
        echo "📦 Installazione dipendenze di sistema (Fedora)..."
        sudo dnf install -y python3-qt6 python3-qt6-base
    fi
fi

# Verifica dipendenze Python
echo "🔍 Controllo dipendenze Python..."
if ! pip3 show PyQt6 &> /dev/null; then
    echo "📦 Installazione dipendenze Python in corso..."
    pip3 install -r requirements.txt --user
    if [ $? -ne 0 ]; then
        echo "❌ Errore durante l'installazione delle dipendenze!"
        echo "🔧 Prova: pip3 install --user PyQt6 pygame"
        read -p "Premi Invio per continuare..."
        exit 1
    fi
fi

# Avvio del software
echo ""
echo "✅ Tutto pronto! Avvio Advanced Jingle Machine v1.5..."
echo ""
python3 main.py

# Gestione errori
if [ $? -ne 0 ]; then
    echo ""
    echo "❌ Errore durante l'avvio del software!"
    echo "📞 Controlla README.md per assistenza"
    echo ""
    read -p "Premi Invio per continuare..."
fi 