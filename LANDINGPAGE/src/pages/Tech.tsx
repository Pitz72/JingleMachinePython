

export function Tech() {
    return (
        <div className="max-w-7xl mx-auto px-6 py-20">
            <div className="text-center mb-20">
                <h1 className="text-5xl font-bold mb-6">Specifiche Tecniche</h1>
                <p className="text-xl text-zinc-400 max-w-2xl mx-auto">
                    Un'analisi approfondita dell'architettura che rende Runtime Radio Live Machine Pro unica nel suo genere.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-16 items-start">
                <div>
                    <h2 className="text-3xl font-bold mb-8">The Stack</h2>
                    <div className="space-y-8">
                        <div className="group">
                            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors">React 19 Core</h3>
                            <p className="text-zinc-400">
                                L'interfaccia utente è costruita sull'ultima versione di React, sfruttando il Concurrent Mode per garantire che la UI rimanga fluida anche durante operazioni audio intensive.
                            </p>
                        </div>
                        <div className="group">
                            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors">Web Audio API</h3>
                            <p className="text-zinc-400">
                                Non usiamo librerie audio di alto livello. Interagiamo direttamente con il grafo audio del browser (C++) per ottenere latenze inferiori ai 10ms e un mixing preciso al campione.
                            </p>
                        </div>
                        <div className="group">
                            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors">Electron Shell</h3>
                            <p className="text-zinc-400">
                                Il wrapper Electron fornisce l'accesso al file system locale per il drag & drop nativo e la persistenza dei dati, oltre a garantire un ambiente di esecuzione isolato e stabile.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-zinc-900 rounded-2xl p-8 border border-white/10">
                    <h3 className="text-xl font-bold mb-6">System Requirements</h3>
                    <table className="w-full text-left">
                        <tbody className="divide-y divide-white/10">
                            <tr>
                                <td className="py-4 text-zinc-400">OS</td>
                                <td className="py-4 font-medium">Windows 10/11 (64-bit)</td>
                            </tr>
                            <tr>
                                <td className="py-4 text-zinc-400">Processor</td>
                                <td className="py-4 font-medium">Intel Core i3 / AMD Ryzen 3 or better</td>
                            </tr>
                            <tr>
                                <td className="py-4 text-zinc-400">RAM</td>
                                <td className="py-4 font-medium">4 GB (8 GB Recommended)</td>
                            </tr>
                            <tr>
                                <td className="py-4 text-zinc-400">Storage</td>
                                <td className="py-4 font-medium">200 MB available space</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
