// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod core;
use crate::core::{commands, audio_engine, config_manager};
use std::collections::VecDeque;
use std::sync::Mutex;

// --- Playback State ---
// This struct holds the current state of audio playback.
#[derive(Default)]
pub struct PlaybackState {
    // The ID of the button currently playing as the main track.
    pub main_track_id: Option<String>,
    // A list of IDs for buttons playing as overlays.
    pub overlay_track_ids: Vec<String>,
    // A queue of button IDs waiting to be played.
    pub queued_track_ids: VecDeque<String>,
}

// --- Application State ---
// This struct holds all the shared state for the application.
pub struct AppState {
    pub audio_engine: audio_engine::AudioEngine,
    pub config: Mutex<Vec<config_manager::ButtonConfig>>,
    pub playback_state: Mutex<PlaybackState>,
}

impl AppState {
    fn new() -> Self {
        Self {
            audio_engine: audio_engine::AudioEngine::new().expect("Failed to initialize audio engine"),
            config: Mutex::new(Vec::new()),
            playback_state: Mutex::new(PlaybackState::default()),
        }
    }
}

fn main() {
    let app_state = AppState::new();

    tauri::Builder::default()
        .manage(app_state)
        .invoke_handler(tauri::generate_handler![
            commands::load_profile_command,
            commands::play_audio_command,
            commands::stop_all_command // Add new command
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
