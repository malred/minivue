class Compile {
    constructor(vm) {
        this.el = vm.$el
        this.vm = vm
        this.compile(this.el)
    }
    // 编译模板,处理文本节点和元素节点
    compile(el) {
        let childNodes = el.childNodes
        Array.from(childNodes).forEach(node => {
            // 此时this指向compile对象
            if (this.isTextNode(node)) {
                // 处理文本节点
                this.compileText(node)
            } else if (this.isElementNode(node)) {
                // 处理元素节点
                this.compileElement(node)
            }
            // 判断node节点是否有子节点,如果有,就递归调用compile
            if (node.childNodes && node.childNodes.length) {
                this.compile(node)
            }
        })
    }
    // 编译元素节点,处理指令
    compileElement(node) {
        // console.log(node.attributes)
        // 遍历所有属性节点
        Array.from(node.attributes).forEach(attr => {
            // 判断是否是指令
            let attrName = attr.name
            if (this.isDirective(attrName)) {
                // v-text --> text
                attrName = attrName.substr(2) // 从第三个字符截取到末尾的内容
                let key = attr.value // v-text="value"
                this.update(node, key, attrName) // 这里的this是compile对象
            }
        })
    }
    // 根据v-xxx来调用不同处理方法
    update(node, key, attrName) {
        let updateFn = this[attrName + 'Updater']
        // 参数一是调用该方法的对象(this)
        updateFn && updateFn.call(this, node, this.vm[key], key) // 传入key是因为watcher需要
    }
    // 处理v-text指令
    textUpdater(node, value, key) {
        // node的文本替换为value
        node.textContent = value
        // 发生变化时触发 
        // 此时的this是compile
        new Watcher(this.vm, key, (newVal) => {
            node.textContent = newVal
        })
    }
    // 处理v-model
    modelUpdater(node, value, key) {
        node.value = value
        // 发生变化时触发
        new Watcher(this.vm, key, (newVal) => {
            node.value = newVal
        })
        // 双向绑定
        node.addEventListener('input', () => {
            // 箭头函数不会改变this指向(此时是compile)
            this.vm[key] = node.value
        })
    }
    // 编译文本节点,处理插值表达式
    compileText(node) {
        // console.dir(node); // 以对象的形式打印
        // {{ msg }} 
        // . 代表任意单个字符
        // + 表示前面的字符出现一或多次
        // ? 表示非贪婪模式,尽可能少地匹配
        // () 是分组,匹配 pattern 并获取这一匹配
        let reg = /\{\{(.+?)\}\}/
        let value = node.textContent
        if (reg.test(value)) {
            // 获取正则匹配的第一个内容
            let key = RegExp.$1.trim()
            // 替换插值表达式的变量名为变量值
            node.textContent = value.replace(reg, this.vm[key]) // 初次渲染时
            // 所有依赖数据的地方都有watcher
            // 创建watcher对象,更新视图
            new Watcher(this.vm, key, (newVal) => {
                node.textContent = newVal // 发生变化时
            })
        }
    }
    // 判断元素属性是否是指令
    isDirective(attrName) {
        return attrName.startsWith('v-')
    }
    // 判断节点是否是文本节点
    isTextNode(node) {
        return node.nodeType === 3
    }
    // 判断节点是否是元素节点
    isElementNode(node) {
        return node.nodeType === 1
    }
}