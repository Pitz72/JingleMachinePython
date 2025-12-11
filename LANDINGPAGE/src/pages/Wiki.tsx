

export function Wiki() {
    return (
        <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row gap-12">
            {/* Sidebar */}
            <aside className="w-full md:w-64 flex-shrink-0">
                <div className="sticky top-32 space-y-8">
                    <div>
                        <h3 className="font-bold text-white mb-4 px-2">Manuale Utente</h3>
                        <nav className="space-y-1">
                            <a href="#intro" className="block px-2 py-1.5 text-sm text-zinc-400 hover:text-primary hover:bg-white/5 rounded-md transition-colors">Introduzione</a>
                            <a href="#interface" className="block px-2 py-1.5 text-sm text-zinc-400 hover:text-primary hover:bg-white/5 rounded-md transition-colors">Interfaccia</a>
                            <a href="#sounds" className="block px-2 py-1.5 text-sm text-zinc-400 hover:text-primary hover:bg-white/5 rounded-md transition-colors">Gestione Suoni</a>
                            <a href="#midi" className="block px-2 py-1.5 text-sm text-zinc-400 hover:text-primary hover:bg-white/5 rounded-md transition-colors">MIDI & Controlli</a>
                        </nav>
                    </div>
                    <div>
                        <h3 className="font-bold text-white mb-4 px-2">Supporto</h3>
                        <nav className="space-y-1">
                            <a href="#faq" className="block px-2 py-1.5 text-sm text-zinc-400 hover:text-primary hover:bg-white/5 rounded-md transition-colors">FAQ</a>
                            <a href="#troubleshooting" className="block px-2 py-1.5 text-sm text-zinc-400 hover:text-primary hover:bg-white/5 rounded-md transition-colors">Risoluzione Problemi</a>
                        </nav>
                    </div>
                </div>
            </aside>

            {/* Content */}
            <div className="flex-grow prose prose-invert prose-zinc max-w-none">
                <div id="intro" className="mb-16">
                    <h1 className="text-4xl font-bold mb-6">Manuale Utente v1.4.1</h1>
                    <p className="text-xl text-zinc-400 leading-relaxed">
                        Benvenuti nella documentazione ufficiale di <strong>Runtime Radio Live Machine Pro</strong>.
                        Questa guida vi accompagnerà nella configurazione e nell'uso avanzato della cartigliera.
                    </p>
                </div>

                <div id="interface" className="mb-16 scroll-mt-32">
                    <h2 className="text-3xl font-bold mb-6 text-white">1. Panoramica Interfaccia</h2>
                    <p className="mb-4">L'interfaccia è divisa in tre aree principali progettate per l'ergonomia in diretta:</p>
                    <ul className="list-disc pl-6 space-y-2 text-zinc-300 mb-6">
                        <li><strong>HEADER:</strong> Controlli globali, Volume Master, Stop All (Panic Button).</li>
                        <li><strong>GRIGLIA:</strong> 88 pulsanti (Pad) organizzati in righe e colonne per accesso immediato.</li>
                        <li><strong>SIDEBAR:</strong> Accesso rapido alle impostazioni (su mobile/schermi piccoli).</li>
                    </ul>
                    <div className="bg-zinc-900/50 border border-white/10 rounded-xl p-6 mb-6">
                        <h4 className="font-bold text-white mb-2">Anatomia di un Pad</h4>
                        <p className="text-sm text-zinc-400">Ogni pulsante mostra il nome del file, una barra di progresso durante la riproduzione e cambia colore per indicare lo stato attivo.</p>
                    </div>
                </div>

                <div id="sounds" className="mb-16 scroll-mt-32">
                    <h2 className="text-3xl font-bold mb-6 text-white">2. Caricare e Gestire i Suoni</h2>

                    <h3 className="text-xl font-bold mb-4 text-white">Drag & Drop (Consigliato)</h3>
                    <ol className="list-decimal pl-6 space-y-2 text-zinc-300 mb-8">
                        <li>Apri la cartella con i tuoi file audio (MP3, WAV, OGG).</li>
                        <li>Trascina un file direttamente sopra un pulsante grigio (vuoto) o colorato.</li>
                        <li>Il pulsante si configurerà automaticamente con il nome del file.</li>
                    </ol>

                    <h3 className="text-xl font-bold mb-4 text-white">Impostazioni Avanzate Pulsante</h3>
                    <p className="mb-4">Cliccando col <strong>TASTO DESTRO</strong> su un pad, accedi alle proprietà:</p>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <li className="bg-zinc-900 p-4 rounded-lg border border-white/5">
                            <span className="text-primary font-bold block mb-1">Restart (Default)</span>
                            Se premi mentre suona, riparte dall'inizio. Ideale per effetti rapidi.
                        </li>
                        <li className="bg-zinc-900 p-4 rounded-lg border border-white/5">
                            <span className="text-primary font-bold block mb-1">Continue</span>
                            Se premi mentre suona, va in Pausa. Ripremi per riprendere. Per basi e podcast.
                        </li>
                        <li className="bg-zinc-900 p-4 rounded-lg border border-white/5">
                            <span className="text-primary font-bold block mb-1">Overlay</span>
                            Sovrappone più istanze dello stesso suono. Perfetto per applausi o spari.
                        </li>
                        <li className="bg-zinc-900 p-4 rounded-lg border border-white/5">
                            <span className="text-primary font-bold block mb-1">Loop</span>
                            Ripete il suono all'infinito finché non viene fermato manualmente.
                        </li>
                    </ul>
                </div>

                <div id="midi" className="mb-16 scroll-mt-32">
                    <h2 className="text-3xl font-bold mb-6 text-white">3. Integrazione MIDI</h2>
                    <p className="mb-6">
                        Puoi usare controller USB (es. Novation Launchpad, Korg NanoKONTROL) per pilotare l'app senza toccare il mouse.
                    </p>

                    <div className="bg-primary/10 border border-primary/20 rounded-xl p-6">
                        <h3 className="text-lg font-bold text-primary mb-4">MIDI Learn Mode</h3>
                        <ol className="list-decimal pl-6 space-y-2 text-zinc-300">
                            <li>Clicca su "Impostazioni" (icona ingranaggio).</li>
                            <li>Attiva l'interruttore <strong>MIDI Learn Mode</strong>.</li>
                            <li>Clicca col mouse sul pulsante che vuoi mappare.</li>
                            <li>Premi il tasto fisico sul tuo controller.</li>
                            <li>Fatto! Disattiva la modalità Learn per salvare.</li>
                        </ol>
                    </div>
                </div>

                <div id="troubleshooting" className="mb-16 scroll-mt-32">
                    <h2 className="text-3xl font-bold mb-6 text-white">Risoluzione Problemi</h2>
                    <div className="space-y-6">
                        <div>
                            <h4 className="font-bold text-white mb-2">Non sento nulla</h4>
                            <p className="text-zinc-400">Controlla che il Volume Master (in alto) non sia a zero e che il dispositivo audio di Windows sia corretto.</p>
                        </div>
                        <div>
                            <h4 className="font-bold text-white mb-2">L'app è lenta</h4>
                            <p className="text-zinc-400">Evita di caricare file WAV enormi (es. registrazioni di 1 ora) su troppi tasti. Usa MP3 per file lunghi per risparmiare memoria RAM.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
