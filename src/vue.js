/* Vue类 */

class Vue {
  constructor(options = {}) {
    this.$el = options.el
    this.$data = options.data
    this.$methods = options.methods
    
    if(this.$data) new Observe(this.$data)

    if(this.$data) this._proxy(this.$data)
    if(this.$methods) this._proxy(this.$methods)

    if (this.$el) {
      new Compile(this.$el, this)
    }

  }

  // 挂载data和methods到Vue实例上
  _proxy(obj) {
    Object.keys(obj).forEach(key => {
      Object.defineProperty(this, key, {
        configurable: true,
        enumerable: true,
        get() {
          return obj[key]
        },
        set(newValue) {
          if (obj[key] === newValue) return

          obj[key] = newValue
        }
      })
    })
  }
}
