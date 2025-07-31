use crate::{AppState, core::{config_manager::{self, PlaybackMode}, audio_engine}};
use tauri::{State, Manager}; // Import Manager to emit events
use std::path::PathBuf;

// --- Helper Functions ---
fn play_as_main_track(
    button_id: &str,
    state: &State<AppState>,
    window: &tauri::Window
) {
    // Stop any currently playing main track
    let mut playback_state = state.playback_state.lock().unwrap();
    if let Some(current_main_id) = playback_state.main_track_id.take() {
        // Here we would tell the audio engine to stop the specific sound
        // For now, we just log it.
        println!("[Core] Stopping previous main track: {}", current_main_id);
        window.emit("playback-stopped", current_main_id).unwrap();
    }

    // Play the new track
    let config = state.config.lock().unwrap();
    if let Some(button_config) = config.iter().find(|b| b.id == button_id) {
        if let Some(file_path) = &button_config.audio_file_path {
            state.audio_engine.play(file_path, button_config.volume).ok();
            playback_state.main_track_id = Some(button_id.to_string());
            println!("[Core] Playing new main track: {}", button_id);
            window.emit("playback-started", button_id.to_string()).unwrap();
        }
    }
}

// --- Tauri Commands ---

#[tauri::command]
pub fn load_profile_command(app_handle: tauri::AppHandle, state: State<AppState>) -> Result<Vec<config_manager::ButtonConfig>, String> {
    let config_dir = app_handle.path_resolver().app_config_dir().unwrap_or_else(|| PathBuf::from("./"));
    match config_manager::load_profile(&config_dir, "default_profile") {
        Ok(loaded_config) => {
            *state.config.lock().unwrap() = loaded_config.clone();
            Ok(loaded_config)
        },
        Err(e) => Err(e),
    }
}

#[tauri::command]
pub fn play_audio_command(button_id: String, state: State<AppState>, window: tauri::Window) {
    println!("[Commands] Received play_audio_command for ID: {}", &button_id);

    let config_lock = state.config.lock().unwrap();
    let button_config = match config_lock.iter().find(|b| b.id == button_id) {
        Some(config) => config.clone(), // Clone to release the lock
        None => {
            eprintln!("[Commands] No button found with ID '{}'", button_id);
            return;
        }
    };

    // Drop the lock so other operations can proceed
    drop(config_lock);

    let mut playback_state = state.playback_state.lock().unwrap();

    match button_config.playback_mode {
        PlaybackMode::Restart => {
            println!("[Core] Handling Restart mode for {}", &button_id);
            // Clear the queue
            if !playback_state.queued_track_ids.is_empty() {
                playback_state.queued_track_ids.clear();
                window.emit("queue-cleared", ()).unwrap();
            }
            // Drop lock before calling helper
            drop(playback_state);
            play_as_main_track(&button_id, &state, &window);
        },
        PlaybackMode::Continue => {
            // Simplified logic for now: treat as Restart
            println!("[Core] Handling Continue mode for {} (as Restart)", &button_id);
            drop(playback_state);
            play_as_main_track(&button_id, &state, &window);
        },
        PlaybackMode::Overlay => {
            println!("[Core] Handling Overlay mode for {}", &button_id);
            if let Some(file_path) = &button_config.audio_file_path {
                state.audio_engine.play(file_path, button_config.volume).ok();
                playback_state.overlay_track_ids.push(button_id.clone());
                window.emit("overlay-started", button_id).unwrap();
            }
        },
        PlaybackMode::Queue => {
            println!("[Core] Handling Queue mode for {}", &button_id);
            if playback_state.main_track_id.is_some() {
                // If something is playing, add to queue
                playback_state.queued_track_ids.push_back(button_id.clone());
                println!("[Core] Added {} to queue.", &button_id);
                window.emit("track-queued", button_id).unwrap();
            } else {
                // If nothing is playing, play it as the main track
                drop(playback_state);
                play_as_main_track(&button_id, &state, &window);
            }
        }
    }
}

#[tauri::command]
pub fn stop_all_command(state: State<AppState>, window: tauri::Window) {
    println!("[Commands] Received stop_all_command");

    let mut playback_state = state.playback_state.lock().unwrap();
    state.audio_engine.stop_all();

    playback_state.main_track_id = None;
    playback_state.overlay_track_ids.clear();
    playback_state.queued_track_ids.clear();

    println!("[Core] All playback stopped and state cleared.");
    window.emit("all-stopped", ()).unwrap();
}
