/**
 * @author cmli@ctrip.com / oxz欧新志 <ouxz@Ctrip.com> / vzyq张有泉 <yq.zhang@Ctrip.com>
 * @class cBase
 * @description 提供框架基本的方法
 */
define(['libs', 'cCoreInherit', 'cCoreDate', 'cCoreHash', 'cBusinessServertime', 'cUtility'],
  function(libs, cCoreInherit, cCoreDate, cCoreHash, cBusinessServertime, util) {

  "use strict";

  /** 兼容处理IE不能使用console的问题  */
  if (typeof console === 'undefined') {
    console = {
      log: function() {},
      error: function() {}
    };
  }

  /** 声明Base作为命名空间 */
  var Base = {};

  /** 委托自cUtility */
  Base.isInApp = util.isInApp;

  /** 委托自cCoreInherit */
  Base.Class = cCoreInherit.Class;
  Base.extend = cCoreInherit.extend;
  Base.implement = cCoreInherit.implement;

  /**
   * @method bind
   * @param {function} fn 需要转换作用域的方法
   * @param {object} obj 对象
   * @param {array} args 数组
   * @description 改变fn的作用域
   * @return {function}
   */
  var slice = [].slice;
  var bind = function(fn, obj, args) {
    args = args || [];
    return function() {
      fn.apply(obj, args.concat(slice.call(arguments)));
    };
  };

  /**
   * @method _toString
   * @param {object} obj 对象
   * @description 将对象打印成string输出
   * @return {string}
   */
  var _toString = function(obj) {
    return Object.prototype.toString.call(obj);
  };

  /**
   * @deprecated
   * @description 2014/1/20 zhoutao 明天排查，如果没有地方引用，直接干掉这个方法

      Base.Type = function(o) {
        return _toString(o);
      };

      (function(Type, types) {
        for (var i = 0; i < types.length; i++) {
          Type['is' + types[i]] = (function(type) {
            return function(obj) {
              return Base.Type(obj) === '[object ' + type + ']'
            };
          })(types[i]);
        }
      })(Base.Type, ['Boolean', 'Object', 'String', 'Number', 'Date', 'Function', 'Array', 'Error', 'RegExp', 'Arguments']);

   */

  Base.Object = new Base.Class({});

  var options = {
    keys: function(obj){
      var keys = [];

      if (typeof obj === 'object') {
        if (typeof Object.keys === 'function') {
          Object.keys(obj);
        }else{
          for (var i in obj) {
            if (obj.hasOwnProperty(i)) keys.push(i);
          }
        }
      }

      return keys;
    }
  };

  /** 向Base.Object对象加入熟悉值 */
  Base.extend(Base.Object, options);

  /**
   * @deprecated
   * @description 委托自cCoreDate
   * @comment 将来需要排查一遍，全部删除，需要移动到cUtility上去
   */
  Base.Date = cCoreDate;

  /**
   * @deprecated
   * @description 哈希对象
   * @comment 2014/1/20 zhoutao 明天排查，如果引用的地方不多，直接移动到cUtility上去
   */
  Base.Hash = cCoreHash.Hash;

  /**
   * @method getInstance
   * @description 实现单例的获得实例的方法
   * @return {object}
   */
  Base.getInstance = function() {
    return this.instance || new this();
  };

  /**
   * @deprecated
   * @description 哈希对象
   * @comment 2014/1/20 zhoutao 明天排查，直接干掉
   */
  window.__at = function() {
    var str = JSON.stringify(arguments);
    alert(str);
  };

  /**
   * @dscsription ： 迁移至 business/c.business.servertime.js
   */
  Base.getServerDate = cBusinessServertime.getServerDate;

  return Base;
});