// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// Import core modules
mod core;
use crate::core::{commands, audio_engine, config_manager};

fn main() {
    // Here we would initialize the application state
    // let app_state = AppState::new();

    tauri::Builder::default()
        // .manage(app_state) // Manage the application state
        .invoke_handler(tauri::generate_handler![
            // List all the commands exposed to the frontend
            commands::play_audio,
            commands::load_config
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
