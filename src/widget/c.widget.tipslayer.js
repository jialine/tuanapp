define(['cBase', 'cUILayer', 'cUIBase', 'cUIMask', 'cWidgetFactory', 'cUIScrollLayer', 'libs'], function (cBase, Layer, uiBase,, Mask, WidgetFactory, ScrollLayer) {
  "use strict";

  var WIDGET_NAME = 'TipsLayer';

  // 如果WidgetFactory已经注册了ListView，就无需重复注册
  if (WidgetFactory.hasWidget(WIDGET_NAME)) {
    return;
  }

  /**
  * 显示控件，初始化时传入title与html即可
  */
  var TipsLayer = new cBase.Class(Layer, {
    __propertys__: function () {
      this.contentDom;
      this.title = '';
      this.body = '';
      this.mask = new Mask({
        classNames: [uiBase.config.prefix + 'opacitymask']
      });
      var scope = this;
      this.mask.addEvent('onShow', function () {
        this.setzIndexTop(-1);
        $(window).bind('resize', this.onResize);
        this.onResize();
        var scope1 = this;
        this.root.bind('click', function () {
          scope1.hide();
          scope1.root.unbind('click');
          scope.hide();
        });

        //this.root.bind('click',)
      });
      this._loadButtonHtml = function () {
        if (this.buttons.length == 0) {
          return "";
        }
        var btnHtml = ['<div class="cui-roller-btns">'];
        $.each(this.buttons, function (index, item) {
          var cls = 'cui-btns-sure';
          //如果没传按钮类型,认为是确认按钮
          if (item.type == 'cancle') {
            cls = 'cui-btns-cancle';
          }
          btnHtml.push('<div class="cui-flexbd ' + cls + '">' + item.text + '</div>');
        });
        btnHtml.push('</div>');
        return btnHtml.join('')
      },

            this.html = '';
    },
    initialize: function ($super, options) {

      $super({
        onCreate: function () {

        },
        onShow: function () {
          this.title = options.title || '';
          this.buttons = options.buttons || [];
          this.html = options.html || '';
          this.html = $(this.html);
          this.btns = $(this._loadButtonHtml());

          this.buttons = options.buttons || [];
          this.contentDom.html([
                        '<div class="cui-pop-box">',
                             '<div class="cui-hd">' + this.title + '<label class="label"><span class="cui-top-close">×</span></label></div>',
                             '<div class="cui-bd" style="overflow: hidden; position: relative; background-color: #fafafa;">',
                             '</div>',
                        '</div>'
                        ].join(''));
          this.mask.show();
          this.reposition();

          this.closeDom = this.contentDom.find('.cui-top-close').parent();
          this.body = this.contentDom.find('.cui-bd');
          this.html.css('background-color', 'white')

          //检测高度，高度过高就需要处理
          $('body').append(this.html);
          var _h = this.html.height();
          if (options.height)  _h = options.height;
          if (_h > 350) _h = 300;
          this.body.css({
            'height': _h + 'px'
          });

          this.s = new ScrollLayer({
            wrapper: this.body,
            body: this.html
          });

          this.contentDom.find('.cui-pop-box').append(this.btns);

          var scope = this;
          this.closeDom.on('click', function () {
            scope.hide();
          });

          $.each(this.btns, function (index, item) {
            var handler = scope.buttons[index].click;
            $(item).on('click', function () {
              handler.call(scope);
            });
          });

          this.setHtml = function (html) {
            scope.body.html(html);
          };

          var s = '';
        },
        onHide: function () {
          this.mask.hide();
          this.closeDom.off('click');
          this.s.removeEvent();
          //                    this.root.remove();
          //                    this.mask.root.remove();
        }
      })
    }
  });

  WidgetFactory.register({
    name: WIDGET_NAME,
    fn: TipsLayer
  });


});