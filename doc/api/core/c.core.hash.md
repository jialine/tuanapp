# c.core.hash类

javascript模拟的Hash容器

    var hash = new C.Hash();

## Method

### length
hash.length()
获取数据数量

    var length = hash.length();

### getItem
getItem(key)
获取指定键值

    var value = hash.getItem("key");

### getKey
getKey(index)
 根据传入的索引值返回键名

    var key = hash.getkey(1);

### index
index(index)
根据传入的索引值返回键值

    var value = hash.index(1);

### add
add(key, value)
增加一个键值对

    hash.add("key", "value");

### del
del(key)
根据传入的 Key 删除，对应的键值对

    hash.del(key, value);

###  delByIndex
delByIndex(index)
根据索引值删除指定的键值对

    hash.delByIndex(1);

### pop
pop()
移除栈顶的hash，并返回出栈键值

    var topHash = hash.pop();

### push
push()
向栈顶压入hash

    hash.push(key, value, order);

### indexOf
indexOf()
根据传入的 value 返回第一匹配的key，不存在匹配时返回 -1

    var key = hash.indexOf(value);


### shift
shift()
移除栈底的hash，返回此 hash 键值
    var value = hash.shift();


### unshift
unshift(key, value, order)
往队列头部插入hash
    hash.unshift(key, value, order);


### slice
slice(start, end)
返回一个hash表的一段

    var subHash = hash.slice(0, 2);

### splice
splice(start, count)
从一个hash中移除一个或多个元素，如果必要，在所移除元素的位置上插入新元素，返回所移除的元素。

    hash.splice(0, 2);

### toString
toString()
返回 JASON 字符串

    hash.toString();

### filter
filter(hander)
返回数组中的满足回调函数中指定条件的元素。


     hash.filter(hander);

### each
each(hander)
为每个匹配元素规定运行的函数

     hash.each(hander);

### valueOf
valueOf()
返回hash对象的原始对象

     hash.valueOf();


### sortBy
sortBy()
根据 handle 返回值 对hash对象键值对进行排序徐

     hash.sortBy(handle);     