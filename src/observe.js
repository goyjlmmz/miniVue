/* observe类，对vue实例上data数据进行数据劫持 */

class Observe {
  constructor(data) {
    this.data = data
    this.walk(data)    
  }

  // 核心方法
  walk(data) {
    if (!data || typeof data !== 'object') return

    Object.keys(data).forEach(key => {
      this.defineReactive(data, key, data[key])
    })
  }

  // 工具方法
  defineReactive(obj, key, value) {
    const self = this
    let dep = new Dep()

    self.walk(value)

    Object.defineProperty(obj, key, {
      configurable: true,
      enumerable: true,
      get() {
        if(Dep.target) {
          dep.addSub(Dep.target)
        }
        return value
      },
      set(newValue) {
        if(value === newValue) return

        value = newValue

        self.walk(newValue)
        
        dep.notify()
      }
    })

  }
}
