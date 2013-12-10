# c.storage


本类封装了最基本的浏览器Storage操作,不推荐直接使用,而是通过[Store](c.store.md)进行数据操作.
在Storage中存放的数据为JSON格式的字符串.

    {
        value: {
            name : '张三',
            mobile: '13651856143',
        },
        timeout: "2013/11/24 12:00:00",
        tag: "dfaefaefaefjieg3212dfadf",
        savedate: '2013/10/24 12:00:00'
    }

另外,storage也提供了对H5旧格式的Storage数据存取方法,旧格式的存取不考虑timeout字段,直接返回Storage中的值.

c.storage的方法可适用于localStorage和sessionStorage,

## Method

### set

 set(key, value, timeout[option], tag[option], savedate[option])

向storage中写值,key为键值,其余参数包装为JSON对象,将JSON格式字符串写入storage

### get

 get(key,tag)

读去storage中的值,如果数据未失效,返回存放数据结构中的value值.

### getTag

  getTag()

返回存放数据结构中的tag值

### getSaveDate

getSaveDate() ==>C.Date

返回数据结构中的saveDate

### getExpireTime

getExpireTime() ==>C.Date

返回数据结构中的timeout

### remove

remove(key)

删除storage中指定key值的记录

    localstorage.remove('FLIGHT_LIST');

### getAll

getAll() ==> Array

返回Storage中存储的所有记录


### clear

clear()

清掉storage中所有的值

### oldSet

oldSet(key,value)

Storage 为 兼容 H5 旧Store格式的方法,写入键值为key的记录value,不验证value的格式.

     window.localstorage.oldSet('HOTEL_NAME','如家');

### oldGet

oldGet(key) == Object;

Storage 为 兼容 H5 旧Store格式的方法,取key对应的记录数据,如数据中包含timemout字段,验证数据有效性.如无此字段,直接
返回数据记录

    window.localstorage.oldGet('HOTEL_NAME') ==> '如家'

### oldRemove

oldRemove(key)

Storage 为 兼容 H5 旧Store格式的方法,删除key对应的记录

    window.localstorage.oldRemove('HOTEL_NAME')


