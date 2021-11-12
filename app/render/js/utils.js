const dayjs = require("dayjs")

const showFilename = (filename) => {
  if (filename.length > 40) {
    return `...${filename.slice(-40)}`
  }
  return filename
}

const formatDate = (lastModifiedDate) => {
  return dayjs(lastModifiedDate).format("DD/MMM/YYYY")
}



module.exports = {
  showFilename, formatDate
}
