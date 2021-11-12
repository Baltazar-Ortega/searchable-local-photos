const utils = require("./utils.js")

/*** Upload icon ***/
const iconDragDrop = document.getElementById("icon-drag-drop")

iconDragDrop.addEventListener('dragenter', (event) => {
  iconDragDrop.classList.remove("app__uploader__icon-area__icon")
  iconDragDrop.classList.add("app__uploader__icon-area__icon-drag")
});

iconDragDrop.addEventListener('dragleave', (event) => {
  iconDragDrop.classList.remove("app__uploader__icon-area__icon-drag")
  iconDragDrop.classList.add("app__uploader__icon-area__icon")
});

iconDragDrop.addEventListener('dragover', (e) => {
  e.preventDefault();
  e.stopPropagation();
});


/*** DOM functions ***/
const showUploader = () => {
  let uploader = document.getElementById("uploader")
  uploader.style.display = "block"
}

const hideUploader = () => {
  let uploader = document.getElementById("uploader")
  uploader.style.display = "none"
}

const displayCards = (files = []) => {
  utils.toggleLoading(true)

  const cardsContainer = document.getElementById("cards-container")

  for (let i = 0; i < files.length; i++) {
    let filename = files[i].name

    let card = document.createElement("div")
    card.classList.add('card__unprocessed')
    card.innerHTML = `
          <img src="${files[i].path}" class="img">
          <p>Date: ${files[i].lastModifiedDate}</p>
          <p class="img-name">Name: ${utils.showFilename(filename)}</p>
      `
    card.id = `card_img_${i + 1}`
    cardsContainer.appendChild(card)
  }
  utils.toggleLoading(false)
};

const showProcessButton = () => {
  let buttonStartProcess = `
    <button onclick="startProcess()">Process</button>
  `
  const buttonContainer = document.getElementById("button-container")
  buttonContainer.innerHTML = buttonStartProcess
}

const hideProcessButton = () => {
  const buttonContainer = document.getElementById("button-container")
  buttonContainer.style.display = "none"
}

const initializeNumImgsProcessed = (imagesLength) => {
  let processLoadingStatusEl = document.getElementById("process-loading-status")
  processLoadingStatusEl.innerText = `Images processed 0/${imagesLength}`
}

const setNumImgsProcessed = (currIdx, total) => {
  let processLoadingStatusEl = document.getElementById("process-loading-status")
  processLoadingStatusEl.innerText = `Images processed ${currIdx + 1}/${total} `
}

const setCardColor = (cardId, state) => {
  let card = document.getElementById(cardId)
  card.classList.remove('card')
  card.classList.add(`card__${state}`)
}

const showSearchBox = () => {
  let buttonContainer = document.getElementById("button-container")
  buttonContainer.style.display = "none"

  let processLoadingStatusEl = document.getElementById("process-loading-status")
  processLoadingStatusEl.style.display = "none"

  let searchBox = document.getElementById("search-container")
  searchBox.style.display = "block"
}

module.exports = {
  hideUploader,
  showUploader,
  displayCards,
  showProcessButton,
  hideProcessButton,
  initializeNumImgsProcessed,
  setNumImgsProcessed,
  setCardColor,
  showSearchBox,
}