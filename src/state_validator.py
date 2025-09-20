"""
Validatore di stati per garantire la consistenza del sistema di riproduzione
"""
from typing import Optional, Dict, Any
from logger import logger


class StateValidator:
    """Validatore per gli stati di riproduzione"""

    # Stati validi e loro proprietà
    VALID_STATES = {
        'stopped': {
            'can_play': True,
            'can_pause': False,
            'can_stop': False,
            'is_playing': False,
            'is_paused': False,
            'has_audio': False  # Può essere True se ha audio caricato
        },
        'playing': {
            'can_play': False,
            'can_pause': True,
            'can_stop': True,
            'is_playing': True,
            'is_paused': False,
            'has_audio': True
        },
        'paused': {
            'can_play': True,
            'can_pause': False,
            'can_stop': True,
            'is_playing': False,
            'is_paused': True,
            'has_audio': True
        },
        'queued': {
            'can_play': False,
            'can_pause': False,
            'can_stop': True,
            'is_playing': False,
            'is_paused': False,
            'has_audio': True
        }
    }

    # Transizioni valide tra stati
    VALID_TRANSITIONS = {
        'stopped': ['playing', 'queued'],
        'playing': ['paused', 'stopped'],
        'paused': ['playing', 'stopped'],
        'queued': ['playing', 'stopped']
    }

    @staticmethod
    def validate_state(current_state: str, button_properties: Dict[str, Any]) -> Dict[str, Any]:
        """
        Valida lo stato corrente e le proprietà del pulsante

        Args:
            current_state: Stato corrente
            button_properties: Proprietà del pulsante

        Returns:
            Dizionario con risultati della validazione
        """
        result = {
            'is_valid': True,
            'errors': [],
            'warnings': [],
            'suggestions': []
        }

        # Verifica che lo stato sia valido
        if current_state not in StateValidator.VALID_STATES:
            result['is_valid'] = False
            result['errors'].append(f"Stato non valido: {current_state}")
            return result

        state_config = StateValidator.VALID_STATES[current_state]

        # Verifica consistenza delle proprietà
        issues = StateValidator._check_property_consistency(current_state, state_config, button_properties)
        result['errors'].extend(issues['errors'])
        result['warnings'].extend(issues['warnings'])
        result['suggestions'].extend(issues['suggestions'])

        if result['errors']:
            result['is_valid'] = False

        return result

    @staticmethod
    def validate_transition(from_state: str, to_state: str) -> Dict[str, Any]:
        """
        Valida una transizione di stato

        Args:
            from_state: Stato di partenza
            to_state: Stato di destinazione

        Returns:
            Dizionario con risultati della validazione
        """
        result = {
            'is_valid': True,
            'errors': [],
            'warnings': []
        }

        # Verifica stati validi
        if from_state not in StateValidator.VALID_STATES:
            result['is_valid'] = False
            result['errors'].append(f"Stato di partenza non valido: {from_state}")
            return result

        if to_state not in StateValidator.VALID_STATES:
            result['is_valid'] = False
            result['errors'].append(f"Stato di destinazione non valido: {to_state}")
            return result

        # Verifica transizione valida
        if to_state not in StateValidator.VALID_TRANSITIONS[from_state]:
            result['is_valid'] = False
            result['errors'].append(f"Transizione non valida: {from_state} -> {to_state}")
            result['warnings'].append(f"Transizioni valide da {from_state}: {StateValidator.VALID_TRANSITIONS[from_state]}")

        return result

    @staticmethod
    def _check_property_consistency(state: str, state_config: Dict[str, Any],
                                  button_props: Dict[str, Any]) -> Dict[str, Any]:
        """Verifica la consistenza delle proprietà con lo stato"""
        result = {'errors': [], 'warnings': [], 'suggestions': []}

        # Verifica audio_file
        has_audio = bool(button_props.get('audio_file'))
        expected_has_audio = state_config['has_audio']

        if expected_has_audio and not has_audio:
            result['errors'].append(f"Stato {state} richiede un file audio, ma non è presente")
        elif not expected_has_audio and has_audio:
            result['warnings'].append(f"Stato {state} normalmente non ha audio, ma è presente")

        # Verifica is_playing_visual_indicator
        actual_playing = button_props.get('is_playing_visual_indicator', False)
        expected_playing = state_config['is_playing']

        if actual_playing != expected_playing:
            result['errors'].append(f"Indicatore visivo di riproduzione inconsistente: "
                                  f"atteso {expected_playing}, trovato {actual_playing}")

        # Verifica is_paused
        actual_paused = button_props.get('is_paused', False)
        expected_paused = state_config['is_paused']

        if actual_paused != expected_paused:
            result['errors'].append(f"Stato pausa inconsistente: "
                                  f"atteso {expected_paused}, trovato {actual_paused}")

        # Verifica is_queued
        if state == 'queued':
            if not button_props.get('is_queued', False):
                result['errors'].append("Stato queued richiede is_queued=True")
        elif button_props.get('is_queued', False):
            result['warnings'].append("is_queued=True ma stato non è queued")

        # Verifica current_sound_channel
        has_channel = button_props.get('current_sound_channel') is not None
        if state in ['playing', 'paused'] and not has_channel:
            result['errors'].append(f"Stato {state} richiede un canale audio attivo")
        elif state == 'stopped' and has_channel:
            # Verifica se il canale è realmente attivo
            channel = button_props.get('current_sound_channel')
            if channel and hasattr(channel, 'get_busy') and channel.get_busy():
                result['warnings'].append("Stato stopped ma canale audio ancora attivo")

        return result

    @staticmethod
    def suggest_state_correction(button_props: Dict[str, Any]) -> Optional[str]:
        """
        Suggerisce uno stato corretto basato sulle proprietà attuali

        Args:
            button_props: Proprietà attuali del pulsante

        Returns:
            Stato suggerito o None se non applicabile
        """
        has_audio = bool(button_props.get('audio_file'))
        is_playing = button_props.get('is_playing_visual_indicator', False)
        is_paused = button_props.get('is_paused', False)
        is_queued = button_props.get('is_queued', False)
        has_channel = button_props.get('current_sound_channel') is not None

        # Logica decisionale per suggerire lo stato corretto
        if not has_audio:
            return 'stopped'
        elif is_queued:
            return 'queued'
        elif is_paused and has_channel:
            return 'paused'
        elif is_playing and has_channel:
            return 'playing'
        else:
            return 'stopped'

    @staticmethod
    def log_validation_result(validation_result: Dict[str, Any], button_id: str = "unknown"):
        """Logga i risultati della validazione"""
        if not validation_result['is_valid']:
            logger.error(f"Validazione stato fallita per pulsante {button_id}: {validation_result['errors']}")

        if validation_result['warnings']:
            logger.warning(f"Avvisi validazione per pulsante {button_id}: {validation_result['warnings']}")

        if validation_result['suggestions']:
            logger.info(f"Suggerimenti per pulsante {button_id}: {validation_result['suggestions']}")


# Istanza globale del validatore
state_validator = StateValidator()