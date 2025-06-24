@echo off
echo.
echo ========================================
echo    RUNTIME RADIO v1.5 - Avvio
echo ========================================
echo.

REM Controlla se Python è installato
python --version >nul 2>&1
if errorlevel 1 (
    echo ERRORE: Python non è installato sul sistema.
    echo Scarica Python da: https://www.python.org/downloads/
    echo.
    pause
    exit /b 1
)

echo Controllo dipendenze...
pip show pygame >nul 2>&1
if errorlevel 1 (
    echo Installazione dipendenze necessarie...
    pip install -r requirements.txt
)

echo.
echo Avvio RUNTIME RADIO v1.5...
echo.

cd src
python main.py

echo.
 