///* File Created: 六月 23, 2013 */

///**
//* CUI框架
//* by ouxingzhi
//*/
//define(['libs', 'cBase', 'cUtility', 'cUIScrollList', 'cWidgetFactory', 'cWidgetGuider'], function (libs, cBase, cUtility, ScrollList, WidgetFactory) {

//    var Guider = WidgetFactory.create('Guider');

//    var _slice = Array.prototype.slice,
//    _push = Array.prototype.push,
//    _toString = Object.prototype.toString;
//    /*
//    * 提供为用户界面的基础函数
//    */
//    //默认配置
//    var config = {
//        /*
//        * 框架内所有生成的元素的id，class都会加上此前缀
//        */
//        prefix: 'cui-'
//    };
//    /**
//    * 设置cui的默认参数
//    * @param name {String} 参数名
//    * @param value {Any Object} 值
//    */
//    var setConfig = function (name, value) {
//        config[name] = value;
//    };
//    /**
//    * 获得元素的在页面中的绝对位置
//    * @param el {Element} 元素对象
//    * @return {Object} 返回元素el在页面中的位置信息
//    * {
//    *   top: 10, //距顶部的像素值
//    *   left: 20 //距左侧的像素值
//    * }
//    */
//    var getElementPos = function (el) {
//        var top = 0,
//        left = 0;
//        do {
//            top += el.offsetTop;
//            left += el.offsetLeft;
//        } while (el = el.offsetParent);
//        return {
//            top: top,
//            left: left
//        };
//    }

//    /**
//    * 获得唯一的id
//    * @param void
//    * @return {String} 唯一的字符串
//    */
//    var getCreateId = (function () {
//        var diviso = new Date().getTime();
//        return function () {
//            return config.prefix + (++diviso);
//        };
//    })();
//    /**
//    * 获得更大的zIndex值，每次调用该函数，都会产生一个更大值的z-index
//    * @param void
//    * @return {Number}
//    */
//    var getBiggerzIndex = (function () {
//        var diviso = parseInt(Math.random() * 10000 + 1000);
//        return function () {
//            return ++diviso;
//        };
//    })();
//    /**
//    * 获得某个元素的最终的样式值
//    */
//    var getCurStyleOfEl = function (el, styleName) {
//        if (document.defaultView && document.defaultView.getComputedStyle) {
//            return document.defaultView.getComputedStyle(el).getPropertyValue(styleName);
//        } else if (el.currentStyle) {
//            var sec = styleName.split('-'),
//            cen = [],
//            arr;
//            for (var i = 0; i < sec.length; i++) {
//                if (i == 0) {
//                    cen.push(sec[i]);
//                } else {
//                    arr = sec[i].split('');
//                    arr[0] = arr[0].toUpperCase();
//                    cen.push(arr.join(''));
//                }
//            }
//            cen = cen.join('');
//            return el.currentStyle[cen];
//        }
//    };
//    var bindthis = function (fun, obj) {
//        return function () {
//            fun.apply(obj, arguments);
//        };
//    };
//    //private 安全的将字符串转换为数字
//    var strToNum = function (str) {
//        var num = parseInt(str.replace(/[a-z]/i, ''));
//        return isNaN(num) ? 0 : num;
//    }
//    /**
//    * 获得元素占位的高宽
//    */
//    var getElementRealSize = function (el) {
//        var $el = $(el);
//        return {
//            width: $el.width(),
//            height: $el.height()
//        };
//    };
//    /**
//    * 获得屏幕的显示高宽
//    * @return {Object} 返回包含高宽的对象
//    */
//    var getPageSize = function () {
//        var width = Math.max(document.documentElement.scrollWidth, document.body.scrollWidth),
//        height = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
//        return {
//            width: width,
//            height: height
//        };
//    };
//    /**
//    * 获得窗口滚动条的位置
//    * @return {
//    *   left: 页面滚动条所在x轴位置
//    *   top: 页面滚动条y轴位置
//    *   height: 窗口高度
//    *   width: 窗口宽度
//    *   pageWidth: 页面实际宽度
//    *   pageHeight: 页面实际高度
//    * }
//    */
//    var getPageScrollPos = function () {
//        var left = Math.max(document.documentElement.scrollLeft, document.body.scrollLeft),
//			top = Math.max(document.documentElement.scrollTop, document.body.scrollTop),
//			height = Math.min(document.documentElement.clientHeight, document.body.clientHeight),
//            width = Math.min(document.documentElement.clientWidth, document.body.clientWidth),
//            pageWidth = Math.max(document.documentElement.scrollWidth, document.body.scrollWidth),
//            pageHeight = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
//        return {
//            top: top,
//            left: left,
//            height: height,
//            width: width,
//            pageWidth: pageWidth,
//            pageHeight: pageHeight
//        };
//    };
//    var getMousePos = function (event) {
//        var top = Math.max(document.body.scrollTop, document.documentElement.scrollTop),
//            left = Math.max(document.body.scrollLeft, document.documentElement.scrollLeft);
//        return {
//            top: top + event.clientY,
//            left: left + event.clientX
//        };
//    };
//    /**
//    * 获得event在元素上的位置
//    * @param {Object Event} 时间对象
//    * @param {Object Element} 元素对象
//    */
//    var getMousePosOfElement = function (event, el) {
//        var mpos = getMousePos(event),
//            pos = getElementPos(el),
//            w = el.clientWidth,
//            h = el.clientHeight;
//        var x = mpos.left - pos.left,
//            y = mpos.top - pos.top;
//        x = x < 0 ? 0 : (x > w ? w : x);
//        y = y < 0 ? 0 : (y > h ? h : y);
//        return {
//            x: x,
//            y: y
//        };
//    };

//    /**
//    * 便捷创建元素方法
//    * @method CUI.Tools.createElement
//    * @singleton
//    * @param tag {String} 标签名称
//    * @param attr {Object} 可选 属性
//    * @param styles {Object} 可选 样式
//    * @param html {String} 可选 内容
//    */
//    var createElement = function (tag, options) {
//        var el = document.createElement(tag), i, t
//        if (options) for (i in options) {
//            switch (i) {
//                case 'attr':
//                    if (typeof options[i] === 'object') for (t in options[i]) {
//                        if (options[i][t] != null) el.setAttribute(t, options[i][t]);
//                    }
//                    break;
//                case 'styles':
//                    if (typeof options[i] === 'object') for (t in options[i]) {
//                        if (options[i][t] != null) el.style[t] = options[i][t];
//                    }
//                    break;
//                case 'id':
//                    el.id = options[i];
//                    break;
//                case 'class':
//                    el.className = options[i];
//                    break;
//                case 'html':
//                    el.innerHTML = options[i];
//                    break;
//            }
//        }


//        return el;
//    }
//    /**
//    * @class CUI.Ext
//    * @singleton
//    */
//    var Tools = {
//        getElementPos: getElementPos,
//        getCreateId: getCreateId,
//        getBiggerzIndex: getBiggerzIndex,
//        getPageSize: getPageSize,
//        getPageScrollPos: getPageScrollPos,
//        getCurStyleOfEl: getCurStyleOfEl,
//        getElementRealSize: getElementRealSize,
//        getMousePosOfElement: getMousePosOfElement,
//        getMousePos: getMousePos,
//        createElement: createElement
//    };



//    /**
//    * @class CUI.HashObserve
//    * @author ouxingzhi
//    * HashObserve 页面中单个ui组件弹出时,添加hash值，监控下回hashchange事件触发时，添加的hash是否还存在，不存在则调用callback
//    */
//    var HashObserve = new cBase.Class({
//        __propertys__: function () {
//            /**
//            * @cfg {String} 要观察的hash值，可以为正则表达式
//            */
//            this.hash;
//            /**
//            * @cfg {Function} 但hash消失时执行的回调
//            */
//            this.callback;
//            // private hashchange事件处理过程
//            this._hashchange = bindthis(function () {
//                this.hashchange();
//            }, this);
//            //是否已经结束
//            this.isend = true;
//            //回调的执行上下文
//            /**
//            * @cfg {Object} callback回调时的上下文设置
//            */
//            this.scope;
//        },
//        initialize: function (options) {
//            this.setOption(options);
//        },
//        setOption: function (options) {
//            var allowOptions = { hash: true, callback: true, scope: true };
//            for (var i in options) {
//                switch (true) {
//                    case allowOptions[i]:
//                        this[i] = options[i];
//                        break;
//                }
//            }
//        },
//        /**
//        * 启动监听hash变化
//        */
//        start: function () {
//            this.isend = false;
//            window.location.hash += '|' + this.hash;
//            $(window).bind('hashchange', this._hashchange);
//        },
//        /**
//        * 结束监听hash变化
//        */
//        end: function () {
//            $(window).unbind('hashchange', this._hashchange);
//            if (!this.isend) {
//                this.isend = true;
//                window.history.go(-1);
//            }
//        },
//        // private
//        hashchange: function () {
//            var hash = window.location.hash;
//            if (!hash.match(new RegExp('\\b' + this.hash + '\\b', 'ig'))) {
//                this.isend = true;
//                this.callback.call(this.scope || this);
//                this.end();
//            }
//        }
//    });

