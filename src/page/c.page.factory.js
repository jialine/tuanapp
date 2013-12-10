/**********************************
 * @author:       cmli@Ctrip.com
 * @description:  常用页面工厂，用来动态的创建常用页面
 */
define(['libs'], function(libs){
  "use strict";

  var CommonPageFactory = CommonPageFactory || {};

  CommonPageFactory.products = {};

  /********************************
   * @description: 检查CommonPageFactory是否已经注册了该名称的常用页面
   * @param: {name} String 常用页面名称
   * @return boolean
   */
  CommonPageFactory.hasPage = function(name){
    return !!(CommonPageFactory.products[name]);
  };

  /********************************
   * @description: 向CommonPageFactory注册常用页面
   * @param: {product.name} String 常用页面名称
   * @param: {product.fn} Function 常用页面，Backbone.View对象
   */
  CommonPageFactory.register = function(product){
    if (product && product.name && product.fn) {
      if (CommonPageFactory.products[product.name]) {
        throw "CommonPageFactory: factory has been register in CommonPageFactory";
      }
      CommonPageFactory.products[product.name] = product.fn;
    }else{
      throw "CommonPageFactory: factory is lack of necessary infomation.";
    }
  };

  /********************************
   * @description: 通过CommonPageFactory生产常用页面
   * @param: {name} String 常用页面名称
   * @return: Function 常用页面，AbstractView对象
   */
  CommonPageFactory.create = function(name){
    return CommonPageFactory.products[name];
  };

  return CommonPageFactory;
});