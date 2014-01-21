/**
 * @author vlcm李淳敏 <cmli@Ctrip.com> / oxz欧新志 <ouxz@Ctrip.com> / vzyq张有泉 <yq.zhang@Ctrip.com>
 * @class Hash
 * @comment 如果使用的很少直接移动到cUtility去
 */
define(['cCoreInherit'], function(cCoreInherit) {

  /**
   * @method indexOf
   * @param {string|object|int} value 查询的目标值
   * @param {array|object} 查询队列或对象
   * @description 为Object提供indexOf方法
   */
  var indexOf = function(value, target) {
    if (!target) return -1;

    if (target.indexOf) return target.indexOf(value);

    for (var i = 0; i < target.length; i++) {
      if (target[i] === value) return i;
    }

    return -1;
  };

  var Base = {};

  var options = {};

  /** 申明数组 */
  options.keys = [];
  options.values = [];

  /**
   * @method __propertys__
   * @description 复写自顶层Class的__propertys__，初始化队列
   */
  options.__propertys__ = function() {};

  /**
   * @method initialize
   * @param {object} obj
   * @description 复写自顶层Class的initialize，赋值队列
   */
  options.initialize = function(obj) {

    /**
     * @author : yq.zhang (Air) / cmli
     * @description : 修正初始化逻辑，将逻辑与 替换为 逻辑或
     */
    if (typeof obj !== 'object') {
      obj = {};
    };

    for (var i in obj) {
      if (obj.hasOwnProperty(i)) {
        options.keys.push(i);
        options.values.push(obj[i]);
      }
    }
  };

  /**
   * @method length
   * @description 获取对象长度
   * @return {int}
   */
  options.length = function() {
    return options.keys.length;
  };

  /**
   * @method getItem
   * @param {string} key 键值名
   * @description 通过键值名获取对象
   */
  options.getItem = function(key) {
    var index = indexOf(key, options.keys);

    if (index < 0) return null;
    else return options.values[index];
  };

  /**
   * @method getKey
   * @param {int} index 序列值
   * @description 通过序列值获取键值名
   */
  options.getKey = function(index) {
    return options.keys[index];
  };

  /**
   * @method index
   * @param {int} index 序列值
   * @description 根据序列值获取对象值
   */
  options.index = function(index) {
    return options.values[index];
  };

  /**
   * @method push
   * @param {string} key 键值名
   * @param {string|int|object} value 键值对应的值
   * @description 向栈顶压入键值对
   */
  options.push = function(key, value, order) {
    if (typeof key === 'object' && !value) {
      for(var i in key){
        if (key.hasOwnProperty(i)) that.push(i, key[i], order);
      }
    }else{
      var index = indexOf(key, options.keys);

      if (index < 0 || order) {

        if (order) options.del(k);
        options.keys.push(key);
        options.values.push(value);

      } else {

        options.values[index] = value;
      }
    }

    return this;
  };

  /**
   * @method add
   * @param {string} key 键值名
   * @param {string|int|object} value 键值对应的值
   * @description 向栈顶压入键值对
   */
  options.add = function(key, value) {
    return options.push(key, value);
  };

  /**
   * @method del
   * @param {string} key 键值名
   * @description 根据key来删除hash
   */
  options.del = function(key){
    var index = indexOf(key, this.keys);

    if (index < 0) return this;

    options.keys.splice(index, 1);
    options.values.splice(index, 1);

    return this;
  };

  /**
   * @method delByIndex
   * @param {int} index 序列值
   * @description 根据index来删除hash
   */
  options.delByIndex = function(index) {
    if (index < 0) return this;

    options.keys.splice(index, 1);
    options.values.splice(index, 1);

    return this;
  };

  /**
   * @method pop
   * @description 移除栈顶的hash，并返回此hash
   */
  options.pop = function() {
    if (!options.keys.length)
      return null;

    /** 移除键值对队列顶部的数据 */
    options.keys.pop();

    return options.values.pop();
  };

  /**
   * @method indexOf
   * @description 查找hash表，返回index
   */
  options.indexOf = function(value) {
    var index = indexOf(value, options.values);

    if (index >= 0)
      return options.keys[index];

    return -1;
  };

  /**
   * @method shift
   * @description 移除栈底的hash，返回此hash
   */
  options.shift = function() {
    if (!options.keys.length) return null;

    options.keys.shift();

    return options.values.shift();
  };

  options.unshift = function(key, value, order) {
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
  };





















  C.Hash = new cCoreInherit.Class({


    //往队列头部插入hash
    unshift: function(k, v, order) {
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
    slice: function(start, end) {
      var keys = this.keys.slice(start, end || null),
        values = this.values.slice(start, end || null),
        obj = {};
      for (var i = 0, l = keys.length; i < l; i++) {
        obj[keys[i]] = values[i];
      }
      return obj;
    },
    //从一个hash中移除一个或多个元素，如果必要，在所移除元素的位置上插入新元素，返回所移除的元素。
    splice: function(start, count) {
      var keys = this.keys.splice(start, count || null),
        values = this.values.splice(start, count || null),
        obj = {};
      for (var i = 0, l = keys.length; i < l; i++) {
        obj[keys[i]] = values[i];
      }
      return obj;
    },
    toString: function() {
      // if (typeof JSON != 'undefined' && JSON.stringify) {
      //     return JSON.stringify(this.valueOf());
      // }
      if (typeof JSON != 'undefined' && JSON.stringify) {
        return JSON.stringify(this.valueOf());
      }
      return typeof this.values;
    },
    filter: function(hander) {
      var list = {};
      if (typeof hander !== 'function') return null;
      for (var i = 0, len = this.keys.length; i < len; i++) {
        if (hander.call(this.values[i], this.values[i], this.keys[i])) list[this.keys[i]] = this.values[i];
      }
      return list;
    },
    each: function(hander) {
      var list = {};
      if (typeof hander !== 'function') return null;
      for (var i = 0, len = this.keys.length; i < len; i++) {
        hander.call(this.values[i], this.values[i], this.keys[i], i);
      }
    },
    valueOf: function() {
      var obj = {};
      for (var i = 0, l = this.keys.length; i < l; i++) {
        obj[this.keys[i]] = this.values[i];
      }
      return obj;
    },

    sortBy: function(handler) {
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