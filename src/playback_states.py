"""
State Pattern per la gestione degli stati di riproduzione audio
"""
from abc import ABC, abstractmethod
import pygame
from PyQt6.QtCore import QTimer
from config import config
from state_validator import state_validator


class PlaybackState(ABC):
    """Classe base astratta per gli stati di riproduzione"""

    def __init__(self, button):
        self.button = button

    @abstractmethod
    def enter_state(self):
        """Chiamato quando si entra in questo stato"""
        pass

    @abstractmethod
    def exit_state(self):
        """Chiamato quando si esce da questo stato"""
        pass

    @abstractmethod
    def handle_press(self):
        """Gestisce la pressione del pulsante in questo stato"""
        pass

    @abstractmethod
    def update_visual(self):
        """Aggiorna l'aspetto visivo del pulsante"""
        pass

    def _start_timer(self):
        """Avvia il timer di controllo riproduzione se non attivo"""
        if not self.button.playback_check_timer.isActive():
            self.button.playback_check_timer.start()

    def _stop_timer(self):
        """Ferma il timer di controllo riproduzione"""
        if self.button.playback_check_timer.isActive():
            self.button.playback_check_timer.stop()


class StoppedState(PlaybackState):
    """Stato: fermato (nessuna riproduzione attiva)"""

    def enter_state(self):
        self.button.is_playing_visual_indicator = False
        self.button.is_paused = False
        self.button.is_queued = False
        self.button.progress_ratio = 0
        self.button.playback_start_time_ms = 0
        self.button.paused_at_ms = 0
        self._stop_timer()
        self.update_visual()

    def exit_state(self):
        pass

    def handle_press(self):
        """Avvia la riproduzione"""
        if not self.button.audio_file:
            return

        try:
            # Carica e avvia il suono
            sound = pygame.mixer.Sound(self.button.audio_file)
            sound.set_volume(self.button.volume)

            loops = -1 if self.button.loop else 0
            self.button.current_sound_channel = sound.play(loops=loops)

            # Imposta i timestamp
            if not self.button.loop:
                self.button.playback_start_time_ms = pygame.time.get_ticks()
            self.button.paused_at_ms = 0

            # Cambia allo stato Playing
            self.button.set_playback_state(PlayingState(self.button))

        except pygame.error as e:
            print(f"Errore avvio riproduzione: {e}")
            # Rimani in stato Stopped

    def update_visual(self):
        self.button._update_style_real()


class PlayingState(PlaybackState):
    """Stato: in riproduzione attiva"""

    def enter_state(self):
        self.button.is_playing_visual_indicator = True
        self.button.is_paused = False
        self.button.is_queued = False
        self._start_timer()
        self.update_visual()

    def exit_state(self):
        pass

    def handle_press(self):
        """Gestisce la pressione in base alle opzioni di riproduzione"""
        if self.button.continue_playback:
            # Modalità continua: metti in pausa
            if self.button.current_sound_channel:
                self.button.current_sound_channel.pause()
                if not self.button.loop:
                    self.button.paused_at_ms = pygame.time.get_ticks() - self.button.playback_start_time_ms
                self.button.set_playback_state(PausedState(self.button))
        else:
            # Modalità da capo o loop: ferma e riavvia
            self._stop_audio()
            self.button.set_playback_state(StoppedState(self.button))

    def update_visual(self):
        self.button._update_style_real()

    def _stop_audio(self):
        """Ferma l'audio corrente"""
        if self.button.current_sound_channel:
            self.button.current_sound_channel.stop()
            self.button.current_sound_channel = None


class PausedState(PlaybackState):
    """Stato: in pausa"""

    def enter_state(self):
        self.button.is_playing_visual_indicator = False
        self.button.is_paused = True
        self.button.is_queued = False
        self._stop_timer()
        self.update_visual()

    def exit_state(self):
        pass

    def handle_press(self):
        """Riprende la riproduzione dalla pausa"""
        if self.button.current_sound_channel:
            self.button.current_sound_channel.unpause()

            # Ricalcola il tempo di inizio
            if not self.button.loop and self.button.paused_at_ms > 0:
                self.button.playback_start_time_ms = pygame.time.get_ticks() - self.button.paused_at_ms

            self.button.set_playback_state(PlayingState(self.button))

    def update_visual(self):
        self.button._update_style_real()


