/*
* l_wang
* 发现电脑有问题的时光，悲伤的实现了该功能
* 提供一个可拖动的div层，以后可以自己扩展滚动条等效果，暂时不支持任何事件，做最简单实现
* Date: 2013年11月14日
*/
define(['cBase'], function (cBase) {

    var ScrollLayer = function (opts) {
        opts = opts || {};
        //检测设备事件支持，确定使用鼠标事件或者touch事件
        this._checkEventCompatibility();
        this._setBaseParam(opts);
        this._addEvent();
        this._initScrollBar();
    };

    ScrollLayer.prototype = {
        constructor: ScrollLayer,
        //检测设备事件兼容
        _checkEventCompatibility: function () {
            var isTouch = 'ontouchstart' in document.documentElement;
            this.start = isTouch ? 'touchstart' : 'mousedown';
            this.move = isTouch ? 'touchmove' : 'mousemove';
            this.end = isTouch ? 'touchend' : 'mouseup';
            this.startFn;
            this.moveFn;
            this.endFn;
        },
        //基本参数设置
        _setBaseParam: function (opts) {
            this.timeGap = 0; //时间间隔
            this.touchTime = 0; //开始时间
            this.isMoveing = false; //是否正在移动
            this.moveState = 'up'; //移动状态，up right down left
            this.oTop = 0; //拖动前的top值
            this.curTop = 0; //当前容器top
            this.mouseY = 0; //鼠标第一次点下时相对父容器的位置
            this.animateParam = opts.animateParam || [10, 8, 6, 5, 4, 3, 2, 1, 0, 0, 0]; //动画参数
            this.cooling = true; //是否处于冷却时间
            this.steplen = 25; //动画步长
            this.wrapper = opts.wrapper || $('body');
            this.dragEl = opts.body;
            this.dragEl.css('position', 'absolute');
            this.wrapper.append(this.dragEl);
        },
        _initScrollBar: function () {

            if (!this.dragHeight) {
                this.dragHeight = this.dragEl.offset().height; //拖动元素高度
                this.wrapperHeight = this.wrapper.offset().height;
            }
            //滚动条缩放比例
            this.scrollProportion = this.wrapperHeight / this.dragHeight;
            this.isNeedScrollBar = true;
            //该种情况无需滚动条
            if (this.scrollProportion >= 1) {
                this.isNeedScrollBar = false; ;
                return false;
            }
            //滚动条
            this.scrollBar = $('<div style="background-color: rgba(0, 0, 0, 0.498039);border: 1px solid rgba(255, 255, 255, 0.901961); width: 5px; border-radius: 3px;  position: absolute; right: 1px; opacity: 0.2;  "></div>');
            this.wrapper.append(this.scrollBar);
            this.scrollHeight = parseInt(this.scrollProportion * this.wrapperHeight);
            this.scrollBar.css('height', this.scrollHeight);
        },
        _setScrollTop: function (top, duration) {
            //滚动条高度
            if (this.isNeedScrollBar) {
                top = this._getResetData(top).top;
                top = top < 0 ? (top + 10) : top;

                var scrollTop = top * (-1);
                if (typeof duration == 'number') {
                    var _top = parseInt(scrollTop * this.scrollProportion) + 'px';
                    this.scrollBar.animate({
                        top: _top,
                        right: '1px'
                    }, duration, 'linear');

                } else {
                    this.scrollBar.css('top', parseInt(scrollTop * this.scrollProportion) + 'px');
                }
                this.scrollBar.css('opacity', '0.8');
            }
        },
        _hideScroll: function () {
            if (this.isNeedScrollBar) {
                this.scrollBar.animate({ 'opacity': '0.2' });
            }
        },
        _addEvent: function () {
            var scope = this;
            this.startFn = function (e) {
                scope._touchStart.call(scope, e);
            };
            this.moveFn = function (e) {
                scope._touchMove.call(scope, e);
            };
            this.endFn = function (e) {
                scope._touchEnd.call(scope, e);
            };
            this.dragEl[0].addEventListener(this.start, this.startFn, false);
            document.addEventListener(this.move, this.moveFn, false);
            document.addEventListener(this.end, this.endFn, false);
        },
        removeEvent: function () {
            this.dragEl[0].removeEventListener(this.start, this.startFn);
            document.removeEventListener(this.move, this.moveFn);
            document.removeEventListener(this.end, this.endFn);
        },
        _touchStart: function (e) {
            var scope = this;
            if (this.isMoveing) { e.preventDefault(); return false; }
            //非运动情况关闭冷却时间
            this.cooling = false;
            this.touchTime = e.timeStamp;
            pos = this.getMousePos((e.changedTouches && e.changedTouches[0]) || e);
            var top = parseFloat(this.dragEl.css('top')) || 0;
            this.mouseY = pos.top - top;
        },
        _touchMove: function (e) {
            if (this.cooling) { e.preventDefault(); return false; }

            this.isMoveing = true;

            e.preventDefault();
            var pos = this.getMousePos((e.changedTouches && e.changedTouches[0]) || e);

            //防止点击时候跳动
            if (Math.abs((pos.top - this.mouseY) - this.curTop) < 10) { e.preventDefault(); return false; }

            //先获取相对容器的位置，在将两个鼠标位置相减
            this.curTop = pos.top - this.mouseY;

            var resetData = this._getResetData(this.curTop);
            if (resetData.needReset) {
                this.curTop = this._resetEdge(this.curTop);
            }

            this.dragEl.css('top', this.curTop + 'px');
            this._setScrollTop(this.curTop);
            e.preventDefault();

        },
        _touchEnd: function (e) {
            if (this.cooling) { e.preventDefault(); return false; }
            if (Math.abs(this.oTop - this.curTop) < 10) { e.preventDefault(); return false; }
            //一次动作结束，开启冷却时间
            this.cooling = true;
            var scope = this;
            this.timeGap = e.timeStamp - this.touchTime;
            var flag = this.oTop < this.curTop ? 1 : -1; //判断是向上还是向下滚动
            this.moveState = flag > 0 ? 'up' : 'down';

            var step = parseInt(this.timeGap / 10 - 10);
            step = step > 0 ? step : 0;
            var speed = this.animateParam[step] || 0;
            var increment = speed * this.steplen * flag;
            var top = this.curTop;
            top += increment;


            var resetData = this._getResetData(top);
            if (resetData.needReset) {
                top = this._resetEdge(top);
                speed = 0;
            }

            //！！！此处动画可能导致数据不同步，后期改造需要加入冷却时间
            if (this.oTop != this.curTop && this.curTop != top) {
                var duration = 100 + (speed * 20);
                top += increment;
                this.dragEl.animate({
                    top: top + 'px'
                }, duration, 'linear', function () {
                    scope.reset.call(scope, top);
                });
                this._setScrollTop(top, duration);
            } else {
                this.isMoveing = false;
                this.oTop = top;
                this.reset(top);
                this.cooling = false; //关闭冷却时间
            }
            this._hideScroll();
            e.preventDefault();
        },
        _resetEdge: function (top) {
            var h1 = parseInt(this.wrapperHeight / 3);
            var h2 = parseInt(this.dragHeight * (-1) + this.wrapperHeight * (2 / 3));
            if (top > 0 && top > h1) top = h1;
            if (top < 0 && top < h2) top = h2;
            return top;
        },
        _getResetData: function (top) {
            var needReset = false;
            if (top < (-1) * (this.dragHeight - this.wrapperHeight)) { top = (-1) * (this.dragHeight - this.wrapperHeight); needReset = true; }
            if (top > 0) { top = 0; needReset = true; }

            return {
                top: top,
                needReset: needReset
            };
        },
        //超出限制后位置还原
        reset: function (top) {
            var scope = this;
            var needReset = this._getResetData(top).needReset;
            var top = this._getResetData(top).top;

            if (needReset) {
                scope.dragEl.animate({
                    top: top + 'px'
                }, 50, 'linear', function () {
                    scope._reset(top);
                });
            } else {
                scope._reset(top);
            }
        },
        _reset: function (top) {
            this.oTop = top;
            this.curTop = top;
            this.isMoveing = false;
            this.cooling = false; //关闭冷却时间
        },
        //获取鼠标信息
        getMousePos: function (event) {
            var top, left;
            top = Math.max(document.body.scrollTop, document.documentElement.scrollTop);
            left = Math.max(document.body.scrollLeft, document.documentElement.scrollLeft);
            return {
                top: top + event.clientY,
                left: left + event.clientX
            };
        }
    };
    return ScrollLayer;
});