//    /**
//    * @class EventListener
//    * 提供事件的支持
//    * @author ouxingzhi
//    *
//    */
//    var EventListener = new cBase.Class({
//        __propertys__: function () {
//            this.__events__ = {};
//        },
//        initialize: function () {

//        },
//        /**
//        * 添加一个事件
//        * @param type {String} 添加事件类型
//        * @param handler {Function} 事件名对应事件句柄
//        */
//        addEvent: function (type, handler) {
//            if (!type || !handler) {
//                throw "addEvent Parameter is not complete!";
//            }
//            var handlers = this.__events__[type] || [];
//            handlers.push(handler);
//            this.__events__[type] = handlers;
//        },
//        /**
//        * 移除一个事件
//        * @param type {String} 要删除的事件类型
//        * @param handler {Function} 可选，如果填写此参数，则只移除type对应的handler时间句柄，如果不填写，则删除type指定的所有事件句柄
//        */
//        removeEvent: function (type, handler) {
//            if (!type) {
//                throw "removeEvent parameters must be at least specify the type!";
//            }
//            var handlers = this.__events__[type], index;
//            if (!handlers) return;
//            if (handler) {
//                for (var i = Math.max(handlers.length - 1, 0); i >= 0; i--) {
//                    if (handlers[i] === handler) handlers.splice(i, 1);
//                }
//            } else {
//                delete handlers[type];
//            }
//        },
//        /**
//        * 触发一个事件
//        * @param type {String} 要触发的事件类型
//        */
//        trigger: function (type, args, scope) {
//            var handlers = this.__events__[type];
//            if (handlers) for (var i = 0, len = handlers.length; i < len; i++) {
//                typeof handlers[i] === 'function' && handlers[i].apply(scope || this, args);
//            }
//        }
//    });

//    /**
//    * @class CUI.AbstractView
//    * 抽象view类，提供最基础的事件机制和显示隐藏
//    * 所有的cui中的大部分的view继承了这个类，继承此类时要实现createHtml方法，这个方法必须返回一个{String|Element|jQuery}对象
//    * @author ouxingzhi
//    * @version 0.1
//    */
//    var AbstractView = new cBase.Class({
//        //类成员定义
//        __propertys__: function () {
//            //允许设置的事件
//            this.allowEvents = {
//                onCreate: true,
//                onShow: true,
//                onHide: true
//            };
//            //允许push添加的属性
//            this.allowsPush = {
//                classNames: true
//            },
//            //允许添加的属性
//                this.allowsConfig = {
//                    rootBox: true
//                };
//            this.events = {
//                onCreate: [],
//                onShow: [],
//                onHide: []
//            };
//            //状态
//            this.status = AbstractView.STATE_NOTCREATE;
//            //参数处理器
//            this.setOptionHander = [];
//            /**
//            * @cfg {jQuery|Element} 所属容器，一个要放置当前组件的容器，默认值为body
//            */
//            this.rootBox;
//            //唯一的id
//            this.id = getCreateId();
//            /**
//            * @cfg {String} 设置当前组件的className
//            */
//            this.classNames = [config.prefix + 'view'];
//            /**
//            * @cfg {jQuery|Element} 当前组件的根元素
//            * 每个元素在onCreate事件触发之前都会自动生成一个唯一的root元素
//            */
//            this.root;
//            //是否创建
//            this.isCreate = false;
//        },
//        initialize: function (options) {
//            this.setOption(function (k, v) {
//                switch (true) {
//                    case this.allowEvents[k]:
//                        this.addEvent(k, v);
//                        break;
//                    case this.allowsPush[k]:
//                        _toString.call(v) === '[object Array]' ? _push.apply(this[k], v) : this[k].push(v);
//                        break;
//                    case this.allowsConfig[k]:
//                        this[k] = v;
//                        break;
//                }
//            });
//            this.readOption(options);
//        },
//        readOption: function (options) {
//            cUtility.each(options, function (k, v) {
//                cUtility.each(this.setOptionHander, function (fk, fun) {
//                    if (typeof fun === 'function')
//                        fun.call(this, k, v);
//                }, this);
//            }, this);
//        },
//        setOption: function (fun) {
//            this.setOptionHander.push(fun);
//        },
//        //创建根元素
//        createRoot: function () {
//            var root = document.createElement('div');
//            root.className = this.classNames.join(' ');
//            root.id = this.id;
//            return $(root);
//        },
//        /**
//        * 给当前组件添加一个className
//        */
//        addClass: function (cls) {
//            this.classNames.push(cls);
//            if (this.root)
//                this.root[0].className = this.classNames.join(' ');
//        },
//        /**
//        * 给当前组件删除一个className
//        */
//        removeClass: function (cls) {
//            cUtility.deleteValue(cls, this.classNames);
//            if (this.root)
//                this.root.removeClass(cls);
//        },
//        /**
//        * @abstract
//        * 抽象方法,所有的view都需要实现此方法，子类实现此方法需返回一个{String|Element|jQuery}
//        */
//        createHtml: function () {
//            throw new Error('未定义createHtml方法');
//        },
//        /**
//        * 设置当前组件的内容
//        */
//        setRootHtml: function (html) {
//            this.root && (this.root.empty(), this.root.append(html));
//        },
//        /**
//        * 获得当前组件的root节点
//        */
//        getRoot: function () {
//            return this.root;
//        },
//        /**
//        * 添加一个时间类型
//        * @param {String} 要添加的时间名称
//        */
//        addEventType: function (type) {
//            this.allowEvents[type] = true;
//            this.events[type] = [];
//        },
//        /**
//        * 添加一个事件
//        * @method addEvent
//        * @param {String} 事件名称
//        * @param {Function} 事件句柄
//        */
//        addEvent: function (type, fun) {
//            if (!this.allowEvents[type])
//                return false;
//            this.events[type] && this.events[type].push(fun);
//        },
//        /**
//        * 删除一个事件
//        * @method removeEvent
//        * @param {String} 事件名称
//        * @param {Function} 事件句柄 可选，如果不填，则删除掉所有type指定的所有事件
//        */
//        removeEvent: function (type, fun) {
//            if (this.events[type]) {
//                if (fun) {
//                    deleleValue(fun, this.events[type]);
//                } else {
//                    this.events[type] = [];
//                }
//            }
//        },
//        /**
//        * 删除当前组件
//        * @method remove
//        */
//        remove: function () {
//            this.hide();
//            this.root.remove();
//        },
//        /**
//        * 触发某个事件
//        * @method trigger
//        * @param {String} 要触发的事件名称
//        * @param {Array} 要传递给事件句柄的参数
//        */
//        trigger: function (type, args) {
//            var results = [],
//                i;
//            if (this.events[type]) {
//                args = args || [];
//                for (i = 0; i < this.events[type].length; i++) {
//                    results[results.length] = this.events[type][i].apply(this, args);
//                }
//            }
//            return results;
//        },
//        /**
//        * 创建根元素
//        * @method create
//        * 这个方法执行会触发onCreate事件
//        */
//        create: function () {
//            if (!this.isCreate && this.status !== AbstractView.STATE_ONCREATE) {
//                this.rootBox = this.rootBox || $('body');
//                this.root = this.createRoot();
//                this.root.hide();
//                this.rootBox.append(this.root);
//                this.root.append(this.createHtml());
//                //this.root.html();
//                this.trigger('onCreate');
//                this.status = AbstractView.STATE_ONCREATE;
//                this.isCreate = true;
//            }
//        },
//        /**
//        * 模板工具方法
//        * @method template
//        * @param {String} 要传的html代码
//        * @return {Function} 一个模板方法
//        */
//        template: function (html) {
//            return _.template(html);
//        },
//        /**
//        * 可重写，重写它对自定义转场动画的支持
//        * @method showAction
//        * @param {Function} show动作执行完毕时应该执行的方法，用于触发组件的内部事件，在重写showAction方法时，务必在动画执行完毕后调用此方法。
//        */
//        showAction: function (callback) {
//            this.root.show();
//            callback();
//        },
//        /**
//        * 可重写，完成对转场动画的支持
//        * @method hideAction
//        * @param {Function} hide动作执行完毕时应该执行的方法，用于触发组件的内部事件，在重写hideAction方法时，务必在动画执行完毕后调用此方法。
//        */
//        hideAction: function (callback) {
//            this.root.hide();
//            callback();
//        },
//        /**
//        * 将当前的控件显示在最上面
//        * @method setzIndexTop
//        */
//        setzIndexTop: function (offset) {
//            offset = typeof offset !== 'number' ? 0 : offset;
//            this.root.css('z-index', getBiggerzIndex() + offset);
//        },
//        /**
//        * 组件是否未创建
//        * @method isNotCreate
//        */
//        isNotCreate: function () {
//            return this.status === AbstractView.STATE_NOTCREATE;
//        },
//        /**
//        * 组件是否处于显示状态
//        * @method isShow
//        */
//        isShow: function () {
//            return this.status === AbstractView.STATE_ONSHOW;
//        },
//        /**
//        * 组件是否处于隐藏状态
//        * @method isHide
//        */
//        isHide: function () {
//            return this.status === AbstractView.STATE_ONHIDE;
//        },
//        /**
//        * 显示控件
//        * @method show
//        * @param callback {Function} 显示操作完的回调函数
//        */
//        show: function (callback) {
//            if (this.status === AbstractView.STATE_ONSHOW)
//                return;
//            this.create();
//            this.showAction(bindthis(function () {
//                this.trigger('onShow');
//                this.status = AbstractView.STATE_ONSHOW;
//                callback && callback.call(this);
//            }, this));
//        },
//        /**
//        * 隐藏控件
//        * @method hide
//        * @param callback {Function} 隐藏操作完的回调函数
//        */
//        hide: function (callback) {
//            if (!this.root || this.status === AbstractView.STATE_ONHIDE) return;
//            this.hideAction(bindthis(function () {
//                this.trigger('onHide');
//                this.status = AbstractView.STATE_ONHIDE;
//                callback && callback.call(this);
//            }, this));
//        }
//    });
//    /**
//    * @singleton
//    * 组件状态,未创建
//    */
//    AbstractView.STATE_NOTCREATE = 'notCreate';
//    /**
//    * @singleton
//    * 组件状态,已创建但未显示
//    */
//    AbstractView.STATE_ONCREATE = 'onCreate';
//    /**
//    * @singleton
//    * 组件状态,已显示
//    */
//    AbstractView.STATE_ONSHOW = 'onShow';
//    /**
//    * @singleton
//    * 组件状态,已隐藏
//    */
//    AbstractView.STATE_ONHIDE = 'onHide';
//    /**
//    * 遮罩层
//    * @class CUI.Mask
//    * @extends CUI.AbstractView
//    */
//    var Mask = new cBase.Class(AbstractView, {
//        __propertys__: function () {
//            this.showTotal = 0;
//            var _show = this.show,
//                _hide = this.hide;
//            this.show = function () {
//                _show.call(this);
//                this.showTotal++;
//            }
//            this.hide = function () {
//                this.showTotal--;
//                if (this.showTotal > 0)
//                    return;
//                _hide.call(this);

