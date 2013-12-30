define(['cBase', 'cUICore', 'cWidgetFactory', 'libs'], function(cBase, cUICore, WidgetFactory){
  "use strict";

  var WIDGET_NAME = 'Slide';

  // 如果WidgetFactory已经注册了ListView，就无需重复注册
  if (WidgetFactory.hasWidget(WIDGET_NAME)) {
    return;
  }

  /**
  * slide图片展示
  * by ouxingzhi
  * @Options {
  *     //图片集
  *     images:[
  *       {
  *      title:'',
  *      src:'',
  *      link:''
  *      }
  *     ],
  *     //是否自动播放
  *     autoplay:true,
  *     //显示第几张
  *     index:0,
  *     //是否增页循环
  *     loop:true
  *   }
  */
var Slide = new cBase.Class({
    __propertys__: function () {
        /* 参数部分 */
        //图片列表
        this.images = [];
        //当前索引
        this.index = 1;
        //延迟多长时间跳转
        this.delay = 3;
        //默认索引
        this.defaultIndex;
        //是否自动播放
        this.autoplay = false;
        //页面根节点
        this.root;
        //图片内部层
        this.imageinter;
        //图片外部层
        this.imageouter;
        //导航层
        this.navbox;
        //导航
        this.navs;
        //导航内层
        this.navinter;
        //容器
        this.container;
        //内容器的宽度
        this.interWidth;
        //单个图片的宽度
        this.itemWidth;
        //当图片切换时触发
        this.onchange = function () { };
        //图片加载失败时触发
        this.onerror = function () { };
        //是否循环
        this.loop = true;
        //状态
        this.ENUM_STATE_EMPTY = 0;
        this.ENUM_STATE_NOTEMPTY = 1;
        this.state = this.ENUM_STATE_EMPTY;
        this.notimage = '';
        //无数据时显示的层
        this.notimagedom;
        //记录setTimeout的记录
        this.setTimeoutResoure;
        //slide是否在动画中
        this.isMove = false;
        //移动方向已定
        this.dirs = {
            'left': 'next',
            'right': 'pre'
        };
        //默认方向
        this.dir = 'left';
        //记录touchstart时手指的位置
        this.startX = 0;
        this.startY = 0;
    },
    initialize: function (options) {
        this.setOption(options);
        //初始化结构
        this.createLayout();
        //加入图片
        this.addImageItems();
        //计算宽度
        setTimeout($.proxy(function () {

            this.calcinterWidth();
            if (this.state === this.ENUM_STATE_NOTEMPTY) {
                this.initposition();
                if (this.autoplay) {
                    this.play();
                }
                if (this.images && this.images.length > 1) this.buildEvent();
            }
        }, this), 1);
    },
    setOption: function (ops) {
        for (var i in ops) {
            switch (i) {
                case 'autoplay':
                case 'defaultIndex':
                case 'container':
                case 'notimage':
                case 'delay':
                case 'dir':
                case 'loop':
                case 'onchange':
                case 'onerror':
                    this[i] = ops[i];
                    break;
                case 'images':
                    if (ops[i] && typeof ops[i][0] === 'string') {
                        var imgs = [];
                        for (var t = 0, len = ops[i].length; t < len; t++) {
                            imgs.push({
                                src: ops[i][t]
                            });
                        }
                        this[i] = imgs;
                    } else {
                        this[i] = ops[i];
                    }
                    break;
            }
        }
    },
    initposition: function () {
        this.go(this.index, function () { }, true);
        this.onchange(this.index, this.index);
        var pi = this.calcNextIndex();
        this.setNavCurrent(pi);
    },
    //创建一个布局结构
    createLayout: function () {
        this.root = $([
                '<div class="' + cUICore.config.prefix + 'slide">',
                    '<div class="' + cUICore.config.prefix + 'slide-imgsouter">',
                        '<div class="' + cUICore.config.prefix + 'slide-imgsinter">',
                        '</div>',
                    '</div>',
                    '<div class="' + cUICore.config.prefix + 'slide-nav">',
                        '<div class="' + cUICore.config.prefix + 'slide-nav-padding">',
                        '</div>',
                    '</div>',
                '</div>'
            ].join(''));
        this.imageouter = this.root.find('.' + cUICore.config.prefix + 'slide-imgsouter');
        this.imageinter = this.root.find('.' + cUICore.config.prefix + 'slide-imgsinter');
        this.navbox = this.root.find('.' + cUICore.config.prefix + 'slide-nav');
        this.navinter = this.root.find('.' + cUICore.config.prefix + 'slide-nav-padding');
        this.container.empty().append(this.root);
    },
    //计算图片内容器的宽度
    calcinterWidth: function () {
        var subs = this.imageinter.find('.' + cUICore.config.prefix + 'slide-img-item'),
                width = 0;

        this.interWidth = width;
        this.itemWidth = this.imageouter.width();
        subs.css('width', this.itemWidth + 'px');
        subs.each(function () {
            width += $(this).width();
        });
        this.imageinter.css('width', width + 'px');
    },
    //创建一个图片项
    createImageItem: function (obj, current, Class) {
        var cls = [cUICore.config.prefix + 'slide-img-item'];
        if (current) cls.push(cUICore.config.prefix + 'slide-img-item-current');
        if (Class) [].push.call(cls, Class);
        var item = $([
                '<div class="' + cls.join(' ') + '">',
                    '<a href="' + (obj.link ? obj.link : 'javascript:void(0);') + '"><img src="' + obj.src + '" title="' + (obj.title || '') + '"/></a>',
                '</div>'
            ].join(''));
        var self = this;
        item.find('img').bind('error', function () {
            var img = this;
            setTimeout(function () {
                self.notimage && (img.src = self.notimage);
                self.onerror && self.onerror(img);
                $(img).unbind('error');
            }, 100);
        });
        return item;
    },
    addEmptyItem: function (obj) {
        var cls = [cUICore.config.prefix + 'slide-img-item', cUICore.config.prefix + 'slide-img-item-empey'];
        this.notimagedom = $('<div class="' + cls.join(' ') + '"></div>');
        this.notimagedom.append(obj);
        this.imageinter.append(this.notimagedom);
    },
    addImageItems: function () {
        for (var i = 0, len = this.images.length, img; i < len; i++) {
            this.addItem(this.images[i], this.defaultIndex === i);
        }
        var firstItem, lastItem;
        if (this.images.length) {
            this.state = this.ENUM_STATE_NOTEMPTY;
            firstItem = this.createImageItem(this.images[0], null, [cUICore.config.prefix + 'slide-img-pre']);
            lastItem = this.createImageItem(this.images[Math.max(0, this.images.length - 1)], null, [cUICore.config.prefix + 'slide-img-last']);
            if (!this.loop) {
                firstItem.css({ visibility: 'hidden' });
                lastItem.css({ visibility: 'hidden' });
            }
            this.imageinter.append(firstItem);
            this.imageinter.prepend(lastItem);
            this.navs = this.navinter.find('.' + cUICore.config.prefix + 'slide-nav-item');
        } else {
            this.state = this.ENUM_STATE_EMPTY;
            this.addEmptyItem(this.notimage);
        }
    },
    buildEvent: function () {
        this.imageouter.bind('touchstart', $.proxy(this.onTouchStart, this));
        this.imageouter.bind('touchmove', $.proxy(this.onTouchMove, this));
        this.imageouter.bind('touchend', $.proxy(this.onTouchEnd, this));
        this.imageouter.bind('touchcancel', $.proxy(this.onTouchEnd, this));
    },
    onTouchStart: function (e) {
        e.preventDefault();
        if (this.isMove) {
            this.isTouchStart = false;
            return;
        }
        this.isTouchStart = true;
        var pos = cUICore.Tools.getMousePosOfElement(e.targetTouches[0], e.currentTarget);
        this.stop();
        this.startX = pos.x;
        this.startY = pos.y;
        this.imageinterLeft = parseInt(this.imageinter.css('left'));
    },
    onTouchMove: function (e) {
        e.preventDefault();
        if (this.isMove || !this.isTouchStart) {
            return;
        }
        var pos = cUICore.Tools.getMousePosOfElement(e.targetTouches[0], e.currentTarget);
        var diffX = pos.x - this.startX,
                diffY = pos.y - this.startY;
        this.imageinter.css('left', (this.imageinterLeft + diffX) + 'px');
    },
    onTouchEnd: function (e) {
        e.preventDefault();
        if (this.isMove || !this.isTouchStart) {
            return;
        }
        var pos = cUICore.Tools.getMousePosOfElement(e.changedTouches[0], e.currentTarget);
        var diffX = pos.x - this.startX,
                diffY = pos.y - this.startY,
                callback = $.proxy(function () {
                    this.autoplay && this.loop && this.play();
                }, this);
        var pi = this.calcNextIndex() + 1,
                len = this.images.length;

        if (diffX > 50 && this.loop || (diffX > 50 && !this.loop && pi !== 1)) {
            this.pre(callback);
        } else if (diffX < -50 && this.loop || (diffX < -50 && !this.loop && pi < len)) {
            this.next(callback);
        } else {
            this.imageinter.animate({ left: this.imageinterLeft + 'px' }, null, callback)
        }
    },
    //创建一个导航
    createNavItem: function (current) {
        return $([
                '<span class="' + cUICore.config.prefix + 'slide-nav-item' + (current ? cUICore.config.prefix + 'slide-nav-item-current' : '') + '"></span>'
            ].join(''));
    },
    addItem: function (obj, current) {
        var img = this.createImageItem(obj, current),
                navItem = this.createNavItem(current);
        this.imageinter.append(img);
        this.navinter.append(navItem);
    },
    play: function () {
        clearInterval(this.setTimeoutResoure);
        if (!this.images || this.images.length < 2) return;
        this.setTimeoutResoure = setInterval($.proxy(function () {
            this[this.dirs[this.dir]]();
        }, this), this.delay * 1000);
    },
    stop: function () {
        clearInterval(this.setTimeoutResoure);
    },
    go: function (i, callback, cancelAnimte) {
        this.isMove = true;
        var left = -(this.itemWidth * i);
        if (cancelAnimte) {
            this.imageinter.css({
                'left': left + 'px'
            });
            this.isMove = false;
            callback && callback();
        } else {
            this.imageinter.animate({
                'left': left + 'px'
            }, null, null, $.proxy(function () {
                this.isMove = false;
                callback && callback();
            }, this));
        }
    },
    next: function (callback) {
        var lastIndex = this.index;
        this.go(++this.index, $.proxy(function () {
            if (this.index === this.images.length + 1) {
                this.index = 1;
                var left = -(this.itemWidth * this.index);
                this.imageinter.css({ 'left': left + 'px' });
            }
            var pi = this.calcNextIndex();
            this.setNavCurrent(pi);
            this.onchange(this.index, lastIndex);
            callback && callback();
        }, this));
    },
    setNavCurrent: function (pi) {
        this.navs.removeClass(cUICore.config.prefix + 'slide-nav-item-current');
        $(this.navs.get(pi)).addClass(cUICore.config.prefix + 'slide-nav-item-current');
    },
    calcNextIndex: function () {
        return this.index > this.images.length ? 0 : (this.index - 1);
    },
    pre: function (callback) {
        this.index == 0 && (this.index = 1);
        var lastIndex = this.index;
        this.go(--this.index, $.proxy(function () {
            if (this.index === 0) {
                this.index = this.images.length;
                var left = -(this.itemWidth * this.index);
                this.imageinter.css({ 'left': left + 'px' });

            }
            var pi = this.calcPreIndex();
            this.setNavCurrent(pi);
            this.onchange(this.index, lastIndex);
            callback && callback();
        }, this));
    },
    calcPreIndex: function () {
        return this.index < 1 ? Math.max(0, this.images.length - 1) : this.index - 1;
    },
    empty: function () {
        this.stop();
        this.imageinter.find('img').remove();
    }
});

  // return Slide;
  WidgetFactory.register({
    name: WIDGET_NAME,
    fn: Slide
  });


});