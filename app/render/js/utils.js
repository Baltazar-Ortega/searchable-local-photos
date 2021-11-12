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
  openImageP.onclick = () => {
    ipcRenderer.send("app:open-image", image.path)
  }

  card.appendChild(openImageP)

  return card
}

module.exports = {
  showFilename, formatDate, cardCreator
}
