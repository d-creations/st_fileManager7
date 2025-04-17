const { contextBridge, ipcRenderer } = require('electron/renderer')

contextBridge.exposeInMainWorld('electron', {
  getFilesInFolder: (filepath) => ipcRenderer.invoke('getFilesInFolder', filepath),
  openFolder:  () => ipcRenderer.invoke('openFolder'),
  openFile: () => ipcRenderer.invoke('openFile'),
  getFileText: (filepath) => ipcRenderer.invoke('getFileText',filepath),
  saveFile: (filepath,text) => ipcRenderer.invoke('saveFile',filepath,text),
  closeApplication: () => ipcRenderer.invoke('closeApplication'),

  moveFileOrFolder: (oldfilepath,newfilepath) => ipcRenderer.invoke('moveFolderOrFile',oldfilepath,newfilepath),
  copyFolderOrFile: (oldfilepath,newfilepath) => ipcRenderer.invoke('copyFolderOrFile',oldfilepath,newfilepath),

  createFolder: (filepath) => ipcRenderer.invoke('createFolder',filepath),
  deleteFileOrFolder:(filepath) =>ipcRenderer.invoke('deleteFileOrFolder',filepath),
  renameFileOrFolder: (oldfilepath,newfilepath) => ipcRenderer.invoke('renameFileOrFolder',oldfilepath,newfilepath),
  getArgs: () => ipcRenderer.invoke('getArgs'),
  undoFileOperation: () => ipcRenderer.invoke('undoOperation'),
  getNCToolPath: (ncCode) => ipcRenderer.invoke('getNCToolPath',ncCode)
})


