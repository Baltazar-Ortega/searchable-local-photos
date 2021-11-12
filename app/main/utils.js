const FileType = require('file-type')
const fs = require("fs")
const path = require('path');

const getValidatedImages = async (files, areObjects) => {
  const allowedExtns = [".jpg", ".jpeg", ".png"]
  let imgsToReturn = []

  if (areObjects) {
    for (let i = 0; i < files.length; i++) {
      let file = files[i]
      const realType = `.${(await FileType.fromFile(file.path)).ext}`
      const lastIndex = file.name.lastIndexOf(".")
      if (lastIndex !== -1 && allowedExtns.includes(file.name.substr(lastIndex)) && allowedExtns.includes(realType)) {
        imgsToReturn.push(file)
      }
    }

  } else {
    for (let i = 0; i < files.length; i++) {
      let file = files[i]
      const realType = `.${(await FileType.fromFile(file)).ext}`
      const lastIndex = file.lastIndexOf(".")
      if (lastIndex !== -1 && allowedExtns.includes(file.substr(lastIndex)) && allowedExtns.includes(realType)) {
        imgsToReturn.push({
          name: path.basename(file),
          path: file,
          lastModifiedDate: fs.statSync(file).mtime
        })
      }
    }
  }
  return imgsToReturn
}

module.exports = {
  getValidatedImages
}