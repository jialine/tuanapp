/**
 * @author cmli@ctrip.com / oxz欧新志 <ouxz@Ctrip.com> / vzyq张有泉 <yq.zhang@Ctrip.com>
 * @class Class类，框架的基础类体系
 * @description Class类，框架的基础类体系
 */
define(['libs'], function(libs) {

  var slice = [].slice;
  var Core = function() {};

  /**
   * @description Class方法，js的继承
   * @param {function} supClass 可选，要继承的类
   * @param {object} subProperty 被创建类的成员
   * @return {function} 被创建的类
   */
  Core.Class = function(supClass, subProperty) {

    if (typeof supClass === 'object') {
      subProperty = supClass;
      supClass = function() {};
    }

    var supProto = supClass.prototype;

    var emptyClass = function() {};
    var newClass = function() {
      this.__propertys__();
      this.initialize.apply(this, arguments);
    };

    emptyClass.prototype = supProto;
    newClass.prototype = new emptyClass();
    newClass.prototype.constructor = supClass;

    var supInitialize = newClass.prototype.initialize || function() {};
    var subInitialize = subProperty.initialize || function() {};

    var sup__propertys__ = newClass.prototype.__propertys__ || function() {};
    var sub__propertys__ = subProperty.__propertys__ || function() {};

    var argslist = /^\s*function\s*\(([^\(\)]*?)\)\s*?\{/i.exec(subInitialize.toString())[1].replace(/\s/i, '').split(',');

    var key = null;
    for (key in subProperty) {
      if(subProperty.hasOwnProperty(key))
        newClass.prototype[key] = subProperty[key];
    }

    /** 初始化方法 */
    if (arguments.length > 0 && arguments[0].prototype && arguments[0].prototype.initialize === supInitialize) {
      newClass.prototype.initialize = function() {
        var scope = this;

        var args = [
          function() {
            supInitialize.apply(scope, arguments);
          }
        ];

        subInitialize.apply(this, args.concat(slice.call(arguments)));
      };
    }

    /** 预设成员定义区 */
    newClass.prototype.__propertys__ = function() {
      sup__propertys__.call(this);
      sub__propertys__.call(this);
    };

    for (key in supClass) {
      if (supClass.hasOwnProperty(key) && key !== 'prototype')
        newClass[key] = supClass[key];
    }

    return newClass;
  };

  /**
   * @description 对象扩展
   * @param {object} 原型对象
   * @param {object} 要继承的对象
   * @returns {boolean}
   */
  Core.extend = function() {
    var args = slice.call(arguments);
    var source = args.shift() || {};

    if (!source) return false;

    for (var i = 0, l = args.length; i < l; i++) {
      if (typeof args[i] === 'object') {
        for (var key in args[i]) {
          source[key] = args[i][key];
        }
      }
    }

    return source;
  };

  /**
   * @description 对原型链的扩充
   * @param {function} fn 构造函数
   * @param {object} propertys 需要補充在原型链上的方法和属性
   * @returns {Function}
   */
  Core.implement = function(fn, propertys) {
    if (typeof fn !== 'function') return false;

    for (var i in propertys) {
      fn.prototype[i] = propertys[i];
    }

    return fn;
  };

  return Core;
});