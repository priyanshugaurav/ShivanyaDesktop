import { app, BrowserWindow } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let backendProcess;

async function createWindow() {
  const win = new BrowserWindow({
    show: false, // Hide until ready to prevent flicker before maximize
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
    },
  });

  win.loadURL(process.env.ELECTRON_START_URL || `file://${path.join(__dirname, 'dist/index.html')}`);

  // Auto-maximize when ready
  win.once('ready-to-show', () => {
    win.maximize();
    win.show();

    // Set zoom factor to 90% (0.9)
    win.webContents.setZoomFactor(0.7);
  });
}


app.whenReady().then(() => {
  // Start backend server
  backendProcess = spawn('node', [path.join(__dirname, 'server.js')]);

  backendProcess.stdout.on('data', (data) => {
    console.log(`Backend: ${data}`);
  });

  backendProcess.stderr.on('data', (data) => {
    console.error(`Backend error: ${data}`);
  });

  backendProcess.on('close', (code) => {
    console.log(`Backend process exited with code ${code}`);
  });

  createWindow();
});

app.on('window-all-closed', () => {
  if (backendProcess) backendProcess.kill();
  if (process.platform !== 'darwin') app.quit();
});
