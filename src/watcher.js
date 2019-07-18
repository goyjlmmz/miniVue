/* watch类，负责把compile模块和observe模块关联起来 */

class Watcher {
  constructor(vm, expr, cb) {
    this.vm = vm
    this.expr = expr
    this.cb = cb

    Dep.target = this    

    this.oldValue = this.getVmValue(this.expr, this.vm)

    Dep.target = null
  }

  update() {
    let oldValue = this.oldValue
    let newValue = this.getVmValue(this.expr, this.vm)

    if (oldValue !== newValue) {      
      this.cb(newValue, oldValue)
    }
  }

  getVmValue(expr, vm) {
    // try {
    //   return eval(`vm.${expr}`)
    // } catch (error) {
    //   console.log(error)
    // }

    let data = vm
    let arr = expr.split('.')

    arr.forEach((item, index) => {
      data = data[item]
    })

    return data
  }
}
