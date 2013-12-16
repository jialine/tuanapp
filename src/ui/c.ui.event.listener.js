define(['libs', 'cBase', 'cUICore', ], function (libs, cBase, cUICore) {

  var options = {};

  options.__propertys__ = function () {
    this.__events__ = {};
  };

  options.initialize = function ($super, opts) {
  };

  options.addEvent = function (type, handler) {
    if (!type || !handler) {
      throw "addEvent Parameter is not complete!";
    }
    var handlers = this.__events__[type] || [];
    handlers.push(handler);
    this.__events__[type] = handlers;
  };

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

  options.trigger = function (type, args, scope) {
    var handlers = this.__events__[type];
    if (handlers) for (var i = 0, len = handlers.length; i < len; i++) {
      typeof handlers[i] === 'function' && handlers[i].apply(scope || this, args);
    }
  };

  return new cBase.Class(options);
});