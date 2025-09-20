"""
Componente per la gestione dell'audio
"""
import pygame
from config import config


class AudioPlayer:
    """Gestisce la riproduzione audio per un pulsante"""

    def __init__(self, button):
        self.button = button
        self.current_channel = None
        self.audio_duration = 0

    def load_audio(self, file_path):
        """Carica un file audio e ne ottiene la durata"""
        try:
            sound = pygame.mixer.Sound(file_path)
            self.audio_duration = sound.get_length()
            return sound
        except pygame.error as e:
            raise AudioLoadError(f"Errore caricamento audio {file_path}: {e}")

    def play_sound(self, sound, volume=1.0, loops=0):
        """Avvia la riproduzione di un suono"""
        if not pygame.mixer.get_init():
            raise AudioError("Mixer audio non inizializzato")

        sound.set_volume(volume)
        self.current_channel = sound.play(loops=loops)
        return self.current_channel

    def stop_audio(self):
        """Ferma la riproduzione corrente"""
        if self.current_channel and self.current_channel.get_busy():
            self.current_channel.stop()
        self.current_channel = None

    def pause_audio(self):
        """Mette in pausa la riproduzione corrente"""
        if self.current_channel and self.current_channel.get_busy():
            self.current_channel.pause()

    def unpause_audio(self):
        """Riprende la riproduzione dalla pausa"""
        if self.current_channel:
            self.current_channel.unpause()

    def is_playing(self):
        """Verifica se l'audio è in riproduzione"""
        return self.current_channel and self.current_channel.get_busy()

    def get_channel(self):
        """Restituisce il canale audio corrente"""
        return self.current_channel

    def cleanup(self):
        """Pulisce le risorse audio"""
        self.stop_audio()
        self.current_channel = None
        self.audio_duration = 0


class AudioError(Exception):
    """Eccezione per errori audio"""
    pass


class AudioLoadError(AudioError):
    """Eccezione per errori di caricamento audio"""
    pass