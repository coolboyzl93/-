// 通用类，既可以搭配localStorage 又可以搭配sessionStorage
class Store {
  constructor (storageAPI) {
    this.api = storageAPI
  }
  get () {
    return this.api.getItem(this.key)
  }

  set (value) {
    this.api.setItem(this.key, value)
  }
}
export class UserStore extends Store {
  constructor (key) {
    // 传入对sessionStorage的引用,其实就是用了sessionStorage的constructor 函数
    super(window.sessionStorage)
    this.key = key
  }
}
