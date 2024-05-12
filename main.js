const { app, BrowserWindow, ipcMain,screen } = require('electron/main')
const path = require('node:path')
const fs = require('node:fs')
const https = require('node:https')
const electron = require('electron');


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

ipcMain.handle('closeApplication', handleCloseApplication)





}

function handleCloseApplication(event){
  BrowserWindow.getAllWindows().forEach(window => {
    window.close()
  })
}

async function handleSaveFile (event,url,text) {
  let options = {properties:["openFile"]}
  console.log("save")
  console.log(url)
  console.log(text)
  await fs.writeFile(url, text, err => {
    if (err) {
      console.error(err);
    } else {
      // file written successfully
    }
  });
  return
}

async function handleGetFileText (event,url) {
  console.log("getText")
  console.log(url)

  let ret = new Promise((resolve, reject) => {
    fs.readFile(url, 'utf8', function(err, data){
        if(err) {
            reject(null);
            throw err;
        }
        resolve(data);
    });
});
  return ret
}

async function handleFileOpen () {
  let options = {properties:["openFile"]}
  const { canceled, filePaths } = await electron.dialog.showOpenDialog(options)
  if (!canceled) {
    return filePaths[0]
  }
  else return
}

async function handleFolderOpen () {
  let options = {properties:["openDirectory"]}
  const { canceled, filePaths } = await electron.dialog.showOpenDialog(options)
  if (!canceled) {
    return filePaths[0]
  }
  return
}

async function handleGetFilesInDir (event,args) {
  let ret = await fs.readdirSync(args,{withFileTypes: true})
  let result =  ret.map(entry => ({
    name: entry.name,
    type: entry.isDirectory() ? "directory" : "file",
  }))  
   return result
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