//            };
//        },
//        initialize: function ($super, options) {
//            this.bindEvent();
//            this.addClass(config.prefix + 'mask');
//            $super(options);
//        },
//        bindEvent: function () {
//            this.addEvent('onCreate', function () {
//                this.setRootStyle();
//                this.onResize = bindthis(function () {
//                    this.resize();
//                }, this);
//                this.onResize();
//                var touchhandler = function (e) {
//                    e.preventDefault();
//                    return false;
//                };
//                this.root.bind('touchstart', touchhandler);
//                this.root.bind('touchmove', touchhandler);
//                this.root.bind('touchend', touchhandler);
//            });
//            this.addEvent('onShow', function () {
//                this.setzIndexTop(-1);
//                $(window).bind('resize', this.onResize);
//                this.onResize();
//            });
//            this.addEvent('onHide', function () {
//                $(window).unbind('resize', this.onResize);
//            });
//        },
//        createHtml: function () {
//            return '<div></div>';
//        },
//        setRootStyle: function () {
//            this.root.css({
//                position: 'absolute',
//                left: '0px',
//                top: '0px'
//            });
//        },
//        resize: function () {
//            this.root.css({
//                width: 'auto',
//                height: 'auto'
//            })
//            var size = getPageSize();
//            this.root.css({
//                width: size.width + 'px',
//                height: size.height + 'px'
//            })
//        }
//    });
//    var globalMask = new Mask(),
//        opacityMask = new Mask({
//            classNames: [config.prefix + 'opacitymask']
//        });

//    /**
//    * 弹层
//    */
//    var Layer = new cBase.Class(AbstractView, {
//        __propertys__: function () {
//            this.tpl = this.template([
//                            '<div class="' + config.prefix + 'layer-padding">',
//                            '<div class="' + config.prefix + 'layer-content"><%=content%></div>',
//                            '</div>'
//                        ].join(''));
//            this.content = '';
//            this.contentDom;
//            this.mask = opacityMask;
//            this.addClass(config.prefix + 'layer');
//            this.viewdata = {};
//            this.windowResizeHander;
//            this.setIntervalResource;
//            this.setIntervalTotal = 0;
//        },
//        initialize: function ($super, options) {
//            var allowConfig = {
//                content: true
//            };
//            this.setOption(function (k, v) {
//                switch (true) {
//                    case allowConfig[k]:
//                        this[k] = v;
//                        break;
//                    case 'class' === k:
//                        this.addClass(v);
//                        break;
//                }
//            });

//            this.bindEvent();
//            $super(options);
//            this.loadViewData();
//        },
//        loadViewData: function () {
//            this.viewdata.content = this.content;
//        },
//        setViewData: function (data) {
//            this.viewdata = cUtility.mix(this.viewdata, data);
//            this.setRootHtml(this.createHtml());
//        },
//        bindEvent: function () {
//            this.addEvent('onCreate', function () {
//                this.windowResizeHander = bindthis(this.reposition, this);
//                this.contentDom = this.root.find('.' + config.prefix + 'layer-content');
//            });
//            this.addEvent('onShow', function () {
//                this.mask.show();
//                $(window).bind('resize', this.windowResizeHander);
//                this.root.css('visibility', 'hidden');
//                this.reposition();
//                //显示以后，连续计算位置
//                this.setIntervalResource = setInterval($.proxy(function () {
//                    if (this.setIntervalTotal < 10) {
//                        this.windowResizeHander();
//                    } else {
//                        this.setIntervalTotal = 0;
//                        this.root.css('visibility', 'visible');
//                        clearInterval(this.setIntervalResource);
//                    }
//                    this.setIntervalTotal++;
//                }, this), 1);
//                this.setzIndexTop();
//            });
//            this.addEvent('onHide', function () {
//                $(window).unbind('resize', this.windowResizeHander);
//                clearInterval(this.setIntervalResource);
//                this.root.css('visibility', 'visible');
//                this.mask.hide();
//            });
//        },
//        //重写createHtml方法
//        createHtml: function () {
//            return this.tpl(this.viewdata);
//        },
//        reposition: function () {
//            var size = getElementRealSize(this.root);
//            this.root.css({
//                'margin-left': -(size.width / 2) + 'px',
//                'margin-top': -(size.height / 2) + 'px'
//            });
//        }
//    });
//    /**
//    * 一个显示层，用于放置各种控件
//    */
//    var PageView = new cBase.Class(AbstractView, {
//        __propertys__: function () { },
//        initialize: function ($super, options) {
//            var allowOptions = {};
//            this.setOption(function (k, v) { });
//            this.addClass(config.prefix + 'pageview');
//            $super(options);
//        },
//        createHtml: function () {
//            return '';
//        }
//    });

//    /**
//    * 弹出框
//    */
//    var Alert = new cBase.Class(AbstractView, {
//        __propertys__: function () {
//            // this.tpl = this.template([
//            //                 '<div class="' + config.prefix + 'alert-padding">',
//            //                 '<h2 class="' + config.prefix + 'alert-title"><%=title%></h2>',
//            //                 '<div class="' + config.prefix + 'alert-content"><%=message%></div>',
//            //                 '<div class="' + config.prefix + 'alert-buttons"></div>',
//            //                 '</div>'
//            //             ].join(''));
//            this.tpl = this.template([
//                '<div class="cui-pop-box">',
//                  '<div class="cui-bd">',
//                    '<p class="cui-error-tips"><%=message%></p>',
//                    '<div class="cui-roller-btns">',
//                    '</div>',
//                  '</div>',
//                '</div>'
//              ].join(''));
//            this.title = '';
//            this.message = '';
//            this.buttons = [{
//                text: '确定',
//                type: 'confirm',
//                click: function () {
//                    this.hide();
//                }
//            }];
//            this.hashObserve = new HashObserve({
//                hash: this.id,
//                scope: this,
//                callback: function () {
//                    this.hide();
//                }
//            });
//            this.viewdata = {
//                title: '',
//                message: ''
//            };
//            this.autoPositionHander = $.proxy(function () {
//                this.reposition();
//            }, this);
//        },
//        initialize: function ($super, options) {
//            var allowOptions = {
//                title: true,
//                message: true,
//                buttons: true
//            };
//            this.setOption(function (k, v) {
//                switch (true) {
//                    case allowOptions[k]:
//                        this[k] = v;
//                        break;
//                }
//            });
//            this.addClass(config.prefix + 'alert');
//            this.buildEvent();
//            $super(options);
//            this.buildViewData();
//        },
//        buildEvent: function () {
//            this.addEvent('onCreate', function () {
//                this.loadButtons();
//            });
//            this.addEvent('onShow', function () {
//                this.reposition();
//                opacityMask.show();
//                this.setzIndexTop();
//                this.hashObserve.start();
//                this.autoposition();
//            });
//            this.addEvent('onHide', function () {
//                opacityMask.hide();
//                setTimeout(bindthis(function () {
//                    this.hashObserve.end();
//                }, this), 10);
//                this.unautoposition();
//            });
//        },
//        buildViewData: function () {
//            this.viewdata.title = this.title;
//            this.viewdata.message = this.message;
//        },
//        setViewData: function (data) {
//            data.title && (this.title = data.title);
//            data.message && (this.message = data.message);
//            data.buttons && (this.buttons = data.buttons);
//            this.buildViewData();
//            this.setRootHtml(this.createHtml());
//            this.loadButtons();
//        },
//        loadButtons: function () {
//            if (!this.root) this.create();
//            // var btuBox = this.root.find('.' + config.prefix + 'alert-buttons');
//            var btnBox = this.root.find('.cui-roller-btns');
//            var btus = this.createButtons();
//            btnBox.empty();
//            cUtility.each(btus, function (k, v) {
//                btnBox.append(v);
//            });
//        },
//        createButtons: function () {
//            var btns = [],
//                isarr = _toString.call(this.buttons) === '[object Array]',
//                i = 0;
//            cUtility.each(this.buttons, function (k, v) {
//                var text = '',
//                // cls = [config.prefix + 'alert-button'],
//                    cls = [],
//                    click = function () { };
//                if (isarr) {
//                    text = v.text;
//                    v.cls && cls.push(v.cls);
//                    v.type = v.type ? v.type : (text == '取消' ? Alert.STYLE_CANCEL : Alert.STYLE_CONFIRM);
//                    switch (v.type) {
//                        case Alert.STYLE_CANCEL:
//                            cls.push('cui-btns-cancel');
//                            break;
//                        case Alert.STYLE_CONFIRM:
//                            cls.push('cui-btns-sure');
//                            break;
//                    };

