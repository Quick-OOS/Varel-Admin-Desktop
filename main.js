const { app, BrowserWindow, Menu, shell, ipcMain } = require('electron');
const path = require('path');

let loginWindow = null;
let mainWindow  = null;

function createLoginWindow() {
  loginWindow = new BrowserWindow({
    width:  420,
    height: 520,
    resizable:       false,
    maximizable:     false,
    fullscreenable:  false,
    title: 'Varel Admin',
    icon:  path.join(__dirname, 'assets', 'icon.png'),
    webPreferences: {
      nodeIntegration:  false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
    backgroundColor: '#0f0c29',
    frame: false,
    show: false,
  });

  Menu.setApplicationMenu(null);
  loginWindow.loadFile(path.join(__dirname, 'renderer', 'login.html'));
  loginWindow.once('ready-to-show', () => loginWindow.show());
  loginWindow.on('closed', () => { loginWindow = null; });
}

function createMainWindow() {
  mainWindow = new BrowserWindow({
    width:    1400,
    height:   900,
    minWidth: 1100,
    minHeight: 700,
    title: 'Varel Admin',
    icon:  path.join(__dirname, 'assets', 'icon.png'),
    webPreferences: {
      nodeIntegration:  false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload-admin.js'),
    },
    backgroundColor: '#0f0c29',
    frame: false,
    show: false,
  });

  Menu.setApplicationMenu(null);
  mainWindow.loadFile(path.join(__dirname, 'renderer', 'admin.html'));
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    // Close login window after main is visible
    if (loginWindow) { loginWindow.close(); loginWindow = null; }
  });
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url); return { action: 'deny' };
  });
  mainWindow.on('closed', () => { mainWindow = null; app.quit(); });
}

// Login sends this when password is correct
ipcMain.on('login-success', () => {
  createMainWindow();
});


// Window controls
ipcMain.on('win-minimize', (event) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  if (win) win.minimize();
});

ipcMain.on('win-maximize', (event) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  if (win) {
    if (win.isMaximized()) win.unmaximize();
    else win.maximize();
  }
});

ipcMain.on('win-close', (event) => {
  const win = BrowserWindow.fromWebContents(event.sender);
  if (win) win.close();
});

app.whenReady().then(() => {
  createLoginWindow();
  app.on('activate', () => { if (!loginWindow && !mainWindow) createLoginWindow(); });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
