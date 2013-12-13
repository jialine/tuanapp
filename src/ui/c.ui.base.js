// @author        Michael.Lee
// @email         cmli@Ctrip.com
// @description   提供ui构建的基本方法

define([], function(){

  var base = {};

  // @description 框架内所有生成的元素的id，class都会加上此前缀
  base.config = {
      prefix: 'cui-'
  };

  // @description   设置cui的默认参数
  // @param         name {String} 参数名
  // @param         value {Any Object} 值
  base.setConfig = function (name, value) {
      config[name] = value;
  };

  // @description   获得元素的在页面中的绝对位置
  // @param         el {Element} 元素对象
  // @return        {Object} 返回元素el在页面中的位置信息
  // {
  //   top: 10, //距顶部的像素值
  //   left: 20 //距左侧的像素值
  // }
  base.getElementPos = function (el) {
    var top = 0, left = 0;
    do {
      top += el.offsetTop;
      left += el.offsetLeft;
    } while (el = el.offsetParent);

    return {
      top: top,
      left: left
    };
  };

  // @description   获得唯一的id
  // @param         void
  // @return        {String} 唯一的字符串
  base.getCreateId = (function () {
    var diviso = new Date().getTime();
    return function () {
      return config.prefix + (++diviso);
    };
  })();

  // @descripion      获得更大的zIndex值，每次调用该函数，都会产生一个更大值的z-index
  // @param void
  // @return {Number}
  base.getBiggerzIndex = (function () {
    var diviso = parseInt(Math.random() * 10000 + 1000);
    return function () {
      return ++diviso;
    };
  })();

  // @description       获得某个元素的最终的样式值
  base.getCurStyleOfEl = function (el, styleName) {
    if (document.defaultView && document.defaultView.getComputedStyle) {
      return document.defaultView.getComputedStyle(el).getPropertyValue(styleName);
    } else if (el.currentStyle) {
      var sec = styleName.split('-'),
      cen = [],
      arr;
      for (var i = 0; i < sec.length; i++) {
        if (i == 0) {
          cen.push(sec[i]);
        } else {
          arr = sec[i].split('');
          arr[0] = arr[0].toUpperCase();
          cen.push(arr.join(''));
        }
      }
      cen = cen.join('');
      return el.currentStyle[cen];
    }
  };

  base.bindthis = function (fn, obj) {
    return function () {
      fn.apply(obj, arguments);
    };
  };

  //@description          安全的将字符串转换为数字
  base.strToNum = function (str) {
    var num = parseInt(str.replace(/[a-z]/i, ''));
    return isNaN(num) ? 0 : num;
  };

  // @description         获得元素占位的高宽
  base.getElementRealSize = function (el) {
      var $el = $(el);
      return {
          width: $el.width(),
          height: $el.height()
      };
  };

  // @description         获得屏幕的显示高宽
  // @return              {Object} 返回包含高宽的对象
  base.getPageSize = function () {
    var width = Math.max(document.documentElement.scrollWidth, document.body.scrollWidth),
    height = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
    return {
      width: width,
      height: height
    };
  };

  // @description         获得窗口滚动条的位置
  // @return
  // {
  //   left:              页面滚动条所在x轴位置
  //   top:               页面滚动条y轴位置
  //   height:            窗口高度
  //   width:             窗口宽度
  //   pageWidth:         页面实际宽度
  //   pageHeight:        页面实际高度
  // }
  base.getPageScrollPos = function () {
      var left = Math.max(document.documentElement.scrollLeft, document.body.scrollLeft),
    top = Math.max(document.documentElement.scrollTop, document.body.scrollTop),
    height = Math.min(document.documentElement.clientHeight, document.body.clientHeight),
          width = Math.min(document.documentElement.clientWidth, document.body.clientWidth),
          pageWidth = Math.max(document.documentElement.scrollWidth, document.body.scrollWidth),
          pageHeight = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight);
      return {
          top: top,
          left: left,
          height: height,
          width: width,
          pageWidth: pageWidth,
          pageHeight: pageHeight
      };
  };

  base.getMousePos = function (event) {
      var top = Math.max(document.body.scrollTop, document.documentElement.scrollTop),
          left = Math.max(document.body.scrollLeft, document.documentElement.scrollLeft);
      return {
          top: top + event.clientY,
          left: left + event.clientX
      };
  };


  // @description         获得event在元素上的位置
  // @param               {Object Event} 时间对象
  // @param               {Object Element} 元素对象
  base.getMousePosOfElement = function (event, el) {
    var mpos = getMousePos(event), pos = getElementPos(el), w = el.clientWidth, h = el.clientHeight;
    var x = mpos.left - pos.left, y = mpos.top - pos.top;
    x = x < 0 ? 0 : (x > w ? w : x);
    y = y < 0 ? 0 : (y > h ? h : y);
    return { x: x, y: y };
  };

  // @description         便捷创建元素方法
  // @param               tag {String} 标签名称
  // @param               attr {Object} 可选 属性
  // @param               styles {Object} 可选 样式
  // @param               html {String} 可选 内容
  base.createElement = function (tag, options) {
    var el = document.createElement(tag), i, t
    if (options) for (i in options) {
      switch (i) {
        case 'attr':
          if (typeof options[i] === 'object') for (t in options[i]) {
            if (options[i][t] != null) el.setAttribute(t, options[i][t]);
          }
          break;
        case 'styles':
          if (typeof options[i] === 'object') for (t in options[i]) {
            if (options[i][t] != null) el.style[t] = options[i][t];
          }
          break;
        case 'id':
          el.id = options[i];
          break;
        case 'class':
          el.className = options[i];
          break;
        case 'html':
          el.innerHTML = options[i];
          break;
      }
    }
    return el;
  };

  return base;

});