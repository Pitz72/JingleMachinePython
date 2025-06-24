#!/bin/bash

echo ""
echo "========================================"
echo "    RUNTIME RADIO v1.5 - Avvio"
echo "========================================"
echo ""

# Controlla se Python è installato
if ! command -v python3 &> /dev/null; then
    if ! command -v python &> /dev/null; then
        echo "ERRORE: Python non è installato sul sistema."
        echo "Installa Python dal package manager del tuo sistema o da:"
        echo "https://www.python.org/downloads/"
        echo ""
        read -p "Premi Invio per uscire..."
        exit 1
    else
        PYTHON_CMD="python"
    fi
else
    PYTHON_CMD="python3"
fi

echo "Controllo dipendenze..."

# Controlla se pip è disponibile
if ! command -v pip &> /dev/null && ! command -v pip3 &> /dev/null; then
    echo "ERRORE: pip non è installato."
    echo "Installa pip dal package manager del tuo sistema."
    read -p "Premi Invio per uscire..."
    exit 1
fi

# Determina il comando pip corretto
if command -v pip3 &> /dev/null; then
    PIP_CMD="pip3"
else
    PIP_CMD="pip"
fi

# Controlla e installa dipendenze se necessario
if ! $PIP_CMD show pygame &> /dev/null; then
    echo "Installazione dipendenze necessarie..."
    $PIP_CMD install -r requirements.txt
fi

echo ""
echo "Avvio RUNTIME RADIO v1.5..."
echo ""

cd src
$PYTHON_CMD main.py

echo ""
echo "RUNTIME RADIO v1.5 chiuso."
read -p "Premi Invio per uscire..." 