//                    v.click && (click = v.click);
//                } else {
//                    text = k;
//                    typeof v === 'function' && (click = v);
//                }
//                // btus[i] = $('<input type="button" value="' + text + '">');
//                btns[i] = $('<div class="cui-flexbd ' + cls.join(' ') + '">' + text + '</div>');
//                btns[i].addClass(cls.join(' '));
//                btns[i].bind('click', bindthis(click, this));
//                i++;
//            }, this);
//            return btns;
//        },
//        createHtml: function () {
//            return this.tpl(this.viewdata);
//        },
//        autoposition: function () {
//            $(window).bind('resize', this.autoPositionHander);
//        },
//        unautoposition: function () {
//            $(window).unbind('resize', this.autoPositionHander);
//        },
//        reposition: function () {
//            var size = getElementRealSize(this.root);
//            this.root.css({
//                'margin-left': -(size.width / 2) + 'px',
//                'margin-top': -(size.height / 2) + 'px'
//            });
//        }
//    });
//    Alert.STYLE_CONFIRM = 'confirm';
//    Alert.STYLE_CANCEL = 'cancel';

//    /**
//    * Select框
//    */
//    var Select = new cBase.Class(AbstractView, {
//        __propertys__: function () {
//            //常量定义
//            this.CLASS_ORIGINSELECT = config.prefix + 'originselect';
//            this.CLASS_ORIGINSELECT_CONTENT = config.prefix + 'originselect-content';
//            this.CLASS_ORIGINSELECT_PADDING = config.prefix + 'originselect-padding';
//            this.CLASS_ORIGINSELECT_FULLSCREEN = config.prefix + 'select-fullscreen';
//            this.CLASS_ORIGINSELECT_DEPEND = config.prefix + 'select-depend';
//            this.CLASS_ORIGINSELECT_FIXED_TITLE = config.prefix + 'originselect-fixed-title';
//            this.CLASS_ORIGINSELECT_TITLE_BOX = config.prefix + 'select-title-box';
//            this.CLASS_ORIGINSELECT_TITLE = config.prefix + 'select-title';
//            this.CLASS_ORIGINSELECT_TITLE_LEFTBACK = config.prefix + 'select-title-leftback';
//            this.CLASS_OPTION = config.prefix + 'option';
//            this.CLASS_SELECT_TITLE = config.prefix + 'select-title';
//            this.CLASS_SELECTED = config.prefix + 'option-selected';

//            this.tpl = this.template([
//				'<div class="' + this.CLASS_ORIGINSELECT_PADDING + '">',
//				'</div>'
//			].join(''));
//            this.itemTpl = this.template([
//				'<div class="<%=cls%>" data-value="<%=value%>"><%=title%></div>'
//			].join(''));
//            this.addClass(this.CLASS_ORIGINSELECT);
//            //加入一种事件类型
//            this.addEventType('onChange');
//            //select dom元素
//            this.select;
//            //select option dom元素
//            this.options;
//            /** 固定显示层 **/
//            this.fixedTitleDom;
//            /** 外部标题相关属性 **/
//            //全屏情况的标题
//            this.title;
//            //title最外层dom
//            this.titleBoxDom;
//            //标题dom
//            this.titleDOM;
//            //返回按键dom
//            this.titleLeftBackDom;
//            /****************/
//            //外部模拟的select框
//            this.originSelect;
//            //外部模拟的select框的内容区
//            this.originSelectContent;
//            //当前值
//            this.currentOption = [];
//            //模式,默认为全屏
//            this.mode = Select.MODE_FULLSCREEN;
//            //数据
//            this.data;
//            //依附模式下，被依附的元素
//            this.depend;
//            //依附模式下，被依附的位置
//            this.dependdir;
//            //是否是多选框
//            this.multiple;
//            //偏移值
//            this.offset;
//            //根容器
//            this.rootBox = $('body');
//            //标题预处理函数
//            this.protitlehandler = function (text) {
//                return text;
//            };
//            //指明select是否生成
//            this.isCreateSelect = false;
//            this.autocreate = false;
//            this.hashObserve = new HashObserve({
//                hash: this.id,
//                callback: function () {
//                    this.hide();
//                },
//                scope: this
//            })
//            //window发生变化时的调用句柄
//            this.windowResizeHander = function () { };
//        },
//        initialize: function ($super, options) {
//            var allowOptions = {};
//            this.setOption(function (k, v) {
//                switch (k) {
//                    case 'select':
//                        this.select = typeof v === 'string' ? this.rootBox.find(v) : v;
//                        break;
//                    case 'data':
//                    case 'mode':
//                    case 'dependdir':
//                    case 'width':
//                    case 'title':
//                    case 'multiple':
//                    case 'offset':
//                    case 'rootBox':
//                    case 'autocreate':
//                    case 'protitlehandler':
//                        this[k] = v;
//                        break;
//                    case 'depend':
//                        this[k] = this.rootBox.find(v);
//                        break;
//                }
//            });
//            $super(options);
//            this.buildEvent();
//            if (this.autocreate) this.create();
//        },
//        isCurrentOption: function (option) {
//            return cUtility.indexOf(option, this.currentOption) !== -1;
//        },
//        insertCurrentOption: function (option, isclear) {
//            if (!this.isCurrentOption(option)) {
//                if (isclear) this.currentOption = [];
//                this.currentOption.push(option);
//            }
//        },
//        delCurrentOpiton: function (option) {
//            cUtility.deleteValue(option, this.currentOption);
//        },
//        buildEvent: function () {
//            this.addEvent('onCreate', this.onCreate);
//            this.addEvent('onShow', this.onShow);
//            this.addEvent('onHide', this.onHide);
//        },
//        createDom: function () {
//            if (!this.select) {
//                this.isCreateSelect = true;
//                this.select = $(createElement('select'));
//            }
//            var self = this, originOptions = [];
//            this.currentOption.length = 0;
//            if (this.data) this.setData(this.data, true);
//            this.options = this.select.find('option');
//            this.multiple = this.multiple || this.select.attr('multiple');
//            if (this.multiple) this.select.attr('multiple', 'multiple');
//            this.options.each(function (k, v) {
//                var cls = [self.CLASS_OPTION];
//                if (this.selected) {
//                    cls.push(self.CLASS_SELECTED);
//                    self.currentOption.push(this);
//                }
//                originOptions.push(self.itemTpl({ value: this.value, title: self.protitlehandler(this.text, this), cls: cls.join(' ') }));
//            });
//            this.originSelect = $('<div class="' + this.CLASS_ORIGINSELECT_PADDING + '"></div>');
//            if (this.mode === Select.MODE_FULLSCREEN) {
//                this.fixedTitleDom = $('<div class="' + this.CLASS_ORIGINSELECT_FIXED_TITLE + '"></div>');
//                if (!this.isCreateSelect) {
//                    this.select.next('.' + this.CLASS_ORIGINSELECT_FIXED_TITLE).remove();
//                    this.select.after(this.fixedTitleDom);
//                    this.select.hide();
//                }
//            }
//            if (this.mode === Select.MODE_FULLSCREEN && this.title) {

//                this.titleBoxDom = $([
//                    '<div class="' + this.CLASS_ORIGINSELECT_TITLE_BOX + '">',
//                        '<div class="' + this.CLASS_ORIGINSELECT_TITLE_LEFTBACK + '"><span class="returnico"></span></div>',
//                        '<div class="' + this.CLASS_ORIGINSELECT_TITLE + '"></div>',
//                    '</div>'
//                ].join(''));
//                this.titleDOM = this.titleBoxDom.find('.' + this.CLASS_ORIGINSELECT_TITLE);
//                this.titleLeftBackDom = this.titleBoxDom.find('.' + this.CLASS_ORIGINSELECT_TITLE_LEFTBACK);
//                if (typeof this.title === 'string') {
//                    this.titleDOM.html(this.title);
//                } else if (typeof this.title === 'function') {
//                    this.titleDOM.html(this.title());
//                }
//                if (this.titleDOM) this.originSelect.append(this.titleBoxDom);
//            }

