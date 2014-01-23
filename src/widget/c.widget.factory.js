/**
 * @author:       cmli@Ctrip.com
 * @description:  组件工厂，用来动态的创建组件
 */
define(['libs'], function(libs){

  "use strict";

  var WidgetFactory = WidgetFactory || {};

  WidgetFactory.products = {};

  /**
   * @description: 检查WidgetFactory是否已经注册了该名称的组件
   * @param: {name} String 组件名称
   * @return boolean
   */
  WidgetFactory.hasWidget = function(name){
    return !!(WidgetFactory.products[name]);
  };

  /**
   * @description: 向WidgetFactory注册注册组件
   * @param: {product.name} String 组件名称
   * @param: {product.fn} Function 组件，AbstractView对象
   */
  WidgetFactory.register = function(product){
    if (product && product.name && product.fn) {
      if (WidgetFactory.products[product.name]) {
        throw "WidgetFactory: widget has been register in WidgetFactory";
      }
      WidgetFactory.products[product.name] = product.fn;
    }else{
      throw "WidgetFactory: widget is lack of necessary infomation.";
    }
  };

  /**
   * @description: 通过WidgetFactory生产组件
   * @param: {name} String 组件名称
   * @return: Function 组件，AbstractView对象
   */
  WidgetFactory.create = function(name){
    return WidgetFactory.products[name];
  };

  return WidgetFactory;
});