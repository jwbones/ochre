const path = require('path');

const { app, BrowserWindow, ipcMain, clipboard } = require('electron');
const isDev = require('electron-is-dev');
const fs = require('fs')

const core = require('../src/core/core.js')

let mainWindow;


const pasteImage = async () => {
    console.log('paste image ipc recieved');
    const img = clipboard.readImage();
    fs.writeFileSync('pasted_img.png', img.toPNG());
    const translated_blocks = await core.core('pasted_img.png');
    console.log(img.getSize);
    mainWindow.webContents.send('new-json', {
        blocks: translated_blocks,
        img_dimensions: img.getSize()
    })
    return img.toDataURL();
}

const createWindow = () => {
    ipcMain.handle('paste-image', pasteImage);
    const window = new BrowserWindow({
        width: 1200,
        height: 1200,
        webPreferences: {
            nodeIntegration: true,
            preload: __dirname + '/preload.js'
        },
    });
    window.loadURL(
        isDev
          ? 'http://localhost:3000'
          : `file://${path.join(__dirname, '../build/index.html')}`
      );
    mainWindow = window;

    if (isDev) {
        window.webContents.openDevTools({ mode: 'detatch'});
    }
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  });
  
app.on('activate', () => {
if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
}
});