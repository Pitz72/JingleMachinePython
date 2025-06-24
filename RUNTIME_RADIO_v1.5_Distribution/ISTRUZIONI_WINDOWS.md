# 🖥️ RUNTIME RADIO v1.5 - Istruzioni per WINDOWS

## 🚀 AVVIO RAPIDO

### Metodo 1: **PIÙ SEMPLICE** ⭐
1. **Doppio click** su `AVVIA_RUNTIME_RADIO.bat`  
2. **Fine!** Il sistema fa tutto automaticamente

### Metodo 2: Manuale
1. Apri **Prompt dei Comandi** (tasto Windows + R → `cmd`)
2. Naviga alla cartella: `cd C:\percorso\alla\cartella`
3. `pip install -r requirements.txt`
4. `python src/main.py`

## 🔧 Se Non Funziona

### "Python non riconosciuto"
1. Vai su **[python.org/downloads](https://www.python.org/downloads/)**
2. Scarica **Python 3.11** o più recente
3. Durante l'installazione **SPUNTA**: ✅ **"Add Python to PATH"**
4. Riavvia il computer
5. Prova di nuovo

### "Errore dipendenze"
1. Apri **Prompt dei Comandi come Amministratore**
2. `pip install --upgrade pip`
3. `pip install -r requirements.txt`

### Il suono non parte
1. **Impostazioni Windows** → **Privacy e sicurezza** → **Microfono**
2. Assicurati che **"Consenti alle app desktop di accedere al microfono"** sia **ON**
3. Prova a chiudere altre app che usano l'audio

## 💡 Consigli Windows

- **Antivirus**: Aggiungi la cartella alle esclusioni se l'antivirus blocca Python
- **Performance**: Chiudi browser e app pesanti per migliori prestazioni  
- **File Audio**: Metti i tuoi MP3 in una cartella facile da trovare
- **Backup**: Copia `jingle_config.json` per salvare le tue impostazioni

---
**Tutto funziona? Leggi `GUIDA_UTENTE.md` per imparare a usare RUNTIME RADIO!** 🎙️ 