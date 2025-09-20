import sys
from PyQt6.QtWidgets import (
    QApplication, QMainWindow, QWidget, QGridLayout, QPushButton, QMenu,
    QFileDialog, QInputDialog, QColorDialog, QVBoxLayout, QMessageBox,
    QSizePolicy, QDialog, QLabel, QLineEdit, QGroupBox, QRadioButton,
    QHBoxLayout, QDialogButtonBox, QDoubleSpinBox, QSplashScreen
)
from PyQt6.QtGui import QColor, QAction, QPainter, QBrush, QPen, QPixmap, QFont, QIcon
from PyQt6.QtCore import Qt, QTimer, QRectF, pyqtSignal
import pygame
import json
import os
import logging
from config import config
from playback_states import PlaybackStateManager, StoppedState, PlayingState, PausedState, QueuedState
from audio_player import AudioPlayer, AudioError, AudioLoadError
from visual_indicator import VisualIndicator
from logger import logger
from async_audio_loader import async_audio_loader
from memory_manager import memory_manager

# Schermata di Benvenuto
class WelcomeDialog(QDialog):
    def __init__(self, parent=None):
        super().__init__(parent)
        self.setWindowTitle(f"{config.get('app.name')} v{config.get('app.version')}")
        self.setFixedSize(700, 650)
        self.setModal(True)

        # Imposta l'icona della finestra
        icon_path = config.get_icon_path()
        if icon_path and os.path.exists(icon_path):
            self.setWindowIcon(QIcon(icon_path))
        
        layout = QVBoxLayout(self)
        layout.setSpacing(15)
        layout.setContentsMargins(40, 30, 40, 30)
        
        # Logo/Immagine
        logo_label = QLabel()
        if icon_path and os.path.exists(icon_path):
            pixmap = QPixmap(icon_path)
            # Ridimensiona l'immagine mantenendo le proporzioni
            scaled_pixmap = pixmap.scaled(120, 120, Qt.AspectRatioMode.KeepAspectRatio, Qt.TransformationMode.SmoothTransformation)
            logo_label.setPixmap(scaled_pixmap)
        else:
            # Se l'immagine non esiste, mostra un placeholder
            logo_label.setText("🎵")
            logo_label.setStyleSheet("font-size: 48px;")
        logo_label.setAlignment(Qt.AlignmentFlag.AlignCenter)
        layout.addWidget(logo_label)

        # Titolo principale
        title_label = QLabel(config.get('app.name'))
        title_font = QFont()
        title_font.setPointSize(24)
        title_font.setBold(True)
        title_label.setFont(title_font)
        title_label.setAlignment(Qt.AlignmentFlag.AlignCenter)
        title_label.setStyleSheet("color: #4CAF50; margin-bottom: 10px;")
        layout.addWidget(title_label)

        # Versione
        version_label = QLabel(f"Versione {config.get('app.version')}")
        version_font = QFont()
        version_font.setPointSize(14)
        version_label.setFont(version_font)
        version_label.setAlignment(Qt.AlignmentFlag.AlignCenter)
        version_label.setStyleSheet("color: #888; margin-bottom: 20px;")
        layout.addWidget(version_label)

        # Autore
        author_label = QLabel(f"Autore: {config.get('app.author')}")
        author_label.setAlignment(Qt.AlignmentFlag.AlignCenter)
        author_label.setStyleSheet("color: #FFF; font-size: 12px; margin-bottom: 5px;")
        layout.addWidget(author_label)

        # Sviluppo
        dev_label = QLabel("Sviluppo sperimentale con LLM")
        dev_label.setAlignment(Qt.AlignmentFlag.AlignCenter)
        dev_label.setStyleSheet("color: #AAA; font-size: 10px; margin-bottom: 15px;")
        layout.addWidget(dev_label)

        # Testo gratuito
        free_label = QLabel("Software gratuito e liberamente scaricabile")
        free_label.setAlignment(Qt.AlignmentFlag.AlignCenter)
        free_label.setStyleSheet("color: #4CAF50; font-weight: bold; margin-bottom: 10px;")
        layout.addWidget(free_label)

        # Messaggio donazione
        donation_label = QLabel("Anche se sviluppato con LLM, questo software è costato\ningegno, impegno e ore di lavoro.\n\nSe lo trovi utile, considera una donazione:")
        donation_label.setAlignment(Qt.AlignmentFlag.AlignCenter)
        donation_label.setWordWrap(True)
        donation_label.setStyleSheet("color: #FFF; font-size: 11px; line-height: 1.6; margin-bottom: 15px; padding: 0 20px;")
        layout.addWidget(donation_label)

        # Link PayPal
        paypal_url = config.get('app.paypal')
        paypal_label = QLabel(f'<a href="{paypal_url}" style="color: #4CAF50; text-decoration: none;">{paypal_url.split("/")[-1]}</a>')
        paypal_label.setAlignment(Qt.AlignmentFlag.AlignCenter)
        paypal_label.setOpenExternalLinks(True)
        paypal_label.setStyleSheet("font-weight: bold; margin-bottom: 10px;")
        layout.addWidget(paypal_label)

        # Sito web
        website_url = config.get('app.website')
        website_label = QLabel(f'<a href="{website_url}" style="color: #2196F3; text-decoration: none;">{website_url.split("/")[-1]}</a>')
        website_label.setAlignment(Qt.AlignmentFlag.AlignCenter)
        website_label.setOpenExternalLinks(True)
        website_label.setStyleSheet("margin-bottom: 20px;")
        layout.addWidget(website_label)
        
        # Pulsante Avvia
        start_button = QPushButton("🚀 AVVIA SOFTWARE")
        start_button.setFixedHeight(50)
        start_button.setStyleSheet("""
            QPushButton {
                background-color: #4CAF50;
                color: white;
                border: none;
                border-radius: 25px;
                font-size: 16px;
                font-weight: bold;
                padding: 10px 20px;
            }
            QPushButton:hover {
                background-color: #45a049;
            }
            QPushButton:pressed {
                background-color: #3d8b40;
            }
        """)
        start_button.clicked.connect(self.accept)
        layout.addWidget(start_button)
        
        # Applica tema scuro
        self.setStyleSheet("""
            QDialog {
                background-color: #2E2E2E;
                color: #FFFFFF;
            }
            QLabel {
                background-color: transparent;
            }
        """)

