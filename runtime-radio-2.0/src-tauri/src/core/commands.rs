use crate::{AppState, core::{config_manager::{self, PlaybackMode, ButtonConfig}, audio_engine}};
use tauri::{State, Manager};
use std::path::PathBuf;

// --- Helper Functions ---

fn get_button_config(id: &str, state: &State<AppState>) -> Option<ButtonConfig> {
    state.config.lock().unwrap().iter().find(|b| b.id == id).cloned()
}

// This function now uses the audio engine's transition logic
fn play_as_main_track(
    config_to_play: &ButtonConfig,
    state: &State<AppState>,
    window: &tauri::Window
) {
    let mut playback_state = state.playback_state.lock().unwrap();

    let from_id = playback_state.main_track_id.take();

    // Use the audio engine's transition logic
    state.audio_engine.transition(from_id.clone(), config_to_play);

    // Update state and emit events
    playback_state.main_track_id = Some(config_to_play.id.clone());
    if let Some(id) = from_id {
        window.emit("playback-stopped", id).unwrap();
    }
    window.emit("playback-started", config_to_play.id.clone()).unwrap();
}

// --- Tauri Commands ---

#[tauri::command]
pub fn load_profile_command(app_handle: tauri::AppHandle, state: State<AppState>) -> Result<Vec<ButtonConfig>, String> {
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
    let pressed_button_config = match get_button_config(&button_id, &state) {
        Some(config) => config,
        None => return,
    };

    let mut playback_state = state.playback_state.lock().unwrap();

    let current_main_track_config = playback_state.main_track_id
        .as_ref()
        .and_then(|id| get_button_config(id, &state));

    // --- Main Logic ---

    if pressed_button_config.playback_mode == PlaybackMode::Overlay {
        if let Some(file_path) = &pressed_button_config.audio_file_path {
            state.audio_engine.play_immediate(&button_id, file_path, pressed_button_config.volume);
            playback_state.overlay_track_ids.push(button_id.clone());
            window.emit("overlay-started", button_id).unwrap();
        }
        return;
    }

    if !pressed_button_config.is_loop {
        if let Some(main_config) = &current_main_track_config {
            if main_config.is_loop {
                playback_state.queued_track_ids.clear();
                window.emit("queue-cleared", ()).unwrap();
                drop(playback_state);
                play_as_main_track(&pressed_button_config, &state, &window);
                return;
            }
        }
    }

    if pressed_button_config.playback_mode == PlaybackMode::Queue {
        if let Some(main_config) = &current_main_track_config {
            if !main_config.is_loop {
                playback_state.queued_track_ids.push_back(button_id.clone());
                window.emit("track-queued", button_id).unwrap();
                return;
            } else {
                return;
            }
        }
    }

    playback_state.queued_track_ids.clear();
    window.emit("queue-cleared", ()).unwrap();
    drop(playback_state);
    play_as_main_track(&pressed_button_config, &state, &window);
}


#[tauri::command]
pub fn stop_all_command(state: State<AppState>, window: tauri::Window) {
    let mut playback_state = state.playback_state.lock().unwrap();
    state.audio_engine.stop_all();
    playback_state.main_track_id = None;
    playback_state.overlay_track_ids.clear();
    playback_state.queued_track_ids.clear();
    window.emit("all-stopped", ()).unwrap();
}
