import { Link, Outlet, useLocation } from 'react-router-dom';

export function MainLayout() {
    const location = useLocation();
    const isHome = location.pathname === '/';

    return (
        <div className="min-h-screen bg-background text-white selection:bg-primary selection:text-black flex flex-col">
            {/* Navigation */}
            <nav className={`fixed w-full z-50 transition-all duration-300 ${isHome ? 'bg-transparent hover:bg-background/80 hover:backdrop-blur-md' : 'bg-background/80 backdrop-blur-md border-b border-white/10'}`}>
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-3 group">
                        <img src="/sw/rlm/header-logo.png" alt="RRJM Logo" className="w-8 h-8 group-hover:scale-110 transition-transform" />
                        <span className="font-bold text-xl tracking-tight">Runtime Radio Live Machine</span>
                    </Link>

                    <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
                        <Link to="/" className={`hover:text-white transition-colors ${location.pathname === '/' ? 'text-white' : ''}`}>Home</Link>
                        <Link to="/wiki" className={`hover:text-white transition-colors ${location.pathname.startsWith('/wiki') ? 'text-white' : ''}`}>Wiki & Docs</Link>
                        <Link to="/tech" className={`hover:text-white transition-colors ${location.pathname === '/tech' ? 'text-white' : ''}`}>Tech Specs</Link>
                    </div>

                    <a href="/sw/rlm/RLM_141_Beta.zip" download className="bg-white text-black px-6 py-2 rounded-full font-semibold text-sm hover:bg-zinc-200 transition-all transform hover:scale-105">
                        Download Beta
                    </a>
                </div>
            </nav>

            {/* Content */}
            <main className="flex-grow pt-20">
                <Outlet />
            </main>

            {/* Footer */}
            <footer className="py-12 border-t border-white/10 bg-black mt-auto">
                <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="text-zinc-500 text-sm">
                        © 2025 Runtime Radio Project. Open Source Software.
                    </div>
                    <div className="flex gap-6">
                        <a href="https://github.com/Pitz72/JingleMachinePython" className="text-zinc-500 hover:text-primary transition-colors">GitHub</a>
                        <Link to="/wiki" className="text-zinc-500 hover:text-primary transition-colors">Documentation</Link>
                        <Link to="/tech" className="text-zinc-500 hover:text-primary transition-colors">Architecture</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
