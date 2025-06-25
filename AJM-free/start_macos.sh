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
    echo "📥 Installa Python da: https://www.python.org/downloads/"
    echo "🔧 Oppure usa Homebrew: brew install python"
    echo ""
    read -p "Premi Invio per continuare..."
    exit 1
fi

# Verifica se pip è disponibile
if ! command -v pip3 &> /dev/null; then
    echo "❌ ERRORE: pip3 non trovato!"
    echo ""
    echo "🔧 Installa pip: python3 -m ensurepip --upgrade"
    echo ""
    read -p "Premi Invio per continuare..."
    exit 1
fi

# Verifica dipendenze
echo "🔍 Controllo dipendenze..."
if ! pip3 show PyQt6 &> /dev/null; then
    echo "📦 Installazione dipendenze in corso..."
    pip3 install -r requirements.txt
    if [ $? -ne 0 ]; then
        echo "❌ Errore durante l'installazione delle dipendenze!"
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