# Finestra di Dialogo per le Impostazioni del Pulsante
class ButtonSettingsDialog(QDialog):
    def __init__(self, button_data, parent=None):
        super().__init__(parent)
        self.setWindowTitle("Impostazioni Pulsante")
        self.button_data = button_data # Dizionario o oggetto con i dati attuali del pulsante

        layout = QVBoxLayout(self)

        # Nome Personalizzato
        name_group = QGroupBox("Nome Personalizzato")
        name_layout = QHBoxLayout()
        self.name_edit = QLineEdit(self.button_data.get('custom_name', ''))
        name_layout.addWidget(self.name_edit)
        name_group.setLayout(name_layout)
        layout.addWidget(name_group)

        # Colore Pulsante
        color_group = QGroupBox("Colore Pulsante")
        color_layout = QHBoxLayout()
        self.color_button = QPushButton("Scegli Colore...")
        self.current_color_label = QLabel()
        self._update_color_label(self.button_data.get('color', '#3E3E3E'))
        self.color_button.clicked.connect(self._choose_color)
        color_layout.addWidget(self.color_button)
        color_layout.addWidget(self.current_color_label)
        color_group.setLayout(color_layout)
        layout.addWidget(color_group)
        self.selected_color_hex = self.button_data.get('color', '#3E3E3E')

        # Volume
        volume_group = QGroupBox("Volume (0.0 - 1.0)")
        volume_layout = QHBoxLayout()
        self.volume_spinbox = QDoubleSpinBox()
        self.volume_spinbox.setRange(0.0, 1.0)
        self.volume_spinbox.setSingleStep(0.1)
        self.volume_spinbox.setValue(self.button_data.get('volume', 1.0))
        volume_layout.addWidget(self.volume_spinbox)
        volume_group.setLayout(volume_layout)
        layout.addWidget(volume_group)

        # Opzioni di Riproduzione
        playback_group = QGroupBox("Opzioni di Riproduzione")
        playback_layout = QVBoxLayout()
        self.loop_radio = QRadioButton("Loop (Continuo)")
        self.continue_radio = QRadioButton("Continua (Pausa/Riprendi)")
        self.from_start_radio = QRadioButton("Da Capo (Default)")
        
        self.loop_radio.setChecked(self.button_data.get('loop', False))
        self.continue_radio.setChecked(self.button_data.get('continue_playback', False))
        self.from_start_radio.setChecked(self.button_data.get('play_from_start', True))

        # Assicura che uno sia checkato se la config è inconsistente
        if not (self.loop_radio.isChecked() or self.continue_radio.isChecked() or self.from_start_radio.isChecked()):
            self.from_start_radio.setChecked(True)

        playback_layout.addWidget(self.loop_radio)
        playback_layout.addWidget(self.continue_radio)
        playback_layout.addWidget(self.from_start_radio)
        playback_group.setLayout(playback_layout)
        layout.addWidget(playback_group)

        # Pulsanti OK / Annulla
        self.button_box = QDialogButtonBox(QDialogButtonBox.StandardButton.Ok | QDialogButtonBox.StandardButton.Cancel)
        self.button_box.accepted.connect(self.accept)
        self.button_box.rejected.connect(self.reject)
        layout.addWidget(self.button_box)

    def _choose_color(self):
        initial_color = QColor(self.selected_color_hex)
        color = QColorDialog.getColor(initial_color, self, "Scegli Colore")
        if color.isValid():
            self.selected_color_hex = color.name()
            self._update_color_label(self.selected_color_hex)

    def _update_color_label(self, color_hex):
        self.current_color_label.setText(color_hex)
        self.current_color_label.setStyleSheet(f"background-color: {color_hex}; color: {self._get_contrasting_text_color(color_hex)}; padding: 5px; border: 1px solid #888;")

    def _get_contrasting_text_color(self, bg_color_hex):
        background_color = QColor(bg_color_hex)
        # Calcolo semplice della luminanza percepita
        luminance = (0.299 * background_color.red() + 0.587 * background_color.green() + 0.114 * background_color.blue()) / 255
        return "#000000" if luminance > 0.5 else "#FFFFFF"

    def get_settings(self):
        return {
            'custom_name': self.name_edit.text(),
            'color': self.selected_color_hex,
            'volume': self.volume_spinbox.value(),
            'loop': self.loop_radio.isChecked(),
            'continue_playback': self.continue_radio.isChecked(),
            'play_from_start': self.from_start_radio.isChecked(),
        }

