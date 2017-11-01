var path = require('path')

var extractFilePath = function (url) {
  var fileName = 'index.html'
  if (url.length > 1) {
    fileName = url.substring(1)
  }
  console.log(fileName)
  var filePath = path.resolve(__dirname, 'app', fileName)
  return filePath
}

var errorFilePath = function () {
  return path.resolve(__dirname, 'app', '404.html')
}

module.exports = {
  extract: extractFilePath,
  error: errorFilePath
}
