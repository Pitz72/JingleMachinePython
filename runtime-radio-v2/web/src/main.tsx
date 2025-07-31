import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Expose a JavaScript function to be called from Python
// This is how the backend will send updates to the frontend
window.eel.expose(updatePlaybackStatus, 'update_playback_status');
function updatePlaybackStatus(newStatus) {
  console.log('[JavaScript] Received status update from Python:', newStatus);
  // In a real app, this would call a function to update the Zustand store
  // e.g., useStore.getState().setPlaybackStatus(newStatus);
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
