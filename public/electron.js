const electron = require('electron');

const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const systemPreferences = electron.systemPreferences;

const path = require('path');
const isDev = require('electron-is-dev');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1100,
    height: 880,
    resizable: true,
    webPreferences: {
      nodeIntegration: true,
    },
  });
  if (process.platform === 'darwin') {
    systemPreferences.subscribeNotification(
      'AppleInterfaceThemeChangedNotification', () => {
        updateAppTheme(systemPreferences.isDarkMode());
      }
    )
  }
  mainWindow.loadURL(isDev ? 'http://localhost:8080' : `file://${path.join(__dirname, '../build/index.html')}`);
  if (isDev) {
    mainWindow.webContents.openDevTools();
  }
  mainWindow.webContents.on('did-finish-load', () => {
    if (process.platform === 'darwin') {
      updateAppTheme(systemPreferences.isDarkMode());
    }
  })
  mainWindow.on('closed', () => mainWindow = null);
}

function updateAppTheme(status) {
  if (status) {
    mainWindow.webContents.executeJavaScript(`document.documentElement.setAttribute('data-theme', 'dark')`);
  } else {
    mainWindow.webContents.executeJavaScript(`document.documentElement.setAttribute('data-theme', 'light')`);
  }
}

app.on('ready', () => {
  createWindow();
});

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