class QueuedState(PlaybackState):
    """Stato: in coda di riproduzione"""

    def enter_state(self):
        self.button.is_playing_visual_indicator = False
        self.button.is_paused = False
        self.button.is_queued = True
        self.button._queue_flash_counter = 0
        self._start_timer()
        self.update_visual()

    def exit_state(self):
        self.button.is_queued = False

    def handle_press(self):
        """Rimuove dalla coda"""
        self.button.set_playback_state(StoppedState(self.button))

    def update_visual(self):
        self.button._update_style()


class PlaybackStateManager:
    """Gestore degli stati di riproduzione per JingleButton"""

    def __init__(self, button):
        self.button = button
        self.current_state = StoppedState(button)

    def set_state(self, new_state):
        """Cambia lo stato corrente con validazione"""
        # Valida la transizione se possibile
        if self.current_state:
            current_state_name = self._get_state_name(self.current_state)
            new_state_name = self._get_state_name(new_state)

            transition_result = state_validator.validate_transition(current_state_name, new_state_name)
            if not transition_result['is_valid']:
                logger.error(f"Transizione di stato non valida: {current_state_name} -> {new_state_name}")
                state_validator.log_validation_result(transition_result, f"button_{id(self.button)}")
                # Non procedere con la transizione non valida
                return

        # Esegui la transizione
        if self.current_state:
            self.current_state.exit_state()
        self.current_state = new_state
        self.current_state.enter_state()

        # Valida lo stato finale
        self._validate_current_state()

    def get_state(self):
        """Restituisce lo stato corrente"""
        return self.current_state

    def handle_press(self):
        """Delegato al metodo handle_press dello stato corrente"""
        self.current_state.handle_press()

    def update_visual(self):
        """Delegato al metodo update_visual dello stato corrente"""
        self.current_state.update_visual()

    def _get_state_name(self, state):
        """Restituisce il nome della classe dello stato"""
        return state.__class__.__name__.lower().replace('state', '')

    def _validate_current_state(self):
        """Valida lo stato corrente del pulsante"""
        try:
            current_state_name = self._get_state_name(self.current_state)

            # Raccogli le proprietà del pulsante per la validazione
            button_props = {
                'audio_file': self.button.audio_file,
                'is_playing_visual_indicator': self.button.is_playing_visual_indicator,
                'is_paused': self.button.is_paused,
                'is_queued': self.button.is_queued,
                'current_sound_channel': self.button.current_sound_channel
            }

            # Valida lo stato
            validation_result = state_validator.validate_state(current_state_name, button_props)

            if not validation_result['is_valid']:
                logger.error(f"Stato non valido rilevato per pulsante {id(self.button)}")
                state_validator.log_validation_result(validation_result, f"button_{id(self.button)}")

                # Tentativo di correzione automatica
                suggested_state = state_validator.suggest_state_correction(button_props)
                if suggested_state and suggested_state != current_state_name:
                    logger.info(f"Tentativo correzione automatica: {current_state_name} -> {suggested_state}")
                    self._auto_correct_state(suggested_state)

        except Exception as e:
            logger.error(f"Errore durante validazione stato: {e}", exc_info=True)

    def _auto_correct_state(self, suggested_state):
        """Corregge automaticamente lo stato inconsistente"""
        try:
            if suggested_state == 'stopped':
                self.set_state(StoppedState(self.button))
            elif suggested_state == 'playing':
                self.set_state(PlayingState(self.button))
            elif suggested_state == 'paused':
                self.set_state(PausedState(self.button))
            elif suggested_state == 'queued':
                self.set_state(QueuedState(self.button))

            logger.info(f"Correzione automatica applicata: {suggested_state}")

        except Exception as e:
            logger.error(f"Errore durante correzione automatica dello stato: {e}", exc_info=True)