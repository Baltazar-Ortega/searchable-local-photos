const { app, BrowserWindow, ipcMain, dialog, shell } = require('electron');
const path = require('path');
const fs = require('fs-extra');
const open = require('open');
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
    loadModel();
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

ipcMain.on("app:open-image", (e, imgPath) => {
    // imgPath: C:\Users\kalbe\Pictures\photos_modified\12.jpg
    if (fs.existsSync(imgPath)) {
        open(imgPath);
    }
})

ipcMain.on("app:show-in-file-explorer", (e, imgPath) => {
    // imgPath: C:\Users\kalbe\Pictures\photos_modified\12.jpg
    shell.showItemInFolder(imgPath)
})

/*** Functions that execute inside the main process ***/
ipcMain.handle('app:validate-files', async (event, fileobjs = []) => {
    validatedImages = await utils.getValidatedImages(fileobjs, true)
    if (validatedImages.length === 0) {
        throw new Error("No images were send")
    }
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
        imagesClasses[images[i].path] = { classes: imageClasses, domId: `card_img_${i + 1}` }

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
    if (validatedImages.length === 0) {
        throw new Error("No images were send")
    }
    return validatedImages
});


