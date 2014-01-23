/**
* @author oxz欧新志 <ouxz@Ctrip.com> / l_wang王磊 <l_wang@Ctrip.com>
* @class cDataSource
* @description 用于处理服务器端下发数据
*/
define(['libs', 'cBase'], function (libs, cBase) {

  var DataSource = new cBase.Class({

    /** 相关属性 */
    __propertys__: function () {
      this.data;
      this.filters = [];
      this.group = {};
      this.isUpdate = true;
    },

    /**
    * @method initialize
    * @param options {object}        构造函数（实例化）传入的参数
    * @description 构造函数入口
    */
    initialize: function (options) {
      this.setOption(options);
    },

    /**
    * @method setOption
    * @param options {Object}        参数对象
    * @description 设置基本属性
    */
    setOption: function (options) {
      options = options || {};
      for (var i in options) {
        switch (i) {
          case 'data':
            this.setData(data);
            break;
        }
      }
    },

    /**
    * @method setData
    * @param data {Object}        
    * @description 设置data
    */
    setData: function (data) {
      this.data = data;
      this.isUpdate = true;
    },

    /**
    * @method filter
    * @param filterfun {function}  
    * @param sortfun {function}  
    * @description 筛选data
    */
    filter: function (filterfun, sortfun) {
      if (typeof filterfun !== 'function') throw 'Screening function did not fill in';

      //l_wang 修改点，将filter变为underscore的
      var fn = function (v, i) {
        return filterfun(i, v);
      }
      
      this.filters = _.filter(this.data, fn);
      this.filters = this.filters || [];
      return typeof sortfun === 'function' ? this.filters.sort(sortfun) : this.filters;
    },

    /**
    * @method groupBy
    * @param field {function}  
    * @param filterfun {function}  
    * @description data分组
    */
    groupBy: function (field, filterfun) {

      this.group = _.filter(this.data, filterfun);
      this.group = _.groupBy(this.group, field);

      return this.group;
    }

    
  });
  return DataSource;
});