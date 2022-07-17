const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
    pasteImage: () => ipcRenderer.invoke('paste-image'),
    newJson: (callback) => ipcRenderer.on('new-json', callback),
    updateLangs: (from, to) => ipcRenderer.send('update-langs', from, to)
})