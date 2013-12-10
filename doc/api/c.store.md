# c.store

继承自[C.Class](c.base.md)

Store在整个MVC模型中中担当M的角色,在本地Storage中保存数据,并为数据记录一个过期时间,在数据有效内可以用Store进行数据存取修改操作.

用户无法直接使用Store类,必须使用继承Store的子类,通过子类的实例进行数据操作.

     //实现Store的子类
     UserStore = new cBase.Class(Store, {
            __propertys__: function () {
                this.key = 'USER';
                this.lifetime = '1D';
            },
            initialize: function ($super, options) {
                $super(options);
            },
        });
    var userStore = UserStore.getInstance();
## Properties
### pageId
ubt统计用pageId


## Properties

子类必须实现的方法,定义Store的属性,子类Store有两个属性

### key

 定义localStorage中的Key值,为String类型

### lifetime [option]

 设置Store数据的有效时间,格式为数字+单位的字符串 可选
 * D 天
 * H 小时
 * M 分钟
 * S 秒
 即1D有效期为一天,10M为10分钟

### isLocal [option]

 使用Local Storage还是Session Storage 默认为true,使用Local Storage

### defaultData [option]

 默认数据,为Object,当未能从Storage中获取数据时将返回默认数据

## Method

### getInstance

获得对象的实例,使用了单例模式

    var userStore = UserStore.getInstance();

### set

set(val,tag[option])

向Store中存放val对象,Store会将val写入浏览器Storage,可选传递tag值,tag做为val值的一个版本标记,在使用get()获取时,如果tag值不符,将无法取到数据.

    var userInfo ={
        name: '张三',
        mobile: '13578632342'
        role:{
            family: 'father',
            'company': 'ceo'
         }
    };
    userStore.set(userInfo);

### setAttr

setAttr(attrName,attrVal,tag[option])

修改Store中的attrName属性的值为attrVal,可选传递tag值,tag做为val值的一个版本标记,在使用get()获取时,如果tag值不符,将无法取到数据.
属性名attrName支持多层路径,路径间以.分隔

     userStore.setAttr('mobile',13651856150);
     userStore.setAttr('role.family','husband');

### get

get(tag[option]) ==>Object

取Store中存放的数据,如果数据未过有效期,返回数据,如果数据已经失效,返回defaultDate 或者 null.
如果传递了tag,刚取数据时会验证tag是否与Set时的tag相符.如不想符,认为数据失效.

    userStore.get()
    ==>{
           name: '张三',
           mobile: '13578632342'
           role:{
               family: 'father',
               'company': 'ceo'
           }
       };

### getAttr

get(attrName,tag[option]) ==>Object

读取Store中对象的的attrName属性,如此属性,返回undefined;属性名attrName支持多层路径,路径间以.分隔.
如果传递了tag,刚取数据时会验证tag是否与Set时的tag相符.如不想符,认为数据失效.

    userStore.getAttr('name'); ==>'张三'
    userStore.getAttr('role.family'); ==>'father'

### remove

remove()

清空Store数据,此操作也会清空浏览器Storage中的数据

    userStore.remove()

### removeAttr

removeAttr(attrName)

清空Store的指定熟悉值,此方法暂不支持层次路径

    userStore.removeAttr('mobile')
    ==>{
          name: '张三',
          role:{
              family: 'father',
              'company': 'ceo'
          }
      };

### getTag

getTag()==>String

获得set数据时Tag值,如未设定返回""

    userStore.getTag(); == ""

### setExpireTime

setExpireTime(date)

硬性设置失效时间,参数为Date类型,此方法会覆盖掉liftTime中设置的有效时长

    var data = new Date();
    userStore.setExpireTime(data.addDays(2));

### getExpireTime

getExpireTime() ==> CDate

返回数据失效时间

    userStore.getExpireTime()

