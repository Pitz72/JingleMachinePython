import React from 'react';
import { SettingsIcon, PlaylistIcon, SunIcon, MoonIcon, DownloadIcon, UploadIcon } from '../icons';
import { useTranslations } from '../../contexts/LanguageContext';

interface TopBarProps {
    appTitle: string;
    theme: string;
    toggleTheme: () => void;
    onSettingsClick: () => void;
    playlistMode: boolean;
    onPlaylistModeChange: (mode: boolean) => void;
    onSaveConfig: () => void;
    onLoadConfig: () => void;
}

const TopBar: React.FC<TopBarProps> = ({
    appTitle,
    theme,
    toggleTheme,
    onSettingsClick,
    playlistMode,
    onPlaylistModeChange,
    onSaveConfig,
    onLoadConfig
}) => {
    const { t } = useTranslations();

    return (
        <header className="h-16 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between px-6 select-none">
            <div className="flex items-center space-x-4">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <h1 className="ml-4 text-xl font-bold text-cyan-400 tracking-wider uppercase">{appTitle}</h1>
            </div>

            <div className="flex items-center space-x-2">
                {/* Playlist Mode */}
                <button
                    onClick={() => onPlaylistModeChange(!playlistMode)}
                    className={`p-2 rounded-lg transition-colors ${playlistMode ? 'bg-cyan-600 text-white' : 'text-zinc-400 hover:bg-zinc-800'}`}
                    title={t('label_playlist_mode')}
                >
                    <PlaylistIcon className="w-5 h-5" />
                </button>

                <div className="h-6 w-px bg-zinc-700 mx-2" />

                {/* Save/Load */}
                <button
                    onClick={onSaveConfig}
                    className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
                    title={t('save_config_button')}
                >
                    <DownloadIcon className="w-5 h-5" />
                </button>
                <button
                    onClick={onLoadConfig}
                    className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
                    title={t('load_config_button')}
                >
                    <UploadIcon className="w-5 h-5" />
                </button>

                <div className="h-6 w-px bg-zinc-700 mx-2" />

                {/* Theme */}
                <button
                    onClick={toggleTheme}
                    className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
                >
                    {theme === 'dark' ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
                </button>

                {/* Global Settings */}
                <button
                    onClick={onSettingsClick}
                    className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
                    title={t('global_settings_title')}
                >
                    <SettingsIcon className="w-5 h-5" />
                </button>
            </div>
        </header>
    );
};

export default TopBar;
