# c.ui.datasource
一个对数据进行过滤,排序功能的类

    var dateSource = new Datasource()

## Properties 属性

### data
要排序的数组

## Method

### setData

设置要排序的数组

### groupBy

groupBy(fieldName,groupFun)

对数据分组,fieldName分组字段,groupFun分组函数

    var list = dateSource.groupBy('initial', function (v) {
        var reuslt = !visited[v.id];
        visited[v.id] = true;
        return reuslt;
    }),

### filter
filter(filterFun,sortFun)
对数组筛选,排序

    var hotCitys = this.dateSource.filter(function (n, v) {
        var result = ((v.flag & 16) === 16) && !visited2[v.id];
        if (result) visited2[v.id] = true;
        return result;
    }, function (a, b) { return a.hotFlag - b.hotFlag; });
