@echo off
title Advanced Jingle Machine v1.5 - Avvio Diretto
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
echo ✅ Avvio diretto dell'eseguibile...
echo.

:: Avvia l'eseguibile
AdvancedJingleMachine.exe

:: Se c'è un errore
if errorlevel 1 (
    echo.
    echo ❌ Errore durante l'avvio!
    echo.
    echo 💡 ALTERNATIVE:
    echo 1. Prova a eseguire come amministratore
    echo 2. Controlla che tutti i file siano presenti
    echo 3. Usa start_windows.bat per installazione Python
    echo.
    pause
) 