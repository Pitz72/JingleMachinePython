import React from 'react';

interface MainGridProps {
    children: React.ReactNode;
}

const MainGrid: React.FC<MainGridProps> = ({ children }) => {
    return (
        <div className="flex-1 bg-zinc-950 relative overflow-hidden p-4 flex items-center justify-center">
            {/* Background Grid Pattern */}
            <div className="absolute inset-0 opacity-5 pointer-events-none"
                style={{
                    backgroundImage: 'radial-gradient(#4b5563 1px, transparent 1px)',
                    backgroundSize: '20px 20px'
                }}
            />

            {/* Content Container - Centered and Scaled */}
            <div className="w-full h-full max-w-[1600px] max-h-[900px] flex flex-col">
                {children}
            </div>
        </div>
    );
};

export default MainGrid;
