const path = require('path');

const { app, BrowserWindow, ipcMain, clipboard } = require('electron');
const isDev = require('electron-is-dev');
const fs = require('fs')

const core = require('../src/core/core.js')

require('dotenv').config()

let mainWindow;

let from_lang = 'JA';
let to_lang = 'EN';

const updateLangs = (from, to) => {
    console.log(from);
    from_lang = from;
    to_lang = to;
    console.log(`updated languages: source: ${from_lang}, target ${to_lang}`);
}

const pasteImage = async () => {
    console.log('paste image ipc recieved');
    const img = clipboard.readImage();
    fs.writeFileSync('pasted_img.png', img.toPNG());
    mainWindow.webContents.send('new-json', {
        blocks: [],
        img_dimensions: img.getSize()
    })
    core.core('pasted_img.png', from_lang, to_lang).then((translated_blocks) => {
        mainWindow.webContents.send('new-json', {
            blocks: translated_blocks,
            img_dimensions: img.getSize()
        })
    });
    return img.toDataURL();
}

const createWindow = () => {
    ipcMain.handle('paste-image', pasteImage);
    ipcMain.on('update-langs', (event, from, to) => {
        updateLangs(from,to);
    });
    const window = new BrowserWindow({
        width: 1200,
        height: 1200,
        webPreferences: {
            nodeIntegration: true,
            preload: __dirname + '/preload.js',
            contextIsolation: true,
        },
    });
    window.loadURL(
        isDev
          ? 'http://localhost:3000'
          : `file://${path.join(__dirname, '../build/index.html')}`
      );

    window.setMenu(null);
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