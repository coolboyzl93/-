// 负责处理页面的dom结构
import $ from 'jquery'
import md5 from 'crypto-js/md5'
import moment from 'moment'

// 生成一个图片路径，得先到gravadar注册用户上传头像才行
function createGravatarUrl (username) {
  let userhash = md5(username)
  console.log(userhash)
  // 返回一个网络url指向一个网络图片路径，利用hash加密算法生成一个唯一的hash值
  return `http://www.gravatar.com/avatar/${userhash.toString()}`
}

// 将moment模块翻译成中文
function toChinese (engString) {
  return engString
  .replace(/minutes{0,}/, '分钟')
  .replace('seconds', '秒')
  .replace('a few', '几')
  .replace(/^an{0,}/, '1')
  .replace('ago', '前')
  .replace(/hours{0,}/, '小时')
}

// prompt交互，输入用户名
export function promptForUsername () {
  // prompt函数是浏览器内置的函数，弹出一个类似alert的窗口，可以写入一些东西，它返回相应的字符串，类似python的input()
  let username = window.prompt('Enter a username')
  return username.toLowerCase()
}
// 聊天输入表单
export class ChatForm {
  constructor (formSel, inputSel) {
    this.$form = $(formSel)
    this.$input = $(inputSel)
  }
  // 初始化表单input 注册了表单提交事件的监听器 它只管将input的值送出去，和重置input,不管这个数据用来什么
  init (submitCallback) {
    this.$form.submit((event) => {
      event.preventDefault()
      // 现获取input的值，然后这个值传入回调函数中，待回调函数执行完毕后，将input的值清空
      // 回调函数就是用来设定某一固定步骤执行的函数。
      let val = this.$input.val()
      submitCallback(val)
      this.$input.val('')
    })

    // 注册异步事件监听器
    this.$form.find('button').on('click', () => this.$form.submit())
  }
}

// 创建动态DOM聊天列表
export class ChatList {
  // 传入静态父DOM元素，和用户名，然后得到jQuery元素，因为要使用jQuery操作Dom
  constructor (listSel, username) {
    this.$list = $(listSel)
    this.username = username
  }

  // 形成聊天列表DOM元素的过程
  drawMessage ({user: u, timestamp: t, message: m}) {
    // 整体的一个消息就是一个<li>,内部有一个<p>,<p>的内部有3个<span>,li内还有一个img头像
    // console.log(`用户名${u}时间戳${t}消息${m}`)
    // 首先创建<li>
    let $messageRow = $('<li>', {
      'class': 'message-row',
      'style': 'display: none'
    })

    // 用来区分自己消息和别人消息的样式，一个特别的类me
    if (this.username === u) {
      $messageRow.addClass('me')
    }

    // 创建<p>
    let $message = $('<p>')

    // 加入用户名，绑定样式
    $message.append($('<span>', {
      'class': 'message-username',
      text: u
    }))

    // 加入时间戳，绑定样式
    $message.append($('<span>', {
      'class': 'timestamp',
      // 在app.js中默认发送消息的时候会传入一个new Date().getTime(),得到1970年1月1日至今的毫秒数，
      // 在JS中如果想，现在的固定下来的时间点，就要 new Date().setTime(new Date().getTime()) 这样就会将时间点固定下来。
      'data-time': t,
      text: toChinese(moment(t).fromNow())
    }))

    // 加入换行
    $message.append($('<br>'))

    // 加入消息，绑定样式
    $message.append($('<span>', {
      'class': 'message-message',
      text: m
    }))

    // 加入图片元素
    let $img = $('<img>', {
      src: createGravatarUrl(u),
      title: u
    })

    // 将图片插入p 中
    $messageRow.append($img)
    // 将消息整体<p>加入<li>中
    $messageRow.append($message)
    // 将新创建的<li>加入原有的<ul>中
    this.$list.append($messageRow)

    // $(DOM)的get(index)方法会将jQuery对象中选择某个DOM对象
    // .scrollIntoView()方法将该DOM对象在浏览器中可见，他是原生Dom自带的方法。
    $messageRow.get(0).scrollIntoView()
    $messageRow.fadeIn(1000)
  }

  // 每秒钟刷新moment时间戳返回的时间。
  init () {
    this.timer = window.setInterval(() => {
      $('[data-time]').each((idx, element) => {
        let $element = $(element)
        // new Date().getTime(milionseconds) 让1970年1月1日加上这些毫秒数返回的时间点。
        let timestamp = new Date().setTime($element.attr('data-time'))
        let ago = toChinese(moment(timestamp).fromNow())
        $element.html(ago)
      })
    }, 1000)
  }
}
