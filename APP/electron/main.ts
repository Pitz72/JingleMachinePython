import { app, BrowserWindow, screen } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Prevent garbage collection
let mainWindow: BrowserWindow | null = null;

const isDev = process.env.NODE_ENV === 'development';

function createWindow() {
    const { width, height } = screen.getPrimaryDisplay().workAreaSize;

    mainWindow = new BrowserWindow({
        width: Math.round(width * 0.9),
        height: Math.round(height * 0.9),
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false, // For now, to simplify migration. In Phase 2 we will secure this.
            webSecurity: false, // Allow local file access for audio
        },
        title: "Runtime Radio Live Machine Pro",
        backgroundColor: '#111827',
        show: false, // Don't show until ready
    });

    if (isDev) {
        mainWindow.loadURL('http://localhost:5173');
        mainWindow.webContents.openDevTools();
    } else {
        // Production: Load the local index.html
        // Path needs to go up two levels from electron/dist/main.js to reach dist/index.html
        const indexPath = path.join(__dirname, '../../dist/index.html');

        mainWindow.loadFile(indexPath).catch((e) => {
            console.error('Failed to load index.html:', e);
        });

        // TEMPORARY: Open DevTools in production to debug crash
        mainWindow.webContents.openDevTools();
    }

    mainWindow.once('ready-to-show', () => {
        mainWindow?.show();
    });

    mainWindow.on('closed', () => {
        mainWindow = null;
    });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (mainWindow === null) {
        createWindow();
    }
});
