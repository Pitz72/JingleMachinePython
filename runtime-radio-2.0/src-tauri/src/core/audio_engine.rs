// Audio Engine Module
// This module is now updated to conceptually handle advanced fades.

use std::sync::{Arc, Mutex};
use crate::core::config_manager::FadeType;

// Represents a single, currently playing sound instance.
pub struct Voice {
    pub id: String, // Corresponds to the button ID
    // In a real implementation, this would be a Rodio `Sink` or similar.
    // We'll use a placeholder.
    _handle: usize,
}

// The main audio engine.
#[derive(Clone)]
pub struct AudioEngine {
    // We now manage a list of active voices.
    voices: Arc<Mutex<Vec<Voice>>>,
}

impl AudioEngine {
    pub fn new() -> Result<Self, String> {
        println!("AudioEngine: Initializing...");
        Ok(Self {
            voices: Arc::new(Mutex::new(Vec::new())),
        })
    }

    /// Plays a new sound immediately, without any fading.
    pub fn play_immediate(&self, button_id: &str, file_path: &str, volume: f32) {
        println!("[AudioEngine] Playing '{}' immediately.", button_id);
        // In a real app, create a new Rodio Sink, set volume, append decoder, and play.
        let mut voices = self.voices.lock().unwrap();
        voices.push(Voice { id: button_id.to_string(), _handle: voices.len() });
    }

    /// Stops a specific voice by its ID.
    pub fn stop(&self, button_id: &str) {
         println!("[AudioEngine] Stopping '{}'.", button_id);
         let mut voices = self.voices.lock().unwrap();
         voices.retain(|v| v.id != button_id);
    }

    /// Stops a voice with a fade-out.
    pub fn fade_out_and_stop(&self, button_id: &str, duration_ms: u32) {
        println!("[AudioEngine] Fading out '{}' over {}ms.", button_id, duration_ms);
        // In a real app, get the sink for the voice and call `fade_to` or a similar function
        // in a separate thread. After the fade, stop the sink and remove the voice.
        let mut voices = self.voices.lock().unwrap();
        voices.retain(|v| v.id != button_id);
    }

    /// The main transition function. It decides which fade logic to use.
    pub fn transition(
        &self,
        from_id: Option<String>,
        to_config: &crate::core::config_manager::ButtonConfig,
    ) {
        let fade_type = &to_config.fade_type;
        let duration_ms = to_config.fade_duration_ms;
        let to_id = &to_config.id;

        println!("[AudioEngine] Transitioning from {:?} to {} using {:?} over {}ms", from_id, to_id, fade_type, duration_ms);

        // Stop the old track using the specified fade type
        if let Some(id) = from_id {
            self.fade_out_and_stop(&id, duration_ms);
        }

        // Start the new track based on the fade type
        if let Some(file_path) = &to_config.audio_file_path {
            match fade_type {
                FadeType::Crossfade => {
                    println!("[AudioEngine] Fading in '{}'.", to_id);
                    // In a real app, start the new sound at volume 0 and fade it in.
                    self.play_immediate(to_id, file_path, to_config.volume);
                },
                FadeType::Duckfade => {
                     println!("[AudioEngine] Starting '{}' immediately (netto).", to_id);
                    // Start the new sound at its target volume immediately.
                    self.play_immediate(to_id, file_path, to_config.volume);
                }
            }
        }
    }

    pub fn stop_all(&self) {
        println!("[AudioEngine] Stopping all sounds.");
        let mut voices = self.voices.lock().unwrap();
        voices.clear();
    }
}
