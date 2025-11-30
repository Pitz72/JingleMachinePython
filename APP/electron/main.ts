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
        width: 1280,
        height: 720,
        useContentSize: true, // Ensure the content area matches the aspect ratio
        icon: path.join(__dirname, '../../dist/favicon.ico'), // Use .ico for better Windows compatibility
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false, // For now, to simplify migration. In Phase 2 we will secure this.
            webSecurity: false, // Allow local file access for audio
        },
        title: "Runtime Radio Live Machine Pro",
        backgroundColor: '#09090b', // Match Zinc-950
        show: false, // Don't show until ready
        autoHideMenuBar: true, // Hide menu bar for native feel
    });

    // Enforce 16:9 Aspect Ratio
    mainWindow.setAspectRatio(16 / 9);
    mainWindow.setMenuBarVisibility(false); // Explicitly hide menu bar

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

        // DevTools removed for production
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
