/**
* @author oxz欧新志 <ouxz@Ctrip.com> / l_wang王磊 <l_wang@Ctrip.com>
* @class cUIEventListener
* @description 用于自建事件机制
*/
define(['libs', 'cBase'], function (libs, cBase) {

  var options = {};

  options.__propertys__ = function () {
    this.__events__ = {};
  };

  /** 相关属性 */
  options.initialize = function (opts) {
  };

  /**
  * @method addEvent
  * @param type {String}        需要添加的事件类型
  * @param handler {function}   对应函数回调
  * @description 添加事件
  */
  options.addEvent = function (type, handler) {
    if (!type || !handler) {
      throw "addEvent Parameter is not complete!";
    }
    var handlers = this.__events__[type] || [];
    handlers.push(handler);
    this.__events__[type] = handlers;
  };

  /**
  * @method removeEvent
  * @param type {String}        移除事件类型
  * @param handler {function}   对应函数回调
  * @description 移除事件
  */
  options.removeEvent = function (type, handler) {
    if (!type) {
      throw "removeEvent parameters must be at least specify the type!";
    }
    var handlers = this.__events__[type], index;
    if (!handlers) return;
    if (handler) {
      for (var i = Math.max(handlers.length - 1, 0); i >= 0; i--) {
        if (handlers[i] === handler) handlers.splice(i, 1);
      }
    } else {
      delete handlers[type];
    }
  };

  /**
  * @method trigger
  * @param type {String}        移除事件类型
  * @param args {Object}   数据参数
  * @param scope {function}   作用域
  * @description 触发事件
  */
  options.trigger = function (type, args, scope) {
    var handlers = this.__events__[type];
    if (handlers) for (var i = 0, len = handlers.length; i < len; i++) {
      typeof handlers[i] === 'function' && handlers[i].apply(scope || this, args);
    }
  };

  return new cBase.Class(options);
});