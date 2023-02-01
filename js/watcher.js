class Watcher {
    constructor(vm, key, cb) {
        this.vm = vm;
        // data中的属性名称
        this.key = key
        // 回调函数,负责更新视图
        this.cb = cb
        // 把watcher对象记录到Dep类的静态属性target
        Dep.target = this
        // 触发get方法,在get方法里调用addSub
        // 保存更新前的data数据
        this.oldVal = vm[key]
        // 设回空值,防止重复添加
        Dep.target = null
    }
    // 当数据发生变化时更新视图
    update() {
        let newVal = this.vm[this.key]
        // 没有发生变化
        if (this.oldVal === newVal) {
            return
        }
        // 回调,更新视图
        this.cb(newVal)
    }
}