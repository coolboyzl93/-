var http = require('http')
var fs = require('fs')
// 只需要将websocket服务器引入主服务器即可，不需要使用。
var wss = require('./websockets-server')
var {
  extract,
  error
} = require('./extract')
const mime = require('mime')

// var handleError = function (err, res) {
//   res.writeHead(404)
//   res.end()
// }
var server = http.createServer(function (req, res) {
  console.log('Responding to a request.')
  var filePath = extract(req.url)
  // fs异步读取文件，从Api的命名上观察，默认就是异步的，异步是没有返回值的
  fs.readFile(filePath, function (err, data) {
    if (err) {
      // handleError(err, res)
      // 如果直接读取一个音频文件会直接在浏览器下载这个音乐

      // 这里用了同步读取文件，毕竟只是一个404的HTML文件，因为有返回值看着代码简洁
      res.end(fs.readFileSync(error()))
    } else {
      // mime模块根据文件的绝对路径，就可以得到数据头的类型字符串
      res.setHeader('Content-type', mime.getType(filePath))
      res.end(data)
    }
  })
})

server.listen(3000)
