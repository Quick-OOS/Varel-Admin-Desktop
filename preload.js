const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  loginSuccess: () => ipcRenderer.send('login-success'),
  minimize:     () => ipcRenderer.send('win-minimize'),
  close:        () => ipcRenderer.send('win-close'),
  isElectron:   true,
  version:      '1.0.0',
});
