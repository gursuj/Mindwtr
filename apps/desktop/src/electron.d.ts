export interface ElectronAPI {
    getData: () => Promise<any>
    saveData: (data: any) => Promise<{ success: boolean }>;
    getDataPath: () => Promise<string>;
    selectDirectory: () => Promise<string | null>;
    getSyncPath: () => Promise<string>;
    setSyncPath: (path: string) => Promise<{ success: boolean; path: string }>;
    syncData: () => Promise<{ success: boolean; data: any }>;
}

declare global {
    interface Window {
        electronAPI: ElectronAPI
    }
}