class JingleButton(QPushButton):
    playback_finished = pyqtSignal(object) # Segnale che emette se stesso

    def __init__(self, text="", parent=None):
        super().__init__(text, parent)
        self.audio_file = None
        self.custom_name = None
        self.loop = False
        self.continue_playback = False
        self.play_from_start = True
        self.volume = config.get('audio.default_volume')
        self.original_color = config.get('colors.default_button')
        self.color = self.original_color
        self.is_playing_visual_indicator = False
        self.is_paused = False
        self.is_overlay_effect = False
        self.is_queued = False
        self._update_style()
        # Rimozione della connessione diretta: ora gestita da JingleMachine
        # self.clicked.connect(self.play_audio)
        self.current_sound_channel = None
        self.audio_duration = 0 # Durata totale dell'audio in secondi
        self.progress_ratio = 0 # Per la progress bar (0.0 a 1.0)
        self.playback_start_time_ms = 0 # Per calcolare il progresso manualmente
        self.paused_at_ms = 0 # Per la modalità continua: tempo trascorso prima della pausa

        # Timer per controllare lo stato della riproduzione per l'indicatore visivo
        self.playback_check_timer = QTimer(self)
        self.playback_check_timer.timeout.connect(self._check_playback_status)
        self.playback_check_timer.setInterval(config.get('audio.timer_interval_ms'))

        # Variabili per ottimizzazioni
        self._last_progress_ratio = 0
        self._last_visual_update = 0
        self._visual_update_interval = 100  # ms tra aggiornamenti visivi
        self._needs_visual_update = False

        # Contatore per rallentare il lampeggio della coda
        self._queue_flash_counter = 0

        # Componenti specializzati
        self.audio_player = AudioPlayer(self)
        self.visual_indicator = VisualIndicator(self)
        self.state_manager = PlaybackStateManager(self)

        self.update_tooltip()

    def set_playback_state(self, new_state):
        """Cambia lo stato di riproduzione"""
        self.state_manager.set_state(new_state)

    def get_playback_state(self):
        """Restituisce lo stato corrente di riproduzione"""
        return self.state_manager.get_state()

    def paintEvent(self, event):
        """Disegna il pulsante con ottimizzazioni per ridurre il flickering"""
        super().paintEvent(event)

        # Disegna la progress bar solo se necessario
        if (self.is_playing_visual_indicator and not self.is_paused and
            self.audio_duration > 0 and not self.loop and self.progress_ratio > 0):

            painter = QPainter(self)
            painter.setRenderHint(QPainter.RenderHint.Antialiasing)

            # Impostazioni Progress Bar ottimizzate
            bar_height = 7
            bar_margin_bottom = 4
            bar_margin_horizontal = 2

            rect_width = self.width() - (2 * bar_margin_horizontal)
            rect_y = self.height() - bar_height - bar_margin_bottom

            # Colori dalla configurazione
            progress_bar_fill_color = QColor("#60FF60")
            progress_bar_bg_color = QColor(0, 0, 0, 60)

            # Disegna sfondo barra progresso
            painter.setBrush(QBrush(progress_bar_bg_color))
            painter.setPen(Qt.PenStyle.NoPen)
            painter.drawRect(bar_margin_horizontal, rect_y, rect_width, bar_height)

            # Disegna parte percorsa solo se > 0
            if self.progress_ratio > 0:
                active_bar_width = int(rect_width * self.progress_ratio)
                painter.setBrush(QBrush(progress_bar_fill_color))
                painter.drawRect(bar_margin_horizontal, rect_y, active_bar_width, bar_height)

    def _update_style(self):
        """Aggiorna lo stile delegando al sistema di stati"""
        self.state_manager.update_visual()

    def _update_style_real(self):
        """Implementazione reale dell'aggiornamento stile con ottimizzazioni"""
        self.visual_indicator.update_style()
        # Forza ridisegno solo se necessario
        if self._needs_visual_update:
            self.update()
            self._needs_visual_update = False

    def _lighter_color(self, hex_color, factor=0.2):
        qcolor = QColor(hex_color)
        h, s, l, a = qcolor.getHslF()
        l = min(1.0, l * (1 + factor))
        return QColor.fromHslF(h, s, l, a).name()

    def _darker_color(self, hex_color, factor=0.2):
        qcolor = QColor(hex_color)
        h, s, l, a = qcolor.getHslF()
        l = max(0.0, l * (1 - factor))
        return QColor.fromHslF(h, s, l, a).name()

    def _check_playback_status(self):
        """Controlla lo stato di riproduzione con ottimizzazioni per ridurre gli aggiornamenti"""
        current_time = pygame.time.get_ticks()

        # Se il pulsante è in coda, gestisci il lampeggio con ottimizzazione
        if self.is_queued:
            self._queue_flash_counter += 1
            # Lampeggia ogni 16 cicli (16 * 50ms = 800ms)
            if self._queue_flash_counter >= 16:
                self._queue_flash_counter = 0
                self._needs_visual_update = True
            return

        # Controlla se il canale audio è attivo
        if self.current_sound_channel and self.current_sound_channel.get_sound() and self.current_sound_channel.get_busy():
            if not self.is_paused:
                if not self.is_playing_visual_indicator:
                    self.is_playing_visual_indicator = True
                    self._needs_visual_update = True

                # Calcola il progresso solo se necessario
                if self.audio_duration > 0 and not self.loop:
                    if self.playback_start_time_ms > 0:
                        current_pos_ms = current_time - self.playback_start_time_ms
                        new_progress_ratio = min(max(0.0, (current_pos_ms / 1000.0) / self.audio_duration), 1.0)

                        # Aggiorna solo se il progresso è cambiato significativamente
                        if abs(new_progress_ratio - self._last_progress_ratio) > 0.01:  # 1% di differenza
                            self.progress_ratio = new_progress_ratio
                            self._last_progress_ratio = new_progress_ratio
                            self._needs_visual_update = True
                else:
                    self.progress_ratio = 0
            else:
                if self.is_playing_visual_indicator:
                    self.is_playing_visual_indicator = False
                    self._needs_visual_update = True
        else:
            # Se prima era in riproduzione e ora non lo è più
            was_playing = self.is_playing_visual_indicator
            if self.is_playing_visual_indicator or self.progress_ratio > 0:
                self.is_playing_visual_indicator = False
                self.progress_ratio = 0
                self._last_progress_ratio = 0
                self._needs_visual_update = True

            if self.playback_check_timer.isActive():
                self.playback_check_timer.stop()

            # Emetti segnale solo se era effettivamente in riproduzione
            if was_playing:
                self.playback_finished.emit(self)

        # Aggiorna l'aspetto visivo solo se necessario e con debouncing
        if self._needs_visual_update and (current_time - self._last_visual_update) > self._visual_update_interval:
            self._update_style()
            self._last_visual_update = current_time
            self._needs_visual_update = False

        # Aggiorna tooltip meno frequentemente
        if current_time % 1000 < 50:  # Ogni secondo circa
            self.update_tooltip()

        # Validazione periodica dello stato (ogni 5 secondi)
        if current_time % 5000 < 50:
            try:
                self.state_manager._validate_current_state()
            except Exception as e:
                logger.warning(f"Errore validazione periodica stato: {e}")

    def stop_audio(self):
        """Ferma la riproduzione del suono di questo pulsante, se attivo."""
        if self.audio_player.is_playing():
            self.audio_player.stop_audio()
            # Reset stati visivi
            self.is_playing_visual_indicator = False
            self.is_paused = False
            self.is_queued = False
            self.progress_ratio = 0
            self._last_progress_ratio = 0
            if self.playback_check_timer.isActive():
                self.playback_check_timer.stop()
            self._needs_visual_update = True
            self._update_style()
            self.update_tooltip()
    

    def update_tooltip(self):
        tooltip_parts = []
        if self.custom_name:
            tooltip_parts.append(f"Nome: {self.custom_name}")
        if self.audio_file:
            tooltip_parts.append(f"File: {os.path.basename(self.audio_file)}")
            if self.is_queued:
                status = "In Coda"
            elif self.current_sound_channel and self.current_sound_channel.get_sound() and self.current_sound_channel.get_busy():
                status = "In Pausa" if self.is_paused else "In Riproduzione"
            else:
                status = "Pronto"
            tooltip_parts.append(f"Stato: {status}")
        else:
            tooltip_parts.append("Vuoto")

        if self.audio_file:
            options = []
            if self.loop: options.append("Loop")
            if self.continue_playback: options.append("Continua")
            if self.play_from_start: options.append("Da Capo")
            tooltip_parts.append(f"Opzioni: {', '.join(options) if options else 'Default (Da Capo)'}")
            tooltip_parts.append(f"Volume: {self.volume:.1f}")
        
        self.setToolTip("\n".join(tooltip_parts))

    def contextMenuEvent(self, event):
        menu = QMenu(self)

        load_action = menu.addAction("Carica Audio")
        settings_action = menu.addAction("Impostazioni Pulsante...") # NUOVA VOCE
        remove_action = menu.addAction("Rimuovi Audio")
        
        # Le vecchie azioni per nome, colore, volume, opzioni sono rimosse da qui

        action = menu.exec(self.mapToGlobal(event.pos()))

        if action == load_action:
            self.load_audio_file()
        elif action == settings_action: # NUOVA GESTIONE
            self.open_settings_dialog()
        elif action == remove_action:
            self.remove_audio()
        self.update_tooltip()

    def open_settings_dialog(self):
        # Prepara i dati attuali del pulsante per il dialogo
        current_data = {
            'custom_name': self.custom_name,
            'color': self.original_color, # Usiamo original_color per l'editing
            'volume': self.volume,
            'loop': self.loop,
            'continue_playback': self.continue_playback,
            'play_from_start': self.play_from_start
        }
        dialog = ButtonSettingsDialog(current_data, self)
        if dialog.exec() == QDialog.DialogCode.Accepted:
            settings = dialog.get_settings()
            self.custom_name = settings['custom_name']
            self.original_color = settings['color'] # Salva come colore base scelto
            self.color = self.original_color # Applica immediatamente
            self.volume = settings['volume']
            self.loop = settings['loop']
            self.continue_playback = settings['continue_playback']
            self.play_from_start = settings['play_from_start']

            self.enforce_playback_option_exclusivity() # Assicura coerenza tra opzioni radio
            self._update_style()
            if self.custom_name:
                self.setText(self.custom_name)
            elif self.audio_file:
                self.setText(os.path.basename(self.audio_file))
            else:
                self.setText("")
            
            # Se il volume è cambiato e un suono è in corso, informare che si applicherà dopo
            # (la logica per applicare il volume live non è stata aggiunta per semplicità in questo step)
            if self.current_sound_channel and self.current_sound_channel.get_sound() and self.current_sound_channel.get_busy():
                 QMessageBox.information(self, "Impostazioni Applicate", "Alcune impostazioni (come il volume) potrebbero richiedere una nuova riproduzione per avere pieno effetto.")
        self.update_tooltip()
        self._update_playback_action_states() # Assicurarsi che gli stati interni delle azioni siano aggiornati se esistono ancora
        self.update() # Forza ridisegno dopo modifiche

    def enforce_playback_option_exclusivity(self):
        active_options = sum([self.loop, self.continue_playback, self.play_from_start])
        if active_options != 1:
            # Default a play_from_start se nessuna o più di una è vera
            self.loop = False
            self.continue_playback = False
            self.play_from_start = True
        self.is_paused = False # Sempre non in pausa se si cambiano le opzioni di base
        self.update_tooltip()
        # self._update_playback_action_states() # Chiamato già dal chiamante (open_settings_dialog o set_config)

    def _update_playback_action_states(self):
        # Questa funzione ora ha meno impatto diretto sul menu, ma mantiene la coerenza interna
        # se si accede a self.loop_action etc. da qualche altra parte (improbabile ora)
        if hasattr(self, 'loop_action') and hasattr(self, 'continue_action') and hasattr(self, 'from_start_action'):
            if self.loop_action: self.loop_action.setChecked(self.loop)
            if self.continue_action: self.continue_action.setChecked(self.continue_playback)
            if self.from_start_action: self.from_start_action.setChecked(self.play_from_start)
    
    def play_audio(self):
        """Metodo semplificato che delega al sistema di stati con error handling migliorato"""
        try:
            if not self.audio_file:
                logger.warning(f"Tentativo di riproduzione senza file audio per pulsante '{self.text()}'")
                QMessageBox.warning(self, "Errore Audio", f"Nessun file audio per '{self.text()}'.")
                return

            if not pygame.mixer.get_init():
                logger.error("Tentativo di riproduzione con mixer non inizializzato")
                QMessageBox.warning(self, "Errore Audio", "Mixer audio non inizializzato.")
                return

            logger.debug(f"Avvio riproduzione per pulsante '{self.text()}': {os.path.basename(self.audio_file)}")

            # Delega la gestione al sistema di stati
            self.state_manager.handle_press()

            logger.debug(f"Riproduzione avviata con successo per '{self.text()}'")

        except AudioError as e:
            logger.error(f"Errore audio durante riproduzione di '{self.text()}': {e}")
            QMessageBox.critical(self, "Errore Audio", f"Errore durante la riproduzione:\n{e}")
            self.set_playback_state(StoppedState(self))

        except Exception as e:
            logger.error(f"Errore imprevisto durante riproduzione di '{self.text()}'", exc_info=True)
            QMessageBox.critical(self, "Errore Inaspettato",
                               f"Si è verificato un errore imprevisto durante la riproduzione:\n{e}")
            # In caso di errore, torna allo stato fermato
            self.set_playback_state(StoppedState(self))

    def load_audio_file(self):
        """Carica un file audio in modo asincrono per non bloccare l'interfaccia"""
        try:
            supported_formats = config.get('audio.supported_formats')
            format_filter = ";;".join([
                f"File Audio ({' '.join(f'*.{fmt}' for fmt in supported_formats)})",
                "Tutti i File (*)"
            ])
            file_name, _ = QFileDialog.getOpenFileName(self, "Seleziona File Audio", "", format_filter)

            if not file_name:
                logger.debug("Caricamento file annullato dall'utente")
                return

            # Cancella caricamento precedente se attivo
            if self.audio_file and async_audio_loader.is_loading(self.audio_file):
                async_audio_loader.cancel_load(self.audio_file)
                logger.debug(f"Caricamento precedente cancellato per: {self.audio_file}")

            logger.info(f"Avvio caricamento asincrono per: {file_name}")

            # Mostra indicatore di caricamento
            self.setText("⏳ Caricamento...")
            self.update_tooltip()

            # Callback per caricamento completato
            def on_load_completed(file_path, sound, duration):
                try:
                    logger.info(f"Caricamento completato per: {file_path} ({duration:.2f}s)")

                    # Aggiorna le proprietà del pulsante
                    self.audio_file = file_path
                    self.audio_duration = duration

                    # Traccia l'oggetto audio per il monitoraggio memoria
                    self._current_audio_id = f"audio_{id(sound)}"
                    memory_manager.track_object(self._current_audio_id, sound, "pygame_sound")

                    # Reset stati di riproduzione
                    self.playback_start_time_ms = 0
                    self.paused_at_ms = 0
                    self.progress_ratio = 0
                    self._last_progress_ratio = 0

                    # Ferma riproduzione precedente se attiva
                    self.audio_player.stop_audio()

                    # Reset stati visivi
                    self.set_playback_state(StoppedState(self))

                    # Aggiorna testo del pulsante
                    if not self.custom_name:
                        self.setText(os.path.basename(file_path))
                    else:
                        self.setText(self.custom_name)

                    self.visual_indicator.update_style()
                    self.update_tooltip()

                except Exception as e:
                    logger.error(f"Errore durante finalizzazione caricamento di {file_path}: {e}", exc_info=True)
                    self._handle_load_error(file_path, f"Errore finalizzazione: {e}")

            # Callback per errore
            def on_load_failed(file_path, error_message):
                logger.error(f"Caricamento fallito per {file_path}: {error_message}")
                self._handle_load_error(file_path, error_message)

            # Callback per progresso (opzionale, per future implementazioni)
            def on_progress_updated(file_path, progress):
                logger.debug(f"Progresso caricamento {file_path}: {progress:.1f}")

            # Avvia caricamento asincrono
            async_audio_loader.load_audio_async(
                file_name,
                on_completed=on_load_completed,
                on_failed=on_load_failed,
                on_progress=on_progress_updated
            )

        except Exception as e:
            logger.error(f"Errore imprevisto durante avvio caricamento asincrono: {e}", exc_info=True)
            QMessageBox.critical(self, "Errore Inaspettato",
                               f"Si è verificato un errore imprevisto:\n{e}")

    def _handle_load_error(self, file_path, error_message):
        """Gestisce gli errori di caricamento"""
        self.audio_file = None
        self.audio_duration = 0
        self.setText("❌ Errore")
        self.update_tooltip()
        QMessageBox.critical(self, "Errore Caricamento Audio",
                           f"Impossibile caricare il file audio:\n{file_path}\n\nErrore: {error_message}")

    def remove_audio(self):
        logger.debug(f"Rimozione audio da pulsante '{self.text()}'")

        # Cancella eventuali caricamenti asincroni in corso per questo pulsante
        if self.audio_file and async_audio_loader.is_loading(self.audio_file):
            async_audio_loader.cancel_load(self.audio_file)
            logger.debug(f"Caricamento asincrono cancellato per: {self.audio_file}")

        # Rimuovi oggetti dal monitoraggio memoria
        if hasattr(self, '_current_audio_id') and self._current_audio_id:
            memory_manager.untrack_object(self._current_audio_id)
            self._current_audio_id = None

        if self.current_sound_channel and self.current_sound_channel.get_sound():
            try:
                self.current_sound_channel.stop()
                logger.debug("Canale audio fermato")
            except pygame.error as e:
                logger.warning(f"Errore durante la fermata del canale audio: {e}")

        self.audio_file = None
        self.custom_name = None
        self.loop = False
        self.continue_playback = False
        self.play_from_start = True
        self.is_paused = False
        self.is_queued = False
        self.current_sound_channel = None
        self.volume = config.get('audio.default_volume')
        self.color = self.original_color = config.get('colors.default_button')
        self.is_playing_visual_indicator = False
        self.audio_duration = 0 # Resetta durata
        self.progress_ratio = 0 # Resetta progresso
        self._last_progress_ratio = 0
        self.playback_start_time_ms = 0 # Reset
        self.paused_at_ms = 0 # Reset
        if self.playback_check_timer.isActive(): self.playback_check_timer.stop()
        self.setText("")
        self._update_style()
        self.enforce_playback_option_exclusivity() # Richiamato dopo aver resettato le opzioni
        self._update_playback_action_states()
        self.update_tooltip()

        logger.info("Audio rimosso dal pulsante")
        QMessageBox.information(self, "Audio Rimosso", f"Audio rimosso dal pulsante.")

    def get_config(self):
        return {
            "audio_file": self.audio_file,
            "custom_name": self.custom_name,
            "loop": self.loop,
            "continue_playback": self.continue_playback,
            "play_from_start": self.play_from_start,
            "volume": self.volume,
            "color": self.original_color,
            "audio_duration": self.audio_duration, # Salva anche la durata
            "paused_at_ms": self.paused_at_ms # Salva anche il tempo di pausa
        }

    def set_config(self, config):
        self.audio_file = config.get("audio_file")
        self.custom_name = config.get("custom_name")
        self.loop = config.get("loop", False)
        self.continue_playback = config.get("continue_playback", False)
        self.play_from_start = config.get("play_from_start", True)
        self.volume = config.get("volume", 1.0)
        self.original_color = config.get("color", "#3E3E3E")
        self.color = self.original_color # Imposta il colore corrente al colore base caricato
        
        # Priorità al ricalcolo della durata dal file audio se esiste
        if self.audio_file and os.path.exists(self.audio_file):
            try:
                sound = pygame.mixer.Sound(self.audio_file)
                self.audio_duration = sound.get_length()
            except pygame.error:
                self.audio_duration = config.get("audio_duration", 0) # Fallback alla config o 0
                print(f"Warning: Could not load audio duration for {self.audio_file}. Using config/default.")
        else:
            self.audio_duration = 0 # Nessun file audio o file non trovato
        
        self.paused_at_ms = config.get("paused_at_ms", 0) # Carica il tempo di pausa

        # Assicura che il volume sia almeno quello di default se non specificato
        if self.volume <= 0:
            self.volume = config.get('audio.default_volume')
        
        self.enforce_playback_option_exclusivity()
        self._update_style()
        self._update_playback_action_states()

        if self.custom_name: self.setText(self.custom_name)
        elif self.audio_file: 
            self.setText(os.path.basename(self.audio_file))
        else: 
            self.setText("")
            self.audio_duration = 0 # Assicurati che sia 0 se non c'è file
        
        if self.current_sound_channel and self.current_sound_channel.get_sound(): self.current_sound_channel.stop()
        self.current_sound_channel = None
        self.is_paused = False
        self.is_playing_visual_indicator = False
        self.is_queued = False
        self.progress_ratio = 0
        self.playback_start_time_ms = 0 # Reset anche qui
        self.paused_at_ms = 0 # Reset anche qui
        if self.playback_check_timer.isActive(): self.playback_check_timer.stop()
        self.update_tooltip()
        self.update() # Forza un ridisegno iniziale dopo aver caricato la config

