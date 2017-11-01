// 负责处理服务器端传来的数据
/*
* 1.连接到服务器
* 2.在初次建立连接时初始化配置
* 3.将到达的信息发给响应的程序
* 4.向外发送信息
* 5.客户端断开连接，比如websocket服务器断开了，比如网络断了，等。
*/

let socket

function init (url) {
  socket = new WebSocket(url)
  console.log('connecting...')
}

function registerOpenHandler (handlerFunction) {
  socket.onopen = () => {
    console.log('open')
    handlerFunction()
  }
}

function registerMessageHandler (handlerFunction) {
  socket.onmessage = (e) => {
    console.log('message', e.data)
    let data = JSON.parse(e.data)
    console.log(data)
    handlerFunction(data)
  }
}

function sendMessage (payload) {
  socket.send(JSON.stringify(payload))
}

function registerCloseHandler (handlerFunction) {
  socket.onclose = () => {
    handlerFunction()
  }
}

export default {
  init,
  registerOpenHandler,
  registerMessageHandler,
  sendMessage,
  registerCloseHandler
}
