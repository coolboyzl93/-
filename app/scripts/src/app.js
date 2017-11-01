// 负责处理聊天信息数据，接应从服务器端传来的经过处理的数据，以及将数据传递到DOM模块

import socket from './ws-client'
import { ChatForm, ChatList, promptForUsername } from './dom'
import { UserStore } from './storage'

// 获取querySelector api选择器
const FORM_SELECTOR = '[data-chat="chat-form"]'
const INPUT_SELECTOR = '[data-chat="message-input"]'
const LIST_SELECTOR = '[data-chat="message-list"]'

// 建立sessionStorage 浏览器存储用户名
let userStore = new UserStore('x-chattrbox/u')
let username = userStore.get()
// 如果不存在存储就让用户输入一个 ，然后存到sessionStorage
if (!username) {
  username = promptForUsername()
  userStore.set(username)
}

// 让网页刷新的时候不会重复发送hello信息
let userHello = new UserStore('hello')

class ChatApp {
  constructor () {
    // 实例化chatform 和chatList
    this.chatForm = new ChatForm(FORM_SELECTOR, INPUT_SELECTOR)
    this.chatList = new ChatList(LIST_SELECTOR, username)

    // 连接websocket服务器端口，并不是主服务器端口
    socket.init('ws://localhost:3001')

    // 将一旦socket建立就立即调用的函数
    socket.registerOpenHandler(() => {
      // 首先发送一个消息
      if (!userHello.get()) {
        console.log(userStore.get('hello'))
        let message = new ChatMessage({message: `${username}加入了聊天室`})
        // 客户端将消息发送给websocket服务器
        socket.sendMessage(message.serialize())
        userHello.set('hello')
      }
      // 然后调用chartForm 的初始化来提交表单信息 注册表单提交事件 然后使用input中的数据来生成chatmessage.
      this.chatForm.init((data) => {
        let message = new ChatMessage({message: data})
        socket.sendMessage(message.serialize())
      })
    })

    // websocket 将收到的数据(来自于好多个客户端的数据)，返回给这个客户端作为响应
    socket.registerMessageHandler((data) => {
      console.log(data)
      // 客户端利用socket返回的数据生成 Dom 聊天列表
      let message = new ChatMessage(data)
      // .serialize()方法生成的是一个对象
      console.log(typeof message.serialize())
      this.chatList.drawMessage(message.serialize())
    })

    // 如果socket服务器断开了连接..
    socket.registerCloseHandler(() => {
      console.log('client disconnected...')
    })

    // 执行moment模块不断更新时间戳，距离当前的时间的差值。
    this.chatList.init()
  }
}

// 对象参数，函数定义时接受一个对象作为形参，在函数调用的时候同样也要用相同的形式，此时对象的key是作为说明用的，对象的value才是真正的参数，它和正常参数没差。
class ChatMessage {
  constructor ({
    message: m,
    // ES6 参数默认值，如果使用对象参数，那么默认值可以是任意位置，因为有字典key索引。
    user: u = username,
    timestamp: t = (new Date()).getTime()
  }) {
    this.message = m
    this.user = u
    this.timestamp = t
  }
  serialize () {
    return {
      user: this.user,
      message: this.message,
      timestamp: this.timestamp
    }
  }
}
export default ChatApp
