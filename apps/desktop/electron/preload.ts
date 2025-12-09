import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {
    getData: () => ipcRenderer.invoke('get-data'),
    saveData: (data: any) => ipcRenderer.invoke('save-data', data),
    getDataPath: () => ipcRenderer.invoke('get-data-path'),
    selectDirectory: () => ipcRenderer.invoke('select-directory'),
    getSyncPath: () => ipcRenderer.invoke('get-sync-path'),
    setSyncPath: (path: string) => ipcRenderer.invoke('set-sync-path', path),
    syncData: () => ipcRenderer.invoke('sync-data'),
})
