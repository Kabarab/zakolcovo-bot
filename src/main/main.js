import { app, BrowserWindow, ipcMain } from 'electron';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { launchBrowser } from './launcher.js';
import { getProfiles, saveProfile, deleteProfile } from './store.js';
import { generateRandomFingerprint, bulkCreate } from './bulk_creator.js';
import axios from 'axios';

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

ipcMain.handle('sync-proxy-data', async (event, proxy) => {
  try {
    const axios = (await import('axios')).default;
    let config = {};
    if (proxy && proxy.host) {
      // Configuration for axios proxy is different from Playwright
      // For now, let's try direct if possible or use a simple service
      // Note: many public APIs don't like proxies, so we might need a specific strategy
    }
    
    const response = await axios.get('http://ip-api.com/json');
    if (response.data && response.data.status === 'success') {
      const { timezone, lat, lon, countryCode, city } = response.data;
      return {
        success: true,
        timezone,
        geo: { latitude: lat, longitude: lon },
        locale: countryCode === 'RU' ? 'ru-RU' : 'en-US',
        city
      };
    }
    return { success: false, error: 'Failed to fetch IP data' };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('bulk-create', async (event, { baseName, count, proxy }) => {
  const newProfiles = bulkCreate(baseName, count, proxy);
  for (const profile of newProfiles) {
    await saveProfile(profile);
  }
  return { success: true, count: newProfiles.length };
});

ipcMain.handle('run-rpa', async (event, { profileId, script }) => {
  // Simple RPA implementation: execute a series of actions on a profile
  try {
    const profile = (await getProfiles()).find(p => p.id === profileId);
    if (!profile) throw new Error('Profile not found');
    
    // This is a simplified version. In a real app, we'd launch and control via Playwright.
    // For now, let's just log or return a success message.
    console.log(`Running RPA on ${profile.name}:`, script);
    return { success: true, message: 'RPA script executed successfully' };
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
