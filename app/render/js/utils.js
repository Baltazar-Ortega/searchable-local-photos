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
  let filename = image.name

  let card = document.createElement("div")
  card.classList.add('card__unprocessed')
  card.innerHTML = `
          <img src="${image.path}" class="img">
          <p>Date: ${formatDate(image.lastModifiedDate)}</p>
          <p class="img-name">Name: ${showFilename(filename)}</p>

      `
  card.id = `card_img_${idx + 1}`

  let openImageP = document.createElement("p")
  openImageP.innerText = "Open image"
  openImageP.classList.add("open__img-btn")
  openImageP.onclick = () => {
    ipcRenderer.send("app:open-image", image.path)
  }

  card.appendChild(openImageP)

  let showInFe = document.createElement("p")
  showInFe.innerText = "Show in FileExplorer"
  showInFe.classList.add("show__in__fe-btn")
  showInFe.onclick = () => {
    ipcRenderer.send("app:show-in-file-explorer", image.path)
  }
  card.appendChild(showInFe)

  return card
}

module.exports = {
  showFilename, formatDate, cardCreator
}
