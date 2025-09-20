"""
Caricamento asincrono dei file audio per migliorare l'esperienza utente
"""
import os
from typing import Callable, Optional
from PyQt6.QtCore import QThread, pyqtSignal, QObject
import pygame
from logger import logger


class AudioLoadWorker(QObject):
    """Worker per il caricamento asincrono dei file audio"""

    # Segnali per comunicare con il thread principale
    load_completed = pyqtSignal(str, object, float)  # file_path, sound_object, duration
    load_failed = pyqtSignal(str, str)  # file_path, error_message
    progress_updated = pyqtSignal(str, float)  # file_path, progress (0.0-1.0)

    def __init__(self):
        super().__init__()
        self._cancelled = False

    def cancel(self):
        """Cancella l'operazione di caricamento"""
        self._cancelled = True

    def load_audio(self, file_path: str):
        """Carica un file audio in modo asincrono"""
        try:
            if self._cancelled:
                return

            logger.debug(f"Caricamento asincrono avviato per: {file_path}")

            # Simula progresso per caricamenti grandi
            self.progress_updated.emit(file_path, 0.3)

            # Carica il file audio
            sound = pygame.mixer.Sound(file_path)

            if self._cancelled:
                return

            self.progress_updated.emit(file_path, 0.7)

            # Ottieni durata
            duration = sound.get_length()

            if self._cancelled:
                return

            self.progress_updated.emit(file_path, 1.0)

            logger.debug(f"Caricamento asincrono completato per: {file_path} ({duration:.2f}s)")
            self.load_completed.emit(file_path, sound, duration)

        except pygame.error as e:
            logger.error(f"Errore pygame durante caricamento asincrono di {file_path}: {e}")
            self.load_failed.emit(file_path, f"Errore audio: {e}")
        except Exception as e:
            logger.error(f"Errore imprevisto durante caricamento asincrono di {file_path}: {e}", exc_info=True)
            self.load_failed.emit(file_path, f"Errore imprevisto: {e}")


class AsyncAudioLoader:
    """Gestore del caricamento asincrono dei file audio"""

    def __init__(self):
        self._workers = {}  # file_path -> worker
        self._threads = {}  # file_path -> thread

    def load_audio_async(self, file_path: str,
                        on_completed: Optional[Callable] = None,
                        on_failed: Optional[Callable] = None,
                        on_progress: Optional[Callable] = None):
        """
        Carica un file audio in modo asincrono

        Args:
            file_path: Path del file da caricare
            on_completed: Callback per caricamento completato (file_path, sound, duration)
            on_failed: Callback per errore (file_path, error_message)
            on_progress: Callback per aggiornamento progresso (file_path, progress)
        """
        if not os.path.exists(file_path):
            if on_failed:
                on_failed(file_path, "File non trovato")
            return

        # Cancella caricamento precedente se esiste
        if file_path in self._workers:
            self.cancel_load(file_path)

        logger.info(f"Avvio caricamento asincrono per: {file_path}")

        # Crea worker e thread
        worker = AudioLoadWorker()
        thread = QThread()

        # Connetti segnali
        if on_completed:
            worker.load_completed.connect(lambda fp, sound, duration: on_completed(fp, sound, duration))
        if on_failed:
            worker.load_failed.connect(lambda fp, error: on_failed(fp, error))
        if on_progress:
            worker.progress_updated.connect(lambda fp, progress: on_progress(fp, progress))

        # Connetti segnali di cleanup
        worker.load_completed.connect(lambda: self._cleanup_worker(file_path))
        worker.load_failed.connect(lambda: self._cleanup_worker(file_path))

        # Sposta worker nel thread
        worker.moveToThread(thread)

        # Connetti avvio e cleanup del thread
        thread.started.connect(lambda: worker.load_audio(file_path))
        worker.load_completed.connect(thread.quit)
        worker.load_failed.connect(thread.quit)
        thread.finished.connect(thread.deleteLater)

        # Salva riferimenti
        self._workers[file_path] = worker
        self._threads[file_path] = thread

        # Avvia thread
        thread.start()

    def cancel_load(self, file_path: str):
        """Cancella il caricamento di un file specifico"""
        if file_path in self._workers:
            logger.debug(f"Cancellazione caricamento per: {file_path}")
            self._workers[file_path].cancel()
            self._cleanup_worker(file_path)

    def cancel_all(self):
        """Cancella tutti i caricamenti in corso"""
        logger.debug("Cancellazione di tutti i caricamenti asincroni")
        for file_path in list(self._workers.keys()):
            self.cancel_load(file_path)

    def is_loading(self, file_path: str) -> bool:
        """Verifica se un file è in caricamento"""
        return file_path in self._workers

    def _cleanup_worker(self, file_path: str):
        """Pulisce le risorse del worker completato"""
        if file_path in self._workers:
            del self._workers[file_path]
        if file_path in self._threads:
            del self._threads[file_path]


# Istanza globale del loader asincrono
async_audio_loader = AsyncAudioLoader()