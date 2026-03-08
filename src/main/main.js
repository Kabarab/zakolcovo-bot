import { app, BrowserWindow, ipcMain } from 'electron';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { launchBrowser } from './launcher.js';
import { getProfiles, saveProfile, deleteProfile } from './store.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      preload: join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
    titleBarStyle: 'hiddenInset',
    backgroundColor: '#0f172a',
  });

  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:3000');
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/dist/index.html'));
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

// IPC Handlers
ipcMain.handle('get-profiles', async () => {
  return await getProfiles();
});

ipcMain.handle('save-profile', async (event, profile) => {
  return await saveProfile(profile);
});

ipcMain.handle('delete-profile', async (event, id) => {
  return await deleteProfile(id);
});

ipcMain.handle('check-proxy', async (event, proxy) => {
  try {
    const { chromium } = await import('playwright');
    const browser = await chromium.launch({
      proxy: {
        server: `${proxy.protocol || 'http'}://${proxy.host}:${proxy.port}`,
        username: proxy.username,
        password: proxy.password,
      }
    });
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto('https://api.ipify.org', { timeout: 10000 });
    const ip = await page.textContent('body');
    await browser.close();
    return { success: true, ip };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('launch-profile', async (event, profile) => {
  try {
    await launchBrowser(profile);
    return { success: true };
  } catch (error) {
    console.error('Launch Error:', error);
    return { success: false, error: error.message };
  }
});
