# 🎙️ Advanced Jingle Machine v1.5

## 📻 Che cos'è?

**Advanced Jingle Machine** è una console audio professionale gratuita progettata per radio, podcast, DJ e eventi live. Con 88 pulsanti personalizzabili, sistema di coda automatico e interfaccia professionale, è l'ideale per gestire jingle, effetti sonori e basi musicali in tempo reale.

**🎯 Caratteristiche Principali:**
- ✅ **88 pulsanti audio** personalizzabili (griglia 8x11)
- ✅ **Sistema coda automatico** con priorità intelligenti
- ✅ **Colonna effetti speciali** sempre sovrapposti
- ✅ **Progress bar tempo reale** per ogni traccia
- ✅ **128 canali audio simultanei** per uso professionale
- ✅ **Personalizzazione totale**: colori, nomi, volumi
- ✅ **Schermata di benvenuto** con informazioni complete

## 👨‍💻 Autore e Sviluppo

**Autore**: Simone Pizzi  
**Metodologia**: Sviluppo sperimentale con LLM  
**Website**: [pizzisimone.runtimeradio.it](https://pizzisimone.runtimeradio.it)  
**Icona**: `advjingle.png` (presente in questa cartella)

## 💝 Software Gratuito

Advanced Jingle Machine è **completamente gratuito** e liberamente scaricabile. Anche se sviluppato mediante l'uso di LLM, ha richiesto ingegno, impegno e ore di lavoro.

Se lo trovi utile, considera una donazione: **[paypal.me/runtimeradio](https://paypal.me/runtimeradio)**

## 🎯 A Chi è Destinato?

- **📻 Stazioni Radio**: Jingle, spot pubblicitari, sottofondo musicale
- **🎧 Podcaster**: Effetti sonori, intro, outro, stacchetti
- **🎵 DJ**: Sample, drop, transizioni musicali
- **🎪 Eventi Live**: Applausi, effetti speciali, musica d'atmosfera

## 🚀 Come Iniziare?

1. **Installa Python 3.8+** da [python.org](https://www.python.org/downloads/)
2. **Apri un terminale** nella cartella del software
3. **Installa le dipendenze**: `pip install -r requirements.txt`
4. **Avvia il software**: `python src/main.py`

### 💡 Prima volta?
Alla prima esecuzione apparirà una schermata di benvenuto con tutte le informazioni. Clicca "🚀 AVVIA SOFTWARE" per iniziare!

## 🛠️ Funzionalità Avanzate

### Sistema Audio Professionale
- **128 canali simultanei** per riproduzione multipla
- **Formati supportati**: MP3, WAV, OGG e altri formati audio standard
- **Latenza minima** ottimizzata per uso live

### Modalità di Riproduzione
- **Loop**: Riproduzione continua (ideale per sottofondo)
- **Continua**: Pausa/riprendi (controllo preciso)
- **Da Capo**: Stop/riavvio (gestione tradizionale)

### Sistema Coda Intelligente
- **Priorità automatiche**: Tracce normali hanno priorità su loop
- **Accodamento**: Tracce si mettono in coda automaticamente
- **Effetti sovrapposti**: Colonna 8 dedicata agli effetti speciali

## 🎨 Personalizzazione

Ogni pulsante può essere completamente personalizzato:
- **Nome custom** (sovrascrive il nome del file)
- **Colore personalizzato** per organizzazione visiva
- **Volume specifico** (da 0.0 a 1.0)
- **Modalità di riproduzione** individuale

**Come fare**: Click destro su qualsiasi pulsante → "Impostazioni Pulsante..."

## 📊 Feedback Visivo

- **Bordo verde**: Audio in riproduzione
- **Progress bar**: Avanzamento traccia (audio non-loop)
- **Lampeggio giallo/arancione**: Fine traccia imminente
- **Lampeggio blu/ciano**: Traccia in coda
- **Tooltip dinamici**: Informazioni complete al passaggio del mouse

## 🆘 Risoluzione Problemi

### "Python non trovato"
- Installa Python da [python.org](https://www.python.org/downloads/)
- Durante l'installazione, spunta "Add Python to PATH"

### "Errore dipendenze"
```bash
pip install PyQt6 pygame
```

### File audio non riconosciuti
- Usa formati standard: MP3, WAV, OGG
- Controlla che i file non siano corrotti

### L'applicazione non si avvia
1. Verifica Python: `python --version` (deve essere 3.8+)
2. Controlla di essere nella cartella corretta
3. Prova: `python -m pip install --upgrade pip`

## 📧 Supporto

- **Documentazione**: Cartella `docs/` per informazioni tecniche
- **Website**: [pizzisimone.runtimeradio.it](https://pizzisimone.runtimeradio.it)
- **Bug report**: Contatta tramite il sito web

---

## 🎉 Buon Lavoro!

Advanced Jingle Machine è stato progettato per essere **facile da usare** ma **potente nelle funzionalità**. Che tu sia un radio DJ, un podcaster o organizzi eventi live, questo software ti aiuterà a gestire il tuo audio in modo professionale.

**Divertiti a creare la tua esperienza audio perfetta!** 🎵✨ 