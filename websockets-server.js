const WebSocket = require('ws')
const WebSocketServer = WebSocket.Server
const port = 3001
// 创建websocket服务器实例
const ws = new WebSocketServer({
  port
})
// 用一个公共消息数组，接受客户端的消息
// let message = []

// 多个聊天室，也就是消息被不同的数组存储。
let messageRoom = {
  finance: [],
  technical: [],
  customService: []
}

// 数组去掉重复的同一用户的'加入聊天室的消息'

console.log('WebSockets server started')

// websockt服务端实例相当于一个插排。一旦链接一个客户端，就会接受一个针对这个客户端的插头，作为参数传入回掉函数。
ws.on('connection', function (socket) {
  console.log('client conection established')
  messageRoom.technical.map(function (msg) {
    // 将所有的信息都发送到这个客户端
    console.log('发送了')
    console.log('!!!')
    console.log(typeof msg)
    console.log('!!!')
    console.log(msg)
    socket.send(msg)
  })
  // 客户端会将信息发送过来，那么将这个客户端发送过来的消息push进公共消息数组中去
  socket.on('message', function (data) {
    console.log(`message received ${data}`)
    messageRoom.technical.push(data)
    // 客户端有一个属性，clients,它是一个包含所有客户端的对象 ，每当有用户发送消息，就将这个消息发送给所有的客户端
    ws.clients.forEach(function (clientSocket) {
      clientSocket.send(data)
    })
  })
})
