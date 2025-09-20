"""
Sistema di logging centralizzato per Advanced Jingle Machine
"""
import logging
import os
from datetime import datetime
from config import config


class Logger:
    """Sistema di logging configurabile"""

    _instance = None
    _logger = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance._setup_logger()
        return cls._instance

    def _setup_logger(self):
        """Configura il logger con le impostazioni dalla configurazione"""
        self._logger = logging.getLogger('AdvancedJingleMachine')
        self._logger.setLevel(getattr(logging, config.get('debug.log_level', 'INFO')))

        # Rimuovi handler esistenti
        for handler in self._logger.handlers[:]:
            self._logger.removeHandler(handler)

        # Handler per console
        console_handler = logging.StreamHandler()
        console_formatter = logging.Formatter(
            '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
        )
        console_handler.setFormatter(console_formatter)
        self._logger.addHandler(console_handler)

        # Handler per file se debug abilitato
        if config.get('debug.enabled', False):
            log_dir = os.path.join(os.path.dirname(__file__), 'logs')
            os.makedirs(log_dir, exist_ok=True)

            log_file = os.path.join(log_dir, f'ajm_{datetime.now().strftime("%Y%m%d")}.log')
            file_handler = logging.FileHandler(log_file, encoding='utf-8')
            file_formatter = logging.Formatter(
                '%(asctime)s - %(name)s - %(levelname)s - %(funcName)s:%(lineno)d - %(message)s'
            )
            file_handler.setFormatter(file_formatter)
            self._logger.addHandler(file_handler)

    def debug(self, message, *args, **kwargs):
        """Log messaggio di debug"""
        self._logger.debug(message, *args, **kwargs)

    def info(self, message, *args, **kwargs):
        """Log messaggio informativo"""
        self._logger.info(message, *args, **kwargs)

    def warning(self, message, *args, **kwargs):
        """Log messaggio di avviso"""
        self._logger.warning(message, *args, **kwargs)

    def error(self, message, exc_info=None, *args, **kwargs):
        """Log messaggio di errore"""
        if exc_info:
            self._logger.error(message, exc_info=exc_info, *args, **kwargs)
        else:
            self._logger.error(message, *args, **kwargs)

    def critical(self, message, exc_info=None, *args, **kwargs):
        """Log messaggio critico"""
        if exc_info:
            self._logger.critical(message, exc_info=exc_info, *args, **kwargs)
        else:
            self._logger.critical(message, *args, **kwargs)

    def log_performance(self, operation, duration_ms):
        """Log metriche di performance"""
        if config.get('debug.performance_monitoring', False):
            self._logger.info(f"Performance: {operation} took {duration_ms:.2f}ms")


# Istanza globale del logger
logger = Logger()