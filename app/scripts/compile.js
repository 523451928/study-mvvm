import {Watcher} from './watcher'
export class Compile{
    constructor(el, vm) {
        this.$vm = vm
        this.$el = this.isElementNode(el) ? el : document.querySelector(el)
        if (this.$el) {
            this.$fragment = this.nodeFragment(this.$el)
            this.init()
            this.$el.appendChild(this.$fragment)
        }
    }
    nodeFragment(el) {
        let fragment = document.createDocumentFragment()
        while (el.firstChild) {
            fragment.appendChild(el.firstChild)
        }
        return fragment
    }
    init() {
        this.compileElement(this.$fragment)
    }
    compileElement(el) {
        let childNodes = el.childNodes, self = this;
        [].slice.call(childNodes).forEach((node) => {
            let text = node.textContent
            let reg = /\{\{(.*)\}\}/
            if (self.isElementNode(node)) {
                self.compile(node)
            } else if (self.isTextNode(node) && reg.test(text)) {
                self.compileText(node, RegExp.$1)
            }
            if (node.childNodes && node.childNodes.length) {
                self.compileElement(node)
            }
        })
    }
    compile(node) {
        let nodeAttrs = node.attributes, self = this;
        [].slice.call(nodeAttrs).forEach((attr) => {
            let attrName = attr.name
            if (self.isDirective(attrName)) {
                let exp = attr.value
                let dir = attrName.indexOf('@') === 0 ? attrName.substring(0) : attrName.substring(2)
                // 事件指令
                if (self.isEventDirective(dir)) {
                    compileUtil.eventHandler(node, self.$vm, exp, dir)
                    // 普通指令
                } else {
                    compileUtil[dir] && compileUtil[dir](node, self.$vm, exp)
                }

                node.removeAttribute(attrName)
            }
        })
    }
    isDirective(attr) {
        return attr.indexOf('v-') == 0 || attr.indexOf('@') == 0
    }
    compileText(node, exp) {
        compileUtil.text(node, this.$vm, exp);
    }
    isEventDirective(dir) {
        return dir.indexOf('on') === 0 ? dir.indexOf('on') === 0 : dir.indexOf('@') === 0
    }
    isTextNode(node) {
        return node.nodeType == 3
    }
    isElementNode(node) {
        return node.nodeType == 1
    }
}
// 指令处理集合
let compileUtil = {
    style: function (node, vm, exp) {
        this.bind(node, vm, exp, 'style')
    },
    for: function (node, vm, exp) {
        this.bind(node, vm, exp, 'for')
    },
    text: function (node, vm, exp) {
        this.bind(node, vm, exp, 'text')
    },

    html: function (node, vm, exp) {
        this.bind(node, vm, exp, 'html')
    },
    show: function (node, vm, exp) {
        this.bind(node, vm, exp, 'show')
    },
    model: function (node, vm, exp) {
        this.bind(node, vm, exp, 'model')

        let me = this,
            val = this._getVMVal(vm, exp)
        node.addEventListener('input', function (e) {
            let newValue = e.target.value
            if (val === newValue) {
                return
            }

            me._setVMVal(vm, exp, newValue)
            val = newValue
        })
    },

    class: function (node, vm, exp) {
        this.bind(node, vm, exp, 'class')
    },

    bind: function (node, vm, exp, dir) {
        let updaterFn = updater[dir + 'Updater']

        updaterFn && updaterFn(node, this._getVMVal(vm, exp))

        new Watcher(vm, exp, function (value, oldValue) {
            updaterFn && updaterFn(node, value, oldValue)
        })
    },

    // 事件处理
    eventHandler: function (node, vm, exp, dir) {
        let eventType = dir.split(':')[1] ? dir.split(':')[1] : dir.split('@')[1],
            fn = vm.$options.methods && vm.$options.methods[exp]

        if (eventType && fn) {
            node.addEventListener(eventType, fn.bind(vm), false)
        }
    },

    _getVMVal: function (vm, exp) {
        let val = vm
        exp = exp.split('.')
        exp.forEach(function (k) {
            val = val[k]
        })
        return val
    },

    _setVMVal: function (vm, exp, value) {
        let val = vm
        exp = exp.split('.')
        exp.forEach(function (k, i) {
            // 非最后一个key，更新val的值
            if (i < exp.length - 1) {
                val = val[k]
            } else {
                val[k] = value
            }
        })
    }
}
let updater = {
    styleUpdater: function (node, value) {
        for (let key in value) {
            node.style[key] = value[key]
        }
    },
    forUpdater: function (node, value) {
    },
    showUpdater: function (node, value) {
        if (value) {
            node.style.display = ''
        } else {
            node.style.display = 'none'
        }
    },
    textUpdater: function (node, value) {
        node.textContent = typeof value == 'undefined' ? '' : value
    },

    htmlUpdater: function (node, value) {
        node.innerHTML = typeof value == 'undefined' ? '' : value
    },

    classUpdater: function (node, value, oldValue) {
        let className = node.className
        className = className.replace(oldValue, '').replace(/\s$/, '')

        let space = className && String(value) ? ' ' : ''

        node.className = className + space + value
    },

    modelUpdater: function (node, value, oldValue) {
        node.value = typeof value == 'undefined' ? '' : value
    }
}