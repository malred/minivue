class Vue {
    constructor(options) {
        // 1,通过属性保存选项的数据
        this.$options = options || {}
        this.$data = options.data || {}
        this.$el = typeof options.el === 'string' ?
            // 获取该dom对象
            document.querySelector(options.el) : options.el
        // 2,把data中的成员转换成getter和setter,注入到vue实例中
        this._proxyData(this.$data)
        // 3,调用observer对象,监听data内数据变化
        new Observer(this.$data) // data.xxx => 响应式
        // 4,调用compile对象,解析指令和插值表达式
        new Compile(this)
    }
    // vue.data => 响应式
    _proxyData(data) {
        // 遍历data中所有属性
        Object.keys(data).forEach(key => {
            // data属性注入到vue实例中
            Object.defineProperty(this, key, {
                enumerable: true, // 可枚举
                configurable: true, // 可遍历
                get() {
                    return data[key]
                },
                set(newVal) {
                    // 没有发生变化
                    if (newVal === data[key]) {
                        return
                    }
                    data[key] = newVal
                }
            })
        })
    }
}