@echo off
title Advanced Jingle Machine v1.5 - Avvio
cls
echo.
echo  ====================================================
echo    🎙️ ADVANCED JINGLE MACHINE v1.5 🎙️
echo  ====================================================
echo.
echo  Autore: Simone Pizzi
echo  Website: pizzisimone.runtimeradio.it
echo  Donazioni: paypal.me/runtimeradio
echo.
echo  ====================================================
echo.

:: Verifica se Python è installato
python --version >nul 2>&1
if errorlevel 1 (
    echo ❌ ERRORE: Python non trovato!
    echo.
    echo 📥 Installa Python da: https://www.python.org/downloads/
    echo ⚠️  Durante l'installazione spunta "Add Python to PATH"
    echo.
    pause
    exit /b 1
)

:: Verifica se le dipendenze sono installate
echo 🔍 Controllo dipendenze...
pip show PyQt6 >nul 2>&1
if errorlevel 1 (
    echo 📦 Installazione dipendenze in corso...
    pip install -r requirements.txt
    if errorlevel 1 (
        echo ❌ Errore durante l'installazione delle dipendenze!
        pause
        exit /b 1
    )
)

:: Avvio del software
echo.
echo ✅ Tutto pronto! Avvio Advanced Jingle Machine v1.5...
echo.
python main.py

:: Se c'è un errore
if errorlevel 1 (
    echo.
    echo ❌ Errore durante l'avvio del software!
    echo 📞 Controlla README.md per assistenza
    echo.
    pause
) 