//            this.originSelectContent = $('<div class="' + this.CLASS_ORIGINSELECT_CONTENT + '"></div>');
//            this.originSelect.append(this.originSelectContent);
//            this.originSelectContent.append(originOptions.join(''));
//            return this.originSelect;
//        },
//        getSize: function () {
//            return this.select.size;
//        },
//        setData: function (data, noupdate) {
//            var option, d, box;
//            if (data) {
//                this.select.empty();
//                for (var i = 0; i < data.length; i++) {
//                    d = data[i];
//                    if (d.title != undefined && d.value != undefined) {
//                        option = createElement('option', {
//                            attr: {
//                                value: d.value,
//                                selected: d.selected ? 'true' : null
//                            },
//                            html: d.title
//                        });
//                        this.select.append(option);
//                    }
//                }
//                if (!noupdate && option) {
//                    this.update();
//                }
//            }
//        },
//        buildSelectEvent: function () {
//            var self = this;
//            this.root.find('.' + this.CLASS_OPTION).bind('click', function () {
//                var $this = $(this);
//                if (self.multiple) {
//                    if ($this.hasClass(self.CLASS_SELECTED)) {
//                        self.unsetValue($this.data('value'));
//                    } else {
//                        self.setValue($this.data('value'));
//                    }
//                } else {
//                    self.setValue($this.data('value'));
//                    setTimeout(function () {
//                        self.hide();
//                    }, 100);
//                }
//            });
//            if (this.mode === Select.MODE_FULLSCREEN && this.title) {
//                this.titleLeftBackDom.bind('click', $.proxy(function () {
//                    this.hide();
//                }, this));
//            }
//            if (this.mode === Select.MODE_FULLSCREEN) {
//                this.fixedTitleDom.bind('click', $.proxy(function () {
//                    this.show();
//                }, this));
//            }
//        },
//        createHtml: function () {
//            return this.createDom();
//        },
//        buildTitle: function () {
//            var value = this.getValue(), title = [];
//            for (var i = 0, len = value.length; i < len; i++) {
//                title.push(value[i].title);
//            }
//            this.fixedTitleDom && this.fixedTitleDom.html(title.join(','));
//        },
//        onCreate: function () {
//            this.buildSelectEvent();
//            this.hide();
//            this.windowResizeHander = bindthis(this.position, this);
//            this.buildTitle();
//        },

//        onShow: function () {
//            this.position();
//            $(window).bind('resize', this.windowResizeHander);
//            this.setzIndexTop();
//            if (this.mode === Select.MODE_FULLSCREEN) {
//                this.hashObserve.start();
//            }
//        },
//        onHide: function () {
//            $(window).unbind('resize', this.windowResizeHander);
//            if (this.mode === Select.MODE_FULLSCREEN) {
//                this.hashObserve.end();
//            }
//        },
//        position: function () {
//            switch (this.mode) {
//                case Select.MODE_FULLSCREEN:
//                    this.setFullScreen();
//                    break;
//                case Select.MODE_DEPEND:
//                    this.setDepend();
//                    break;
//            }
//        },
//        setFullScreen: function () {
//            this.root.css({
//                width: 'auto',
//                height: 'auto'
//            });

//            var size = getPageSize();
//            this.root.css({
//                left: '0px',
//                top: '0px',
//                width: size.width,
//                height: size.height
//            });
//            this.root.removeClass(this.CLASS_ORIGINSELECT_DEPEND);
//            this.root.addClass(this.CLASS_ORIGINSELECT_FULLSCREEN);
//        },
//        setDepend: function () {
//            if (!this.depend) {
//                throw new Error('select没有指定依附的元素');
//            }
//            if (!this.dependdir) {
//                throw new Error('select没有指定依附位置');
//            }
//            var pos = getElementPos(this.depend[0]),
//				dewidth = this.depend.width(),
//				deheight = this.depend.height(),
//				selwidth = this.root.width(),
//				selheight = this.root.height();
//            var style = {};
//            if (this.width === 'matchdepend') {
//                style.width = dewidth;
//                selwidth = dewidth;
//            } else if (this.width) {
//                style.width = width;
//                selwidth = dewidth;
//            }
//            var left, top, right, bottom;
//            if (!!(this.dependdir & Select.DEPEND_LEFT)) {
//                left = pos.left;
//            }
//            if (!!(this.dependdir & Select.DEPEND_TOP)) {
//                top = pos.top - selheight;
//            }
//            if (!!(this.dependdir & Select.DEPEND_RIGHT)) {
//                left = pos.left + dewidth - selwidth;
//            }
//            if (!!(this.dependdir & Select.DEPEND_BOTTOM)) {
//                top = pos.top + deheight;
//            }
//            if (typeof this.offset == 'object') {
//                this.offset.top && (top += this.offset.top);
//                this.offset.left && (left += this.offset.left);
//            }
//            left !== undefined && (style.left = left + 'px');
//            top !== undefined && (style.top = top + 'px');
//            style.height = 'auto';
//            this.root.css(style);
//            this.root.removeClass(this.CLASS_ORIGINSELECT_FULLSCREEN);
//            this.root.addClass(this.CLASS_ORIGINSELECT_DEPEND);
//        },
//        setElement: function (select) {
//            select = $(select);
//            if (select[0] && select[0].nodeName == 'SELECT') {
//                this.select = select;
//                this.update();
//            }
//        },
//        setMode: function (mode) {
//            if (!this.select) return;
//            this.mode = mode;
//            this.update();
//            this.position();

//        },
//        switchFullScreen: function () {
//            this.setMode(Select.MODE_FULLSCREEN);
//        },
//        switchDepend: function () {
//            this.setMode(Select.MODE_DEPEND);
//        },
//        setPosition: function (dependdir) {
//            this.dependdir = dependdir;
//            this.position();
//        },
//        add: function (title, value, selected) {
//            if (!this.select) return;
//            var option = createElement('option', {
//                attr: {
//                    value: value,
//                    selected: selected ? 'true' : null
//                },
//                html: title
//            });
//            this.select.append(option);
//            this.update();
//        },
//        _updateOption: function () {
//            return this.options = this.select.find('option');
//        },
//        removeAll: function () {
//            if (!this.select) return;
//            this.select.empty();
//            this.currentOption = [];
//            this.update();
//        },
//        remove: function (value) {
//            if (!this.select) return;
//            var currentOption = this.options.filter('[value=' + value + ']');
//            if (currentOption.length) {
//                currentOption.remove();
//                this.update();
//            }
//        },
//        removeNode: function () {
//            this.root.remove();
//        },
//        getValue: function () {
//            if (!this.select) return;
//            var vals = [];
//            for (var i = 0; i < this.currentOption.length; i++) {
//                vals.push({ title: this.currentOption[i].text, value: this.currentOption[i].value });
//            }
//            return vals;
//        },
//        setValue: function (value, notChange) {
//            if (!this.select) return;
//            var currentOption = this.options.filter("[value='" + value + "']"), last_value;
//            if (currentOption.length) {
//                if (this.multiple) {
//                    currentOption.attr('selected', 'selected');
//                    this.insertCurrentOption(currentOption[0]);
//                    this.root.find('.' + this.CLASS_OPTION + "[data-value='" + currentOption[0].value + "']").addClass(this.CLASS_SELECTED);
//                    !notChange && this.trigger('onChange', [this.getValue()]);
//                } else {
//                    this._updateOption().removeAttr('selected');
//                    this.select[0].selectedIndex = currentOption[0].index;
//                    if (!this.isCurrentOption(currentOption[0])) {
//                        last_value = this.getValue();
//                        this.insertCurrentOption(currentOption[0], true);
//                        this.root.find('.' + this.CLASS_SELECTED).removeClass(this.CLASS_SELECTED);
//                        this.root.find('.' + this.CLASS_OPTION + "[data-value='" + currentOption[0].value + "']").addClass(this.CLASS_SELECTED);
//                        this.fixedTitleDom && this.fixedTitleDom.html(currentOption.html());
//                        !notChange && this.trigger('onChange', [this.getValue(), last_value, currentOption[0]]);
//                    }
//                }
//            }
//        },
//        unsetValue: function (value, notChange) {
//            if (!this.select) return;
//            var currentOption = this.options.filter('[value=' + value + ']');
//            if (currentOption.length) {
//                currentOption.removeAttr('selected');
//                this.delCurrentOpiton(currentOption[0]);
//                this.root.find('.' + this.CLASS_OPTION + "[data-value='" + currentOption[0].value + "']").removeClass(this.CLASS_SELECTED);
//                !notChange && this.trigger('onChange', [this.getValue()]);
//            }
//        },
//        update: function () {
//            if (!this.select) return;
//            this.setRootHtml(this.createDom());
//            this.trigger('onCreate');
//            this.position();
//        }
//    });
//    //布局模式，全屏
//    Select.MODE_FULLSCREEN = 1;
//    //布局模式，依附于某个元素
//    Select.MODE_DEPEND = 2;
//    //依附模式，与元素左对齐
//    Select.DEPEND_LEFT = 1;
//    //依附模式，靠元素顶部
//    Select.DEPEND_TOP = 2;
//    //依附模式，于元素右对齐
//    Select.DEPEND_RIGHT = 4;
//    //依附模式，靠元素底部
//    Select.DEPEND_BOTTOM = 8;


