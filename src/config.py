"""
Sistema di configurazione centralizzata per Advanced Jingle Machine
"""
import os
import json
from typing import Dict, Any


class Config:
    """Classe singleton per la gestione centralizzata della configurazione"""

    _instance = None
    _config_data = {}

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance._load_config()
        return cls._instance

    def _load_config(self):
        """Carica la configurazione da file o usa valori di default"""
        config_path = os.path.join(os.path.dirname(__file__), 'config.json')

        # Configurazione di default
        default_config = {
            "app": {
                "name": "Advanced Jingle Machine",
                "version": "1.6",
                "author": "Simone Pizzi",
                "website": "https://pizzisimone.runtimeradio.it",
                "paypal": "https://paypal.me/runtimeradio"
            },
            "ui": {
                "window_width": 1700,
                "window_height": 550,
                "button_width": 200,
                "button_height": 35,
                "grid_rows": 11,
                "grid_cols": 8,
                "theme": "dark"
            },
            "audio": {
                "channels": 128,
                "default_volume": 1.0,
                "supported_formats": [".mp3", ".wav", ".ogg", ".aac", ".flac"],
                "timer_interval_ms": 50,
                "progress_bar_threshold": 0.15
            },
            "paths": {
                "icon": "advjingle.png",
                "config_file": "jingle_config.json",
                "resources": "resources"
            },
            "colors": {
                "default_button": "#3E3E3E",
                "overlay_button": "#4a4a4a",
                "playing_border": "#00FF00",
                "queued_border": "#007BFF",
                "ending_border": "#FFA500",
                "background": "#2E2E2E",
                "text": "#FFFFFF"
            },
            "debug": {
                "enabled": False,
                "log_level": "INFO",
                "performance_monitoring": False
            }
        }

        # Carica configurazione personalizzata se esiste
        if os.path.exists(config_path):
            try:
                with open(config_path, 'r', encoding='utf-8') as f:
                    user_config = json.load(f)
                # Merge con configurazione di default
                self._merge_config(default_config, user_config)
            except (json.JSONDecodeError, IOError) as e:
                print(f"Errore caricamento configurazione: {e}. Uso configurazione di default.")
                self._config_data = default_config
        else:
            self._config_data = default_config

    def _merge_config(self, default: Dict[str, Any], user: Dict[str, Any]):
        """Merge ricorsivo delle configurazioni"""
        for key, value in default.items():
            if key in user:
                if isinstance(value, dict) and isinstance(user[key], dict):
                    self._merge_config(value, user[key])
                else:
                    default[key] = user[key]
        self._config_data = default

    def get(self, key_path: str, default=None):
        """Ottieni un valore dalla configurazione usando dot notation"""
        keys = key_path.split('.')
        value = self._config_data

        try:
            for key in keys:
                value = value[key]
            return value
        except (KeyError, TypeError):
            return default

    def set(self, key_path: str, value: Any):
        """Imposta un valore nella configurazione usando dot notation"""
        keys = key_path.split('.')
        config = self._config_data

        for key in keys[:-1]:
            if key not in config:
                config[key] = {}
            config = config[key]

        config[keys[-1]] = value

    def save(self):
        """Salva la configurazione corrente su file"""
        config_path = os.path.join(os.path.dirname(__file__), 'config.json')
        try:
            with open(config_path, 'w', encoding='utf-8') as f:
                json.dump(self._config_data, f, indent=4, ensure_ascii=False)
        except IOError as e:
            print(f"Errore salvataggio configurazione: {e}")

    def get_icon_path(self) -> str:
        """Restituisce il path completo dell'icona"""
        icon_name = self.get('paths.icon')
        # Cerca prima nella directory corrente, poi in AJM-free
        current_dir = os.path.dirname(__file__)
        icon_path = os.path.join(current_dir, icon_name)

        if not os.path.exists(icon_path):
            # Prova con il path relativo per distribuzioni standalone
            parent_dir = os.path.dirname(current_dir)
            icon_path = os.path.join(parent_dir, 'AJM-free', icon_name)

        return icon_path if os.path.exists(icon_path) else ""

    def get_config_file_path(self) -> str:
        """Restituisce il path completo del file di configurazione pulsanti"""
        config_name = self.get('paths.config_file')
        return os.path.join(os.path.dirname(__file__), config_name)


# Istanza globale della configurazione
config = Config()