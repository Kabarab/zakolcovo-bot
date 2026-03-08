const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  getProfiles: () => ipcRenderer.invoke('get-profiles'),
  saveProfile: (profile) => ipcRenderer.invoke('save-profile', profile),
  deleteProfile: (id) => ipcRenderer.invoke('delete-profile', id),
  launchProfile: (profile) => ipcRenderer.invoke('launch-profile', profile),
  checkProxy: (proxy) => ipcRenderer.invoke('check-proxy', proxy),
  syncProxyData: (proxy) => ipcRenderer.invoke('sync-proxy-data', proxy),
  bulkCreate: (data) => ipcRenderer.invoke('bulk-create', data),
  getRandomFingerprint: (overrides) => ipcRenderer.invoke('get-random-fingerprint', overrides),
});
