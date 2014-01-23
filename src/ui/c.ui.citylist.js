/**
* @author oxz欧新志 <ouxz@Ctrip.com> / l_wang王磊 <l_wang@Ctrip.com>
* @class cUICitylist
* @description 城市列表相关UI插件
*/
define(['libs', 'cBase', 'cUIBase'], function (libs, cBase, uiBase) {

  var CityList = new cBase.Class({
    
    /** 相关属性 */
    __propertys__: function () {
      /** 根元素 */
      this.element = null;

      /** 展开城市时候的class */
      this.groupOpenClass = 'cityListClick';

      /** 选择城市的css样式 */
      this.selectedCityClass = 'citylistcrt';

      /** 默认城市 */
      this.autoLocCity = null;

      /** 选择的城市 */
      this.selectedCity = null;

      /** 默认国内数家 */
      this.defaultData = 'inland';

      /** 点击时候的方法 */
      this.itemClickFun = null;

      /** 数据对象 */
      this.data = null;

      /** 是否自动定位 */
      this.autoLoc = !!navigator.geolocation;

      /** 默认展开数据 */
      this.listType = this.defaultData;

    },

    /**
    * @method initialize
    * @param options {object}        构造函数（实例化）传入的参数
    * @description 构造函数入口
    */
    initialize: function (options) {
      this.setOption(options);
      this.assert();
      this._init();
    },

    /**
    * @method _init
    * @description 初始化方法
    */
    _init: function () {
      this.renderCityGroup();
      if (this.data) {
        this.renderData = this.data[this.defaultData] || [];
        this.bindClickEvent();
      }
    },

    /**
    * @method setOption
    * @param ops {Object}        设置的参数
    */
    setOption: function (ops) {
      for (var i in ops) {
        switch (i) {
          case 'groupOpenClass':
          case 'selectedCityClass':
          case 'selectedCity':
          case 'itemClickFun':
          case 'defaultData':
          case 'autoLoc':
          case 'autoLocCity':
          case 'data':
            this[i] = ops[i];
            break;
          case 'element':
            this[i] = $(ops[i]);
            break;
        }
      }
    },

    /**
    * @method assert
    * @description  将需要验证的属性加入，如果出错就不会继续执行
    */
    assert: function () {
      if (!this.element && this.element.length == 0) {
        throw 'not override element property';
      }
    },

    /**
    * @method renderCityGroup
    * @description   渲染城市分组
    */
    renderCityGroup: function () {
      var values = [];
      //如果设置了默认城市,置当前城市为选中状态
      if (this.autoLocCity && this.autoLocCity.listType == this.listType && this.autoLocCity.name) {
        values.push('<li id="' + uiBase.config.prefix + 'curCity" data-ruler="item"');
        if (!this.selectedCity || this.autoLocCity.name == this.selectedCity.name) {
          values.push(' class="' + this.selectedCityClass + '" ');
        } else {
          values.push(' class="noCrt"');
        }
        values.push(' data-value="' + this.autoLocCity.name + '"');
        values.push('>当前城市</li>');
      }

      values.push('<li id="hotCity" data-ruler="group" data-group="hotCity" class="' + this.groupOpenClass + '" >热门城市</li>');
      var groups = 'ABCDEFGHJKLMNOPQRSTWXYZ'.split('');
      //生成字母分类
      for (var i in groups) {
        values.push('<li data-ruler="group" data-group="' + groups[i] + '" id="' + groups[i] + '">' + groups[i] + '</li>');
      }
      this.element.html(values.join(''));
    },
 
    /**
    * @method groupClickHandler
    * @param group      用于分组的dom
    * @param alwaysOpen     是否打开状态
    * @description   渲染City
    */
    groupClickHandler: function (group, alwaysOpen) {
      var group = $(group);
      var dataGroup = group.attr("data-group") || group.attr("id");
      //如果分组下，没有城市列表 生成html
      if (group.children().length == 0) {
        var cities = [];
        try {
          cities = this.renderData[dataGroup];
        } catch (e) {
          console.log("city list 无" + dataGroup + "分组数据");
          return;
        }
        var values = [];
        values.push("<ul>")
        for (var i = 0, ln = cities.length; i < ln; i++) {
          var city = cities[i]
          values.push('<li class data-ruler="item" data-id="' + city.id + '"');
          values.push('>' + city.name + '</li>');
        }
        values.push("</ul>");
        group.append(values.join(''));
      }

      var clazz = group.attr("class");
      if (alwaysOpen) {
        group.addClass(this.groupOpenClass);
      } else {
        //如果已是打开状态,则关闭
        if (clazz && $.inArray(this.groupOpenClass, clazz)) {
          group.removeClass(this.groupOpenClass);
        } else {
          this.element.find('.' + this.groupOpenClass).removeClass(this.groupOpenClass);
          group.addClass(this.groupOpenClass);
        }
      }

      var pos = uiBase.getElementPos(group[0]);
      if (pos && group.attr("id") != 'hotCity') {
        //减去item的高
        $(window).scrollTop(pos.top - 60);
      }

      this.setSelectedCity(this.selectedCity);
    },

    /**
    * @method bindClickEvent
    * @description   绑定事件
    */
    bindClickEvent: function () {
      var self = this;
      this.element.delegate('li', 'click', function (e) {
        var ruler = $(this).attr('data-ruler');
        if (ruler == 'group') {
          self.groupClickHandler(this);
        } else if (ruler == 'item') {
          if (self.itemClickFun && typeof self.itemClickFun == 'function') {
            var obj = {
              id: $(this).attr("data-id"),
              name: $(this).attr("data-value") || $(this).html(),
              listType: self.listType
            }
            self.itemClickFun(obj);
          }
        }
      });
    },

    /**
    * @method bindClickEvent
    * @param attrName      
    * @description   切换国内/国际城市
    */
    switchData: function (attrName) {
      var data = this.data[attrName];
      if (data) {
        this.listType = attrName;
        this.element.undelegate('li', 'click');
        this.element.html("");
        this.renderCityGroup();
        this.renderData = data;
        this.groupClickHandler(this.element.find('#hotCity'), true);
        this.setSelectedCity(this.selectedCity);
        this.bindClickEvent();
      }
    },

    /**
    * @method bindClickEvent
    * @param city       城市
    * @description   设置默认城市
    */
    setSelectedCity: function (city) {
      var self = this;
      if (city && this.listType == city.listType && city.name) {
        var curCity = this.element.find('#' + uiBase.config.prefix + 'curCity');
        if (curCity.length > 0) {
          curCity.removeClass(this.selectedCityClass);
          curCity.addClass('noCrt');
        } else if (self.autoLocCity && self.autoLocCity.listType == this.listType && self.autoLocCity.name) {
          //如果开启了自动定位,则增加当前城市项
          var values = [];
          values.push('<li id="' + uiBase.config.prefix + 'curCity"');
          values.push('data-value="' + city.name + '" data-ruler="item">当前城市</li>');
          this.element.prepend(values.join());
        }
        this.element.find('li').each(function (i) {
          var item = $(this);
          if (item.html() == city.name || item.attr('data-value') == city.name) {
            item.removeClass('noCrt');
            item.addClass(self.selectedCityClass);
          } else {
            item.removeClass(self.selectedCityClass);
          }
        });
        this.selectedCity = city;
      }
    },

    /**
    * @method setData
    * @param data       设置数据对象
    * @description   设置数据源
    */
    setData: function (data) {
      this.element.html("");
      this.data = data;
      this._init();
    },

    /**
    * @method openHotCity
    * @param alwaysOpen       
    * @description   打开热点城市
    */
    openHotCity: function (alwaysOpen) {
      var ht = this.element.find('#hotCity');
      if (ht.length > 0) {
        this.groupClickHandler(ht, !!alwaysOpen);
      }
    }
  });
  return CityList;
});
