# 聊天宝盒

## 功能
- 在线聊天系统

## 技术选型
- websocket
- Node.js
- jQuery
- Bootstrap

## 编码规范
- ES6 standard
- CSS BEM

## 环境组成
- babel: 编译ES6+为ES5Node.js模块
- nodemon: 代码变动自动重新载代
- browserify: 将Node.js模块转化为ES5的函数
- watchify: 代码变动自动触发重新编译

## NPM特别功能的包
- crypto.js: 使用md5算法生成几乎无冲突，不可逆向破译的哈希值
- moment.js: 根据对比某一个时间点自动生成那个时间点到当前时间的英文表示
- mime: 根据文件的路径就可以自动得到文件头contentText类型

## 项目结构
1. 使用Node.js + websocket 作为聊天室的服务器
2. 使用babel + browserify编译,所以有src(编译前)文件目录和dist(编译后)文件目录
3. we-client.js 负责处理连接websocket服务器的数据，数据的发送，接受，连接的初始化等操作
4. dom.js 专门负责UI层面的js文件
5. storage.js 负责浏览器缓存
6. app.js 负责业务功能主逻辑
7. 404页面负责显示一个错误的URL跳转页面


