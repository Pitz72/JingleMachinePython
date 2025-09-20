"""
Componente per la gestione del feedback visivo
"""
from PyQt6.QtGui import QColor
from config import config


class VisualIndicator:
    """Gestisce il feedback visivo del pulsante"""

    def __init__(self, button):
        self.button = button
        self.flash_state = False
        self.flash_state_queued = False

    def update_style(self):
        """Aggiorna lo stile del pulsante basato sullo stato"""
        is_ending_soon = (self.button.is_playing_visual_indicator and
                         not self.button.is_paused and
                         self.button.audio_duration > 0 and
                         (1.0 - self.button.progress_ratio) < config.get('audio.progress_bar_threshold') and
                         (1.0 - self.button.progress_ratio) > 0.01)

        border_color = self._get_border_color(is_ending_soon)
        border_color_hex = border_color.name()

        self.button.setStyleSheet(f"""
            QPushButton {{
                background-color: {self.button.color};
                color: white;
                border: 2px solid {border_color_hex};
                padding: 5px;
            }}
            QPushButton:hover {{
                background-color: {self._lighter_color(self.button.color)};
            }}
            QPushButton:pressed {{
                background-color: {self._darker_color(self.button.color)};
            }}
        """)

        # Forza ridisegno quando necessario
        if is_ending_soon or self.button.is_queued or (self.button.is_playing_visual_indicator and not self.button.is_paused):
            self.button.update()

    def _get_border_color(self, is_ending_soon):
        """Determina il colore del bordo basato sullo stato"""
        if is_ending_soon:
            # Lampeggio semplice alternando il colore del bordo
            if hasattr(self, '_flash_state') and self._flash_state:
                  color = QColor(config.get('colors.ending_border'))
                  self._flash_state = False
            else:
                  color = QColor("#FFFF00") # Giallo
                  self._flash_state = True
        elif self.button.is_queued:
            # Lampeggio blu/ciano per indicare che è in coda
            if hasattr(self, '_flash_state_queued') and self._flash_state_queued:
                color = QColor("#00FFFF") # Ciano
                self._flash_state_queued = False
            else:
                color = QColor(config.get('colors.queued_border'))
                self._flash_state_queued = True
        elif self.button.is_playing_visual_indicator and not self.button.is_paused:
            color = QColor(config.get('colors.playing_border'))
        else:
            color = QColor("#555") # Colore di default

        return color

    def _lighter_color(self, hex_color, factor=0.2):
        """Restituisce una versione più chiara del colore"""
        qcolor = QColor(hex_color)
        h, s, l, a = qcolor.getHslF()
        l = min(1.0, l * (1 + factor))
        return QColor.fromHslF(h, s, l, a).name()

    def _darker_color(self, hex_color, factor=0.2):
        """Restituisce una versione più scura del colore"""
        qcolor = QColor(hex_color)
        h, s, l, a = qcolor.getHslF()
        l = max(0.0, l * (1 - factor))
        return QColor.fromHslF(h, s, l, a).name()

    def reset_flash_states(self):
        """Resetta gli stati di lampeggio"""
        self._flash_state = False
        self._flash_state_queued = False