//    /**
//    * Loading 框
//    */
//    var Loading = new cBase.Class(Layer, {
//        __propertys__: function () {
//            this.contentDom;
//            this.loadHtml = '';
//            this.mask = opacityMask;
//        },
//        initialize: function ($super) {
//            // console.log('on initialize');
//            $super({
//                'class': config.prefix + 'loading',
//                onCreate: function () { },
//                onShow: function () {
//                    // ------- 以前的loading样式 ------- //
//                    // this.contentDom.html('<div class="loading"><div class="circle"></div></div><p class="loading-slogan">' + this.loadHtml + '</p>');

//                    this.contentDom.html('<div class="cui-breaking-load"><div class="cui-w-loading"></div><i class="cui-white-logo"></i></div>');
//                    this.reposition();
//                }
//            });
//        },
//        setHtml: function (loadHtml) {
//            this.loadHtml = loadHtml;
//        }
//    });
//    /**
//    * Loading 框
//    */
//    var Loading2 = new cBase.Class(Layer, {
//        __propertys__: function () {
//            this.contentDom;
//            this.loadHtml = '';
//            this.mask = opacityMask;
//        },
//        initialize: function ($super) {
//            $super({
//                'class': config.prefix + 'loading',
//                onCreate: function () { },
//                onShow: function () {
//                    // ------- 以前的loading2样式 ------- //
//                    // this.contentDom.html('<div class="pop_load" style="min-width: 100px; left: -50px; top: 0; ">' + '<img src="../res/img/send_load.png" width="14" height="15">&nbsp;' + this.loadHtml + '<i class="pop_close"></i></div>');

//                    this.contentDom.html('<div class="cui-zl-load"><div class="cui-b-loading i"></div><i class="i_bef cui-blue-logo"></i><p>&nbsp;' + this.loadHtml + '</p></div>');
//                    this.root.find('.pop_close').bind('click', $.proxy(function () {
//                        this.callback && this.callback();
//                    }, this));

//                    this.reposition();
//                }
//            });
//        },
//        setHtml: function (loadHtml) {
//            this.loadHtml = loadHtml;
//        }
//    });

//    //l_wang 发送中的弹出层，无遮罩
//    var LoadingLayer = new cBase.Class(Layer, {
//        __propertys__: function () {
//            this.contentDom;
//            this.callback = function () { };
//            this.text = '发送中...';
//        },
//        initialize: function ($super, callback, text) {
//            this.callback = callback || function () { };
//            this.text = text || '发送中...';
//            $super({
//                'class': config.prefix + 'loading',
//                onCreate: function () { },
//                onShow: function () {
//                    //本来不用这么干
//                    this.contentDom.html([
//                     '<div class="cui-grayload-text">',
//                         '<div class="cui-w-loading"></div>',
//                         '<i class="cui-white-logo"></i>',
//                         '<i class="cui-grayload-close"></i>',
//                         '<div class="cui-grayload-bfont">' + this.text + '</div>',
//                    '</div>'
//                    ].join(''));
//                    this.root.find('.cui-grayload-close').off('click').on('click', $.proxy(function () {
//                        this.callback && this.callback();
//                        this.hide();
//                    }, this));
//                    this.reposition();
//                }
//            });
//        }
//    });

//    /**
//    * 错误提示层
//    */
//    var Warning = new cBase.Class(Layer, {
//        __propertys__: function () {
//            this.warningDom;
//            this.warningtitle = '';
//            this.callback = function () { };
//            this.mask;
//        },
//        initialize: function ($super, options) {
//            this.setOption(function (k, v) {
//                switch (k) {
//                    case 'title':
//                        this.warningtitle = v;
//                        break;
//                }
//            });
//            var ops = cUtility.mix({
//                'class': config.prefix + 'warning',
//                onCreate: function () {
//                    this.contentDom.html('<div class="' + config.prefix + 'warning"><div class="blank"></div><p class="blanktxt">' + this.warningtitle + '</p></div>');
//                    this.warningDom = this.contentDom.find('.blanktxt');
//                    this.mask = new Mask({
//                        classNames: [config.prefix + 'warning-mask']
//                    });
//                    this.root.bind('click', $.proxy(function () {
//                        this.callback && this.callback();
//                    }, this));
//                    this.mask.create();
//                    this.mask.root.bind('click', $.proxy(function () {
//                        this.callback && this.callback();
//                    }, this));
//                },
//                onShow: function () {
//                    this.mask.show();
//                },
//                onHide: function () {
//                    this.mask.hide();
//                }
//            }, options);
//            $super(ops);
//        },
//        setTitle: function (title, callback) {
//            if (title) {
//                this.create();
//                this.warningDom.html(title);
//                this.warningtitle = title;
//            }
//            if (callback) {
//                this.callback = callback;
//            } else {
//                this.callback = function () { };
//            }
//        },
//        getTitle: function () {
//            return this.warningtitle;
//        }
//    });

//        /**
//        * 滚动列表
//        */
//        var ScrollRadioList = new cBase.Class(PageView, {
//          __propertys__: function () {
//            this.title;
//            this.content;
//            this.itemClick = function () { };
//            this.mask = new Mask({ classNames: [config.prefix + 'opacitymask'] });
//            this.scroll = null;
//            this.data = []; //用于组装list的数据
//            this.index = -1; //当前索引值
//            this.key = null;
//            var scope = this;
//            this.disItemNum = 5;
//          },
//          initialize: function ($super, options) {
//            this.setOption(function (k, v) {
//              this[k] = v;
//            });
//            var ops = cUtility.mix({
//              'class': config.prefix + 'warning',
//              onCreate: function () {
//                this.root.html([
//                        '<div class="cui-pop-box" lazyTap="true">',
//                             '<div class="cui-hd"><div class="cui-text-center">' + this.title + '</div></div>',
//                             '<div class="cui-bd">',
//                             '</div>',
//                        '</div>'
//                    ].join(''));
//                this.root.css({
//                  position: 'absolute'
//                });
//                this.title = this.root.find('.cui-text-center');
//                this.content = this.root.find('.cui-bd');
//                this.reposition = function () {
//                  var size = getElementRealSize(this.root);
//                  this.root.css({
//                    'margin-left': -(size.width / 2) + 'px',
//                    'margin-top': (-(size.height / 2) + $(window).scrollTop()) + 'px',
//                    left: '50%',
//                    top: '50%'
//                  });
//                }
//              },
//              onShow: function () {
//                var scope = this;
//                this.mask.show();
//                scope.mask.root.on('click', function () {
//                  scope.hide();
//                  scope.mask.root.off('click');
//                });
//                this.scroll = new ScrollList({
//                  wrapper: this.content,
//                  data: this.data,
//                  index: this.index,
//                  key: this.key,
//                  disItemNum: this.disItemNum,
//                  changed: function (item) {
//                    scope.hide(); //改变则隐藏该层
//                    scope.itemClick.call(scope, item); //改变则触发事件
//                  }
//                });

//                this.scroll.setKey(this.key);
//                this.setzIndexTop();
//                this.reposition();

//                //l_wang 测试
//                //    $(window).bind('scroll', function () {
//                //      window.scrollTo(0, 1);
//                //    });
//                this.root.bind('touchmove', function (e) {
//                  e.preventDefault();
//                });

//                this.mask.root.css('height', $(window).height());
//              },
//              onHide: function () {
//                this.mask.hide();
//                this.mask.root.remove();
//                this.scroll.removeEvent();

//                this.root.unbind('touchmove');
//                this.root.remove();

//              }
//            }, options);
//            $super(ops);
//          }
//        });

//        //根据data确定有几列
//        var ScrollRadio = new cBase.Class(PageView, {
//          __propertys__: function () {
//            var scope = this;
//            this.mask = new Mask({ classNames: [config.prefix + 'opacitymask'] });

//            this.changed = function () { };

//            this.scroll = [];
//            this.data = [];
//            this.index = [];
//            this.key = [];


//            this.tips = '';
//            this.btCancel;
//            this.btOk;
//            this.cancel = '取消';
//            this.ok = '确定';

//            this.cancelClick = function () { scope.hide() };
//            this.okClick = function () { scope.hide() };
//            this.disItemNum = 5;

//          },
//          initialize: function ($super, options) {
//            this.setOption(function (k, v) {
//              this[k] = v;
//            });
//            var ops = cUtility.mix({
//              'class': config.prefix + 'warning',
//              onCreate: function () {
//                this.root.html([
//                        '<div class="cui-pop-box" >',
//                            '<div class="cui-hd">',
//                                '<div class="cui-text-center">',
//                                    '' + this.title + '</div>',
//                            '</div>',
//                            '<div class="cui-bd ">',
//                                '<div class="cui-roller scrollWrapper">',

//                                '</div>',
//                                '<p class="cui-roller-tips">',
//                                    '' + this.tips + '</p>',
//                                '<div class="cui-roller-btns">',
//                                    '<div class="cui-btns-cancel cui-flexbd">' + this.cancel + '</div> <div class="cui-btns-sure cui-flexbd" >',
//                                        '' + this.ok + '</div>',
//                                '</div>',
//                            '</div>',
//                        '</div>'
//                    ].join(''));

