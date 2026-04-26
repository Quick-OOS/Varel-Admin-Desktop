const { contextBridge, ipcRenderer } = require('electron');

// Set auth before page scripts run
localStorage.setItem('varel_admin', 'true');

contextBridge.exposeInMainWorld('electronAPI', {
  minimize:   () => ipcRenderer.send('win-minimize'),
  maximize:   () => ipcRenderer.send('win-maximize'),
  close:      () => ipcRenderer.send('win-close'),
  isElectron: true,
  version:    '1.0.0',
});
