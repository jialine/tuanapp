# c.multiple.data

该类用于多model情况下,依次执行各个Model,并将各个Model的的执行结果返回

    var baseDataModel = new cMultipleDate({
        models: {
            'FlightCityList': FlightModel.FlightCityListModel.getInstance(),
            'FlightInterCityList': FlightModel.FlightInterCityListModel.getInstance()
        }
    });

## Propertys

### models
 设置多个需要执行的model

## Method

### addModel
addModel(name, model)
用于添加单个model

### addModels(models)

用于添加model集合

### removeModelByName(name)

根据键值删除model

### removeModelByIndex(index)

根据索引删除model

### excute(onComplete, onError, isAjax, scope, onAbort)

执行所有model的ajax请求





































