const { app, BrowserWindow,screen  } = require('electron/main')

const createWindow = () => {
  const primaryDisplay = screen.getPrimaryDisplay()
  const { width, height } = primaryDisplay.workAreaSize
  const win = new BrowserWindow({
    width: width,
    height: height
  })
  win.openDevTools();
  win.loadFile('public/html/index.html')
}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow()
    }
  })
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})