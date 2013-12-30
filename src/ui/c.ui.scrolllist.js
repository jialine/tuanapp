/*
* c.store module,
* File:c.store.js
* Project: Ctrip H5
* Author: shbzhang@ctrip.com
* Date: 2013年6月23日
*/
define(['cBase'], function (cBase) {


  //l_wang至今点透仍无法可破......
  window.initTap = function () {
    var forTap = $('#forTap');
    if (!forTap[0]) {
      forTap = $('<div id="forTap" style="color: White; display: none; border-radius: 60px; position: absolute; z-index: 99999; width: 60px; height: 60px"></div>');
      $('body').append(forTap);
    }
    return forTap;
  };

  window.showMaskTap = function (x, y) {
    var forTap = initTap();
    forTap[0] && forTap.css({
      top: y + 'px',
      left: x + 'px'
    })
    forTap.show();
    setTimeout(function () {
      forTap.hide();
    }, 350);
  };

  var ScrollList = function (opts) {
    opts = opts || {};
    //检测设备事件支持，确定使用鼠标事件或者touch事件
    this._checkEventCompatibility();
    this._setBaseParam(opts);
    //初始化最初dom结构
    this._initBaseDom(opts);
    //设置显示几个项目
    this._setDisItemNum(opts);
    //设置默认选择值
    this._setSelectedIndex(opts);

    this.init();
  };
  ScrollList.prototype = {
    constructor: ScrollList,
    //检测设备事件兼容
    _checkEventCompatibility: function () {
      //兼容性方案处理，以及后期资源清理
      var isTouch = 'ontouchstart' in document.documentElement;

      //      isTouch = true; //设置为true时电脑浏览器只能使用touch事件

      this.start = isTouch ? 'touchstart' : 'mousedown';
      this.move = isTouch ? 'touchmove' : 'mousemove';
      this.end = isTouch ? 'touchend' : 'mouseup';
      this.startFn;
      this.moveFn;
      this.endFn;
    },
    //基本参数设置
    _setBaseParam: function (opts) {
      /*
      定位实际需要用到的信息
      暂时不考虑水平移动吧
      */
      this.setHeight = 0; //被设置的高度
      this.itemHeight = 0; //单个item高度
      this.dragHeight = 0; //拖动元素高度
      this.dragTop = 0; //拖动元素top
      this.timeGap = 0; //时间间隔
      this.touchTime = 0; //开始时间
      this.moveAble = false; //是否正在移动
      this.moveState = 'up'; //移动状态，up right down left
      this.oTop = 0; //拖动前的top值
      this.curTop = 0; //当前容器top
      this.mouseY = 0; //鼠标第一次点下时相对父容器的位置
      this.cooling = false; //是否处于冷却时间
      this.animateParam = opts.animateParam || [50, 40, 30, 25, 20, 15, 10, 8, 6, 4, 2]; //动画参数
      this.animateParam = opts.animateParam || [10, 8, 6, 5, 4, 3, 2, 1, 0, 0, 0]; //动画参数
      //数据源
      this.data = opts.data || [];
      this.dataK = {}; //以id作为检索键值
      this.size = this.data.length; //当前容量

      //绑定用户事件
      this._changed = opts.changed || null;
    },
    /*start _initBaseDom相关***********************/
    //初始化最初dom结构
    _initBaseDom: function (opts) {
      //容器元素
      this.wrapper = opts.wrapper || $(document);
      this.type = opts.type || 'list'; //list, radio
      this.id = opts.id || 'id_' + new Date().getTime();
      this.className = opts.className || 'cui-roller-bd';

      //设置滚动的class
      this._setScrollClass(opts);
      this._initDom();
      this.wrapper.append(this.body);

    },
    //_initBaseDom子集
    _setScrollClass: function (opts) {
      var scrollClass;
      //单选的情况需要确定显示选择项
      if (this.type == 'list') {
        scrollClass = 'cui-select-view';
      } else if (this.type == 'radio') {
        scrollClass = 'ul-list';
      }
      //没有被设置就是要默认值
      scrollClass = opts.scrollClass || scrollClass;
      this.scrollClass = scrollClass;
    },
    _initDom: function () {
      this.body = $([
                    '<div class="' + this.className + '" style="overflow: hidden; position: relative; " id="' + this.id + '" >',
                    '</div>'
                    ].join(''));
      //真正拖动的元素（现在是ul）
      this.dragEl = $([
                    '<ul class="' + this.scrollClass + '" style="position: absolute; width: 100%;">',
                    '</ul>'
                    ].join(''));
    },
    /*end _initBaseDom相关***********************/

    //设置控件会显示几项
    _setDisItemNum: function (opts) {
      //不设置的话，默认显示5项，手机显示不了太多，设置了就不控制长度了
      this.disItemNum = this.data.length;
      this.disItemNum = this.disItemNum > 5 ? 5 : this.disItemNum;

      //在单选项的情况，默认显示3项即可
      if (this.type == 'radio') this.disItemNum = 5;

      //获取用户设置的值，但是必须是奇数
      this.disItemNum = opts.disItemNum || this.disItemNum;
      if (this.type == 'radio') this.disItemNum = this.disItemNum % 2 == 0 ? this.disItemNum + 1 : this.disItemNum;
      if (this.data.length < this.disItemNum) {
        if (this.type == 'radio') {
          for (var i = 0, len = this.disItemNum - this.data.length; i < len; i++) {
            this.data.push({ key: '', val: '', disabled: false });
          }
          this.size = this.disItemNum;

        } else {
          this.disItemNum = this.data.length;
        }
      }

    },

    //设置初始时候的选项索引
    _setSelectedIndex: function (opts) {
      this.selectedIndex = parseInt(this.disItemNum / 2); //暂时不考虑多选的情况
      //list情况可以不用初始值
      if (this.type == 'list') {
        this.selectedIndex = -1;
      }
      //如果用户设置了索引值，便使用
      this.selectedIndex = opts.index != undefined ? opts.index : this.selectedIndex;

      //如果数组长度有问题的话
      this.selectedIndex = this.selectedIndex > this.data.length ? 0 : this.selectedIndex;
      //检测选项是否可选
      this._checkSelected();
    },

    /* start _checkSelected ************/
    //检测设置的选项是否可选，不行的话需要重置选项，这里需要处理用户向上或者向下的情况
    _checkSelected: function (dir) {
      //检测时需要根据参数先向上搜索或者先向下搜索
      dir = dir || 'down'; //默认向下搜索
      var isFind = false, index = this.selectedIndex;
      //首先检测当前项目是否不可选
      if (this.data[index] && (typeof this.data[index].disabled == 'undefined' || this.data[index].disabled == false)) {
        //向下的情况
        if (dir == 'down') {
          this.selectedIndex = this._checkSelectedDown(index);
          if (typeof this.selectedIndex != 'number') this.selectedIndex = this._checkSelectedUp(index);
        } else {
          this.selectedIndex = this._checkSelectedUp(index);
          if (typeof this.selectedIndex != 'number') this.selectedIndex = this._checkSelectedDown(index);
        }
      }
      if (typeof this.selectedIndex != 'number') this.selectedIndex = index;

      var s = '';
    },
    _checkSelectedUp: function (index) {
      var isFind = false;
      for (var i = index; i != 0; i--) {
        if (typeof this.data[i].disabled == 'undefined' || this.data[i].disabled == true) {
          index = i;
          isFind = true;
          break;
        }
      }
      return isFind ? index : null;
    },
    _checkSelectedDown: function (index) {
      var isFind = false;
      for (var i = index, len = this.data.length; i < len; i++) {
        if (typeof this.data[i].disabled == 'undefined' || this.data[i].disabled == true) {
          index = i;
          isFind = true;
          break;
        }
      }
      return isFind ? index : null
    },
    /* end _checkSelected ************/

    init: function () {
      this._addItem();
      this._initEventParam();
      this._addEvent();
      this._initScrollBar();
      this.setIndex(this.selectedIndex, true);

    },
    //增加数据
    _addItem: function () {
      var _tmp, _data, i, k, val;
      for (var i in this.data) {
        _data = this.data[i];
        _data.index = i;
        if (typeof _data.key == 'undefined') _data.key = _data.id;
        if (typeof _data.val == 'undefined') _data.val = _data.name;
        val = _data.val || _data.key;
        this.dataK[_data.key] = _data;
        _tmp = $('<li>' + val + '</li>');
        _tmp.attr('data-index', i);
        if (typeof _data.disabled != 'undefined' && _data.disabled == false) {
          _tmp.css('color', 'gray');
        }
        this.dragEl.append(_tmp);
      }
      this.body.append(this.dragEl);
    },
    //初始化事件需要用到的参数信息
    _initEventParam: function () {
      //如果没有数据的话就在这里断了吧
      if (this.data.constructor != Array || this.data.length == 0) return false;
      var offset = this.dragEl.offset();
      var li = this.dragEl.find('li').eq(0);
      var itemOffset = li.offset();
      //暂时不考虑边框与外边距问题
      this.itemHeight = itemOffset.height;
      this.setHeight = this.itemHeight * this.disItemNum;
      this.body.css('height', this.setHeight);
      this.dragTop = offset.top;
      this.dragHeight = this.itemHeight * this.size;

      //      var wrapperHeight = parseInt(this.wrapper.css('height'));

      //      var wrapperNum = wrapperHeight / this.itemHeight;

      //      var _top = parseInt((wrapperNum - this.disItemNum) / 2) * this.itemHeight;

      //      if (wrapperNum != this.disItemNum) { this.body.css('margin-top', _top + 'px'); }

      var s = '';
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
      //            this.dragEl[0].addEventListener(this.move, this.moveFn, false);
      //            this.dragEl[0].addEventListener(this.end, this.endFn, false);
      this.dragEl[0].addEventListener(this.move, this.moveFn, false);
      this.dragEl[0].addEventListener(this.end, this.endFn, false);
    },
    removeEvent: function () {
      this.dragEl[0].removeEventListener(this.start, this.startFn);
      this.dragEl[0].removeEventListener(this.move, this.moveFn);
      this.dragEl[0].removeEventListener(this.end, this.endFn);
    },
    _initScrollBar: function () {
      if (this.type != 'list') return;
      //滚动条缩放比例
      this.scrollProportion = this.setHeight / this.dragHeight;
      this.isNeedScrollBar = true;
      //该种情况无需滚动条
      if (this.scrollProportion >= 1) {
        this.isNeedScrollBar = false; ;
        return false;
      }
      //滚动条
      this.scrollBar = $('<div style="background-color: rgba(0, 0, 0, 0.498039);border: 1px solid rgba(255, 255, 255, 0.901961); width: 5px; border-radius: 3px;  position: absolute; right: 1px;  opacity: 0.2;  "></div>');
      this.body.append(this.scrollBar);
      this.scrollHeight = parseInt(this.scrollProportion * this.setHeight);
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
    _touchStart: function (e) {
      e.preventDefault();
      var scope = this;
      //冷却时间不能开始
      if (this.cooling) {
        setTimeout(function () {
          scope.cooling = false;
        }, 50);
        e.preventDefault();
        return false;
      }
      //需要判断是否是拉取元素，此处需要递归验证，这里暂时不管
      //！！！！！！！！此处不严谨
      var el = $(e.target).parent(), pos;

      this.isMoved = false;

      if (el.hasClass(this.scrollClass)) {
        this.touchTime = e.timeStamp;
        //获取鼠标信息
        pos = this.getMousePos((e.changedTouches && e.changedTouches[0]) || e);
        //注意，此处是相对位置，注意该处还与动画有关，所以高度必须动态计算
        var top = parseFloat(this.dragEl.css('top')) || 0;
        this.mouseY = pos.top - top;
        this.moveAble = true;
      }
    },
    _touchMove: function (e) {

      e.preventDefault();
      if (!this.moveAble) { return false; }
      var pos = this.getMousePos((e.changedTouches && e.changedTouches[0]) || e);

      //先获取相对容器的位置，在将两个鼠标位置相减
      this.curTop = pos.top - this.mouseY;
      var cheakListBound = this._cheakListBound(this.curTop);
      if (cheakListBound != false) {
        this.curTop = cheakListBound.top;
      }
      this.isMoved = true;
      this.dragEl.css('top', this.curTop + 'px');
      this._setScrollTop(this.curTop);

      e.preventDefault();
    },
    _cheakListBound: function (top) {
      //此处经产品要求加入头尾不能动的需求判断，暂时只考虑list

      //注意此处radio已经判断
      var minTop = parseInt(this.dragHeight) - parseInt(this.setHeight); //能达到的最小负top值


      var isBound = false; //是否到达边界
      if (this.type == 'radio') {
        var radioNum = parseInt(this.disItemNum / 2);
        if (top > this.itemHeight * radioNum) {
          top = this.itemHeight * radioNum;
          isBound = true;
        } else {
          if (top < (minTop * (-1)) - this.itemHeight * radioNum) {
            top = minTop * (-1) - this.itemHeight * radioNum;
            isBound = true;
          }
        }
      } else {
        if (top > this.itemHeight) {
          top = this.itemHeight;
          isBound = true;
        } else {
          if (top < (minTop * (-1)) - this.itemHeight) {
            top = minTop * (-1) - this.itemHeight;
            isBound = true;
          }
        }

      }

      if (isBound) {
        this.isBound = true; //当前以达到边界
        return {
          speed: 1,
          top: top
        };
      }
      this.isBound = false;
      return false;
    },
    _getAnimateData: function (e) {
      this.timeGap = e.timeStamp - this.touchTime;
      var flag = this.oTop <= this.curTop ? 1 : -1; //判断是向上还是向下滚动
      var flag2 = this.curTop > 0 ? 1 : -1; //这个会影响后面的计算结果
      this.moveState = flag > 0 ? 'up' : 'down';
      var ih = parseFloat(this.itemHeight);
      var ih1 = ih / 2;

      var top = Math.abs(this.curTop);
      var mod = top % ih;
      top = (parseInt(top / ih) * ih + (mod > ih1 ? ih : 0)) * flag2;
      var step = parseInt(this.timeGap / 10 - 10);
      step = step > 0 ? step : 0;
      var speed = this.animateParam[step] || 0;
      var increment = speed * ih * flag;
      top += increment;

      return {
        top: top,
        speed: speed
      };
    },
    _touchEnd: function (e) {
      var scope = this;
      if (this.isBound === true && this.isMoved === true) {
        scope.reset.call(scope, this.curTop);
        return false;
      }
      if (!this.moveAble) return false;
      this.cooling = true; //开启冷却时间

      //时间间隔
      var animateData = this._getAnimateData(e);
      var top = animateData.top;
      var speed = animateData.speed;

      var cheakListBound = this._cheakListBound(top);
      if (cheakListBound != false) {
        top = cheakListBound.top;
        speed = cheakListBound.speed;
      }

      //！！！此处动画可能导致数据不同步，后期改造需要加入冷却时间
      if (this.oTop != this.curTop && this.curTop != top) {
        this.dragEl.animate({
          top: top + 'px'
        }, 100 + (speed * 20), 'linear', function () {
          scope.reset.call(scope, top);
        });
        scope._setScrollTop(top, 100 + (speed * 20));

      } else {
        var el = $(e.target);
        if (this.type == 'list') {
          var item = this.dragEl.find('li');
          item.removeClass('current');
          el.addClass('current');
        }
        //这个由于使用了边距等东西，使用位置定位有点不靠谱了
        this.selectedIndex = el.attr('data-index');
        //单选多选列表触发的事件，反正都会触发

        if (this.type == 'list') {
          this.onTouchEnd();
          //尼玛其实点透至今仍然不可破......上蒙版吧......
          if (scope.start == 'touchstart') {
            var _e = e.changedTouches && e.changedTouches[0];
            showMaskTap(_e.pageX - 30, _e.pageY - 30);
          }
        }
        //                e.stopPropagation();
        //                e.preventDefault();
        this.cooling = false; //关闭冷却时间
      }
      this._hideScroll();
      this.moveAble = false;
      //            e.preventDefault();
    },
    _getResetData: function (top) {
      var num = parseInt(this.type == 'list' ? 0 : this.disItemNum / 2);
      var _top = top, t = false;

      var sHeight = this.type == 'list' ? 0 : parseFloat(this.itemHeight) * num;
      var eHeight = this.type == 'list' ? this.setHeight : parseFloat(this.itemHeight) * (num + 1);
      var h = this.dragHeight;

      if (top >= 0) {
        if (top > sHeight) {
          _top = sHeight;
          t = true;
        } else {
          //出现该情况说明项目太少，达不到一半
          if (h <= sHeight) {
            _top = sHeight - this.itemHeight * (this.size - 1);
            t = true;
          }
        }
      }
      if (top < 0 && (top + this.dragHeight <= eHeight)) {
        t = true;
        _top = (this.dragHeight - eHeight) * (-1);
      }
      if (top == _top) {
        t = false;
      }

      return {
        top: _top,
        needReset: t
      };
    },
    //超出限制后位置还原
    reset: function (top) {
      var scope = this;
      var t = this._getResetData(top).needReset;
      var _top = this._getResetData(top).top;

      if (t) {
        scope.dragEl.animate({
          top: _top + 'px'
        }, 50, 'linear', function () {
          scope._reset(_top);
        });
      } else {
        scope._reset(top);
      }
      this._hideScroll();

    },
    _reset: function (top) {
      this.oTop = top;
      this.curTop = top;
      this.type == 'radio' && this.onTouchEnd();
      this.cooling = false; //关闭冷却时间
    },
    onTouchEnd: function (scope) {
      scope = scope || this;

      var secItem, i, len, index, isFind;
      var changed = this._changed;
      var num = parseInt(this.type == 'list' ? 0 : this.disItemNum / 2);
      len = this.data.length;
      if (this.type == 'radio') {
        i = parseInt((this.curTop - this.itemHeight * num) / parseFloat(this.itemHeight));
        this.selectedIndex = Math.abs(i);
        secItem = this.data[this.selectedIndex];
      } else {
        secItem = this.data[this.selectedIndex];
      }

      //默认不去找
      isFind = false; //检测是否找到可选项
      //检测是否当前项不可选，若是不可选，需要还原到最近一个可选项
      if (typeof secItem.disabled != 'undefined') {
        if (secItem.disabled == false) {
          index = this.selectedIndex;
          if (this.type == 'radio')
            this._checkSelected(this.moveState);
          if (index != this.selectedIndex) isFind = true;
        }
      }
      //会有还原的逻辑
      if (isFind) {
        this.setIndex(this.selectedIndex);
      } else {
        var changed = this._changed;
        if (changed && typeof changed == 'function' && secItem.disabled != false) {
          changed.call(scope, secItem);
        }
        this.dragEl.find('li').removeClass('current');
        if (this.type == 'radio') this.dragEl.find('li').eq(this.selectedIndex).addClass('current');
      }
    },
    //数据重新加载
    reload: function (data) {
      this.data = data;
      this.dragEl.html('');
      if (data.constructor == Array && data.length > 0) {
        this.selectedIndex = parseInt(this.disItemNum / 2); //暂时不考虑多选的情况
        this.selectedIndex = this.selectedIndex > this.data.length ? this.data.length - 1 : this.selectedIndex;
        this._checkSelected('down');
        this._addItem();
        this._initEventParam();
        this.cooling = false;
        this.setIndex(this.selectedIndex, true);

        //添加样式效果
        this.dragEl.find('li').removeClass('current');
        if (this.type == 'radio') this.dragEl.find('li').eq(this.selectedIndex).addClass('current');
      }
    },
    setKey: function (k) {
      if (k == undefined || k == null) return false;
      var i = this.dataK[k] && this.dataK[k].index;
      this.setIndex(i);
    },
    setIndex: function (i, init) {
      if (i == undefined || i < 0) return false;
      var scope = this;
      //                    this.cooling = true; //关闭冷却时间
      var num = parseInt(scope.disItemNum / 2);

      if (scope.type == 'list') {
        if (this.data.length == scope.disItemNum) {
          num = i;
        } else {
          num = i == 0 ? 0 : 1;
          //产品要求，最低处不能有空格
          if (this.size - i < this.disItemNum)
            num = (-1) * parseInt(this.size) + parseInt(this.disItemNum) + parseInt(i);
        }
      }

      var i = parseInt(i), top;
      if (i < 0) return false;
      if (i >= this.data.length) i = this.data.length - 1;
      this.selectedIndex = i;
      top = this.itemHeight * (num - i);

      //防止设置失败
      scope.oTop = top;
      scope.curTop = top;
      scope.cooling = false; //关闭冷却时间
      //            scope.dragEl.css('top', top + 'px');

      scope.dragEl.animate({ 'top': top + 'px' }, 50, 'linear');

      //修复滚动条初始化BUG
      this._setScrollTop(top, 50);

      if (scope.type == 'list') {
        var item = scope.dragEl.find('li');
        item.removeClass('current');
        item.eq(i).addClass('current');
      }
      //初始化dom选项时不触发事件
      if (!init) {
        //单选时候的change事件
        scope.onTouchEnd();
      }
    },
    getSelected: function () {
      return this.data[this.selectedIndex];
    },
    getByKey: function (k) {
      var i = this.dataK[k] && this.dataK[k].index;
      if (i != null && i != undefined)
        return this.data[i];
      return null;
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
  return ScrollList;
});
