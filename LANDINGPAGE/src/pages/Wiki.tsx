

export function Wiki() {
    return (
        <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row gap-12">
            {/* Sidebar */}
            <aside className="hidden md:block w-64 flex-shrink-0">
                <div className="sticky top-32 space-y-8">
                    <div>
                        <h3 className="font-bold text-white mb-4 px-2">Manuale Utente</h3>
                        <nav className="space-y-1">
                            <a href="#intro" className="block px-2 py-1.5 text-sm text-zinc-400 hover:text-primary hover:bg-white/5 rounded-md transition-colors">Introduzione</a>
                            <a href="#interface" className="block px-2 py-1.5 text-sm text-zinc-400 hover:text-primary hover:bg-white/5 rounded-md transition-colors">1. Interfaccia</a>
                            <a href="#sounds" className="block px-2 py-1.5 text-sm text-zinc-400 hover:text-primary hover:bg-white/5 rounded-md transition-colors">2. Gestione Suoni</a>
                            <a href="#midi" className="block px-2 py-1.5 text-sm text-zinc-400 hover:text-primary hover:bg-white/5 rounded-md transition-colors">3. MIDI & Controlli</a>
                            <a href="#global" className="block px-2 py-1.5 text-sm text-zinc-400 hover:text-primary hover:bg-white/5 rounded-md transition-colors">4. Impostazioni Globali</a>
                            <a href="#shortcuts" className="block px-2 py-1.5 text-sm text-zinc-400 hover:text-primary hover:bg-white/5 rounded-md transition-colors">5. Scorciatoie</a>
                        </nav>
                    </div>
                    <div>
                        <h3 className="font-bold text-white mb-4 px-2">Supporto</h3>
                        <nav className="space-y-1">
                            <a href="#faq" className="block px-2 py-1.5 text-sm text-zinc-400 hover:text-primary hover:bg-white/5 rounded-md transition-colors">Domande Frequenti (FAQ)</a>
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
                    <p className="mb-4 text-lg">L'interfaccia è stata progettata per la massima visibilità in ambienti di regia scuri. È divisa in tre aree logiche:</p>

                    <div className="grid md:grid-cols-2 gap-6 mb-8">
                        <div className="bg-zinc-900/50 p-6 rounded-xl border border-white/5">
                            <h4 className="font-bold text-primary mb-2">HEADER (Top Bar)</h4>
                            <p className="text-sm text-zinc-400">Contiene i controlli globali: Volume Master, Orologio, Panic Button (STOP ALL) e accesso alle impostazioni.</p>
                        </div>
                        <div className="bg-zinc-900/50 p-6 rounded-xl border border-white/5">
                            <h4 className="font-bold text-primary mb-2">GRIGLIA (Main Area)</h4>
                            <p className="text-sm text-zinc-400">La matrice 8x11 di Pad. È il cuore dell'applicazione dove carichi e suoni i tuoi jingle.</p>
                        </div>
                    </div>

                    <div className="bg-zinc-900/50 border border-white/10 rounded-xl p-6 mb-6">
                        <h4 className="font-bold text-white mb-4">Anatomia di un Pad</h4>
                        <ul className="space-y-2 text-sm text-zinc-400">
                            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-green-500"></span> <strong>Nome File:</strong> Il titolo della traccia caricata (modificabile).</li>
                            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-blue-500"></span> <strong>Stato:</strong> Cambia colore quando in riproduzione.</li>
                            <li className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-yellow-500"></span> <strong>Progress Bar:</strong> Barra visiva che mostra l'avanzamento della traccia.</li>
                        </ul>
                    </div>
                </div>

                <div id="sounds" className="mb-16 scroll-mt-32">
                    <h2 className="text-3xl font-bold mb-6 text-white">2. Caricare e Gestire i Suoni</h2>

                    <h3 className="text-xl font-bold mb-4 text-white border-b border-white/10 pb-2">Come Caricare</h3>
                    <div className="grid md:grid-cols-2 gap-8 mb-8">
                        <div>
                            <h4 className="font-bold text-white mb-2">Metodo 1: Drag & Drop (Consigliato)</h4>
                            <ol className="list-decimal pl-5 space-y-2 text-zinc-300">
                                <li>Apri la cartella di Windows con i tuoi file audio.</li>
                                <li>Trascina un file (`.mp3`, `.wav`) sopra un pulsante qualsiasi.</li>
                                <li>Il pulsante si configurerà istantaneamente.</li>
                            </ol>
                        </div>
                        <div>
                            <h4 className="font-bold text-white mb-2">Metodo 2: Caricamento Manuale</h4>
                            <ol className="list-decimal pl-5 space-y-2 text-zinc-300">
                                <li>Clicca col <strong>Tasto Destro</strong> su un pulsante vuoto.</li>
                                <li>Nel menu "Impostazioni Pulsante", clicca su "Carica File".</li>
                                <li>Scegli il file nel browser dei file.</li>
                            </ol>
                        </div>
                    </div>

                    <h3 className="text-xl font-bold mb-4 text-white border-b border-white/10 pb-2">Impostazioni Avanzate Pulsante</h3>
                    <p className="mb-4">Cliccando col <strong>TASTO DESTRO</strong> su un pad, accedi alle sue proprietà:</p>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                        <li className="bg-zinc-900 p-4 rounded-lg border border-white/5">
                            <span className="text-primary font-bold block mb-1">Color Coding</span>
                            Assegna un colore specifico (es. Rosso per Jingle, Verde per Basi) per raggruppare i suoni visivamente.
                        </li>
                        <li className="bg-zinc-900 p-4 rounded-lg border border-white/5">
                            <span className="text-primary font-bold block mb-1">Volume Trim</span>
                            Regola il volume del singolo clip indipendentemente dal master. Utile per normalizzare tracce con livelli diversi.
                        </li>
                    </ul>

                    <h4 className="font-bold text-white mb-4">Modalità di Riproduzione (Playback Modes)</h4>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm border-collapse">
                            <thead>
                                <tr className="border-b border-white/10">
                                    <th className="py-2 text-primary">Modalità</th>
                                    <th className="py-2 text-primary">Comportamento</th>
                                    <th className="py-2 text-primary">Utilizzo Tipico</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 text-zinc-300">
                                <tr>
                                    <td className="py-3 font-bold">Restart</td>
                                    <td className="py-3">Riapre il file dall'inizio ad ogni click.</td>
                                    <td className="py-3">Effetti sonori brevi, Laser, Airhorn.</td>
                                </tr>
                                <tr>
                                    <td className="py-3 font-bold">Continue</td>
                                    <td className="py-3">Play/Pausa. Cliccando ferma, ricliccando riprende.</td>
                                    <td className="py-3">Basi musicali, Podcast lunghi, Interviste.</td>
                                </tr>
                                <tr>
                                    <td className="py-3 font-bold">Overlay</td>
                                    <td className="py-3">Sovrappone più esecuzioni dello stesso suono.</td>
                                    <td className="py-3">Applausi, Risate, Rumori ambientali.</td>
                                </tr>
                                <tr>
                                    <td className="py-3 font-bold">Loop</td>
                                    <td className="py-3">Ripete il file all'infinito.</td>
                                    <td className="py-3">Tappeti sonori, Ambient, Loop di batteria.</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div id="midi" className="mb-16 scroll-mt-32">
                    <h2 className="text-3xl font-bold mb-6 text-white">3. Integrazione MIDI</h2>
                    <p className="mb-6">
                        Collega controller esterni (es. Novation Launchpad, AKAI, Korg) per un'esperienza tattile.
                    </p>

                    <div className="bg-primary/5 border border-primary/20 rounded-xl p-6">
                        <h3 className="text-lg font-bold text-primary mb-4 flex items-center gap-2">
                            <span>🎛️</span> MIDI Learn Mode
                        </h3>
                        <ol className="list-decimal pl-6 space-y-3 text-zinc-300">
                            <li>Clicca su "Impostazioni" (icona ingranaggio).</li>
                            <li>Attiva l'interruttore <strong>MIDI Learn Mode</strong>. I tasti diventeranno evidenziati.</li>
                            <li>Clicca col mouse sul pulsante virtuale che vuoi mappare.</li>
                            <li>Premi il pulsante fisico sul tuo controller.</li>
                            <li>Ripeti per tutti i tasti desiderati.</li>
                            <li>Disattiva MIDI Learn per salvare e uscire.</li>
                        </ol>
                    </div>
                </div>

                <div id="global" className="mb-16 scroll-mt-32">
                    <h2 className="text-3xl font-bold mb-6 text-white">4. Impostazioni Globali</h2>
                    <ul className="space-y-4">
                        <li className="bg-zinc-900 p-6 rounded-xl border border-white/5">
                            <h4 className="font-bold text-white mb-2">Salvataggio Configurazioni (.rrlm / .json)</h4>
                            <p className="text-zinc-400 mb-2">Puoi esportare l'intera configurazione della cartigliera per backup o per trasferirla su un altro PC.</p>
                            <div className="text-xs bg-black/50 p-3 rounded text-zinc-500 font-mono">
                                Nota: Il file di configurazione salva i percorsi dei file e i colori/volumi, ma NON include i file audio fisici.
                                Assicurati di copiare anche la cartella dei suoni se cambi PC.
                            </div>
                        </li>
                        <li className="bg-zinc-900 p-6 rounded-xl border border-white/5">
                            <h4 className="font-bold text-white mb-2">Temi</h4>
                            <p className="text-zinc-400">Scegli tra tema Chiaro (Light) o Scuro (Dark) in base all'illuminazione del tuo studio.</p>
                        </li>
                    </ul>
                </div>

                <div id="shortcuts" className="mb-16 scroll-mt-32">
                    <h2 className="text-3xl font-bold mb-6 text-white">5. Scorciatoie da Tastiera</h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="bg-zinc-900 p-4 rounded text-center border border-white/5">
                            <kbd className="px-2 py-1 bg-zinc-700 rounded text-white font-mono text-sm">ESC</kbd>
                            <div className="text-xs text-zinc-400 mt-2">Panic Button (Stop All)</div>
                        </div>
                        <div className="bg-zinc-900 p-4 rounded text-center border border-white/5">
                            <kbd className="px-2 py-1 bg-zinc-700 rounded text-white font-mono text-sm">1 - 9</kbd>
                            <div className="text-xs text-zinc-400 mt-2">Trigger Riga 1</div>
                        </div>
                        <div className="bg-zinc-900 p-4 rounded text-center border border-white/5">
                            <kbd className="px-2 py-1 bg-zinc-700 rounded text-white font-mono text-sm">CTRL + Z</kbd>
                            <div className="text-xs text-zinc-400 mt-2">Undo</div>
                        </div>
                        <div className="bg-zinc-900 p-4 rounded text-center border border-white/5">
                            <kbd className="px-2 py-1 bg-zinc-700 rounded text-white font-mono text-sm">CTRL + Y</kbd>
                            <div className="text-xs text-zinc-400 mt-2">Redo</div>
                        </div>
                    </div>
                </div>

                <div id="faq" className="mb-16 scroll-mt-32">
                    <h2 className="text-3xl font-bold mb-8 text-white">Domande Frequenti (FAQ)</h2>

                    <div className="space-y-4">
                        <details className="group bg-zinc-900/40 rounded-xl border border-white/5 overflow-hidden">
                            <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-zinc-900/60 transition-colors">
                                <h4 className="font-bold text-white">I pulsanti non suonano, cosa faccio?</h4>
                                <span className="transform group-open:rotate-180 transition-transform text-zinc-400">▼</span>
                            </summary>
                            <div className="px-6 pb-6 text-zinc-400 leading-relaxed border-t border-white/5 pt-4">
                                <p>Controlla tre cose:</p>
                                <ul className="list-disc pl-5 mt-2 space-y-1">
                                    <li>Il <strong>Master Volume</strong> in alto a destra non deve essere a zero.</li>
                                    <li>Verifica che il dispositivo di uscita audio di Windows sia corretto.</li>
                                    <li>Assicurati che il file audio originale non sia stato spostato o cancellato dal disco.</li>
                                </ul>
                            </div>
                        </details>

                        <details className="group bg-zinc-900/40 rounded-xl border border-white/5 overflow-hidden">
                            <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-zinc-900/60 transition-colors">
                                <h4 className="font-bold text-white">Che formati audio sono supportati?</h4>
                                <span className="transform group-open:rotate-180 transition-transform text-zinc-400">▼</span>
                            </summary>
                            <div className="px-6 pb-6 text-zinc-400 leading-relaxed border-t border-white/5 pt-4">
                                <p>L'app supporta nativamente <strong>MP3, WAV, OGG e AAC</strong>. Per le migliori prestazioni e loop perfetti, consigliamo il formato <strong>WAV</strong>.</p>
                            </div>
                        </details>

                        <details className="group bg-zinc-900/40 rounded-xl border border-white/5 overflow-hidden">
                            <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-zinc-900/60 transition-colors">
                                <h4 className="font-bold text-white">Windows SmartScreen mi blocca l'installazione. È un virus?</h4>
                                <span className="transform group-open:rotate-180 transition-transform text-zinc-400">▼</span>
                            </summary>
                            <div className="px-6 pb-6 text-zinc-400 leading-relaxed border-t border-white/5 pt-4">
                                <p>Assolutamente no. Questo avviso appare perché l'applicazione è nuova e non ha ancora una "reputazione" o un certificato digitale costoso presso Microsoft. Puoi procedere sicuro cliccando su <strong>"Ulteriori informazioni"</strong> e poi <strong>"Esegui comunque"</strong>.</p>
                            </div>
                        </details>

                        <details className="group bg-zinc-900/40 rounded-xl border border-white/5 overflow-hidden">
                            <summary className="flex items-center justify-between p-6 cursor-pointer hover:bg-zinc-900/60 transition-colors">
                                <h4 className="font-bold text-white">Posso usare file molto lunghi (es. Podcast interi)?</h4>
                                <span className="transform group-open:rotate-180 transition-transform text-zinc-400">▼</span>
                            </summary>
                            <div className="px-6 pb-6 text-zinc-400 leading-relaxed border-t border-white/5 pt-4">
                                <p>Sì, ma con riserva. L'app carica i file interamente in RAM per garantire latenza zero. Se carichi 50 file da 1 ora l'uno, potresti saturare la memoria del PC. Per basi e jingle non c'è nessun problema.</p>
                            </div>
                        </details>
                    </div>
                </div>

                <div id="troubleshooting" className="mb-16 scroll-mt-32">
                    <h2 className="text-3xl font-bold mb-6 text-white">Risoluzione Problemi</h2>
                    <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-xl">
                        <h4 className="font-bold text-red-400 mb-2">Reset di Emergenza</h4>
                        <p className="text-zinc-400">
                            Se l'applicazione dovesse bloccarsi completamente, puoi provare a cancellare la cache locale.
                            <strong>Attenzione:</strong> questo cancellerà la tua configurazione se non l'hai salvata in un file .RRLM/.JSON.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
