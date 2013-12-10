# c.ui.history

H5的一个可保存历史记录的输入组件,实际是一个aotocomplete组件

     var history = new History({
        'element': this.els.input,
        'style': { width: '100%', left: '0px'},
        'size': { height: -(100 + 5), top: 5 },
        'historyStore': self.kwHistoryStore,
        'listSize': 20,
        'itmeClickFun': function (data) {
            self._scenicSpotSelect(data);
        },
        'rootBox': this.$el,
        'focusFun': function () {
            self._inputFocus();
        },
        'inputFun': function () {
            self._keyInput();
        }
    });

## Properties

### element

为histroy组件指定一个input组件做输入控制

### style
history组件的样式

### size
 指定history的size

### historyStore
为history组件指定一个Store存放输入历史记录,store应继承[c.store](c.store.md)

### listSize
history组件最多显示多少条历史记录

### rootBox
history组件的父容器

### focusFun
input组件获得焦点时出发函数

### inputFun
input组件输入时触发函数

### itmeClickFun
点击记录想时触发函数


## Event

## Method

### setDataSource
setDataSource(datasource)
为history组件指定一个外部数据源,datasource应为一个数组,每个数组元素为一个对象,应至少包含
id和name两个属性.

    history.setDataSource([
        {
            id : 2,
            name: '上海'
        }
    ])



### open
open()

打开history组件

    history.open()

### close
close()

关闭history组件

    history.close()

### addHistory
addHistory(data)

添加一条历史记录

    history.addHistory({
        id :'2',
        name: '上海'
    })





