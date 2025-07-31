import eel
import sys

# Initialize Eel, specifying the 'web' directory for the frontend files
eel.init('web')

# --- Backend Functions Exposed to JavaScript ---

@eel.expose
def play_button(button_id):
    """
    This function will be called from the JavaScript frontend.
    It will contain the core logic for playing a button.
    """
    print(f"[Python] Received call to play button: {button_id}")
    # TODO: Implement the actual audio playback logic using pygame

    # Example of calling a JavaScript function from Python
    eel.update_status_for_button(button_id, "Playing")

# --- Main Application Logic ---

def start_app():
    """Starts the Eel application."""
    print("Starting Runtime Radio 2.0...")
    try:
        # Start the app. Eel will open a window pointing to 'index.html'.
        # The size and position can be configured here.
        eel.start('index.html', size=(1200, 800), block=True)
    except (SystemExit, MemoryError, KeyboardInterrupt):
        # Handle graceful shutdown
        print("Application closing.")
        sys.exit()

if __name__ == "__main__":
    start_app()
