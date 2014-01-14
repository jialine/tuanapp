# c.inherit

提供一些基本的js扩展功能,如模拟类的继承,自定义了一些基础类

## Class

Class(supClass,subProperty) ==> Object

实现类的继承,子类subProperty有两个继承的__propertys__和initialize.__propertys__中定义子类的属性,initialize显示调用父类的构造函数

    var.UserStore = new cBase.Class(AbstractStore, {
        __propertys__: function () {
            this.key = 'USER';
            this.lifetime = '1D';
        },
        initialize: function ($super, options) {
            $super(options);
        },
    });
### __propertys__

初始化方法,定义子类的属性

### initialize
构造函数实际调用点，其中的参数options便是构造函数传入的参数，在此方法中完成一些初始化操作
子类须显示调用


* * *
# extend
扩展对象  
语法 ：extend(targetObject, source1, source2, ..., source(N-1), source(N))  
参数 ：  
targetObject         : {object} 被扩充对象  
source1 ~ sourceN    :  {object} 属性/方法来源对象。  
说明:   
source(N)中的方法将会覆盖source(0~ N-1) 的同名方法/属性
source(1) ~ source(N) 中的方法将会覆盖 targetObject 中的同名方法/属性   

返回值：{object} targetObject

  
    var result = cBase.extend(targetObject, source1, source2, ..., source(N-1), source(N));
* * * 
# implement
扩充原型链  
语法 ：cBase.implement(targetObject, source);  
参数 ：  
targetObject         : {object} 被扩充对象  
source    :  [object] 属性/方法来源对象。  
说明:   
targetObject.prototype 中的方法将会被 source 中的同名方法/属性所覆盖   

返回值：{object} targetObject

  
    var result = cBase.implement(targetObject, source);
* * *