// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod core;
use crate::core::{commands, audio_engine, config_manager};
use std::sync::Mutex;

// --- Application State ---
// This struct holds all the shared state for the application.
// Tauri will manage access to this state for us.
pub struct AppState {
    pub audio_engine: audio_engine::AudioEngine,
    pub config: Mutex<Vec<config_manager::ButtonConfig>>,
}

impl AppState {
    fn new() -> Self {
        Self {
            // Initialize the audio engine. Panicking here is okay because
            // the app can't run without audio.
            audio_engine: audio_engine::AudioEngine::new().expect("Failed to initialize audio engine"),
            // Initialize with an empty config. It will be loaded from a file.
            config: Mutex::new(Vec::new()),
        }
    }
}

fn main() {
    // Create the shared state instance
    let app_state = AppState::new();

    tauri::Builder::default()
        // Add the AppState to Tauri's managed state
        .manage(app_state)
        // Register the Tauri commands
        .invoke_handler(tauri::generate_handler![
            commands::load_profile_command,
            commands::play_audio_command
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
