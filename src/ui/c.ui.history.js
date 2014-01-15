/* File Created: 六月 23, 2013 */

define(['cBase', 'cUIBase', 'libs'], function (cBase, Tools, libs) {

    /* 历史记录*/
    var History = function (options) {
        //元素
        this.element;
        /* 事件定义 */
        //默认class
        this.clazz = [Tools.config.prefix + 'history'];
        //唯一的maskname
        this.maskName = "maskName";
        //自定义样式
        this.style = {};
        //背景大小偏移
        this.size = false;
        //显示数目大小
        this.listSize = 6;
        //点击回调
        this.itemClickFun = null,
        //获取焦点回调
        this.focusFun = null,
        //失去焦点回调
        this.blursFun = null,
        //输入回调
        this.inputFun = null,

        //private variable
        this._id = Tools.getCreateId();
        //最外层的层
        this._boxDom;
        //边线层
        this._borderDom;
        //内容层
        this._contDom;
        //清除按键
        this._clearButton;
        //清除按键标题
        this.clearButtonTitle = '清除搜索历史';
        //无历史记录时的标题
        this.notHistoryButtonTitle = '无搜索历史';
        //默认历史数据存取Store
        this.historyStore = null,

        this.dataSource = [],
        //自动设置尺寸的资源句柄
        this._autoLocResoure;
        //body元素
        this._bodyDom;
        //根节点
        this.rootBox;
        //设置显示下拉框
        this._oneShow = false;
        //事件定义
        var self = this;
        this.event_focus = function () {
            self.Open();
            if (typeof self.focusFun == 'function') {
                self.focusFun();
            }
        };
        this.event_blur = function () {
            /*setTimeout(function () {
            if (!self._oneShow) {
            self.Close();
            }
            self._oneShow = false;
            }, 200);*/
            if (typeof self.blurFun == 'function') {
                self.blurFun();
            }
        };
        this.event_input = function () {
            //self.Close();
            if (self.element.val() == "") {
                self._init();
                self.Open();
            }
            self.inputFun(self.element.val());
        };
        this._setOption(options);
        this._init();
    };

    History.prototype = {
        _setOption: function (options) {
            for (var i in options) {
                switch (i) {
                    case 'element':
                    case 'maskName':
                    case 'clearButtonTitle':
                    case 'style':
                    case 'dataSource':
                    case 'historyStore':
                    case 'itmeClickFun':
                    case 'focusFun':
                    case 'blurFun':
                    case 'inputFun':
                    case 'size':
                    case 'listSize':
                    case 'rootBox':
                        this[i] = options[i];
                        break;
                    case 'clazz':
                        isArray(options[i]) && (this.clazz = this.clazz.concat(options[i]));
                        isString(options[i]) && this.clazz.push(options[i]);
                        break;
                }
            }
        },
        _init: function () {
            if (this._contDom) {
                this._contDom.find('li.item').unbind('click');
                this._contDom.remove();
            }
            this._boxDom && this._boxDom.remove();
            this._CreateDom();
            this._BuildEvent();
        },
        _CreateDom: function () {
            var C = Tools.createElement;
            this._bodyDom = this.rootBox || $('body');
            this.element = $(this.element);
            this._boxDom = $(C('div', { 'id': this._id, 'class': this.clazz.join(' ') }));
            this._boxDom.css({
                'position': 'absolute',
                'display': 'none'
            });
            this._borderDom = $(C('div', { 'class': Tools.config.prefix + 'history-border' }));
            var list = [];
            //如果没有输入值，去历史记录
            if (this.element.val() == "") {
                list = this._getHistory();
            } else {
                list = this._getSubList(this.dataSource, this.listSize);
            }

            this._contDom = $(C('ul', { 'class': Tools.config.prefix + 'history-list' }));
            for (var i in list) {
                this._contDom.append('<li class="item" data_id="' + list[i].id + '">' + list[i].name + '</li>');
            }
            //如果是在历史记录中取,显示清除提示
            if (this.element.val() == "") {
                this._clearButton = $(C('li', { 'class': [Tools.config.prefix + 'clear-history clearbutton'] }));
                if (list.length > 0) {
                    this._clearButton.html(this.clearButtonTitle);
                } else {
                    this._clearButton.html(this.notHistoryButtonTitle);
                }
                this._contDom.append(this._clearButton);
            }
            this._borderDom.append(this._contDom);
            this._boxDom.append(this._borderDom);
            this._bodyDom.append(this._boxDom);
        },
        _Location: function () {
            this._boxDom.css({ height: 'auto', width: 'auto' });
            var size = Tools.getPageSize();
            var pos = Tools.getElementPos(this.element[0]),
                left = this.style.left ? this.style.left : (this.size && this.size.left ? this.size.left + pos.left : pos.left) + 'px',
                top = this.style.top ? this.style.top : (this.size && this.size.top ? this.size.top + (pos.top + this.element.height()) : (pos.top + this.element.height())) + 'px',
                width = this.style.width ? this.style.width : this.element.width() + 'px',
                height = this.size && this.size.height ? ((size.height + this.size.height) + 'px') : 'auto';
            this._boxDom.css({
                'left': left,
                'top': top,
                'width': width,
                'height': height
            });
        },
        _AutoLocation: function () {
            this._Location();
            var self = this;
            this._autoLocResoure = function () {
                self._Location();
            };
            $(window).unbind('resize', this._autoLocResoure);
            $(window).bind('resize', this._autoLocResoure);
        },
        _UnAutoLocation: function () {
            $(window).unbind('resize', this._autoLocResoure);
        },
        _BuildEvent: function () {
            var self = this;
            this._contDom.find('li.item').unbind('click').bind('click', function () {
                var d = $(this);
                self.element.val(d.text());
                self.Close();
                if (typeof self.itmeClickFun == 'function') {
                    var obj = {
                        id: d.attr("data_id"),
                        name: d.text()
                    }
                    self.itmeClickFun(obj);
                }
            });
            this.element.unbind('focus', this.event_focus);
            this.element.unbind('blur', this.event_blur);
            this.element.unbind('input', this.event_input);
            this.element.bind({
                'focus': this.event_focus,
                'blur': this.event_blur,
                'input': this.event_input
            });
            if (this.element.val() == "") {
                if (this._getHistory().length > 0) {
                    this._clearButton.bind('click', function () {
                        self.historyStore.remove();
                        self.Close();
                        self._init();
                    });
                }
            }
        },
        setOpen: function () {
            this._oneShow = true;
        },
        Open: function () {
            this._boxDom.css('z-index', Tools.getBiggerzIndex());
            this._boxDom.show();
            this._AutoLocation();
        },
        Close: function () {
            this._boxDom.hide();
            this._UnAutoLocation();
        },

        setDataSource: function (data) {
            this.dataSource = data;
            this.Close();
            this._init();
            this.Open()
        },

        addHistory: function (data) {
            var hList = this.historyStore.get() || [];
            if (!data.id) {
                data.id = 0;
            }
            //检查关键字已经查询在历史中
            var saveIdx = -1;
            for (var i = 0, ln = hList.length; i < ln; i++) {
                if (hList[i].name == data.name) {
                    saveIdx = i;
                    break;
                }
            }
            //如在历史中找到
            if (saveIdx > -1) {
                hList.splice(saveIdx, 1);
            }
            hList.unshift(data);
            this.historyStore.set(hList);
            //保存之后,重新生成dom结构
            this._init();
        },

        reset: function () {
            this._init();
        },
        //取历史记录
        _getHistory: function () {
            var hList = this.historyStore.get() || [];
            return this._getSubList(hList, this.listSize);
        },

        _getSubList: function (hList, size) {
            var ln = hList.length;
            if (ln <= size) {
                return hList;
            } else {
                return hList.slice(0, size);
            }
        }
    };
    return History;
}); 