const { app, BrowserWindow, Menu, protocol, ipcMain, systemPreferences } = require('electron');

const path = require('path');
const log = require('electron-log');
const isDev = require('electron-is-dev');

const { autoUpdater } = require('electron-updater');

//-------------------------------------------------------------------
// Logging
//
// THIS SECTION IS NOT REQUIRED
//
// This logging setup is not required for auto-updates to work,
// but it sure makes debugging easier :)
//-------------------------------------------------------------------
autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';
log.info('App starting...');

let mainWindow;

function sendStatusToWindow(text) {
  log.info(text);
  mainWindow.webContents.send('message', text);
}

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
  mainWindow.webContents.openDevTools();
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
  autoUpdater.checkForUpdatesAndNotify();
});

autoUpdater.on('checking-for-update', () => {
  sendStatusToWindow('Checking for update...');
})
autoUpdater.on('update-available', (info) => {
  sendStatusToWindow('Update available.');
})
autoUpdater.on('update-not-available', (info) => {
  sendStatusToWindow('Update not available.');
})
autoUpdater.on('error', (err) => {
  sendStatusToWindow('Error in auto-updater. ' + err);
})
autoUpdater.on('download-progress', (progressObj) => {
  let log_message = "Download speed: " + progressObj.bytesPerSecond;
  log_message = log_message + ' - Downloaded ' + progressObj.percent + '%';
  log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')';
  sendStatusToWindow(log_message);
})
autoUpdater.on('update-downloaded', (info) => {
  sendStatusToWindow('Update downloaded');
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
    autoUpdater.checkForUpdatesAndNotify();
  }
});
