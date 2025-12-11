
import { Link } from 'react-router-dom';

export function Home() {
    return (
        <div className="flex flex-col gap-0">
            {/* Hero Section */}
            <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/20 via-background to-background" />

                <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                    <img src="/sw/rlm/favicon.png" alt="Official Logo" className="w-24 h-24 mx-auto mb-6 drop-shadow-2xl animate-fade-in" />

                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-primary mb-8 animate-fade-in">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
                        </span>
                        v1.4.1 Public Beta
                    </div>

                    <h1 className="text-6xl md:text-8xl font-bold tracking-tight mb-8 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/50 animate-slide-up">
                        Broadcast<br />
                        <span className="text-primary">Perfection</span>
                    </h1>

                    <p className="text-xl md:text-2xl text-zinc-400 mb-12 max-w-3xl mx-auto leading-relaxed animate-slide-up" style={{ animationDelay: '0.1s' }}>
                        Runtime Radio Live Machine Pro è la cartigliera digitale definitiva.
                        <br />
                        Progettata per emittenti radiofoniche, streamer e teatri che non accettano compromessi.
                    </p>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
                        <a href="/sw/rlm/RLM_141_Beta.zip" download className="w-full md:w-auto px-8 py-4 bg-primary text-black font-bold rounded-xl hover:bg-cyan-400 transition-all transform hover:scale-105 shadow-lg shadow-primary/20 flex items-center justify-center">
                            Scarica per Windows
                        </a>
                        <Link to="/wiki" className="w-full md:w-auto px-8 py-4 bg-white/5 border border-white/10 text-white font-semibold rounded-xl hover:bg-white/10 transition-all">
                            Esplora la Wiki
                        </Link>
                    </div>
                </div>
            </section>

            {/* Value Proposition */}
            <section className="py-32 bg-zinc-900/30 border-y border-white/5">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid md:grid-cols-3 gap-12">
                        <div className="space-y-4">
                            <h3 className="text-2xl font-bold text-white">Affidabilità Totale</h3>
                            <p className="text-zinc-400 leading-relaxed">
                                Costruito su Electron e Web Audio API, il motore audio è separato dall'interfaccia.
                                Anche sotto carico pesante, l'audio non salta mai.
                            </p>
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-2xl font-bold text-white">Latenza Zero</h3>
                            <p className="text-zinc-400 leading-relaxed">
                                Trigger istantaneo dei suoni. Dal click al play in meno di 10ms.
                                Perfetto per jingle rapidi e effetti sonori in tempo reale.
                            </p>
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-2xl font-bold text-white">Controllo Assoluto</h3>
                            <p className="text-zinc-400 leading-relaxed">
                                88 Pad completamente configurabili. Colori, volumi, modalità di loop e
                                sovrapposizione personalizzabili per ogni singolo tasto.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Use Cases */}
            <section className="py-32 relative overflow-hidden">
                <div className="max-w-7xl mx-auto px-6 relative z-10">
                    <h2 className="text-4xl md:text-5xl font-bold mb-16 text-center">Designed for Pros</h2>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="p-8 rounded-3xl bg-gradient-to-br from-zinc-900 to-black border border-white/10 hover:border-primary/30 transition-colors">
                            <div className="text-primary text-sm font-bold uppercase tracking-widest mb-4">Radio Broadcast</div>
                            <h3 className="text-3xl font-bold mb-4">La Regia Perfetta</h3>
                            <p className="text-zinc-400 mb-8">
                                Gestisci sigle, stacchi e sottofondi con la precisione di un software da migliaia di euro.
                                Supporto multi-monitor e interfaccia scura per non affaticare la vista in studio.
                            </p>
                            <ul className="space-y-2 text-zinc-300">
                                <li className="flex items-center gap-2">✓ Modalità Talkover</li>
                                <li className="flex items-center gap-2">✓ Gestione Playlist</li>
                                <li className="flex items-center gap-2">✓ Output Routing Avanzato</li>
                            </ul>
                        </div>

                        <div className="p-8 rounded-3xl bg-gradient-to-br from-zinc-900 to-black border border-white/10 hover:border-purple-500/30 transition-colors">
                            <div className="text-purple-500 text-sm font-bold uppercase tracking-widest mb-4">Live Streaming</div>
                            <h3 className="text-3xl font-bold mb-4">Stream Deck Killer</h3>
                            <p className="text-zinc-400 mb-8">
                                Integra la tua regia OBS con una soundboard professionale.
                                Niente più "alt-tab" rischiosi: controlla tutto via MIDI o touch screen.
                            </p>
                            <ul className="space-y-2 text-zinc-300">
                                <li className="flex items-center gap-2">✓ Supporto MIDI Nativo</li>
                                <li className="flex items-center gap-2">✓ Compatibile con Touch Screen</li>
                                <li className="flex items-center gap-2">✓ Leggero sulla CPU</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* Public Beta Info */}
            <section className="py-20 bg-primary/5 border-y border-primary/10">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <div className="inline-block p-3 rounded-full bg-primary/10 mb-6">
                        <span className="text-3xl">🚧</span>
                    </div>
                    <h2 className="text-3xl font-bold mb-6 text-white">Stato del Progetto: Public Beta</h2>
                    <p className="text-zinc-300 mb-8 leading-relaxed">
                        L'applicazione è attualmente in fase di <strong>Public Beta</strong> ed è liberamente scaricabile per un periodo di tempo non ancora stabilito.
                        <br className="hidden md:block" />
                        Il vostro contributo è fondamentale per rendere Runtime Radio Live Machine sempre più stabile e ricca di funzionalità.
                    </p>

                    <div className="bg-zinc-900/80 rounded-2xl p-8 border border-white/10 backdrop-blur-sm">
                        <h3 className="text-xl font-bold mb-4 text-primary">Supporto & Feedback</h3>
                        <p className="text-zinc-400 mb-6">
                            Avete riscontrato un bug o avete suggerimenti per nuove feature?
                            <br />
                            Il team di sviluppo è a vostra disposizione. Contattateci direttamente:
                        </p>
                        <div className="flex flex-col md:flex-row justify-center gap-4 text-white font-medium">
                            <a href="mailto:runtimeradio@gmail.com" className="flex items-center justify-center gap-2 px-6 py-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors border border-white/5">
                                ✉️ runtimeradio@gmail.com
                            </a>
                            <a href="mailto:pizzisimone1972@gmail.com" className="flex items-center justify-center gap-2 px-6 py-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors border border-white/5">
                                ✉️ pizzisimone1972@gmail.com
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Bottom */}
            <section className="py-32 text-center">
                <h2 className="text-4xl font-bold mb-8">Pronto per andare in onda?</h2>
                <p className="text-zinc-400 mb-12 max-w-2xl mx-auto">
                    Scarica la versione gratuita e open source. Nessun costo nascosto, nessuna pubblicità.
                    Solo software professionale.
                </p>
                <a href="/sw/rlm/RLM_141_Beta.zip" download className="inline-block px-12 py-6 bg-white text-black font-bold text-xl rounded-full hover:bg-zinc-200 transition-all transform hover:scale-105">
                    Inizia Ora
                </a>
            </section>
        </div>
    );
}
