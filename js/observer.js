class Observer {
    constructor(data) {
        this.walk(data)
    }
    walk(data) {
        // 1,判断data是否是对象
        if (!data || typeof data !== 'object') {
            return
        }
        // 2,遍历data对象的所有属性
        Object.keys(data).forEach(key => { // 监听函数不会改变this指向 
            this.defineReactive(data, key, data[key])
        })
    }
    // data下的数据转换为响应式数据
    defineReactive(obj, key, value) {
        // 记录this (observer)
        let that = this
        // 收集依赖,并发送通知
        let dep = new Dep()
        // 如果value是对象,则其内部数据转为响应式
        this.walk(value)
        Object.defineProperty(obj, key, {
            enumerable: true,
            configurable: true,
            get() {
                // 如果使用 obj[key] 会发生死递归
                // 收集依赖
                Dep.target && dep.addSub(Dep.target)
                return value
            },
            set(newVal) {
                if (newVal === value) {
                    return
                }
                value = newVal
                // 如果新赋值的属性是对象,则转响应式
                that.walk(newVal) // 这里的this是data
                // this.walk(newVal) // 这里的this是data
                // 发送通知
                dep.notify()
            }
        })
    }
}