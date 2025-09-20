"""
Gestore memoria per ottimizzare l'uso delle risorse in Advanced Jingle Machine
"""
import gc
import psutil
import os
from typing import Dict, List, Optional
from logger import logger
from config import config


class MemoryManager:
    """Gestore centralizzato della memoria e risorse"""

    _instance = None
    _memory_threshold = 100 * 1024 * 1024  # 100MB threshold
    _cleanup_interval = 30000  # 30 secondi

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance._initialize()
        return cls._instance

    def _initialize(self):
        """Inizializza il gestore memoria"""
        self._tracked_objects = {}
        self._memory_usage_history = []
        self._last_cleanup = 0
        logger.info("MemoryManager inizializzato")

    def track_object(self, obj_id: str, obj, obj_type: str = "generic"):
        """Traccia un oggetto per il monitoraggio memoria"""
        self._tracked_objects[obj_id] = {
            'object': obj,
            'type': obj_type,
            'created_at': psutil.time.time() if psutil else 0
        }
        logger.debug(f"Oggetto tracciato: {obj_id} ({obj_type})")

    def untrack_object(self, obj_id: str):
        """Rimuove un oggetto dal monitoraggio"""
        if obj_id in self._tracked_objects:
            del self._tracked_objects[obj_id]
            logger.debug(f"Oggetto rimosso dal monitoraggio: {obj_id}")

    def get_memory_usage(self) -> Dict:
        """Restituisce informazioni sull'uso della memoria"""
        try:
            process = psutil.Process(os.getpid())
            memory_info = process.memory_info()

            return {
                'rss': memory_info.rss,  # Resident Set Size
                'vms': memory_info.vms,  # Virtual Memory Size
                'percentage': process.memory_percent(),
                'tracked_objects': len(self._tracked_objects)
            }
        except Exception as e:
            logger.warning(f"Errore nel monitoraggio memoria: {e}")
            return {'error': str(e)}

    def should_cleanup(self) -> bool:
        """Determina se è necessario eseguire una pulizia della memoria"""
        memory_info = self.get_memory_usage()
        current_time = psutil.time.time() if psutil else 0

        # Controlla soglia memoria
        if memory_info.get('rss', 0) > self._memory_threshold:
            logger.warning(f"Soglia memoria superata: {memory_info.get('rss', 0)} bytes")
            return True

        # Controlla intervallo di cleanup
        if current_time - self._last_cleanup > self._cleanup_interval:
            return True

        return False

    def cleanup(self):
        """Esegue la pulizia della memoria"""
        logger.info("Avvio pulizia memoria")

        try:
            # Forza garbage collection
            collected = gc.collect()
            logger.debug(f"Garbage collector: {collected} oggetti raccolti")

            # Cleanup oggetti pygame specifici
            self.cleanup_pygame_objects()

            # Rimuovi riferimenti deboli se necessario
            self._cleanup_weak_references()

            # Log utilizzo memoria dopo cleanup
            memory_info = self.get_memory_usage()
            logger.info(f"Memoria dopo cleanup: {memory_info.get('rss', 0)} bytes")

            self._last_cleanup = psutil.time.time() if psutil else 0

        except Exception as e:
            logger.error(f"Errore durante pulizia memoria: {e}")

    def _cleanup_weak_references(self):
        """Pulisce riferimenti deboli agli oggetti pygame"""
        try:
            import pygame
            if pygame.mixer.get_init():
                # Forza cleanup canali pygame non utilizzati
                for i in range(pygame.mixer.get_num_channels()):
                    channel = pygame.mixer.Channel(i)
                    if channel and not channel.get_busy():
                        # Il canale è libero, può essere riutilizzato
                        pass
                logger.debug("Cleanup canali pygame completato")
        except Exception as e:
            logger.warning(f"Errore durante cleanup pygame: {e}")

    def cleanup_pygame_objects(self):
        """Pulisce specificamente gli oggetti pygame tracciati"""
        pygame_objects = [
            obj_id for obj_id, obj_info in self._tracked_objects.items()
            if obj_info['type'] == 'pygame_sound'
        ]

        for obj_id in pygame_objects:
            try:
                obj_info = self._tracked_objects[obj_id]
                sound_obj = obj_info['object']
                # Qui possiamo aggiungere logica specifica per cleanup oggetti pygame
                # Ad esempio, fermare riproduzioni, liberare risorse, ecc.
                del self._tracked_objects[obj_id]
                logger.debug(f"Oggetto pygame pulito: {obj_id}")
            except Exception as e:
                logger.warning(f"Errore durante cleanup oggetto pygame {obj_id}: {e}")

    def optimize_pygame_resources(self):
        """Ottimizza l'uso delle risorse pygame"""
        try:
            # Forza cleanup canali pygame non utilizzati
            import pygame
            if pygame.mixer.get_init():
                # Qui possiamo implementare ottimizzazioni specifiche per pygame
                logger.debug("Ottimizzazione risorse pygame completata")
        except Exception as e:
            logger.warning(f"Errore ottimizzazione risorse pygame: {e}")

    def get_memory_stats(self) -> Dict:
        """Restituisce statistiche dettagliate sulla memoria"""
        memory_info = self.get_memory_usage()

        return {
            'current_usage': memory_info,
            'tracked_objects_count': len(self._tracked_objects),
            'tracked_objects_types': self._get_object_types_count(),
            'gc_stats': {
                'collected': gc.get_count(),
                'stats': gc.get_stats()
            }
        }

    def _get_object_types_count(self) -> Dict[str, int]:
        """Conta gli oggetti per tipo"""
        types_count = {}
        for obj_info in self._tracked_objects.values():
            obj_type = obj_info['type']
            types_count[obj_type] = types_count.get(obj_type, 0) + 1
        return types_count


# Istanza globale del memory manager
memory_manager = MemoryManager()