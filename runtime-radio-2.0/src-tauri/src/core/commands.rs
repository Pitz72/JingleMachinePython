// This file contains all the Tauri commands that can be invoked from the frontend.

use crate::{AppState, core::config_manager};
use tauri::State;
use std::path::PathBuf; // For handling file paths

// A command to load a configuration profile.
#[tauri::command]
pub fn load_profile_command(app_handle: tauri::AppHandle, state: State<AppState>) -> Result<Vec<config_manager::ButtonConfig>, String> {
    println!("[Commands] Received load_profile_command");

    // Get the path to the app's config directory
    let config_dir = app_handle.path_resolver().app_config_dir().unwrap_or_else(|| {
        // Fallback for development if the directory doesn't exist
        PathBuf::from("./")
    });

    match config_manager::load_profile(&config_dir, "default_profile") {
        Ok(loaded_config) => {
            // Update the shared state with the loaded configuration
            let mut app_config = state.config.lock().unwrap();
            *app_config = loaded_config.clone();
            println!("[Commands] Configuration loaded and state updated.");
            Ok(loaded_config)
        },
        Err(e) => {
            eprintln!("[Commands] Error loading profile: {}", e);
            Err(e)
        }
    }
}

// A command to play audio for a specific button.
#[tauri::command]
pub fn play_audio_command(button_id: String, state: State<AppState>) {
    println!("[Commands] Received play_audio_command for ID: {}", button_id);

    // Lock the config to find the button's details
    let app_config = state.config.lock().unwrap();

    // Find the button config that matches the ID
    if let Some(button) = app_config.iter().find(|&b| b.id == button_id) {
        if let Some(audio_file) = &button.audio_file_path {
            // We have a file to play.
            // In a real app, we'd resolve the relative path here.
            println!("[Commands] Found button '{}'. Attempting to play '{}'", button.name, audio_file);

            // Call the audio engine to play the sound
            match state.audio_engine.play(audio_file, button.volume) {
                Ok(_) => println!("[Commands] Audio engine started successfully."),
                Err(e) => eprintln!("[Commands] Audio engine failed to play: {}", e),
            }
        } else {
            eprintln!("[Commands] Button '{}' has no audio file assigned.", button_id);
        }
    } else {
        eprintln!("[Commands] No button found with ID '{}'", button_id);
    }
}
