// Configuration Manager Module
// Responsible for loading, saving, and migrating configurations.
// It will use `serde` for JSON serialization/deserialization.

use serde::{Serialize, Deserialize};
use std::fs;
use std::path::PathBuf;

// --- Data Structures ---

#[derive(Serialize, Deserialize, Clone, Debug)]
pub enum PlaybackMode {
    Restart,
    Continue,
    Overlay,
    Queue,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct ButtonConfig {
    pub id: String,
    pub name: String,
    pub color: String,
    pub volume: f32, // Volume from 0.0 to 1.0
    pub audio_file_path: Option<String>, // Relative path to the media folder
    pub playback_mode: PlaybackMode,
    pub is_loop: bool,
    pub crossfade_ms: u32,
    pub fade_out_ms: u32,
}

// --- Public Functions ---

/// Loads a profile from a JSON file.
/// `app_dir` is the path to the application's config directory.
pub fn load_profile(app_dir: &PathBuf, profile_name: &str) -> Result<Vec<ButtonConfig>, String> {
    let profile_path = app_dir.join(format!("{}.json", profile_name));
    println!("ConfigManager: Attempting to load profile from {:?}", profile_path);

    match fs::read_to_string(&profile_path) {
        Ok(json_content) => {
            match serde_json::from_str(&json_content) {
                Ok(config) => {
                    println!("ConfigManager: Profile '{}' loaded successfully.", profile_name);
                    Ok(config)
                },
                Err(e) => {
                    let err_msg = format!("Failed to parse profile '{}': {}", profile_name, e);
                    eprintln!("{}", err_msg);
                    Err(err_msg)
                }
            }
        },
        Err(e) => {
            let err_msg = format!("Failed to read profile file '{}': {}", profile_name, e);
            eprintln!("{}", err_msg);
            Err(err_msg)
        }
    }
}

/// Saves a profile to a JSON file.
pub fn save_profile(app_dir: &PathBuf, profile_name: &str, config: &Vec<ButtonConfig>) -> Result<(), String> {
    let profile_path = app_dir.join(format!("{}.json", profile_name));
    println!("ConfigManager: Attempting to save profile to {:?}", profile_path);

    match serde_json::to_string_pretty(config) {
        Ok(json_content) => {
            match fs::write(&profile_path, json_content) {
                Ok(_) => {
                    println!("ConfigManager: Profile '{}' saved successfully.", profile_name);
                    Ok(())
                },
                Err(e) => {
                    let err_msg = format!("Failed to write to profile file '{}': {}", profile_name, e);
                    eprintln!("{}", err_msg);
                    Err(err_msg)
                }
            }
        },
        Err(e) => {
            let err_msg = format!("Failed to serialize profile '{}': {}", profile_name, e);
            eprintln!("{}", err_msg);
            Err(err_msg)
        }
    }
}
