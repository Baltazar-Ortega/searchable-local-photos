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

iconDragDrop.addEventListener("drop", (e) => {
  iconDragDrop.classList.remove("app__uploader__icon-area__icon-drag")
  iconDragDrop.classList.add("app__uploader__icon-area__icon")
})


/*** DOM functions ***/
const toggleLoading = (loading) => {
  let loadingStatusEl = document.getElementById("loading-status")
  if (loading) {
    loadingStatusEl.innerText = `Loading...`
  } else {
    loadingStatusEl.style.display = "none"
  }
}

const showUploader = () => {
  let uploader = document.getElementById("uploader")
  uploader.style.display = "flex"
}

const hideUploader = () => {
  let uploader = document.getElementById("uploader")
  uploader.style.display = "none"
}

const displayCards = (images = []) => {
  toggleLoading(true)
  const cardsContainer = document.getElementById("cards-container")

  for (let i = 0; i < images.length; i++) {
    let filename = images[i].name

    let card = document.createElement("div")
    card.classList.add('card__unprocessed')
    card.innerHTML = `
          <img src="${images[i].path}" class="img">
          <p>Date: ${utils.formatDate(images[i].lastModifiedDate)}</p>
          <p class="img-name">Name: ${utils.showFilename(filename)}</p>
      `
    card.id = `card_img_${i + 1}`
    cardsContainer.appendChild(card)
  }
  toggleLoading(false)
};

const showProcessButton = () => {
  const buttonContainer = document.getElementById("process-btn-container")
  buttonContainer.style.display = "block"
}

const hideProcessButton = () => {
  const buttonContainer = document.getElementById("process-btn-container")
  buttonContainer.style.display = "none"
}

const initializeNumImgsProcessed = (imagesLength) => {
  let processLoadingStatusEl = document.getElementById("process-loading-status")
  processLoadingStatusEl.style.display = "block"
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

const showSearchContainer = () => {
  let buttonContainer = document.getElementById("process-btn-container")
  buttonContainer.style.display = "none"

  let processLoadingStatusEl = document.getElementById("process-loading-status")
  processLoadingStatusEl.style.display = "none"

  let searchContainer = document.getElementById("search-container")
  searchContainer.classList.remove("search-container-inactive")
  searchContainer.classList.add("search-container-active")
}

const restartCards = () => {
  let searchContainer = document.getElementById("search-container")
  searchContainer.classList.remove("search-container-active")
  searchContainer.classList.add("search-container-inactive")

  let cardsContainer = document.getElementById("cards-container")
  cardsContainer.textContent = ""
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
  showSearchContainer,
  restartCards
}