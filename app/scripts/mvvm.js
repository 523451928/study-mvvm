import { Compile } from './compile.js'
import { Watcher } from './watcher'
import { observe } from './observer'
export class MVVM{
    constructor(options){
        this.$options = options || {}
        let data = this._data = this.$options.data
        let self = this
        Object.keys(data).forEach((key) => {
            self._proxyData(key)
        })
        this._initComputed() 
        observe(data, this)
        this.$compile = new Compile(options.el || document.body, this)
        if (this.$options.mounted) {
            this.$options.mounted.call(this)
        }
    }
    $watch(key, cb, options) {
        new Watcher(this, key, cb)
    }
    _proxyData(key) {
        Object.defineProperty(this, key, {
            configurable: false,
            enumerable: true,
            get: function proxyGetter() {
                return this._data[key]
            },
            set: function proxySetter(newVal) {
                this._data[key] = newVal
            }
        })
    }
    _initComputed() {
        let computed = this.$options.computed
        if (typeof computed == 'object') {
            Object.keys(computed).forEach((key) => {
                Object.defineProperty(this, key, {
                    get: typeof computed[key] === 'function' ? computed[key] : computed[key].get,
                    set: typeof computed[key] === 'function' ? computed[key] : computed[key].set
                })
            })
        }
    }
}