const { ipcRenderer } = require('electron');
const dragDrop = require('drag-drop');
const dom = require('./dom');

/*****************************/
/*** Global variables ***/
let imagesClasses = {}
let searchInputEl = document.getElementById("search-box")

/*** Drag and drop functionality ***/
dragDrop('#uploader', (files) => {
  const _files = files.map(file => {
    return {
      name: file.name,
      // C:\Users\baltazarortega\02.jpg
      path: file.path,
      lastModifiedDate: file.lastModifiedDate
    };
  });

  ipcRenderer.invoke('app:validate-files', _files).then((images) => {
    dom.hideErrorMessage()
    dom.displayCards(images)
    dom.hideUploader()
    dom.showProcessButton()
  }).catch((e) => {
    dom.displayErrorMessage("No images were send. Try again.")
  })
});

/*** Search functionality ***/
searchInputEl.addEventListener("keyup", filterImages)

function filterImages() {
  const searchValue = searchInputEl.value;

  if (searchValue === "") {
    let allImages = document.getElementsByTagName("img")
    for (let i = 1; i < allImages.length; i++) {
      allImages[i].parentElement.style.display = "block"
    }
    return
  }

  for (let imagePath in imagesClasses) {
    let cardEl = document.getElementById(imagesClasses[imagePath].domId)
    if (imagesClasses[imagePath].classes.includes(searchValue)) {
      cardEl.style.display = "block"
    } else {
      cardEl.style.display = "none"
    }
  }
}

/*** Functions that receive messages from the main process ***/
ipcRenderer.on("app:dom-set-card-color", (e, { domId, state }) => {
  dom.setCardColor(domId, state)
})

ipcRenderer.on("app:dom-set-num-imgs-processed", (e, { idx, imagesLen }) => {
  dom.setNumImgsProcessed(idx, imagesLen)
})

/*** Functions exposed in HTML ***/
window.startProcess = () => {
  dom.hideProcessButton()
  ipcRenderer.invoke("app:get-validated-images").then(async (images) => {
    dom.initializeNumImgsProcessed(images.length)
    ipcRenderer.invoke("app:inference-on-images", images).then((imagesClassesMain) => {
      imagesClasses = imagesClassesMain
      dom.showSearchContainer()
    })
  })
}

window.openDialog = () => {
  ipcRenderer.invoke('app:on-fs-dialog-open').then((images) => {
    dom.displayCards(images);
    dom.hideUploader()
    dom.showProcessButton()
  }).catch((e) => {
    dom.displayErrorMessage("No images were send. Try with other files")
  })
}

window.restart = () => {
  imagesClasses = {}
  dom.restartCards()
  dom.showUploader()
}
