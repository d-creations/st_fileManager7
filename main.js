const { app, BrowserWindow, ipcMain,screen } = require('electron/main')
const path = require('node:path')
const fs = require('node:fs')
const https = require('node:https')
const electron = require('electron');
const { resourceLimits } = require('node:worker_threads');

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





function createWindow () {
  const primaryDisplay = screen.getPrimaryDisplay()
  const { width, height } = primaryDisplay.workAreaSize

  const win = new BrowserWindow({
    width: width,
    height: height,
    webPreferences: {
      preload: path.join(__dirname, 'src/preload.js')
    }
  })
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
    fs.readFile(url, 'utf8', function(err, data){
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
            return entry.isFile() || entry.isDirectory() ;
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

  function handleRenameFileOrFolder(event,oldUrl,newUrl){

    console.log("rename File or Folder ")
    let ret = new Promise((resolve, reject) => {
      notExists(newUrl).then((state)=>{
        if(state){
        fs.rename(oldUrl, newUrl, function(err, data){
          if(err) {
            throw new MainIPC_Error(0,"rename failed in Main process old\n" + oldUrl +"new\n" + newUrl)
            }
          resolve(newUrl);
        });
      }
      else{
        resolve(oldUrl);
      }

      })
  });
    return ret
  }

  function notExists(url){
    let ret = new Promise((resolve, reject) => {
      fs.access(url,fs.constants.F_OK,(err)=>{
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


