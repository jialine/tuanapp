define(['libs'], function (libs) {
    
    var slice = [].slice;
    var core = function(){};

    /**
    * Class类，框架的基础类体系
    * @supClass {Function} 可选，要继承的类
    * @subProperty {Object} 被创建类的成员
    * @return {Function} 被创建的类
    */
    core.Class = function (supClass, subProperty) {
        if (typeof supClass === 'object') {
            subProperty = supClass;
            supClass = function () { };
        }
        var supProto = supClass.prototype,
			emptyClass = function () { },
			newClass = function () {
			    this.__propertys__();
			    this.initialize.apply(this, arguments);
			},
			sup__propertys__,
			sub__propertys__,
			supInitialize,
			subInitialize,
			i;
        emptyClass.prototype = supProto;
        newClass.prototype = new emptyClass();
        newClass.prototype.constructor = supClass;
        supInitialize = newClass.prototype.initialize || function () { };
        subInitialize = subProperty.initialize || function () { };
        sup__propertys__ = newClass.prototype.__propertys__ || function () { };
        sub__propertys__ = subProperty.__propertys__ || function () { };
        var argslist = /^\s*function\s*\(([^\(\)]*?)\)\s*?\{/i.exec(subInitialize.toString())[1].replace(/\s/i, '').split(',');
        for (i in subProperty) {
            subProperty.hasOwnProperty(i) && (newClass.prototype[i] = subProperty[i]);
        }
        //初始化方法
        //if (argslist[0] === '$super') {
        if (arguments.length > 0 && arguments[0].prototype && arguments[0].prototype.initialize === supInitialize) {
            newClass.prototype.initialize = function () {
                var self = this,
            args = [function () {
                supInitialize.apply(self, arguments);
            } ];
                subInitialize.apply(this, args.concat(slice.call(arguments)));
            };
        }
        //预设成员定义区
        newClass.prototype.__propertys__ = function () {
            sup__propertys__.call(this);
            sub__propertys__.call(this);
        };
        for (var i in supClass) {
            if (supClass.hasOwnProperty(i) && i !== 'prototype') newClass[i] = supClass[i];
        }
        return newClass;
    }

    /**
    * 对象扩展
    * @param {Object} 任何对象
    * @param {Object}... 要继承的对象
    * @returns {Boolean}
    */
    core.extend = function () {
        var args = slice.call(arguments),
            source = args.shift() || {};
        if (!source) return false;
        for (var i = 0, l = args.length; i < l; i++) {
            if (typeof args[i] === 'object') {
                for (var ii in args[i]) {
                    source[ii] = args[i][ii];
                }
            }
        }
        return source;
    }
    /**
    * 对原型链的扩充
    * @param {Function} fun
    * @para!m {Object} propertys
    * @returns {Function}
    */
    core.implement = function (fun, propertys) {
        if (typeof fun != 'function') return false;
        for (var i in propertys) {
            fun.prototype[i] = propertys[i];
        }
        return fun;
    }	


    return core;
});