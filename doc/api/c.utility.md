# c.utility

本类提供一些常用的工具方法。

## Method

### mix

mix(destination,source) ==> destination

复制source对象中的所有属性覆盖到destination对象上，并且返回 destination 对象.复制是按顺序的, 所以后面的对象属性会把前面的对象属性覆盖掉(如果有重复).

    c.utility.mix({name: 'moe'}, {age: 50});
    ==>{name: "moe", age: 50}

### each

each(list,fun,[context])

遍历对象或数组中每个元素或键值对象,对每一个对象调用fun方法.

    c.utility.each(list,function(k,v){
    });

### deleteValue

deleteValue(arr,val) ==>val

删除数组中的指定的值.如成功返回,否则返回null

    c.utility.deleteValue([1,2,4,3],2)
    ==> [1,4.3]

### getGuid

getGuid() ==> guiId

生成唯一ID字符串,此函数首先会在localStorage中查找key为GUID的值,如没有找到则生成一个20位的随机字符串,并把此ID存至localstorage.

    c.utility.getGuid()
    ==>eb5edcb3-a2c5-0185-cda6-83e26626a641

### trim

trim(str) ==> str

去除字符串str中的空格.

    c.utility.trim('相  见')
    ==>'相见''

### getServerDate

getServerDate(callback)

获取系统时间,并执行回调函数

    c.utility.getServerDate(function(data){
    });

### isInApp

isInApp() ==>boolean

判断是否为APP嵌入环境

    c.utility.isInApp() ==> false

### dateParse

dateParse(dateStr) ==> Date

根据日期字符串dateStr返回Date对象,支持的日期字符串格式有2010/5/10 | July,2010,3,23 | Tuesday November 9 1996 7:30 PM | 2010-01-01 12:23:39

    ##c.utility.dateParse('2013/10/22')
    ==> Date类型Tue Oct 22 2013 00:00:00 GMT+0800 (中国标准时间)
# validate

提供一系列验证方法

## Methd
### isEmail

isEmail(val) ==>boolean

是否符合Email的验证规则

    c.utility.validate.isEmail('swdd@ctrip.com') ==>true
### isQq

isQq(val) ==>boolean

是否符合QQ号码的验证规则

    c.utility.validate.isQq('248697154') ==>true
### isPhone

isPhone(val) ==>boolean

是否符合座机号码的验证规则

    c.utility.validate.isPhone('3428512') ==>true
### isUrl

isUrl(val) ==>boolean

是否符合url的验证规则

    c.utility.validate.isUrl('http://www.ctrip.com') ==>true

### isPostcode

isPostcode(val) ==>boolean

是否符合邮政编码的验证规则

    c.utility.validate.isPostcode('256656') ==>true
### isIP

isIP(val) ==>boolean

是否符合IP的验证规则

    c.utility.validate.isIP('192.168.0.1') ==>true
### isEmptyObject

isEmptyObject(val) ==>boolean

如果object 不包含任何值(没有可枚举的属性)，返回true。

 c.utility.validate.isEmptyObject({}) ==>true

### isIdCard

isIdCard(val) ==>boolean

是否符合中国大陆身份证号码的验证规则

    c.utility.validate.isIdCard('3232432') ==>false
### isContactName

isContactName(val) ==>boolean

是否符合联系人姓名的验证规则,0-13个汉字，0-26个字符

     c.utility.validate.isIdCard('张三') ==>true
### isBookPS

isBookPS(val) ==>boolean

是否符合备注的验证规则, 0-50个汉字，0-100个字符

     c.utility.validate.isBookPS('张三') ==>true
### isInvTitle

isInvTitle(val) ==>boolean

是否符合发票抬头的验证规则, 0-50个汉字，0-100个字符

     c.utility.validate.isInvTitle('张三') ==>true

### isAreaTitle

isAreaTitle(val) ==>boolean

是否符合送达地的验证规则, 0-40个汉字，80个字符

     c.utility.validate.isAreaTitle('张三') ==>true

### isMobileNumber

isMobileNumber(val) ==>boolean
是否符合联系人手机号码的验证规则,11个数字

     c.utility.validate.isMobileNumber('13651856150') ==>true

### isFlightNumber

isFlightNumber(val) ==>boolean

是否符合航班号的验证规则,少于3位或多于7位、输入含特殊字符、输入汉字等不符合航班号查询规则

     c.utility.validate.isFlightNumber('MU2561') ==>true

# cookie

提供cookie操作方法.

## Mehtod
### setCookie

 setCookie(cookieName, cookieVal, [expire], [path],[domain], [secure])
根据指定的cookieName保存cookie值cookieVal.

     c.utility.cookie.setCookie('testcookie','cookie value')
### getCookie
 getCookie(cookieName) ==>String

读取cookie,注意cookie名字中不得带奇怪的字符，在正则表达式的所有元字符中，目前 .[]$ 是安全的.

    c.utility.cookie.getCookie('testcookie')
    ==>'cookie value'

### deleteCookie
  deleteCookie(cookieName) ==>String

根据指定的cookieName,删除cookie

    c.utility.deleteCookie('cookieName')

# Object

提供对Object对象操作的方法

## Method

### set

  set(obj, path, value) ==>Object

设置对象obj某个path上的值value,如果是多层次路径,path用.做分割

     var obj = {
                   name: 'polly',
                   profile:{
                       owner:'张三'
                       }
               };
     c.utility.Object.set(obj,'profile.owner','张三')
     ==>{
            name: 'polly',
            profile:{
                owner:'张三'
                }
        }
### get

get(obj, path) ==>Object

获得对象obj在某个路径path上的值,如果是多层次路径,path用.做分割.

    c.utility.Object.get(obj,'profile.owner')
    ==>'张三'