//                this.root.css({
//                  position: 'absolute'
//                });
//                this.reposition = function () {
//                  var size = getElementRealSize(this.root);
//                  this.root.css({
//                    'margin-left': -(size.width / 2) + 'px',
//                    'margin-top': (-(size.height / 2) + $(window).scrollTop()) + 'px',
//                    left: '50%',
//                    top: '50%'
//                  });
//                }
//                this.title = this.root.find('.cui-text-center');
//                this.tips = this.root.find('.cui-roller-tips');
//                this.btCancel = this.root.find('.cui-btns-cancel');
//                this.btOk = this.root.find('.cui-btns-sure');
//                this.line = $('<div class="cui-mask-gray"></div><div class="cui-lines">&nbsp;</div>');
//                this.wrapper = this.root.find('.scrollWrapper');

//                this.setTips = function (str) {
//                  this.tips.html(str);
//                };
//              },

//              onShow: function () {
//                var scope = this;
//                //没有data的话便不进行渲染了
//                if (!this.data || this.data.length == 0) return false;

//                this.mask.show();

//                scope.mask.root.on('click', function () {
//                  scope.hide();
//                  scope.mask.root.off('click');
//                });

//                for (var i = 0, len = this.data.length; i < len; i++) {
//                  var param = {
//                    wrapper: this.wrapper,
//                    data: this.data[i],
//                    type: 'radio',
//                    disItemNum: this.disItemNum,

//                    changed: (function (i) {
//                      return function (item) {
//                        var changed = scope.changed[i];
//                        if (typeof changed == 'function') {
//                          changed.call(scope, item); //改变则触发事件
//                        }
//                      }
//                    })(i)
//                  }
//                  if (i == 0 && len == 3) {
//                    param.className = 'cui-roller-bd  cui-flex2'
//                  }
//                  var s = new ScrollList(param);
//                  this.scroll.push(s);
//                }

//                for (var i = 0, len = this.data.length; i < len; i++) {
//                  this.scroll[i].setIndex(this.index[i]);
//                  this.scroll[i].setKey(this.key[i]);
//                }

//                this.wrapper.append(this.line);
//                this.btOk.on('click', function () {
//                  var item = [];
//                  for (var i = 0, len = scope.scroll.length; i < len; i++) {
//                    item.push(scope.scroll[i].getSelected());
//                  }
//                  scope.okClick.call(scope, item); //改变则触发事件
//                  scope.hide();
//                });

//                this.btCancel.on('click', function () {
//                  var item = [];
//                  for (var i = 0, len = scope.scroll.length; i < len; i++) {
//                    item.push(scope.scroll[i].getSelected());
//                  }
//                  scope.cancelClick.call(scope, item); //改变则触发事件
//                  scope.hide();
//                });

//                this.setzIndexTop();
//                this.reposition();

//                this.root.bind('touchmove', function (e) {
//                  e.preventDefault();
//                });
//                this.mask.root.css('height', $(window).height());

//              },
//              onHide: function () {
//                this.mask.hide();
//                this.mask.root.remove();
//                for (var i = 0, len = this.scroll.length; i < len; i++) {
//                  this.scroll[i].removeEvent();
//                }

//                this.btOk.off('click');
//                this.btCancel.off('click');

//                this.root.unbind('touchmove');
//                this.root.remove();


//              }
//            }, options);
//            $super(ops);
//          }
//        });

//    /**
//    * 带head的错误提示层
//    */
//    var HeadWarning = new cBase.Class(PageView, {
//        __propertys__: function () {

//            this.warningtitleDom;
//            this.warningcontentDom;
//            this.warningtitle = '';
//            this.warningcontent = '';
//            this.callback = function () { };
//            this.mask;
//        },
//        initialize: function ($super, options) {
//            this.setOption(function (k, v) {
//                switch (k) {
//                    case 'title':
//                        this.warningtitle = v;
//                        break;
//                    case 'content':
//                        this.warningcontent = v;
//                        break;
//                    case 'callback':
//                        this.callback = v;
//                        break;
//                }
//            });
//            var ops = cUtility.mix({
//                'class': config.prefix + 'warning',
//                onCreate: function () {
//                    this.root.html([
//                        '<div class="head-warning">',
//                            '<div class="head-warning-padding">',
//                                '<div class="head-warning-header">',
//                                    '<div class="head-warning-header-backbtu"><span class="returnico"></span></div>',
//                                    '<div class="head-warning-header-title"></div>',
//                                '</div>',
//                                '<div class="head-warning-content">',
//                                    '<div class="head-warning-content-icon"><div class="cui-load-error"><div class="i cui-wifi cui-exclam"></div></div></div>',
//                                    '<div class="head-warning-content-title"></div>',
//                                '</div>',
//                            '</div>',
//                        '</div>'
//                    ].join(''));
//                    this.root.css({
//                        position: 'absolute',
//                        left: '0px',
//                        top: '0px'
//                    });
//                    this.addClass('head-warning-top');
//                    this.warningtitleDom = this.root.find('.head-warning-header-title');
//                    this.warningcontentDom = this.root.find('.head-warning-content-title');
//                    this.warningleftbtuDom = this.root.find('.head-warning-header-backbtu');
//                    this.mask = new Mask({
//                        classNames: [config.prefix + 'warning-mask']
//                    });
//                    this.mask.create();
//                    this.mask.root.css({
//                        background: 'url(data:image/gif;base64,R0lGODlhAQABAIAAAPX19QAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==) repeat'
//                    });
//                    this.warningleftbtuDom.bind('click', $.proxy(function () {
//                        this.callback && this.callback();
//                    }, this));

//                },
//                onShow: function () {
//                    this.mask.show();
//                    this.setzIndexTop();
//                    window.scrollTo(0, 0);
//                },
//                onHide: function () {
//                    this.mask.hide();
//                }
//            }, options);
//            $super(ops);
//        },
//        setTitle: function (title, content, callback) {
//            if (title) {
//                this.create();
//                this.warningtitleDom.html(title);
//                this.warningcontentDom.html(content);
//            }
//            if (callback) {
//                this.callback = callback;
//            } else {
//                this.callback = function () { };
//            }
//        }
//    });

//    /**
//    * 带head的404错误页，本来想直接继承自上面的类，没成功，后面再研究，先完成任务
//    */
//    var Warning404 = new cBase.Class(PageView, {
//        __propertys__: function () {
//            this.retryDom;
//            this.tel = '4000086666';
//            this.callback = function () { };
//            this.mask;
//        },
//        initialize: function ($super) {
//            var ops = {
//                'class': config.prefix + 'warning',
//                onCreate: function () {
//                    this.root.html([
//                        '<div class="head-warning">',
//                            '<div class="head-warning-padding">',
//                                '<div class="head-warning-content">',
//                                   '<div class="cui-load-fail cui-text-center">',
//                                      '<div class="cui-load-error">',
//                                           '<div class="i cui-wifi i_bef cui-fail-icon">',
//                                            '</div>',
//                                      '</div>',
//                                      '<p class="cui-grayc">加载失败，请稍后再试试吧</p>',
//                                      '<span class="cui-btns-retry">重试</span>',
//                                      '<div class="cui-glines"></div>',
//                                      '<p class="cui-grayc">或者拨打携程客服电话</p>',
//                                      '<div id="telBtn"><span class="cui-btns-tel"><i class="icon_phone i_bef"></i>联系客服</span></div>',
//                                  '</div>',
//                                '</div>',
//                            '</div>',
//                        '</div>'
//                    ].join(''));
//                    this.root.css({
//                        position: 'absolute',
//                        left: '0px',
//                        top: '0px'
//                    });
//                    this.addClass('head-warning-top');
//                    this.retryDom = this.root.find('.cui-btns-retry');
//                    this.mask = new Mask({
//                        classNames: [config.prefix + 'warning-mask']
//                    });
//                    this.mask.create();
//                    this.mask.root.css({
//                        background: 'url(data:image/gif;base64,R0lGODlhAQABAIAAAPX19QAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==) repeat'
//                    });
//                    this.retryDom.bind('click', $.proxy(function () {
//                        this.callback && this.callback();
//                    }, this));
//                },
//                onShow: function () {
//                    this.mask.show();
//                    this.mask.root.css('z-index', '500');
//                    this.setzIndexTop();
//                    window.scrollTo(0, 0);
//                    var self = this;
//                    this.root.find('#telBtn').click(function () {
//                        Guider.apply({
//                            hybridCallback: function () {
//                                Guider.callService();
//                            },
//                            callback: function () {
//                                window.location.href = 'tel:' + self.tel;
//                            }
//                        })
//                    })

//                    this.root.on('touchmove', function (e) {
//                        e.preventDefault();
//                    });
//                },
//                onHide: function () {
//                    this.mask.hide();
//                    this.root.off('touchmove');

//                }
//            };
//            $super(ops);
//        },
//        retryClick: function (callback) {
//            if (callback) {
//                this.callback = callback;

//            }
//        }
//    });


//    var NoHeadWarning = new cBase.Class(PageView, {
//        __propertys__: function () {

