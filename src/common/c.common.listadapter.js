/**********************************
* @author:       cmli@Ctrip.com
* @description:  ListAdapter是ListView的适配器
*/
define(['libs', 'cBase'], function (libs, cBase) {

    var options = options || {};

    /*************************
    * @description: 生产随机的length长度的码
    * @scope: private
    */
    var _random = function (length) {
        var s = '';
        var randomchar = function () {
            var n = Math.floor(Math.random() * 62);
            if (n < 10) return n; //1-10
            if (n < 36) return String.fromCharCode(n + 55); //A-Z
            return String.fromCharCode(n + 61); //a-z
        }
        while (s.length < length) s += randomchar();
        return s;
    }

    /*************************
    * @description: 生产不重复的随机码，将value设置到hash对象中去
    * @scope: private
    */
    var _setValue = function (map, value) {
        var randomCode = _random(8);
        if (!map.getItem(randomCode)) {
            return map.add(randomCode, value);
        } else {
            _setValue(map, value);
        }
    }

    /*************************
    * @description: 生成cBase的Hash对象，将数组转换成Hash对象进行存储
    * @scope: private
    */
    var _hashMap = function (map, dataList) {
        for (var i = 0; i < dataList.length; i++) {
            _setValue(map, dataList[i]);
        };
    }

    options.__propertys__ = function () {
        this.observers = [];
    }

    options.initialize = function (options) {
        this.setAdapter(options.data);
    }

    /*************************
    * @description: 向队列的尾部添加数据
    * @scope: public
    */
    options.add = function (data) {
        if (data instanceof Array) {
            for (var i = 0; i < data.length; i++) {
                _setValue(this.map, data[i]);
                this.list.push(data[i]);
            };
        } else {
            _setValue(this.map, data);
            this.list.push(data);
        }

        this.notifyDataChanged();
    }

    /*************************
    * @description: 从队列的头部剔除一个数据，同时返回该数据
    * @scope: public
    */
    options.shift = function () {
        this.map.shift();
        this.notifyDataChanged();
        return this.list.shift();
    }

    /*************************
    * @description: 从队列的尾部剔除一个数据，同时返回该数据
    * @scope: public
    */
    options.pop = function () {
        this.map.pop();
        this.notifyDataChanged();
        return this.list.pop();
    }

    /*************************
    * @description: 从队列的尾部部剔除number个数据
    * @scope: public
    */
    options.remove = function (number) {
        for (var i = 0; i < number; i++) {
            this.map.pop();
            this.list.pop();
        };

        this.notifyDataChanged();
    }

    /*************************
    * @description: 以handler返回的数据进行排序
    * @scope: public
    */
    options.sortBy = function (handler) {
        this.map.sortBy(handler);
        this.list = _.sortBy(this.list, handler);

        this.notifyDataChanged();
    }

    options.setAdapter = function (dataList) {
        dataList = (dataList && dataList instanceof Array) ? dataList : [];
       // if (dataList && dataList instanceof Array) {
            this.list = $.extend(true, [], dataList);
            this.map = new cBase.Hash();
            _hashMap(this.map, dataList);
            this.notifyDataChanged();
//        } else {
//            throw "ListAdapter: set data is not array";
//        }
    }

    /********************************
    * @description: 将观察者注册到被观察者中
    * @param: {observer} ListView 观察者实例
    */
    options.regiseterObserver = function (observer) {
        if (this.observers.indexOf(observer) === -1) {
            this.observers.push(observer);
        }
    }

    /********************************
    * @description: 将观察者从被观察者中解绑
    * @param: {observer} ListView 观察者实例
    */
    options.unregiseterObserver = function (observer) {
        var index = this.observers.indexOf(observer)
        if (index) {
            this.observers.splice(index, 1);
        };
    }

    /********************************
    * @description: 通知观察者数据发生变化需要更新
    */
    options.notifyDataChanged = function () {
        for (var i = 0; i < this.observers.length; i++) {
            this.observers[i].update();
        };
    }

    var ListAdapter = new cBase.Class(options);

    return ListAdapter;

});