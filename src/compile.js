/* compile类，编译模板 */

class Compile {
  constructor(el, vm) {
    this.el = typeof el === 'string' ? document.querySelector(el) : el
    this.vm = vm

    let frag = this._nodeToFragment(this.el)

    this._compile(frag)

    this.el.appendChild(frag)

  }

  // 核心方法

  _nodeToFragment(node) {
    let fragment = document.createDocumentFragment()

    let child
    while (child = node.firstChild) {
      fragment.appendChild(child)
    }

    return fragment

  }

  _compile(frag) {
    let childNodes = frag.childNodes
    
    Array.from(childNodes).forEach(node => {
      let type = node.nodeType

      if (type === 1) {
        this._compileElement(node)
      }

      if (type === 3) {
        this._compileText(node, this.vm)
      }

      if (node.childNodes && node.childNodes.length > 0) {
        this._compile(node)
      }

    });

  }

  // 元素节点解析
  _compileElement(node) {
    let attrArr = node.attributes

    Array.from(attrArr).forEach(attr => {
      let attrName = attr.nodeName
      let expr = attr.value

      if (attrName.startsWith('v-')) {
        let type = attrName.slice(2)

        if (type.split(':')[0] === 'on') {
          CompileUtils['eventHandle'](node, this.vm, type, expr)
        } else {
          CompileUtils[type](node, expr, this.vm)
        }

      }
    })

  }

  // 文本节点解析
  _compileText(node, vm) {
    let txt = node.textContent
    let reg = /{\{(.+)\}\}/

    if (reg.test(txt)) {
      let expr = RegExp.$1

      node.textContent = txt.replace(reg, CompileUtils.getVmValue(expr, vm))

      new Watcher(vm, expr, (newValue) => {
        node.textContent = txt.replace(reg, newValue)
      })
    }

  }

  // 工具方法


}

const CompileUtils = {
  text(node, expr, vm) {
    node.innerText = this.getVmValue(expr, vm)

    new Watcher(vm, expr, (newValue) => {
      node.innerText = newValue
    })
  },
  html(node, expr, vm) {
    node.innerHTML = this.getVmValue(expr, vm)

    new Watcher(vm, expr, (newValue) => {
      node.innerHTML = newValue
    })
  },
  model(node, expr, vm) {
    const self = this

    node.value = this.getVmValue(expr, vm)

    new Watcher(vm, expr, (newValue) => {
      node.value = newValue
    })

    node.addEventListener('input', function () {
      self.setVmValue(vm, expr, this.value)
    })

  },
  eventHandle(node, vm, type, expr) {
    let eventType = type.split(':')[1]
    let fn = vm.$methods && vm.$methods[expr]

    if (eventType && fn) {
      node.addEventListener(eventType, fn.bind(vm))
    }

  },
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
  },
  setVmValue(vm, expr, value) {
    let data = vm
    let arr = expr.split('.')

    arr.forEach((key, index) => {
      if (index < arr.length - 1) {
        data = data[key]
      } else {
        data[key] = value
      }
    })
  }
}
