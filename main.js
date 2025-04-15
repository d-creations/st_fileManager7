const { app, BrowserWindow, ipcMain,screen } = require('electron/main')
const path = require('node:path')
const fs = require('node:fs')
const https = require('node:https')
const electron = require('electron');
const { resourceLimits } = require('node:worker_threads');
const { updateElectronApp, UpdateSourceType } = require('update-electron-app');
const { get } = require('node:http');
const args = process.argv
updateElectronApp({
  updateSource: {
  type: UpdateSourceType.ElectronPublicUpdateService,
  repo: 'd-creations/st_fileManager7',
  host: "https://update.electronjs.org"
},
updateInterval: '60 minutes'
})
let executionPath = process.cwd()
const cacheFolder = path.join(executionPath, 'cache');  // Create cache folder in execution path
if (!fs.existsSync(cacheFolder)) {
    fs.mkdirSync(cacheFolder);
}
console.log("Cache folder created at: " + cacheFolder);

// Global undo stack
let undoStack = [];

const MainIPC_ErrorCode = ["FileReadError","FolderReadError",
"DirectoryReadError","FileWrite","CreateFolder","CreateFile","RemoveFile","RemoveFolder"]
let MainIPC_Error = /** @class */ (function () {
  MainIPC_Error.prototype  = Object.create(Error.prototype, {
    constructor: {
      value: Error,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  function MainIPC_Error(MainIPC_ErrorCode,message) {
          this.errorCode = MainIPC_ErrorCode
          this.message = message
  }

  MainIPC_Error.prototype.getErrorCode = function(){
    return this.errorCode;
  }

  MainIPC_Error.prototype.getMessage = function(){
    return this.message;
  }

  return MainIPC_Error;
}());
/*
Sxcril installaton
*/


// this should be placed at top of main.js to handle setup events quickly
if (handleSquirrelEvent()) {
  // squirrel event handled and app will exit in 1000ms, so don't do anything else
  return;
}

function handleSquirrelEvent() {
  if (process.argv.length === 1) {
    return false;
  }

  const ChildProcess = require('child_process');
  const path = require('path');

  const appFolder = path.resolve(process.execPath, '..');
  const rootAtomFolder = path.resolve(appFolder, '..');
  const updateDotExe = path.resolve(path.join(rootAtomFolder, 'Update.exe'));
  const exeName = path.basename(process.execPath);

  const spawn = function(command, args) {
    let spawnedProcess, error;
    try {
      spawnedProcess = ChildProcess.spawn(command, args, {detached: true});
    } catch (error) {}

    return spawnedProcess;
  };

  const spawnUpdate = function(args) {
    return spawn(updateDotExe, args);
  };

  const squirrelEvent = process.argv[1];
  switch (squirrelEvent) {
    case '--squirrel-install':
    case '--squirrel-updated':
      // Install desktop and start menu shortcuts
      spawnUpdate(['--createShortcut', exeName]);

      setTimeout(app.quit, 1000);
      return true;

    case '--squirrel-uninstall':

      // Remove desktop and start menu shortcuts
      spawnUpdate(['--removeShortcut', exeName]);

      setTimeout(app.quit, 1000);
      return true;

    case '--squirrel-obsolete':

      app.quit();
      return true;
  }
};


/*
MAIN APP
*/

function createWindow () {
  const primaryDisplay = screen.getPrimaryDisplay()
  const { width, height } = primaryDisplay.workAreaSize

  const win = new BrowserWindow({
    width: width,
    height: height,
    icon: path.join(executionPath, './resources/icon.ico'),
    
    titleBarStyle: 'customButtonsOnHover',
    webPreferences: {
      preload: path.join(executionPath, 'src/preload.js'),
    }
  })
  const ses = win.webContents.session;

  ses.clearCache(() => {
    alert("Cache cleared!");
  });
  win.removeMenu()
  

  win.openDevTools();
    win.loadFile('public/html/index.html')
  ipcMain.handle('openFile', handleFileOpen)
  ipcMain.handle('openFolder', handleFolderOpen)
  ipcMain.handle('getFilesInFolder', handleGetFilesInDir)
  ipcMain.handle('getFileText', handleGetFileText)
  ipcMain.handle('saveFile', handleSaveFile)
  ipcMain.handle('createFolder', handleCreateFolder)
  ipcMain.handle('deleteFileOrFolder', handleDeleteFileOrFolder)
  ipcMain.handle('renameFileOrFolder', handleRenameFileOrFolder)
  ipcMain.handle('closeApplication', handleCloseApplication)
  ipcMain.handle('moveFolderOrFile', handleMoveFolderOrFile)
  ipcMain.handle('copyFolderOrFile', handleCopyFolderOrFile)
  ipcMain.handle('getArgs', getArgs)
  ipcMain.handle('undoOperation',undoOperation);
  ipcMain.handle('getNCToolPath',handleGetNCToolPath);
}

function getArgs(){
  return args
}
function handleCloseApplication(event){
  BrowserWindow.getAllWindows().forEach(window => {
    window.close()
  })
}

function handleSaveFile (event,url,text) {
  let options = {flag: 'w+'}
  console.log("save")
  console.log(url)
  console.log(text)
  let ret = new Promise((resolve, reject) => {
    fs.writeFile(url, text,options, err => {
    if (err) {
      console.error(err);
      reject(new MainIPC_Error(0,"save File failed in  process"));  
    }
    resolve()
    });
  })
  return ret
}

function handleGetFileText (event,url) {
  console.log("getText")
  console.log(url)
  let ret = new Promise((resolve, reject) => {
//    fs.readFile(url, 'utf8', function(err, data){
    fs.readFile(url, 'binary', function(err, data){
        if(err) {
            reject(new MainIPC_Error(0,"get File Text failed in Main process"));
        }
        resolve(data);
    });
});
  return ret
}

function handleFileOpen () {
  console.log("open file")  
  let options = {properties:["openFile"]}
  console.log("open Folder")
  let ret = new Promise((resolve, reject) => {
    electron.dialog.showOpenDialog(options).then(function(pathPromis){
    if (!pathPromis.canceled) {
        console.log("resolve")      
        resolve(pathPromis.filePaths[0]);
      }
      else{
        reject(new MainIPC_Error(1,"open Folder in Main process"));
      };
    ;
    })
  })
  return ret
  }

function handleFolderOpen () {
  let options = {properties:["openDirectory"]}
  console.log("open Folder")
  let ret = new Promise((resolve, reject) => {
    electron.dialog.showOpenDialog(options).then(function(pathPromis){
    if (!pathPromis.canceled) {
        console.log("resolve")      
        resolve(pathPromis.filePaths[0]);
      }
      else{
        reject(new MainIPC_Error(1,"open Folder in Main process"));
      };
    ;
    })
  })
  return ret
}

function handleGetFilesInDir (event,args) {
  console.log(args)
  let ret = new Promise((resolve, reject) => {
    fs.readdir(args,{withFileTypes: true},function(err,files){
      if(err) {
        reject(new MainIPC_Error(0,"error read files in directory"));
      }
      else{
        let result =  files.filter(function(entry){
            return (entry.isFile() || entry.isDirectory()) && !entry.isSymbolicLink() ;
          }).map(entry => ({
          name: entry.name,
          type: entry.isDirectory() ? "directory" : "file",
         }))  
        resolve(result)
      
      }
    })
    })
    return ret
  }

// Modified handleCreateFolder: push undo record to delete the created folder
function handleCreateFolder(event, url) {
    console.log("create Folder", url);
    return new Promise((resolve, reject) => {
        fs.mkdir(url, function(err, data) {
            if(err) {
                reject(new MainIPC_Error(0, "create Folder failed in Main process"));
            } else {
                undoStack.push({ op: 'createFolder', path: url });
                console.log("undoStack", undoStack);

                resolve(data);
            }
        });
    });
}

// Modified handleDeleteFileOrFolder: backup before deletion and record undo info
function handleDeleteFileOrFolder(event, url) {
    console.log("delete File or Folder", url);
    return new Promise((resolve, reject) => {
        // Create a backup path inside cacheFolder using timestamp and basename
        const backupPath = path.join(cacheFolder, `delete-${Date.now()}-${path.basename(url)}`);
        fs.cp(url, backupPath, { recursive: true }, function(copyErr) {
            if (copyErr) {
                reject(new MainIPC_Error(0, "backup before delete failed"));
            } else {
                // Push undo record to restore from backup
                undoStack.push({ op: 'delete', original: url, backup: backupPath });
                fs.rm(url, { recursive: true, force: true }, function(err, data) {
                    if (err) {
                        reject(new MainIPC_Error(0, "delete File or Folder Failed"));
                    } else {
                        resolve();
                    }
                });
            }
        });
    });
}

// Modified handleRenameFileOrFolder: push undo record to reverse the rename
function handleRenameFileOrFolder(event, oldUrl, newUrl) {
    console.log("rename File or Folder");
    return new Promise((resolve, reject) => {
        notExists(newUrl).then((state) => {
            if(state) {
                // Push undo record to move newUrl back to oldUrl
                undoStack.push({ op: 'rename', old: oldUrl, new: newUrl });
                fs.rename(oldUrl, newUrl, function(err, data) {
                    if(err) {
                        reject(new MainIPC_Error(0, "rename failed in Main process old\n" + oldUrl + " new\n" + newUrl));
                    }
                    resolve(true);
                });
            } else {
                resolve(false);
            }
        });
    });
}

// Modified handleMoveFolderOrFile: push undo record, undo by moving back
function handleMoveFolderOrFile(event, oldUrl, newUrl) {
    console.log("move Folder or File");
    return new Promise((resolve, reject) => {
        // Push undo record to move newUrl back to oldUrl
        undoStack.push({ op: 'move', old: oldUrl, new: newUrl });
        console.log("destination", newUrl)
        console.log("source", oldUrl)
        fs.cp(oldUrl, newUrl, { recursive: true }, function(err, data) {
            if(err) {
                reject(new MainIPC_Error(0, "move failed in Main process"));
            }
            fs.rm(oldUrl, { recursive: true, force: true }, function(rmErr) {
                if(rmErr) {
                    reject(new MainIPC_Error(0, "move cleanup failed in Main process"));
                }
                resolve(data);
            });
        });
    });
}

// Modified handleCopyFolderOrFile: push undo record to delete the copied item for undo
function handleCopyFolderOrFile(event, oldUrl, newUrl) {
    console.log("copy File or Folder");
    return new Promise((resolve, reject) => {
        notExists(newUrl).then((state) => {
            if(state) {
                fs.cp(oldUrl, newUrl, { recursive: true }, function(err, data) {
                    if(err) {
                        throw new MainIPC_Error(0, "copy failed in Main process old\n" + oldUrl + "\nnew\n" + newUrl);
                    }
                    // Push undo record to remove the copied item
                    undoStack.push({ op: 'copy', new: newUrl });
                    resolve(true);
                });
            } else {
                resolve(false);
            }
        });
    });
}

// New undoOperation function to revert the last operation
function undoOperation() {
    return new Promise((resolve, reject) => {
      console.log("undo operation");
        if (undoStack.length === 0) {
            return resolve("No operations to undo");
        }
        const lastOp = undoStack.pop();
        switch(lastOp.op) {
            case 'createFolder':
                fs.rm(lastOp.path, { recursive: true, force: true }, (err) => {
                    if(err) reject(new MainIPC_Error(0, "undo createFolder failed"));
                    else resolve("Undo createFolder successful");
                });
                break;
            case 'delete':
                fs.cp(lastOp.backup, lastOp.original, { recursive: true }, (err) => {
                    if(err) reject(new MainIPC_Error(0, "undo delete failed"));
                    else {
                        fs.rm(lastOp.backup, { recursive: true, force: true }, () => {});
                        resolve("Undo delete successful");
                    }
                });
                break;
            case 'rename':
                fs.rename(lastOp.new, lastOp.old, (err) => {
                    if(err) reject(new MainIPC_Error(0, "undo rename failed"));
                    else resolve("Undo rename successful");
                });
                break;
            case 'move':
                fs.cp(lastOp.new, lastOp.old, { recursive: true }, (err) => {
                    if(err) reject(new MainIPC_Error(0, "undo move failed"));
                    else {
                        fs.rm(lastOp.new, { recursive: true, force: true }, () => {});
                        resolve("Undo move successful");
                    }
                });
                break;
            case 'copy':
                fs.rm(lastOp.new, { recursive: true, force: true }, (err) => {
                    if(err) reject(new MainIPC_Error(0, "undo copy failed"));
                    else resolve("Undo copy successful");
                });
                break;
            default:
                resolve("Unknown operation");
        }
    });
}

function handleGetNCToolPath(event, toolpath) {
    return new Promise((resolve, reject) => {
        const { execFile } = require('child_process');
        execFile(toolpath, [], (err, stdout, stderr) => {
            if(err) {
                reject(new MainIPC_Error(0, "Execution failed: " + err.message));
            } else {
                resolve(stdout);
            }
        });
    });
}

function notExists(url){
    let ret = new Promise((resolve, reject) => {
      fs.access(url,fs.constants.F_OK,(err)=>{
        console.log("File Exists ? "+ err +" URL "+ url)
        if(err)
          resolve(true)
        else 
          resolve(false)
      })
    })
    return ret  
  }

app.on('before-quit', () => {  // Remove cache folder when closing the application
    if (fs.existsSync(cacheFolder)) {
        fs.rmSync(cacheFolder, { recursive: true, force: true });
    }
});

app.whenReady().then(createWindow)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})


