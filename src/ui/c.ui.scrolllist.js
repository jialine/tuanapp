define(["cBase"], function() {
  window.initTap = function() {
    var a = $("#forTap");
    return a[0] || (a = $('<div id="forTap" style="color: White; display: none; border-radius: 60px; position: absolute; z-index: 99999; width: 60px; height: 60px"></div>'), $("body").append(a)), a
  }, window.showMaskTap = function(a, b) {
    var c = initTap();
    c[0] && c.css({
      top: b + "px",
      left: a + "px"
    }), c.show(), setTimeout(function() {
      c.hide()
    }, 350)
  };
  var a = function(a) {
    a = a || {}, this._checkEventCompatibility(), this._setBaseParam(a), this._initBaseDom(a), this._setDisItemNum(a), this._setSelectedIndex(a), this.init()
  };
  return a.prototype = {
    constructor: a,
    _checkEventCompatibility: function() {
      var a = "ontouchstart" in document.documentElement;
      this.start = a ? "touchstart" : "mousedown", this.move = a ? "touchmove" : "mousemove", this.end = a ? "touchend" : "mouseup", this.startFn, this.moveFn, this.endFn
    },
    _setBaseParam: function(a) {
      this.setHeight = 0, this.itemHeight = 0, this.dragHeight = 0, this.dragTop = 0, this.timeGap = 0, this.touchTime = 0, this.moveAble = !1, this.moveState = "up", this.oTop = 0, this.curTop = 0, this.mouseY = 0, this.cooling = !1, this.animateParam = a.animateParam || [50, 40, 30, 25, 20, 15, 10, 8, 6, 4, 2], this.animateParam = a.animateParam || [10, 8, 6, 5, 4, 3, 2, 1, 0, 0, 0], this.data = a.data || [], this.dataK = {}, this.size = this.data.length, this._changed = a.changed || null
    },
    _initBaseDom: function(a) {
      this.wrapper = a.wrapper || $(document), this.type = a.type || "list", this.id = a.id || "id_" + (new Date).getTime(), this.className = a.className || "cui-roller-bd", this._setScrollClass(a), this._initDom(), this.wrapper.append(this.body)
    },
    _setScrollClass: function(a) {
      var b;
      "list" == this.type ? b = "cui-select-view" : "radio" == this.type && (b = "ul-list"), b = a.scrollClass || b, this.scrollClass = b
    },
    _initDom: function() {
      this.body = $(['<div class="' + this.className + '" style="overflow: hidden; position: relative; " id="' + this.id + '" >', "</div>"].join("")), this.dragEl = $(['<ul class="' + this.scrollClass + '" style="position: absolute; width: 100%;">', "</ul>"].join(""))
    },
    _setDisItemNum: function(a) {
      if (this.disItemNum = this.data.length, this.disItemNum = this.disItemNum > 5 ? 5 : this.disItemNum, "radio" == this.type && (this.disItemNum = 5), this.disItemNum = a.disItemNum || this.disItemNum, "radio" == this.type && (this.disItemNum = this.disItemNum % 2 == 0 ? this.disItemNum + 1 : this.disItemNum), this.data.length < this.disItemNum)
        if ("radio" == this.type) {
          for (var b = 0, c = this.disItemNum - this.data.length; c > b; b++) this.data.push({
            key: "",
            val: "",
            disabled: !1
          });
          this.size = this.disItemNum
        } else this.disItemNum = this.data.length
    },
    _setSelectedIndex: function(a) {
      this.selectedIndex = parseInt(this.disItemNum / 2), "list" == this.type && (this.selectedIndex = -1), this.selectedIndex = void 0 != a.index ? a.index : this.selectedIndex, this.selectedIndex = this.selectedIndex > this.data.length ? 0 : this.selectedIndex, this._checkSelected()
    },
    _checkSelected: function(a) {
      a = a || "down";
      var b = this.selectedIndex;
      !this.data[b] || "undefined" != typeof this.data[b].disabled && 0 != this.data[b].disabled || ("down" == a ? (this.selectedIndex = this._checkSelectedDown(b), "number" != typeof this.selectedIndex && (this.selectedIndex = this._checkSelectedUp(b))) : (this.selectedIndex = this._checkSelectedUp(b), "number" != typeof this.selectedIndex && (this.selectedIndex = this._checkSelectedDown(b)))), "number" != typeof this.selectedIndex && (this.selectedIndex = b)
    },
    _checkSelectedUp: function(a) {
      for (var b = !1, c = a; -1 != c; c--)
        if ("undefined" == typeof this.data[c].disabled || 1 == this.data[c].disabled) {
          a = c, b = !0;
          break
        }
      return b ? a : null
    },
    _checkSelectedDown: function(a) {
      for (var b = !1, c = a, d = this.data.length; d > c; c++)
        if ("undefined" == typeof this.data[c].disabled || 1 == this.data[c].disabled) {
          a = c, b = !0;
          break
        }
      return b ? a : null
    },
    init: function() {
      this._addItem(), this._initEventParam(), this._addEvent(), this._initScrollBar(), this.setIndex(this.selectedIndex, !0)
    },
    _addItem: function() {
      var a, b, c, d;
      for (var c in this.data) b = this.data[c], b.index = c, "undefined" == typeof b.key && (b.key = b.id), "undefined" == typeof b.val && (b.val = b.name), d = b.val || b.key, this.dataK[b.key] = b, a = $("<li>" + d + "</li>"), a.attr("data-index", c), "undefined" != typeof b.disabled && 0 == b.disabled && a.css("color", "gray"), this.dragEl.append(a);
      this.body.append(this.dragEl)
    },
    _initEventParam: function() {
      if (this.data.constructor != Array || 0 == this.data.length) return !1;
      var a = this.dragEl.offset(),
        b = this.dragEl.find("li").eq(0),
        c = b.offset();
      this.itemHeight = c.height, this.setHeight = this.itemHeight * this.disItemNum, this.body.css("height", this.setHeight), this.dragTop = a.top, this.dragHeight = this.itemHeight * this.size
    },
    _addEvent: function() {
      var a = this;
      this.startFn = function(b) {
        a._touchStart.call(a, b)
      }, this.moveFn = function(b) {
        a._touchMove.call(a, b)
      }, this.endFn = function(b) {
        a._touchEnd.call(a, b)
      }, this.dragEl[0].addEventListener(this.start, this.startFn, !1), this.dragEl[0].addEventListener(this.move, this.moveFn, !1), this.dragEl[0].addEventListener(this.end, this.endFn, !1)
    },
    removeEvent: function() {
      this.dragEl[0].removeEventListener(this.start, this.startFn), this.dragEl[0].removeEventListener(this.move, this.moveFn), this.dragEl[0].removeEventListener(this.end, this.endFn)
    },
    _initScrollBar: function() {
      if ("list" == this.type) {
        if (this.scrollProportion = this.setHeight / this.dragHeight, this.isNeedScrollBar = !0, this.scrollProportion >= 1) return this.isNeedScrollBar = !1, !1;
        this.scrollBar = $('<div style="background-color: rgba(0, 0, 0, 0.498039);border: 1px solid rgba(255, 255, 255, 0.901961); width: 5px; border-radius: 3px;  position: absolute; right: 1px;  opacity: 0.2;  "></div>'), this.body.append(this.scrollBar), this.scrollHeight = parseInt(this.scrollProportion * this.setHeight), this.scrollBar.css("height", this.scrollHeight)
      }
    },
    _setScrollTop: function(a, b) {
      if (this.isNeedScrollBar) {
        a = this._getResetData(a).top, a = 0 > a ? a + 10 : a;
        var c = -1 * a;
        if ("number" == typeof b) {
          var d = parseInt(c * this.scrollProportion) + "px";
          this.scrollBar.animate({
            top: d,
            right: "1px"
          }, b, "linear")
        } else this.scrollBar.css("top", parseInt(c * this.scrollProportion) + "px");
        this.scrollBar.css("opacity", "0.8")
      }
    },
    _hideScroll: function() {
      this.isNeedScrollBar && this.scrollBar.animate({
        opacity: "0.2"
      })
    },
    _touchStart: function(a) {
      a.preventDefault();
      var b = this;
      if (this.cooling) return setTimeout(function() {
        b.cooling = !1
      }, 50), a.preventDefault(), !1;
      var c, d = $(a.target).parent();
      if (this.isMoved = !1, d.hasClass(this.scrollClass)) {
        this.touchTime = a.timeStamp, c = this.getMousePos(a.changedTouches && a.changedTouches[0] || a);
        var e = parseFloat(this.dragEl.css("top")) || 0;
        this.mouseY = c.top - e, this.moveAble = !0
      }
    },
    _touchMove: function(a) {
      if (a.preventDefault(), !this.moveAble) return !1;
      var b = this.getMousePos(a.changedTouches && a.changedTouches[0] || a);
      this.curTop = b.top - this.mouseY;
      var c = this._cheakListBound(this.curTop);
      0 != c && (this.curTop = c.top), this.isMoved = !0, this.dragEl.css("top", this.curTop + "px"), this._setScrollTop(this.curTop), a.preventDefault()
    },
    _cheakListBound: function(a) {
      var b = parseInt(this.dragHeight) - parseInt(this.setHeight),
        c = !1;
      if ("radio" == this.type) {
        var d = parseInt(this.disItemNum / 2);
        a > this.itemHeight * d ? (a = this.itemHeight * d, c = !0) : a < -1 * b - this.itemHeight * d && (a = -1 * b - this.itemHeight * d, c = !0)
      } else a > this.itemHeight ? (a = this.itemHeight, c = !0) : a < -1 * b - this.itemHeight && (a = -1 * b - this.itemHeight, c = !0);
      return c ? (this.isBound = !0, {
        speed: 1,
        top: a
      }) : (this.isBound = !1, !1)
    },
    _getAnimateData: function(a) {
      this.timeGap = a.timeStamp - this.touchTime;
      var b = this.oTop <= this.curTop ? 1 : -1,
        c = this.curTop > 0 ? 1 : -1;
      this.moveState = b > 0 ? "up" : "down";
      var d = parseFloat(this.itemHeight),
        e = d / 2,
        f = Math.abs(this.curTop),
        g = f % d;
      f = (parseInt(f / d) * d + (g > e ? d : 0)) * c;
      var h = parseInt(this.timeGap / 10 - 10);
      h = h > 0 ? h : 0;
      var i = this.animateParam[h] || 0,
        j = i * d * b;
      return f += j, {
        top: f,
        speed: i
      }
    },
    _touchEnd: function(a) {
      var b = this;
      if (this.isBound === !0 && this.isMoved === !0) return b.reset.call(b, this.curTop), !1;
      if (!this.moveAble) return !1;
      this.cooling = !0;
      var c = this._getAnimateData(a),
        d = c.top,
        e = c.speed,
        f = this._cheakListBound(d);
      if (0 != f && (d = f.top, e = f.speed), this.oTop != this.curTop && this.curTop != d) this.dragEl.animate({
        top: d + "px"
      }, 100 + 20 * e, "linear", function() {
        b.reset.call(b, d)
      }), b._setScrollTop(d, 100 + 20 * e);
      else {
        var g = $(a.target);
        if ("list" == this.type) {
          var h = this.dragEl.find("li");
          h.removeClass("current"), g.addClass("current")
        }
        if (this.selectedIndex = g.attr("data-index"), "list" == this.type && (this.onTouchEnd(), "touchstart" == b.start)) {
          var i = a.changedTouches && a.changedTouches[0];
          showMaskTap(i.pageX - 30, i.pageY - 30)
        }
        this.cooling = !1
      }
      this._hideScroll(), this.moveAble = !1
    },
    _getResetData: function(a) {
      var b = parseInt("list" == this.type ? 0 : this.disItemNum / 2),
        c = a,
        d = !1,
        e = "list" == this.type ? 0 : parseFloat(this.itemHeight) * b,
        f = "list" == this.type ? this.setHeight : parseFloat(this.itemHeight) * (b + 1),
        g = this.dragHeight;
      return a >= 0 && (a > e ? (c = e, d = !0) : e >= g && (c = e - this.itemHeight * (this.size - 1), d = !0)), 0 > a && a + this.dragHeight <= f && (d = !0, c = -1 * (this.dragHeight - f)), a == c && (d = !1), {
        top: c,
        needReset: d
      }
    },
    reset: function(a) {
      var b = this,
        c = this._getResetData(a).needReset,
        d = this._getResetData(a).top;
      c ? b.dragEl.animate({
        top: d + "px"
      }, 50, "linear", function() {
        b._reset(d)
      }) : b._reset(a), this._hideScroll()
    },
    _reset: function(a) {
      this.oTop = a, this.curTop = a, "radio" == this.type && this.onTouchEnd(), this.cooling = !1
    },
    onTouchEnd: function(a) {
      a = a || this;
      var b, c, d, e, f, g = this._changed,
        h = parseInt("list" == this.type ? 0 : this.disItemNum / 2);
      if (d = this.data.length, "radio" == this.type ? (c = parseInt((this.curTop - this.itemHeight * h) / parseFloat(this.itemHeight)), this.selectedIndex = Math.abs(c), b = this.data[this.selectedIndex]) : b = this.data[this.selectedIndex], f = !1, "undefined" != typeof b.disabled && 0 == b.disabled && (e = this.selectedIndex, "radio" == this.type && this._checkSelected(this.moveState), e != this.selectedIndex && (f = !0)), f) this.setIndex(this.selectedIndex);
      else {
        var g = this._changed;
        g && "function" == typeof g && 0 != b.disabled && g.call(a, b), this.dragEl.find("li").removeClass("current"), "radio" == this.type && this.dragEl.find("li").eq(this.selectedIndex).addClass("current")
      }
    },
    reload: function(a) {
      this.data = a, this.dragEl.html(""), a.constructor == Array && a.length > 0 && (this.selectedIndex = parseInt(this.disItemNum / 2), this.selectedIndex = this.selectedIndex > this.data.length ? this.data.length - 1 : this.selectedIndex, this._checkSelected("down"), this._addItem(), this._initEventParam(), this.cooling = !1, this.setIndex(this.selectedIndex, !0), this.dragEl.find("li").removeClass("current"), "radio" == this.type && this.dragEl.find("li").eq(this.selectedIndex).addClass("current"))
    },
    setKey: function(a) {
      if (void 0 == a || null == a) return !1;
      var b = this.dataK[a] && this.dataK[a].index;
      this.setIndex(b)
    },
    setIndex: function(a, b) {
      if (void 0 == a || 0 > a) return !1;
      var c = this,
        d = parseInt(c.disItemNum / 2);
      "list" == c.type && (this.data.length == c.disItemNum ? d = a : (d = 0 == a ? 0 : 1, this.size - a < this.disItemNum && (d = -1 * parseInt(this.size) + parseInt(this.disItemNum) + parseInt(a))));
      var e, a = parseInt(a);
      if (0 > a) return !1;
      if (a >= this.data.length && (a = this.data.length - 1), this.selectedIndex = a, e = this.itemHeight * (d - a), c.oTop = e, c.curTop = e, c.cooling = !1, c.dragEl.animate({
        top: e + "px"
      }, 50, "linear"), this._setScrollTop(e, 50), "list" == c.type) {
        var f = c.dragEl.find("li");
        f.removeClass("current"), f.eq(a).addClass("current")
      }
      b || c.onTouchEnd()
    },
    getSelected: function() {
      return this.data[this.selectedIndex]
    },
    getByKey: function(a) {
      var b = this.dataK[a] && this.dataK[a].index;
      return null != b && void 0 != b ? this.data[b] : null
    },
    getMousePos: function(a) {
      var b, c;
      return b = Math.max(document.body.scrollTop, document.documentElement.scrollTop), c = Math.max(document.body.scrollLeft, document.documentElement.scrollLeft), {
        top: b + a.clientY,
        left: c + a.clientX
      }
    }
  }, a
});