//            this.warningtitleDom;
//            this.warningcontentDom;
//            this.warningtitle = '';
//            this.warningcontent = '';
//            this.warningTop = '0';
//            this.mask;
//        },
//        initialize: function ($super, options) {
//            this.setOption(function (k, v) {
//                switch (k) {
//                    case 'content':
//                        this.warningcontent = v;
//                        break;
//                    case 'top':
//                        this.warningTop = v;
//                        break;
//                }
//            });
//            var ops = cUtility.mix({
//                'class': config.prefix + 'warning',
//                onCreate: function () {
//                    var self = this;
//                    this.root.html([
//                        '<div class="head-warning">',
//                            '<div class="head-warning-padding">',
//                                '<div class="head-warning-content">',
//                                    '<div class="head-warning-content-icon"><div class="cui-load-error"><div class="i cui-wifi cui-exclam"></div></div></div>',
//                                    '<div class="head-warning-content-title"></div>',
//                                '</div>',
//                            '</div>',
//                        '</div>'
//                    ].join(''));
//                    this.root.css({
//                        position: 'absolute',
//                        left: '0px',
//                        top: this.warningTop
//                    });
//                    this.addClass('head-warning-top');
//                    this.warningcontentDom = this.root.find('.head-warning-content-title');
//                    this.warningleftbtuDom = this.root.find('.head-warning-header-backbtu');
//                    this.mask = new Mask({
//                        classNames: [config.prefix + 'warning-mask']
//                    });
//                    this.mask.setRootStyle = function () {
//                        this.root.css({
//                            position: 'absolute',
//                            left: '0px',
//                            top: self.warningTop
//                        });
//                    };
//                    this.mask.create();


//                },
//                onShow: function () {
//                    this.mask.show();
//                    this.setzIndexTop();
//                    window.scrollTo(0, 0);
//                },
//                onHide: function () {
//                    this.mask.hide();
//                }
//            }, options);
//            $super(ops);
//        },
//        setContent: function (content, top) {

//            if (top) {
//                this.warningTop = top;
//                this.create();
//            }

//            if (content) {
//                if (!top) this.create();
//                this.warningcontentDom.html(content);
//            }


//        }
//    });

//    /**
//    * 弹层提示
//    */
//    var Toast = new cBase.Class(Layer, {
//        __propertys__: function () {
//            //内容
//            this.content;
//            this.sleep = 2;
//            this.mask = opacityMask;
//            var show = this.show,
//                hide = this.hide,
//                resource;
//            //复写show
//            this.show = function (title, sleep, callback, clickToHide) {
//                this.setContent(title)
//                var self = this;
//                show.call(this);
//                resource = setTimeout(function () {
//                    self.hideHandle(self, callback);
//                }, (sleep || this.sleep) * 1000);
//                if (clickToHide) {
//                    setTimeout(function () {
//                        $('.cui-opacitymask').unbind('click').bind('click', function () {
//                            self.hideHandle(self, callback);
//                        });
//                        $('.cui-toast').unbind('click').bind('click', function () {
//                            self.hideHandle(self, callback);
//                        });
//                    }, 400)
//                }
//            };
//            //复写hide
//            this.hide = function () {
//                clearTimeout(resource);
//                hide.call(this);
//            };
//        },
//        initialize: function ($super, options) {
//            this.addClass([config.prefix + 'toast']);
//            $super(options);
//        },
//        setContent: function (content) {
//            this.create();
//            this.contentDom.html(content);
//        },
//        hideHandle: function (self, callback) {
//            self.hide();
//            callback && callback.call(self);
//            $('.cui-opacitymask').unbind('click');
//            $('.cui-toast').unbind('click');
//        }
//    });
//    /**
//    *  输入框清除按键
//    *  @type Function
//    *  @param input {String|jQuery|Element} 要设置的输入框
//    *  @param clearClass {String} 自定义class
//    *  @param clearCallback 清空后回调
//    */
//    var InputClear = (function () {
//        var isPlaceHolder = 'placeholder' in document.createElement('input');
//        /*判断浏览器是否支持placeholder*/
//        var InputClear = function (input, clearClass, clearCallback, offset) {
//            clearClass || (clearClass = '');
//            offset = offset || {}
//            var $input = typeof input == 'string' ? $(input) : input;
//            $input.each(function () {
//                var clearButton = $('<a class="clear-input ' + clearClass + '" href="javascript:;"><span></span></a>'),
//                $input = $(this);
//                if (offset.left) {
//                    clearButton.css({
//                        left: offset.left + 'px',
//                        right: 'auto'
//                    });
//                }
//                if (offset.top) {
//                    clearButton.css({
//                        top: offset.top + 'px',
//                        bottom: 'auto'
//                    });
//                }
//                if (offset.right) {
//                    clearButton.css({
//                        right: offset.right + 'px',
//                        left: 'auto'
//                    });
//                }
//                if (offset.bottom) {
//                    clearButton.css({
//                        bottom: offset.bottom + 'px',
//                        top: 'auto'
//                    });
//                }
//                $input.parent().addClass('clear-input-box');
//                if (!isPlaceHolder) {
//                    var placeholder = $input.attr('placeholder'),
//                    placeholderNode = $('<span class="placeholder-title' + (clearClass ? ' placeholder-' + clearClass : '') + '">' + placeholder + '</span>');
//                }
//                clearButton.hide();
//                $input.bind({
//                    'focus': function () {
//                        var val = $.trim($input.val());
//                        if (val != '') {
//                            clearButton.show();
//                        }
//                    },
//                    'input': function () {
//                        window.setTimeout(function () {
//                            var val = $input.val();
//                            if (val == '') {
//                                clearButton.hide();
//                            } else {
//                                clearButton.show();
//                            }
//                            if (!isPlaceHolder) {
//                                if (val == '') {
//                                    placeholderNode.show();
//                                } else {
//                                    placeholderNode.hide();
//                                }
//                            }
//                        }, 10)

//                    },
//                    'blur': function () {
//                        var val = $.trim($input.val());
//                        if (!isPlaceHolder) {
//                            if (val == '') {
//                                placeholderNode.show();
//                            } else {
//                                placeholderNode.hide();
//                            }
//                        }
//                        setTimeout(function () {
//                            clearButton.hide();
//                        },
//                        300);
//                    }
//                });
//                clearButton.bind('click',
//                function () {
//                    $input.val('');
//                    $input.keyup();
//                    clearButton.hide();
//                    $input.focus();
//                    $input.trigger('input');
//                    typeof clearCallback == 'function' && clearCallback.call(this);
//                });
//                $input.after(clearButton);
//                if (!isPlaceHolder) {
//                    $input.after(placeholderNode);
//                    placeholderNode.bind('click',
//                    function () {
//                        $input.focus();
//                    });
//                }

//                $input.blur();
//            });
//        };
//        return InputClear;
//    })();

//    return {
//        Tools: Tools,
//        config: config,
//        EventListener: EventListener,
//        HashObserve: HashObserve,
//        AbstractView: AbstractView,
//        Mask: Mask,
//        Layer: Layer,
//        Alert: Alert,
//        PageView: PageView,
//        Select: Select,
//        Loading: Loading,
//        Loading2: Loading2,
//        LoadingLayer: LoadingLayer,
//        Warning: Warning,
//        ScrollRadioList: ScrollRadioList,
//        ScrollRadio: ScrollRadio,
//        HeadWarning: HeadWarning,
//        NoHeadWarning: NoHeadWarning,
//        Toast: Toast,
//        Warning404: Warning404,
//        InputClear: InputClear
//    };

//});

define(['cHistory', 'cView', 'cDataSource', 'cUIBase', 'cUIAbstractView', 'cAdView', 'cUIAlert', 'cUIAnimation', 'cUICitylist', 'cUIHeadWarning', 'cUIInputClear', 'cUILayer', 'cUILoading', 'cUILoadingLayer', 'cUIMask', 'cUIPageview', 'cUIScrollRadio', 'cUIScrollRadioList', 'cUIScrollList', 'cUIScrollLayer', 'cUIToast', 'cUIWarning', 'cUIWarning404', 'cUIHashObserve', 'cUIEventListener'], function (cuiHistory, cuiView, cuiDataSource, cuiBase, cuiAbstractView, cuiAdView, cuiAlert, cuiAnimation, cuiCityList, cuiHeadWarning, cuiInputClear, cuiLayer, cuiLoading, cuiLoadingLayer, cuiMask, cuiPageView, cuiScrollRadio, cuiScrollRadioList, cuiScrollList, cuiScrollLayer, cuiToast, cuiWarning, cuiWarning404, cuiHashObserve, cuiEventListener) {

  var config = {
    // @description 框架内所有生成的元素的id，class都会加上此前缀
    prefix: 'cui-'
  };

  var cui = {
    History: cuiHistory,
    View: cuiView,
    DataSource: cuiDataSource,
    Tools: cuiBase,
    config: config,
    AbstractView: cuiAbstractView,
    AdView: cuiAdView,
    Alert: cuiAlert,
    Animation: cuiAnimation,
    CityList: cuiCityList,
    HeadWarning: cuiHeadWarning,
    InputClear: cuiInputClear,
    Layer: cuiLayer,
    Loading: cuiLoading,
    LoadingLayer: cuiLoadingLayer,
    Mask: cuiMask,
    PageView: cuiPageView,
    ScrollRadio: cuiScrollRadio,
    ScrollRadioList: cuiScrollRadioList,
    ScrollList: cuiScrollList,
    ScrollLayer: cuiScrollLayer,
    Toast: cuiToast,
    Warning: cuiWarning,
    HashObserve: cuiHashObserve,
    EventListener: cuiEventListener
  }

  return cui;
});