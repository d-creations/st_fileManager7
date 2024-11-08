const { app, BrowserWindow, ipcMain,screen } = require('electron/main')
const path = require('node:path')
const fs = require('node:fs')
const https = require('node:https')
const electron = require('electron');
const { resourceLimits } = require('node:worker_threads');
const { updateElectronApp, UpdateSourceType } = require('update-electron-app')
const args = process.argv
updateElectronApp({
  updateSource: {
  type: UpdateSourceType.ElectronPublicUpdateService,
  repo: 'd-creations/st_fileManager7',
  host: "https://update.electronjs.org"
},
updateInterval: '60 minutes'
})

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
  function MainIPC_Error(mainIPC_ErrorCode,message) {
          this.errorCode = mainIPC_ErrorCode
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
    icon: path.join(__dirname, './resources/icon.ico'),
    
    titleBarStyle: 'customButtonsOnHover',
    webPreferences: {
      preload: path.join(__dirname, 'src/preload.js'),
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

  function handleCreateFolder (event,url){
    console.log("create File or Folder ")
    console.log(url)
    let ret = new Promise((resolve, reject) => {
      fs.mkdir(url, function(err, data){
          if(err) {
              reject(new MainIPC_Error(0,"create Folder failed in Main process"));
          }
          resolve(data);
      });
  });
    return ret
  }


  function handleMoveFolderOrFile (event,oldUrl,newUrl){
    console.log("create File or Folder ")
    console.log(url)
    let ret = new Promise((resolve, reject) => {
      fs.cp(src, dest, {recursive: true},function(err, data){
          if(err) {
              reject(new MainIPC_Error(0,"ove Folder failed in Main process"));
          }
          resolve(data);
      });
  });
    return ret
  }


  function handleCopyFolderOrFile (event,oldUrl,newUrl){
    console.log("copy File or Folder ")
    let ret = new Promise((resolve, reject) => {
      notExists(newUrl).then((state)=>{
        if(state){
          fs.cp(oldUrl, newUrl, {recursive: true},function(err, data){
          if(err) {
            throw new MainIPC_Error(0,"cop< failed in Main process old\n" + oldUrl +"\nnew\n" + newUrl)
            }
          resolve(true);
        });
      }
      else{
        resolve(false);
      }

      })
  });
    return ret

  }

  function handleRenameFileOrFolder(event,oldUrl,newUrl){

    console.log("rename File or Folder ")
    let ret = new Promise((resolve, reject) => {
      notExists(newUrl).then((state)=>{
        if(state){
        fs.rename(oldUrl, newUrl, function(err, data){
          if(err) {
            throw new MainIPC_Error(0,"rename failed in Main process old\n" + oldUrl +"new\n" + newUrl)
            }
          resolve(true);
        });
      }
      else{
        resolve(false);
      }

      })
  });
    return ret
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
  function handleDeleteFileOrFolder(event,url){
    console.log("delete File or Folder ")
    console.log(url)
    let ret = new Promise((resolve, reject) => {
      fs.rm(url, { recursive: true, force: true },function(err, data){
          if(err) {
            throw new MainIPC_Error(0,"delete File or Folder Failed")
          }
          resolve();
      });
  });
    return ret
  }





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


