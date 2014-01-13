define(['cCoreInherit'], function (cCoreInherit) {
	var C = function(){};

	function indexOf(v, a) {
        if (!a) return -1;
        if (a.indexOf) return a.indexOf(v);
        for (var i = 0, l = a.length; i < l; i++) {
            if (a[i] === v) return i;
        }
        return -1;
    }
    
	C.Hash = new cCoreInherit.Class({
        __propertys__: function () {
            this.keys = [];
            this.values = [];
        },
        initialize: function (obj) {
            
            // @Author : yq.zhang (Air)
            // @Description : 修正初始化逻辑，将逻辑与 替换为 逻辑或
            typeof obj == 'object' || (obj = {});
            for (var i in obj) {
                if (obj.hasOwnProperty(i)) {
                    this.keys.push(i);
                    this.values.push(obj[i]);
                }
            }
        },

        length: function () {
            return this.keys.length;
        },

        getItem: function (k) {
            var index = indexOf(k, this.keys);
            if (index < 0) return null;
            return this.values[index];
        },
        getKey: function (i) {
            return this.keys[i];
        },
        index: function (i) {
            return this.values[i];
        },
        //加入一对hash
        add: function (k, v) {
            return this.push(k, v);
        },
        //根据key来删除hash
        del: function (k) {
            var index = indexOf(k, this.keys);
            if (index < 0) return this;
            this.keys.splice(index, 1);
            this.values.splice(index, 1);
            return this;
        },
        //根据index来删除hash
        delByIndex: function (index) {
            if (index < 0) return this;
            this.keys.splice(index, 1);
            this.values.splice(index, 1);
            return this;
        },
        //移除栈顶的hash，并返回此hash
        pop: function () {
            if (!this.keys.length) return null;
            this.keys.pop();
            return this.values.pop();
        },
        //向栈顶压入hash
        push: function (k, v, order) {
            if (typeof k == 'object' && !v) {
                for (var i in k)
                    if (k.hasOwnProperty(i)) this.push(i, k[i], order);
            } else {
                var index = indexOf(k, this.keys);
                if (index < 0 || order) {
                    if (order) this.del(k);
                    this.keys.push(k);
                    this.values.push(v);
                } else {
                    this.values[index] = v;
                }
            }
            return this;
        },
        //查找hash表，返回key
        indexOf: function (v) {
            var index = indexOf(v, this.values);
            if (index >= 0) return this.keys[index];
            return -1;
        },
        //移除栈底的hash，返回此hash
        shift: function () {
            if (!this.keys.length) return null;
            this.keys.shift();
            return this.values.shift();
        },
        //往队列头部插入hash
        unshift: function (k, v, order) {
            if (Ext.isObject(k) && !v) {
                for (var i in k)
                    if (k.hasOwnProperty(i)) this.unshift(i, k[i]);
            } else {
                var index = indexOf(k, this.keys);
                if (index < 0 || order) {
                    if (order) this.del(k);
                    this.keys.unshift(k);
                    this.values.unshift(v);
                } else {
                    this.values[i] = v;
                }
            }
            return this;
        },
        //返回一个hash表的一段
        slice: function (start, end) {
            var keys = this.keys.slice(start, end || null),
                values = this.values.slice(start, end || null),
                obj = {};
            for (var i = 0, l = keys.length; i < l; i++) {
                obj[keys[i]] = values[i];
            }
            return obj;
        },
        //从一个hash中移除一个或多个元素，如果必要，在所移除元素的位置上插入新元素，返回所移除的元素。
        splice: function (start, count) {
            var keys = this.keys.splice(start, count || null),
                values = this.values.splice(start, count || null),
                obj = {};
            for (var i = 0, l = keys.length; i < l; i++) {
                obj[keys[i]] = values[i];
            }
            return obj;
        },
        toString: function () {
            // if (typeof JSON != 'undefined' && JSON.stringify) {
            //     return JSON.stringify(this.valueOf());
            // }
            if (typeof JSON != 'undefined' && JSON.stringify) {
                return JSON.stringify(this.valueOf());
            }
            return typeof this.values;
        },
        filter: function (hander) {
            var list = {};
            if (typeof hander !== 'function') return null;
            for (var i = 0, len = this.keys.length; i < len; i++) {
                if (hander.call(this.values[i], this.values[i], this.keys[i])) list[this.keys[i]] = this.values[i];
            }
            return list;
        },
        each: function (hander) {
            var list = {};
            if (typeof hander !== 'function') return null;
            for (var i = 0, len = this.keys.length; i < len; i++) {
                hander.call(this.values[i], this.values[i], this.keys[i], i);
            }
        },
        valueOf: function () {
            var obj = {};
            for (var i = 0, l = this.keys.length; i < l; i++) {
                obj[this.keys[i]] = this.values[i];
            }
            return obj;
        },

        sortBy: function (handler) {
            var tempValueList = _.sortBy(this.values, handler);
            var templKeyList = [];
            for (var i = 0; i < tempValueList.length; i++) {
                var key = this.indexOf(tempValueList[i]);
                templKeyList[i] = key;
            };
            this.values = tempValueList;
            this.keys = templKeyList;
        }
    });
    
    return C
});