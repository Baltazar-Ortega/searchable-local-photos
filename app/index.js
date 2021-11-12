const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const model = require("./main/model")
const utils = require("./main/utils")

/*** Global variables ***/
let vitModelSession = null
let validatedImages = []
let win = null

const openWindow = () => {
    win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
        },
    });
    win.loadFile(path.resolve(__dirname, 'render/html/index.html'));
    win.webContents.openDevTools()
};

const loadModel = async () => {
    console.log("loading vitModel...")
    vitModelSession = await model.getModelSession()
    console.log("vitModel loaded")
}

/*** Functions for messages from the renderer process ***/
app.on('ready', () => {
    loadModel()
    openWindow();
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        openWindow();
    }
});

/*** Functions that execute inside the main process ***/
ipcMain.handle('app:validate-files', async (event, fileobjs = []) => {
    validatedImages = await utils.getValidatedImages(fileobjs, true)
    return validatedImages
})

ipcMain.handle("app:get-validated-images", (e) => {
    return validatedImages
})

ipcMain.handle("app:inference-on-images", async (e, images) => {
    let imagesClasses = {}
    for (let i = 0; i < images.length; i++) {
        win.webContents.send("app:dom-set-card-color", { domId: `card_img_${i + 1}`, state: 'loading' })

        let imageClasses = await model.getImageClasses(images[i].path, vitModelSession)
        let cleanPath = images[i].path.replace(/\\/g, '/')

        imagesClasses[cleanPath] = { classes: imageClasses, domId: `card_img_${i + 1}` }

        win.webContents.send("app:dom-set-card-color", { domId: `card_img_${i + 1}`, state: 'processed' })
        win.webContents.send("app:dom-set-num-imgs-processed", { idx: i, imagesLen: images.length })
    }
    return imagesClasses
})

ipcMain.handle('app:on-fs-dialog-open', async (e) => {
    const files = dialog.showOpenDialogSync({
        properties: ['openFile', 'multiSelections'],
    });
    validatedImages = await utils.getValidatedImages(files, false)
    return validatedImages
});

