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

# Schermata di Benvenuto
class WelcomeDialog(QDialog):
    def __init__(self, parent=None):
        super().__init__(parent)
        self.setWindowTitle("Advanced Jingle Machine v1.5")
        self.setFixedSize(700, 650)
        self.setModal(True)
        
        # Imposta l'icona della finestra
        icon_path = "../AJM-free/advjingle.png"
        if os.path.exists(icon_path):
            self.setWindowIcon(QIcon(icon_path))
        
        layout = QVBoxLayout(self)
        layout.setSpacing(15)
        layout.setContentsMargins(40, 30, 40, 30)
        
        # Logo/Immagine
        logo_label = QLabel()
        if os.path.exists(icon_path):
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
        title_label = QLabel("Advanced Jingle Machine")
        title_font = QFont()
        title_font.setPointSize(24)
        title_font.setBold(True)
        title_label.setFont(title_font)
        title_label.setAlignment(Qt.AlignmentFlag.AlignCenter)
        title_label.setStyleSheet("color: #4CAF50; margin-bottom: 10px;")
        layout.addWidget(title_label)
        
        # Versione
        version_label = QLabel("Versione 1.5")
        version_font = QFont()
        version_font.setPointSize(14)
        version_label.setFont(version_font)
        version_label.setAlignment(Qt.AlignmentFlag.AlignCenter)
        version_label.setStyleSheet("color: #888; margin-bottom: 20px;")
        layout.addWidget(version_label)
        
        # Autore
        author_label = QLabel("Autore: Simone Pizzi")
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
        paypal_label = QLabel('<a href="https://paypal.me/runtimeradio" style="color: #4CAF50; text-decoration: none;">paypal.me/runtimeradio</a>')
        paypal_label.setAlignment(Qt.AlignmentFlag.AlignCenter)
        paypal_label.setOpenExternalLinks(True)
        paypal_label.setStyleSheet("font-weight: bold; margin-bottom: 10px;")
        layout.addWidget(paypal_label)
        
        # Sito web
        website_label = QLabel('<a href="https://pizzisimone.runtimeradio.it" style="color: #2196F3; text-decoration: none;">pizzisimone.runtimeradio.it</a>')
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
        self.volume = 1.0
        self.original_color = "#3E3E3E"
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
        self.playback_check_timer.setInterval(50) # Intervallo più frequente per progress bar fluida
        
        # Contatore per rallentare il lampeggio della coda (ogni ~800ms invece di 50ms)
        self._queue_flash_counter = 0
        self.update_tooltip()

    def paintEvent(self, event):
        # DEBUG PRINT RIMOSSO
        # print(f"PaintEvent for {self.text()}: Playing={self.is_playing_visual_indicator}, Paused={self.is_paused}, Duration={self.audio_duration}, Loop={self.loop}, Ratio={self.progress_ratio:.2f}")
        super().paintEvent(event)

        if self.is_playing_visual_indicator and not self.is_paused and self.audio_duration > 0 and not self.loop:
            # DEBUG PRINT RIMOSSO
            # print(f"  -> Drawing progress bar for {self.text()} with ratio {self.progress_ratio:.2f}")
            painter = QPainter(self)
            painter.setRenderHint(QPainter.RenderHint.Antialiasing)

            # Impostazioni Progress Bar più evidenti
            bar_height = 7 # Aumentata altezza della progress bar
            bar_margin_bottom = 4 # Leggermente più in alto dal bordo inferiore del pulsante
            bar_margin_horizontal = 2 # Margine orizzontale interno al pulsante, ridotto per più spazio

            rect_width = self.width() - (2 * bar_margin_horizontal)
            rect_y = self.height() - bar_height - bar_margin_bottom
            
            # Colore della progress bar (un verde leggermente diverso dal bordo per distinguerla)
            progress_bar_fill_color = QColor("#60FF60") # Verde più chiaro per il fill
            # Colore di sfondo della barra (parte non percorsa)
            progress_bar_bg_color = QColor(0,0,0, 60) # Grigio scuro semi-trasparente

            # Disegna lo sfondo completo della barra di progresso
            painter.setBrush(QBrush(progress_bar_bg_color))
            painter.setPen(Qt.PenStyle.NoPen)
            painter.drawRect(bar_margin_horizontal, rect_y, rect_width, bar_height)

            # Calcola la larghezza della parte "attiva" (percorsa)
            active_bar_width = int(rect_width * self.progress_ratio)
            
            painter.setBrush(QBrush(progress_bar_fill_color))
            # Disegna la parte percorsa da sinistra
            painter.drawRect(bar_margin_horizontal, rect_y, active_bar_width, bar_height)

    def _update_style(self):
        is_ending_soon = self.is_playing_visual_indicator and not self.is_paused and self.audio_duration > 0 and (1.0 - self.progress_ratio) < 0.15 and (1.0 - self.progress_ratio) > 0.01 # es. ultimi 15%
        
        border_color = QColor("#555") # Colore di default
        
        if is_ending_soon:
            # Lampeggio semplice alternando il colore del bordo
            # Questa logica di lampeggio è basica e potrebbe essere migliorata con un altro timer dedicato
            # o basandosi sul numero di chiamate a _update_style
            if hasattr(self, '_flash_state') and self._flash_state:
                 border_color = QColor("#FFA500") # Arancione per lampeggio
                 self._flash_state = False
            else:
                 border_color = QColor("#FFFF00") # Giallo
                 self._flash_state = True
        elif self.is_queued: # NUOVA CONDIZIONE
            # Lampeggio blu/ciano per indicare che è in coda
            if hasattr(self, '_flash_state_queued') and self._flash_state_queued:
                border_color = QColor("#00FFFF") # Ciano
                self._flash_state_queued = False
            else:
                border_color = QColor("#007BFF") # Blu
                self._flash_state_queued = True
        elif self.is_playing_visual_indicator and not self.is_paused:
            border_color = QColor("#00FF00") # Verde per in riproduzione
        
        border_color_hex = border_color.name()

        self.setStyleSheet(f"""
            QPushButton {{
                background-color: {self.color};
                color: white;
                border: 2px solid {border_color_hex};
                padding: 5px;
            }}
            QPushButton:hover {{
                background-color: {self._lighter_color(self.color)};
            }}
            QPushButton:pressed {{
                background-color: {self._darker_color(self.color)};
            }}
        """)
        
        # Aggiungi self.is_queued alla condizione per forzare il ridisegno
        if is_ending_soon or self.is_queued or (self.is_playing_visual_indicator and not self.is_paused):
            self.update() 

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
        # DEBUG PRINT RIMOSSO
        # print(f"_check_playback_status for: {self.text()} - Timer Active: {self.playback_check_timer.isActive()}")
        
        # Se il pulsante è in coda, deve sempre lampeggiare (ma lentamente)
        if self.is_queued:
            self._queue_flash_counter += 1
            # Lampeggia ogni 16 cicli (16 * 50ms = 800ms)
            if self._queue_flash_counter >= 16:
                self._queue_flash_counter = 0
                self._update_style() # Forza aggiornamento per lampeggio
            return
        
        if self.current_sound_channel and self.current_sound_channel.get_sound() and self.current_sound_channel.get_busy():
            # DEBUG PRINT RIMOSSO
            # print(f"  Sound Busy for {self.text()}. Paused: {self.is_paused}, Loop: {self.loop}, Duration: {self.audio_duration}")
            if not self.is_paused:
                if not self.is_playing_visual_indicator: 
                    self.is_playing_visual_indicator = True
                
                if self.audio_duration > 0 and not self.loop: 
                    current_ticks = pygame.time.get_ticks()
                    if self.playback_start_time_ms > 0:
                        current_pos_ms = current_ticks - self.playback_start_time_ms
                    else:
                        current_pos_ms = 0 
                    # DEBUG PRINT RIMOSSO
                    # print(f"    DEBUG TICKS: current={current_ticks}, start={self.playback_start_time_ms}, pos_ms={current_pos_ms}")
                    self.progress_ratio = (current_pos_ms / 1000.0) / self.audio_duration
                    self.progress_ratio = min(max(0.0, self.progress_ratio), 1.0) 
                    # print(f"    --> Calculated Progress for {self.text()}: PosMS={current_pos_ms}, Ratio={self.progress_ratio:.2f}")
                else:
                    self.progress_ratio = 0 
                self.update() 
            else: 
                 # Mantiene l'ultimo progresso noto se in pausa, ma non dovrebbe essere disegnato attivamente
                 # self.progress_ratio = self.progress_ratio 
                 if self.is_playing_visual_indicator: 
                     self.is_playing_visual_indicator = False 

        else: 
            # Se prima era in riproduzione e ora non lo è più, significa che è appena terminato.
            was_playing = self.is_playing_visual_indicator
            if self.is_playing_visual_indicator or self.progress_ratio > 0: 
                self.is_playing_visual_indicator = False
                self.progress_ratio = 0
            if self.playback_check_timer.isActive():
                 self.playback_check_timer.stop()
            
            # EMETTI IL SEGNALE
            # Emettiamo il segnale solo se era effettivamente in riproduzione,
            # per non emetterlo per pulsanti che non stavano facendo nulla.
            if was_playing:
    
                self.playback_finished.emit(self)
        
        self._update_style() 
        self.update_tooltip()

    def stop_audio(self):
        """Ferma la riproduzione del suono di questo pulsante, se attivo."""
        if self.current_sound_channel and self.current_sound_channel.get_busy():
            self.current_sound_channel.stop()
            # Aggiungiamo un reset completo dello stato visivo
            self.is_playing_visual_indicator = False
            self.is_paused = False
            self.is_queued = False # Assicuriamoci che anche lo stato di coda sia resettato
            self.progress_ratio = 0
            if self.playback_check_timer.isActive():
                self.playback_check_timer.stop()
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
        if not self.audio_file or not pygame.mixer.get_init():
            QMessageBox.warning(self, "Errore Audio", f"Nessun file audio per '{self.text()}' o mixer non inizializzato.")
            return
        try:
            sound_is_active = self.current_sound_channel and self.current_sound_channel.get_sound() and self.current_sound_channel.get_busy()

            if self.continue_playback:
                if sound_is_active:
                    if self.is_paused:
                        self.current_sound_channel.unpause()
                        self.is_paused = False
                        if not self.loop:
                            if hasattr(self, 'paused_at_ms'): 
                                self.playback_start_time_ms = pygame.time.get_ticks() - self.paused_at_ms
                            else: # Fallback improbabile se __init__ è corretto
                                self.playback_start_time_ms = pygame.time.get_ticks() 
                                self.paused_at_ms = 0 # Assicura che sia definito
                        else:
                             self.playback_start_time_ms = 0
                        self.is_playing_visual_indicator = True 
                        if not self.playback_check_timer.isActive(): self.playback_check_timer.start()
                    else: # Pausa
                        self.current_sound_channel.pause()
                        self.is_paused = True
                        if not self.loop and self.playback_start_time_ms > 0:
                            self.paused_at_ms = pygame.time.get_ticks() - self.playback_start_time_ms
                        else:
                            self.paused_at_ms = 0
                        self.is_playing_visual_indicator = False 
                else: # Avvia per la prima volta in modalità continua
                    if self.current_sound_channel: self.current_sound_channel.stop()
                    sound = pygame.mixer.Sound(self.audio_file)
                    sound.set_volume(self.volume)
                    self.current_sound_channel = sound.play()
                    self.is_paused = False
                    if not self.loop:
                        self.playback_start_time_ms = pygame.time.get_ticks()
                        self.paused_at_ms = 0 
                    else:
                        self.playback_start_time_ms = 0
                    self.is_playing_visual_indicator = True
                    if not self.playback_check_timer.isActive(): self.playback_check_timer.start()
                self._update_style()
                self.update_tooltip()
                return

            if sound_is_active:
                self.current_sound_channel.stop()
                self.is_paused = False 
                self.is_playing_visual_indicator = False
                self.progress_ratio = 0
                if self.playback_check_timer.isActive(): self.playback_check_timer.stop()
                self._update_style()
                self.update_tooltip()
                return 
            
            self.current_sound_channel = None
            self.is_paused = False
            self.progress_ratio = 0 # Reset progresso prima di iniziare
            sound = pygame.mixer.Sound(self.audio_file) # Ricarica per ottenere durata fresca se non già fatto
            sound.set_volume(self.volume)
            loops_to_play = -1 if self.loop else 0
            self.current_sound_channel = sound.play(loops=loops_to_play)
            
            # Impostazione corretta di playback_start_time_ms e paused_at_ms
            if self.loop:
                self.playback_start_time_ms = 0
                self.paused_at_ms = 0 # Anche se non usato per loop, resettiamolo per coerenza
            else: # Modalità Da Capo (o Continua al primo avvio)
                self.playback_start_time_ms = pygame.time.get_ticks()
                self.paused_at_ms = 0 # Inizia da capo, nessuna pausa precedente
            
            self.is_playing_visual_indicator = True
            if not self.playback_check_timer.isActive(): self.playback_check_timer.start()
            
            self.audio_duration = sound.get_length() # Memorizza durata
            # NON ci devono essere altri reset di playback_start_time_ms o paused_at_ms qui sotto

        except pygame.error as e:
            QMessageBox.critical(self, "Errore Pygame", f"Errore durante l'interazione con l'audio {os.path.basename(self.audio_file if self.audio_file else 'N/A')}:\n{e}")
            if self.current_sound_channel: self.current_sound_channel.stop()
            self.current_sound_channel = None
            self.is_paused = False
            self.is_playing_visual_indicator = False
            self.progress_ratio = 0
            if self.playback_check_timer.isActive(): self.playback_check_timer.stop()
        except Exception as e:
            QMessageBox.critical(self, "Errore Generico", f"Errore in play_audio per {self.text()}:\n{e}")
        self._update_style()
        self.update_tooltip()

    def load_audio_file(self):
        file_filter = "File Audio (*.mp3 *.wav *.ogg *.aac *.flac);;Tutti i File (*)"
        file_name, _ = QFileDialog.getOpenFileName(self, "Seleziona File Audio", "", file_filter)
        if file_name:
            self.audio_file = file_name
            try:
                sound = pygame.mixer.Sound(self.audio_file)
                self.audio_duration = sound.get_length() # Memorizza durata
                self.playback_start_time_ms = 0 # Reset
                self.paused_at_ms = 0 # Reset
            except pygame.error as e:
                QMessageBox.critical(self, "Errore Caricamento Audio", f"Impossibile caricare il file audio:\n{file_name}\nErrore: {e}")
                self.audio_file = None
                self.audio_duration = 0
                return # Esce se il file non è valido

            if self.current_sound_channel and self.current_sound_channel.get_sound(): self.current_sound_channel.stop()
            self.current_sound_channel = None
            self.is_paused = False
            self.is_playing_visual_indicator = False
            self.progress_ratio = 0
            if self.playback_check_timer.isActive(): self.playback_check_timer.stop()
            if not self.custom_name: self.setText(os.path.basename(file_name))
            else: self.setText(self.custom_name)
            self._update_style()
        self.update_tooltip()

    def remove_audio(self):
        if self.current_sound_channel and self.current_sound_channel.get_sound():
            try: self.current_sound_channel.stop()
            except pygame.error: pass
        self.audio_file = None
        self.custom_name = None
        self.loop = False
        self.continue_playback = False
        self.play_from_start = True
        self.is_paused = False
        self.is_queued = False
        self.current_sound_channel = None
        self.volume = 1.0
        self.color = self.original_color = "#3E3E3E"
        self.is_playing_visual_indicator = False
        self.audio_duration = 0 # Resetta durata
        self.progress_ratio = 0 # Resetta progresso
        self.playback_start_time_ms = 0 # Reset
        self.paused_at_ms = 0 # Reset
        if self.playback_check_timer.isActive(): self.playback_check_timer.stop()
        self.setText("")
        self._update_style()
        self.enforce_playback_option_exclusivity() # Richiamato dopo aver resettato le opzioni
        self._update_playback_action_states()
        self.update_tooltip()
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
        self.setWindowTitle("Advanced Jingle Machine v1.5")
        self.setGeometry(100, 100, 1700, 550) 

        # Imposta l'icona della finestra principale
        icon_path = "../AJM-free/advjingle.png"
        if os.path.exists(icon_path):
            self.setWindowIcon(QIcon(icon_path))

        pygame.mixer.init()
        pygame.mixer.set_num_channels(128)

        # Proprietà per la gestione centralizzata della riproduzione
        self.active_main_track_button = None
        self.queued_main_track_button = None

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
        for row in range(11):
            row_buttons = []
            for col in range(8):
                button = JingleButton(parent=self.grid_widget) # Imposta il parent corretto
                button.setSizePolicy(QSizePolicy.Policy.Expanding, QSizePolicy.Policy.Expanding)
                button.setFixedSize(200, 35)
                # Connessione centralizzata: invece di button.play_audio, usa handle_button_press
                button.clicked.connect(lambda checked, b=button: self.handle_button_press(b))
                # Connessione per la riproduzione automatica dalla coda
                button.playback_finished.connect(self.on_playback_finished)
                
                # Logica per identificare la colonna degli effetti (ultima colonna)
                if col == 7:
                    button.is_overlay_effect = True
                    # Applica un colore di base leggermente diverso per riconoscere la colonna
                    button.original_color = "#4a4a4a" 
                    button.color = button.original_color
                    button._update_style()
                
                self.grid_layout.addWidget(button, row, col)
                row_buttons.append(button)
            self.buttons.append(row_buttons)

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

    def closeEvent(self, event):
        self.save_config()
        pygame.mixer.quit()
        event.accept()

    def save_config(self):
        config_data = []
        for r_idx, row_buttons in enumerate(self.buttons):
            row_config = []
            for c_idx, button in enumerate(row_buttons):
                # Verifica che il pulsante esista prima di accedere alla configurazione
                actual_button = self.grid_layout.itemAtPosition(r_idx, c_idx).widget()
                if actual_button and isinstance(actual_button, JingleButton):
                     row_config.append(actual_button.get_config())
                else: # In caso di problemi, salva una config vuota per quel posto
                    row_config.append(JingleButton().get_config())
            config_data.append(row_config)
        try:
            with open("jingle_config.json", "w") as f:
                json.dump(config_data, f, indent=4)
        except IOError as e:
            QMessageBox.critical(self, "Errore Salvataggio", f"Errore durante il salvataggio della configurazione:\n{e}")

    def load_config(self):
        try:
            if os.path.exists("jingle_config.json"):
                with open("jingle_config.json", "r") as f:
                    config_data = json.load(f)
                    if len(config_data) == 11 and all(len(row) == 8 for row in config_data):
                        for r, row_config_data in enumerate(config_data):
                            for c, button_config_data in enumerate(row_config_data):
                                button = self.grid_layout.itemAtPosition(r, c).widget()
                                if button and isinstance(button, JingleButton):
                                    button.set_config(button_config_data)
                        # Configurazione caricata silenziosamente
                    else:
                        QMessageBox.warning(self, "Errore Configurazione", "File di configurazione trovato ma non valido per la griglia 11x8. Verrà creata una nuova configurazione.")
            else:
                QMessageBox.information(self, "Nessuna Configurazione", "Nessun file di configurazione trovato. Verrà creato al prossimo salvataggio.")
        except (IOError, json.JSONDecodeError) as e:
            QMessageBox.critical(self, "Errore Caricamento Config.", f"Errore durante il caricamento della configurazione:\n{e}")

if __name__ == '__main__':
    pygame.init() # INIZIALIZZA TUTTI I MODULI PYGAME
    app = QApplication(sys.argv)
    
    # Mostra la schermata di benvenuto
    welcome = WelcomeDialog()
    if welcome.exec() == QDialog.DialogCode.Accepted:
        # Se l'utente clicca "AVVIA SOFTWARE", mostra la finestra principale
        main_window = JingleMachine()
        main_window.show()
        sys.exit(app.exec())
    else:
        # Se l'utente chiude la schermata di benvenuto, esce
        sys.exit(0) 