class JingleMachine(QMainWindow):
    def __init__(self):
        super().__init__()
        logger.info("Inizializzazione Advanced Jingle Machine")

        self.setWindowTitle(f"{config.get('app.name')} v{config.get('app.version')}")
        window_width = config.get('ui.window_width')
        window_height = config.get('ui.window_height')
        self.setGeometry(100, 100, window_width, window_height)
        logger.debug(f"Finestra configurata: {window_width}x{window_height}")

        # Imposta l'icona della finestra principale
        icon_path = config.get_icon_path()
        if icon_path and os.path.exists(icon_path):
            self.setWindowIcon(QIcon(icon_path))
            logger.debug(f"Icona caricata: {icon_path}")
        else:
            logger.warning("Icona non trovata, utilizzo icona di default")

        # Inizializzazione audio
        try:
            pygame.mixer.init()
            pygame.mixer.set_num_channels(config.get('audio.channels'))
            logger.info(f"Mixer audio inizializzato con {config.get('audio.channels')} canali")
        except pygame.error as e:
            logger.error(f"Errore inizializzazione mixer audio: {e}", exc_info=True)
            QMessageBox.critical(self, "Errore Audio",
                               "Impossibile inizializzare il sistema audio.\nL'applicazione potrebbe non funzionare correttamente.")

        # Proprietà per la gestione centralizzata della riproduzione
        self.active_main_track_button = None
        self.queued_main_track_button = None

        # Timer per monitoraggio memoria
        self.memory_monitor_timer = QTimer(self)
        self.memory_monitor_timer.timeout.connect(self._check_memory_usage)
        self.memory_monitor_timer.setInterval(60000)  # Controlla ogni minuto
        self.memory_monitor_timer.start()

        self.main_layout = QVBoxLayout() # Layout verticale principale
        self.central_widget = QWidget()
        self.central_widget.setLayout(self.main_layout)
        self.setCentralWidget(self.central_widget)

        # Pulsante Stop All Sounds
        self.stop_all_button = QPushButton("STOP ALL SOUNDS")
        self.stop_all_button.setStyleSheet("background-color: #C00000; color: white; font-weight: bold; padding: 10px;")
        self.stop_all_button.clicked.connect(self.stop_all_sounds)
        self.main_layout.addWidget(self.stop_all_button)

        self.grid_widget = QWidget() # Widget per contenere la griglia
        self.grid_layout = QGridLayout(self.grid_widget)
        self.grid_layout.setSpacing(5)
        self.main_layout.addWidget(self.grid_widget) # Aggiunge la griglia al layout principale

        self.buttons = []
        rows = config.get('ui.grid_rows')
        cols = config.get('ui.grid_cols')
        button_width = config.get('ui.button_width')
        button_height = config.get('ui.button_height')

        logger.debug(f"Creazione griglia pulsanti: {rows}x{cols}")

        for row in range(rows):
            row_buttons = []
            for col in range(cols):
                try:
                    button = JingleButton(parent=self.grid_widget) # Imposta il parent corretto
                    button.setSizePolicy(QSizePolicy.Policy.Expanding, QSizePolicy.Policy.Expanding)
                    button.setFixedSize(button_width, button_height)
                    # Connessione centralizzata: invece di button.play_audio, usa handle_button_press
                    button.clicked.connect(lambda checked, b=button: self.handle_button_press(b))
                    # Connessione per la riproduzione automatica dalla coda
                    button.playback_finished.connect(self.on_playback_finished)

                    # Logica per identificare la colonna degli effetti (ultima colonna)
                    if col == cols - 1:  # Ultima colonna invece di hardcoded 7
                        button.is_overlay_effect = True
                        # Applica un colore di base leggermente diverso per riconoscere la colonna
                        button.original_color = config.get('colors.overlay_button')
                        button.color = button.original_color
                        button._update_style()

                    self.grid_layout.addWidget(button, row, col)
                    row_buttons.append(button)

                    # Traccia il pulsante per il monitoraggio memoria
                    button_id = f"button_{row}_{col}"
                    memory_manager.track_object(button_id, button, "jingle_button")

                except Exception as e:
                    logger.error(f"Errore creazione pulsante [{row},{col}]: {e}", exc_info=True)
                    # Crea un pulsante placeholder in caso di errore
                    placeholder = JingleButton(parent=self.grid_widget)
                    self.grid_layout.addWidget(placeholder, row, col)
                    row_buttons.append(placeholder)
                    # Traccia anche il placeholder
                    placeholder_id = f"placeholder_{row}_{col}"
                    memory_manager.track_object(placeholder_id, placeholder, "placeholder_button")

            self.buttons.append(row_buttons)

        logger.info(f"Griglia pulsanti creata con successo: {rows * cols} pulsanti totali")

        self.setStyleSheet("QMainWindow { background-color: #2E2E2E; } QWidget { background-color: #2E2E2E; }")
        self.load_config()

    def on_playback_finished(self, finished_button):
        """Questo slot viene chiamato quando un JingleButton finisce di suonare."""


        # Verifica che il pulsante terminato fosse effettivamente la traccia attiva.
        # Questo previene che un effetto sovrapposto attivi la coda per errore.
        if self.active_main_track_button is not finished_button:
            return

        self.active_main_track_button = None # La traccia attiva non c'è più.

        # Se c'è un pulsante in coda, avvialo.
        queued_button = self.queued_main_track_button
        if queued_button:

            self.queued_main_track_button = None # Rimuovilo dalla coda
            queued_button.is_queued = False
            
            # Ora gestisci la sua pressione come se l'utente l'avesse appena cliccato
            self.handle_button_press(queued_button)

    def handle_button_press(self, button):
        if button.is_overlay_effect:
            # Logica per gli effetti sonori: suonano sempre e comunque.

            button.play_audio()
            return # Fine, non interagisce con la logica delle tracce principali

        # --- Logica per le tracce principali (colonne 0-6) ---


        active_button = self.active_main_track_button
        queued_button = self.queued_main_track_button
        
        # Caso 1: Il pulsante premuto è già quello attivo.
        if button is active_button:
            button.play_audio()
            if not button.current_sound_channel.get_busy():
                self.active_main_track_button = None # Si è fermato, non è più attivo
            return

        # Caso 2: Il pulsante premuto è già in coda.
        if button is queued_button:
            # L'utente lo preme di nuovo: lo rimuove dalla coda.
            button.is_queued = False
            button._queue_flash_counter = 0  # Reset contatore lampeggio
            button._update_style()
            button.update_tooltip()
            # Ferma il timer se non c'è riproduzione attiva
            if not (button.current_sound_channel and button.current_sound_channel.get_busy()):
                if button.playback_check_timer.isActive():
                    button.playback_check_timer.stop()
            self.queued_main_track_button = None
            
            return

        # Caso 3: Viene premuto un nuovo pulsante.

        # Se non c'è una traccia attiva, questo diventa la traccia attiva.
        if not active_button or not active_button.current_sound_channel.get_busy():
            button.play_audio()
            self.active_main_track_button = button
            return

        # Se c'è una traccia attiva...

        # REGOLA 2a: Priorità Non-Loop su Loop
        if not button.loop and active_button.loop:
            active_button.stop_audio()
            # Pulisce la coda se c'era qualcosa in attesa per il loop
            if queued_button:
                queued_button.is_queued = False
                queued_button._queue_flash_counter = 0  # Reset contatore lampeggio
                queued_button._update_style()
                # Ferma il timer se non ha audio attivo
                if not (queued_button.current_sound_channel and queued_button.current_sound_channel.get_busy()):
                    if queued_button.playback_check_timer.isActive():
                        queued_button.playback_check_timer.stop()
                self.queued_main_track_button = None
            button.play_audio()
            self.active_main_track_button = button
            return

        # REGOLA 2b: Accodamento
        # Se sia la traccia attiva che quella premuta sono non-loop, metti in coda.
        if not active_button.loop and not button.loop:
            
            # Se c'era già un brano in coda, toglilo prima di aggiungere il nuovo.
            if queued_button:
                queued_button.is_queued = False
                queued_button._queue_flash_counter = 0  # Reset contatore lampeggio
                queued_button._update_style()
                # Ferma il timer del vecchio pulsante in coda se non ha audio attivo
                if not (queued_button.current_sound_channel and queued_button.current_sound_channel.get_busy()):
                    if queued_button.playback_check_timer.isActive():
                        queued_button.playback_check_timer.stop()
            
            self.queued_main_track_button = button
            button.is_queued = True
            button._queue_flash_counter = 0  # Reset contatore per iniziare lampeggio
            button._update_style()
            button.update_tooltip()
            # Avvia il timer per il lampeggio se non è già attivo
            if not button.playback_check_timer.isActive():
                button.playback_check_timer.start()
            return
            
        # Caso di fallback: se si preme un loop mentre un non-loop è attivo,
        # o un loop mentre un altro loop è attivo. In entrambi i casi, ferma il vecchio e avvia il nuovo.
        active_button.stop_audio()
        if queued_button: # Pulisci la coda
            queued_button.is_queued = False
            queued_button._queue_flash_counter = 0  # Reset contatore lampeggio
            queued_button._update_style()
            # Ferma il timer se non ha audio attivo
            if not (queued_button.current_sound_channel and queued_button.current_sound_channel.get_busy()):
                if queued_button.playback_check_timer.isActive():
                    queued_button.playback_check_timer.stop()
            self.queued_main_track_button = None
        button.play_audio()
        self.active_main_track_button = button

    def stop_all_sounds(self):
        stopped_any = False
        for row_buttons in self.buttons:
            for button in row_buttons:
                if button.current_sound_channel and button.current_sound_channel.get_sound() and button.current_sound_channel.get_busy():
                    try:
                        button.current_sound_channel.stop()
                        stopped_any = True
                        button.is_paused = False
                        button.is_playing_visual_indicator = False
                        button.progress_ratio = 0
                        if button.playback_check_timer.isActive(): button.playback_check_timer.stop()
                        button._update_style()
                        button.update_tooltip()
                        button.update() # Forza ridisegno per pulire la progress bar
                    except pygame.error as e:
                        # Manteniamo un log per il debug, ma nessun QMessageBox qui per non essere invasivi
                        pass
        # Rimosso QMessageBox da qui
        # if stopped_any:
        #     QMessageBox.information(self, "Audio Fermato", "Tutti i suoni in riproduzione sono stati fermati.")
        # else:
        #     QMessageBox.information(self, "Nessun Audio", "Nessun suono era in riproduzione.")

    def _check_memory_usage(self):
        """Controlla periodicamente l'uso della memoria e esegue cleanup se necessario"""
        try:
            if memory_manager.should_cleanup():
                logger.info("Esecuzione cleanup memoria programmato")
                memory_manager.cleanup()
                memory_manager.optimize_pygame_resources()

            # Log periodico delle statistiche memoria (ogni 5 minuti)
            import time
            if int(time.time()) % 300 == 0:
                stats = memory_manager.get_memory_stats()
                logger.debug(f"Statistiche memoria: {stats}")

        except Exception as e:
            logger.warning(f"Errore durante controllo memoria: {e}")

    def closeEvent(self, event):
        logger.info("Chiusura applicazione in corso...")

        # Ferma timer monitoraggio memoria
        if hasattr(self, 'memory_monitor_timer'):
            self.memory_monitor_timer.stop()

        # Cancella eventuali caricamenti asincroni in corso
        async_audio_loader.cancel_all()
        logger.debug("Caricamenti asincroni cancellati")

        # Esegui cleanup finale della memoria
        memory_manager.cleanup()
        logger.debug("Cleanup memoria finale completato")

        # Salva configurazione
        self.save_config()

        # Chiudi mixer audio
        pygame.mixer.quit()
        logger.info("Applicazione chiusa correttamente")

        event.accept()

    def save_config(self):
        """Salva la configurazione con error handling migliorato"""
        logger.info("Avvio salvataggio configurazione")

        try:
            config_data = []
            for r_idx, row_buttons in enumerate(self.buttons):
                row_config = []
                for c_idx, button in enumerate(row_buttons):
                    # Verifica che il pulsante esista prima di accedere alla configurazione
                    actual_button = self.grid_layout.itemAtPosition(r_idx, c_idx).widget()
                    if actual_button and isinstance(actual_button, JingleButton):
                        try:
                            row_config.append(actual_button.get_config())
                        except Exception as e:
                            logger.warning(f"Errore nel recupero configurazione pulsante [{r_idx},{c_idx}]: {e}")
                            row_config.append(JingleButton().get_config())  # Config vuota come fallback
                    else:
                        logger.warning(f"Pulsante non valido in posizione [{r_idx},{c_idx}]")
                        row_config.append(JingleButton().get_config())
                config_data.append(row_config)

            config_file_path = config.get_config_file_path()
            logger.debug(f"Salvataggio configurazione in: {config_file_path}")

            with open(config_file_path, "w", encoding='utf-8') as f:
                json.dump(config_data, f, indent=4, ensure_ascii=False)

            logger.info("Configurazione salvata con successo")

        except IOError as e:
            logger.error(f"Errore I/O durante salvataggio configurazione: {e}", exc_info=True)
            QMessageBox.critical(self, "Errore Salvataggio",
                               f"Errore durante il salvataggio della configurazione:\n{e}")
        except Exception as e:
            logger.error(f"Errore imprevisto durante salvataggio configurazione: {e}", exc_info=True)
            QMessageBox.critical(self, "Errore Inaspettato",
                               f"Si è verificato un errore imprevisto durante il salvataggio:\n{e}")

    def load_config(self):
        """Carica la configurazione con error handling migliorato"""
        config_file_path = config.get_config_file_path()
        logger.info(f"Caricamento configurazione da: {config_file_path}")

        try:
            if not os.path.exists(config_file_path):
                logger.info("File di configurazione non trovato, verrà creato al prossimo salvataggio")
                QMessageBox.information(self, "Nessuna Configurazione",
                                      "Nessun file di configurazione trovato. Verrà creato al prossimo salvataggio.")
                return

            logger.debug("Lettura file di configurazione")
            with open(config_file_path, "r", encoding='utf-8') as f:
                config_data = json.load(f)

            rows = config.get('ui.grid_rows')
            cols = config.get('ui.grid_cols')

            # Validazione struttura configurazione
            if len(config_data) != rows or not all(len(row) == cols for row in config_data):
                logger.warning(f"Configurazione non valida: attesa {rows}x{cols}, trovata {len(config_data)}x{max(len(row) for row in config_data) if config_data else 0}")
                QMessageBox.warning(self, "Errore Configurazione",
                                  f"File di configurazione trovato ma non valido per la griglia {rows}x{cols}. Verrà creata una nuova configurazione.")
                return

            # Caricamento configurazione pulsanti
            loaded_count = 0
            for r, row_config_data in enumerate(config_data):
                for c, button_config_data in enumerate(row_config_data):
                    try:
                        button = self.grid_layout.itemAtPosition(r, c).widget()
                        if button and isinstance(button, JingleButton):
                            button.set_config(button_config_data)
                            loaded_count += 1
                        else:
                            logger.warning(f"Pulsante non valido in posizione [{r},{c}]")
                    except Exception as e:
                        logger.error(f"Errore caricamento configurazione pulsante [{r},{c}]: {e}", exc_info=True)

            logger.info(f"Configurazione caricata con successo: {loaded_count} pulsanti configurati")

        except json.JSONDecodeError as e:
            logger.error(f"Errore parsing JSON configurazione: {e}", exc_info=True)
            QMessageBox.critical(self, "Errore Configurazione",
                               f"File di configurazione corrotto:\n{e}")
        except IOError as e:
            logger.error(f"Errore I/O durante caricamento configurazione: {e}", exc_info=True)
            QMessageBox.critical(self, "Errore Caricamento Config.",
                               f"Errore durante il caricamento della configurazione:\n{e}")
        except Exception as e:
            logger.error(f"Errore imprevisto durante caricamento configurazione: {e}", exc_info=True)
            QMessageBox.critical(self, "Errore Inaspettato",
                               f"Si è verificato un errore imprevisto:\n{e}")

if __name__ == '__main__':
    try:
        logger.info("Avvio Advanced Jingle Machine")

        # Inizializzazione PyQt
        app = QApplication(sys.argv)
        logger.debug("Applicazione Qt inizializzata")

        # Mostra la schermata di benvenuto
        logger.debug("Visualizzazione schermata di benvenuto")
        welcome = WelcomeDialog()
        result = welcome.exec()

        if result == QDialog.DialogCode.Accepted:
            logger.info("Utente ha confermato avvio applicazione")
            # Se l'utente clicca "AVVIA SOFTWARE", mostra la finestra principale
            main_window = JingleMachine()
            main_window.show()
            logger.info("Finestra principale visualizzata, avvio event loop")
            sys.exit(app.exec())
        else:
            logger.info("Utente ha annullato avvio applicazione")
            # Se l'utente chiude la schermata di benvenuto, esce
            sys.exit(0)

    except Exception as e:
        logger.critical(f"Errore critico durante avvio applicazione: {e}", exc_info=True)
        QMessageBox.critical(None, "Errore Critico",
                           f"Si è verificato un errore critico durante l'avvio:\n{e}\n\nL'applicazione verrà chiusa.")
        sys.exit(1)