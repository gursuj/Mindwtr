import { app, BrowserWindow, ipcMain, Menu, dialog } from 'electron'
import path from 'path'
import fs from 'fs/promises'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// The built directory structure
//
// ├─┬─ dist
// │ └── index.html
// ├── dist-electron
// │ ├── main.js
// │ └── preload.js
//
process.env.DIST = path.join(__dirname, '../dist')
process.env.VITE_PUBLIC = app.isPackaged ? process.env.DIST : path.join(__dirname, '../public')

let win: BrowserWindow | null

const CONFIG_FILE = path.join(app.getPath('userData'), 'config.json')

interface AppConfig {
    dataFilePath?: string;
    syncPath?: string;
}

async function loadConfig(): Promise<AppConfig> {
    try {
        const data = await fs.readFile(CONFIG_FILE, 'utf-8')
        return JSON.parse(data)
    } catch {
        return {}
    }
}

async function saveConfig(config: AppConfig) {
    await fs.writeFile(CONFIG_FILE, JSON.stringify(config, null, 2))
}

async function getDataPath(): Promise<string> {
    const config = await loadConfig()
    return config.dataFilePath || path.join(app.getPath('userData'), 'data.json')
}

// Helper to ensure data file exists
async function ensureDataFile() {
    const dataFile = await getDataPath()
    try {
        await fs.access(dataFile)
    } catch {
        const initialData = { tasks: [], projects: [], settings: {} }
        await fs.writeFile(dataFile, JSON.stringify(initialData, null, 2))
    }
}

function createWindow() {
    win = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, 'preload.mjs'),
        },
    })
    // Only hide menu bar in production
    if (!process.env.VITE_DEV_SERVER_URL) {
        win.setMenuBarVisibility(false)
    }

    // Test active push message to Renderer-process.
    win.webContents.on('did-finish-load', () => {
        win?.webContents.send('main-process-message', (new Date).toLocaleString())
    })

    if (process.env.VITE_DEV_SERVER_URL) {
        win.loadURL(process.env.VITE_DEV_SERVER_URL)
        // Open DevTools in dev mode for debugging
        win.webContents.openDevTools()
    } else {
        // win.loadFile('dist/index.html')
        win.loadFile(path.join(process.env.DIST || path.join(__dirname, '../dist'), 'index.html'))
    }
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
})

app.whenReady().then(async () => {
    await ensureDataFile()

    // Remove the application menu completely
    Menu.setApplicationMenu(null)

    ipcMain.handle('get-data', async () => {
        try {
            const dataFile = await getDataPath()
            const data = await fs.readFile(dataFile, 'utf-8')
            const parsed = JSON.parse(data)

            // Basic schema validation
            if (!Array.isArray(parsed.tasks) || !Array.isArray(parsed.projects)) {
                console.error('Invalid data structure in file')
                return { tasks: [], projects: [], settings: {} }
            }

            return parsed
        } catch (error) {
            console.error('Failed to read data:', error)
            return { tasks: [], projects: [], settings: {} }
        }
    })

    ipcMain.handle('save-data', async (_, data) => {
        try {
            const dataFile = await getDataPath()
            await fs.writeFile(dataFile, JSON.stringify(data, null, 2))
            return { success: true }
        } catch (error) {
            console.error('Failed to save data:', error)
            throw error
        }
    })

    ipcMain.handle('get-data-path', async () => {
        return await getDataPath()
    })

    ipcMain.handle('get-sync-path', async () => {
        const config = await loadConfig()
        // Default to userData/sync folder (e.g., ~/.config/gtd-todo-app/sync)
        const defaultSyncPath = path.join(app.getPath('userData'), 'sync')
        return config.syncPath || defaultSyncPath
    })

    ipcMain.handle('set-sync-path', async (_, syncPath: string) => {
        try {
            const config = await loadConfig()
            config.syncPath = syncPath
            await saveConfig(config)
            return { success: true, path: syncPath }
        } catch (error) {
            console.error('Failed to set sync path:', error)
            throw error
        }
    })

    ipcMain.handle('select-directory', async () => {
        console.log('[Main] select-directory called')

        try {
            // Use native Electron dialog
            // On Linux/Wayland, ensure xdg-desktop-portal is used
            const result = await dialog.showOpenDialog({
                properties: ['openDirectory', 'createDirectory'],
                title: 'Select Sync Folder'
            })
            console.log('[Main] Dialog result:', result)

            if (result.canceled) return null
            return result.filePaths[0]
        } catch (error) {
            console.error('[Main] Dialog error:', error)
            return null
        }
    })

    ipcMain.handle('set-data-path', async (_, newPath) => {
        try {
            // New data file path
            const newDataFile = path.join(newPath, 'focus-gtd-data.json')

            // Get current data to migrate
            const currentDataFile = await getDataPath()
            let currentData = { tasks: [], projects: [], settings: {} }
            try {
                const data = await fs.readFile(currentDataFile, 'utf-8')
                currentData = JSON.parse(data)
            } catch (e) {
                console.log('No existing data to migrate')
            }

            // Write data to new location
            await fs.writeFile(newDataFile, JSON.stringify(currentData, null, 2))

            // Update config
            await saveConfig({ dataFilePath: newDataFile })

            return { success: true, path: newDataFile }
        } catch (error) {
            console.error('Failed to set data path:', error)
            throw error
        }
    })

    createWindow()
})
