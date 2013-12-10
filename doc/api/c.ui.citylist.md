# c.ui.citylist
H5 城市选择列表组件

    var cityList = new CityList({
        'element': this.els.cityList,
        'data' : {
            'inland':[
                {name:'上海',id:'2'}
            ],
            'aboard':[
                {name:'剑桥',id:'12322'}
            ]
        }
        'autoLocCity': '上海',
        'defaultDataName': 'inland',
        'itemClickFun': function (data) {
            self.citySelectAction(data);
        }
    })

## Properties 属性

### element

   城市的列表的dom根节点

### data
   包含城市数据的一个对象,对不同种类的数据如国内,国际城市可以的做为此对象的不同属性
   传入,如

    'data' : {
        'inland':[
            {name:'上海',id:'2'}
        ],
        'aboard':[
            {name:'剑桥',id:'12322'}
        ]
    }

### defaultDataName

默认显示的数据属性名,如inland显示国内城市数据

### autoLoc

是否显示自动定位栏,注意该组件并不提供自动定位功能,而只是城市列表中增加一个显示区域

### autoLocCity

设定该值,则会在自位定位栏显示该城市

### selectedCity

当前选中城市,可选

### itemClickFun

点击城市后的回调事件

## Event 事件

## Method 方法

### setData
setData(Object)

设定城市数据,data数据格式参见[data]属性

### openHotCity
openHotCity(boolean)

是否打开热点城市

    cityList,openHotCity(true)

### setSelectedCity
setSelectedCity(cityName)

设置选中城市

    cityList.setSelectedCity('上海')

### switchData

切换不同数据源的城市,如国內/国际城市,实际切换data的不同属性

    cityList.switchData('inland');
