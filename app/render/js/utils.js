const showFilename = (filename) => {
  if (filename.length > 40) {
    return `...${filename.slice(-40)}`
  }
  return filename
}

const toggleLoading = (loading) => {
  let loadingStatusEl = document.getElementById("loading-status")
  if (loading) {
    loadingStatusEl.innerText = `Loading...`
  } else {
    loadingStatusEl.style.display = "none"
  }
}

module.exports = {
  showFilename, toggleLoading
}
