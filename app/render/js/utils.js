const dayjs = require("dayjs")
const { ipcRenderer } = require('electron');

const showFilename = (filename) => {
  if (filename.length > 40) {
    return `...${filename.slice(-40)}`
  }
  return filename
}

const formatDate = (lastModifiedDate) => {
  return dayjs(lastModifiedDate).format("DD/MMM/YYYY")
}

const cardCreator = (image, idx) => {
  let card = createCardContent(image, idx)
  let cardLinks = createCardLinks(image.path)

  card.appendChild(cardLinks)

  return card
}

const createCardLinks = (imgPath) => {
  let cardLinks = document.createElement("div")
  cardLinks.classList.add("card-body")

  let openImageLink = document.createElement("a")
  openImageLink.classList.add("card-link")
  openImageLink.innerText = "Open"
  openImageLink.onclick = () => {
    ipcRenderer.send("app:open-image", imgPath)
  }
  let showInFeLink = document.createElement("a")
  showInFeLink.classList.add("card-link")
  showInFeLink.innerText = "Show in file explorer"
  showInFeLink.onclick = () => {
    ipcRenderer.send("app:show-in-file-explorer", imgPath)
  }

  cardLinks.appendChild(openImageLink)
  cardLinks.appendChild(showInFeLink)

  return cardLinks
}

const createCardContent = (image, idx) => {
  let filename = image.name
  let card = document.createElement("div")

  card.classList.add('card__unprocessed')
  card.style = "width: 18rem;"
  card.innerHTML = `
      <img src="${image.path}" class="img" alt="...">
      <div class="card-body">
        <h5 class="card-title">Name: ${showFilename(filename)}</h5>
        <p class="card-text">${formatDate(image.lastModifiedDate)}</p>
      </div>
  `
  card.id = `card_img_${idx + 1}`

  return card
}

module.exports = {
  showFilename, formatDate, cardCreator
}
