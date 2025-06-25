# 🖥️ Istruzioni per Windows - Advanced Jingle Machine v1.5

## 🚀 Metodo Super Rapido (CONSIGLIATO)

### 1. **Doppio Click su `AVVIA_WINDOWS.bat`**
- L'eseguibile standalone (45MB) si avvia **istantaneamente**:
  - ✅ **Nessuna installazione** richiesta
  - ✅ **Nessuna dipendenza** da installare  
  - ✅ **Avvio immediato** di Advanced Jingle Machine

**È tutto qui!** L'eseguibile contiene tutto il necessario.

---

## 🔧 Metodo Alternativo (Python)

### 1. **Doppio Click su `start_windows.bat`**
- Il file batch automatico farà tutto per te:
  - ✅ Controlla se Python è installato
  - ✅ Installa le dipendenze necessarie
  - ✅ Avvia Advanced Jingle Machine

**Usa questo metodo solo se preferisci l'installazione Python classica.**

---

## 🔧 Installazione Manuale

### 1. **Installa Python**
1. Vai su [python.org/downloads](https://www.python.org/downloads/)
2. Scarica **Python 3.8 o superiore**
3. **⚠️ IMPORTANTE**: Durante l'installazione spunta **"Add Python to PATH"**
4. Completa l'installazione

### 2. **Apri PowerShell o Prompt dei Comandi**
- **PowerShell**: Tasto Win + X → "Windows PowerShell"
- **Prompt**: Tasto Win + R → scrivi "cmd" → Invio

### 3. **Naviga nella cartella**
```cmd
cd C:\percorso\della\cartella\AJM-free
```
*Sostituisci con il percorso reale dove hai estratto i file*

### 4. **Installa le dipendenze**
```cmd
pip install -r requirements.txt
```

### 5. **Avvia il software**
```cmd
python main.py
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

## 🆘 Risoluzione Problemi Windows

### "python non è riconosciuto come comando interno o esterno"
**Causa**: Python non è nel PATH
**Soluzione**:
1. Reinstalla Python da [python.org](https://www.python.org/downloads/)
2. **Spunta "Add Python to PATH"** durante l'installazione
3. Riavvia il computer

### "Accesso negato" o errori di permessi
**Soluzione**:
```cmd
pip install --user -r requirements.txt
```

### File batch non si avvia
1. **Click destro** su `start_windows.bat`
2. **"Esegui come amministratore"**
3. Se non funziona, usa il metodo manuale sopra

### Audio non funziona
1. Controlla che i **driver audio** siano aggiornati
2. Chiudi altri programmi che usano l'audio
3. Verifica che il **volume di sistema** non sia a zero

### Antivirus blocca l'esecuzione
1. **Aggiungi eccezione** per la cartella AJM-free
2. Marca `start_windows.bat` e `main.py` come **file sicuri**

---

## 💡 Suggerimenti per Windows

### Performance Ottimali:
- **Chiudi programmi inutili** prima dell'uso live
- **Disabilita Windows Defender** temporaneamente per eventi critici
- Usa **SSD** per file audio grandi

### Sicurezza:
- **Non eseguire come amministratore** a meno che necessario
- **Backup** della configurazione: copia `jingle_config.json`

### Compatibilità:
- ✅ **Windows 10** (consigliato)
- ✅ **Windows 11** (supportato)
- ⚠️ **Windows 7/8** (potrebbero servire aggiornamenti aggiuntivi)

---

## 📞 Supporto Windows

**Problemi specifici Windows?**
- Verifica **Windows Update** aggiornato
- Installa **Visual C++ Redistributable** se richiesto
- Controlla che **.NET Framework** sia installato

**Errori con PyQt6?**
```cmd
pip uninstall PyQt6
pip install PyQt6 --force-reinstall
```

---

## 🎉 Tutto Pronto!

Una volta avviato Advanced Jingle Machine v1.5:
- **88 pulsanti** per il tuo audio
- **Sistema coda automatico**
- **Effetti speciali** in colonna 8
- **Personalizzazione completa**

**Buon lavoro con il tuo nuovo studio audio professionale!** 🎙️✨ 