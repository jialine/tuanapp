define(['libs', 'cBase', 'cStorage', 'CommonStore', 'cUtility', 'cWidgetFactory', 'cWidgetGeolocation', 'cWidgetGuider', 'cGeoService'], function (cBase, cStorage, libs, CommonStore, cUtility, cWidgetFactory) {
    /*
    * 地理相关的服务
    */
    var Geo = {};
    var Geolocation = cWidgetFactory.create('Geolocation');
    var Guider = cWidgetFactory.create('Guider');
    var posStore = Geolocation.PositionStore.getInstance();
    /**
    * 获取的当前城市信息
    */
    Geo.GeoLocation = function () {
        var STATE_INITIALIZE = 0,
			STATE_START = 1,
			STATE_COMPLETE = 2,
			STATE_ERROR = 3;

        //定位回调
        var handler = {},
        //初始状态
			state = STATE_INITIALIZE,
            resource = null;
        //调用回调函数

        function RunCallback(name, args, clearHandler) {
            for (var i in handler) {
                handler[i] && (typeof handler[i][name] === 'function') && handler[i][name].apply(handler[i].scope, args);
            }
            clearHandler && (handler = {});
        }

        return {
            /**
            * 获得当前城市信息
            * @param name {String} 一个字符串标记，用于标记当前请求
            * @param events {Object} 要注册的事件
            *		onStart {Function} 可选,开始时的回调
            *		onComplete {Function} 可选,完成时的回调
            *		onError {Function} 可选,当定位成功，但高德定位错误时的回调
            *       onPosComplete {Function} 可选,获取经纬度成功后的回调
            *       onPosError {Function} 可选，当定位失败的回调
            * @param scope {Object} 可选，当前执行上下文
            * @param nocache {Boolean} 可选，是否不使用缓存
            */
            Subscribe: function (name, events, scope, nocache) {
                var i;
                events = events || {};
                //之前没有注册过则加入到队列中
                if (!handler[name]) {
                    handler[name] = {
                        name: name,
                        onStart: events.onStart,
                        onComplete: events.onComplete,
                        onError: events.onError,
                        onPosComplete: events.onPosComplete,
                        onPosError: events.onPosError,
                        scope: scope
                    };
                }
                var posinfo = posStore.get();
                //此参数为真，则强制请求
                if (nocache) {
                    posinfo = null;
                }
                //有缓存直接调用成功回调，回传结果
                if (posinfo) {
                    state = STATE_START;
                    RunCallback('onStart', null);
                    state = STATE_COMPLETE;
                    RunCallback('onPosComplete', [posinfo.lng, posinfo.lat]);
                    RunCallback('onComplete', [posinfo], true);
                    //无缓存则调用加载中回调，并发起请求
                } else {
                    clearTimeout(resource);
                    resource = setTimeout(function () {
                        if (state === STATE_START) {
                          state = STATE_ERROR;
                          Guider.print({ log: '#cGeoService -- 22 second timeout call onError' });
                          RunCallback('onError', [null], true);
                        }
                    }, 35000);
                    //当在加载中时,加入队列
                    if (state === STATE_START) {
                        handler[name] && (typeof handler[name].onStart === 'function') && handler[name].onStart.call(scope);
                        return;
                    }
                    state = STATE_START;
                    RunCallback('onStart', null);
                    Guider.print({ log: '#cGeoService -- start request city info' });
                    Geolocation.requestCityInfo(function (posinfo) {
                        state = STATE_COMPLETE;
                        posStore.set(posinfo);
                        RunCallback('onComplete', [posinfo], true);
                    }, function (msg, e) {
                        state = STATE_ERROR;
                        //app那边禁用定位，这个值会返回e为2
                        if (typeof e === 'number' && e === 2) e = { code: 1 };
                        Guider.print({ log: '#cGeoService -- locate onError' });
                        RunCallback('onError', [msg, e], true);
                    }, function (lng, lat) {
                        RunCallback('onPosComplete', [lng, lat]);
                    }, function (msg, e) {
                        state = STATE_ERROR;
                        //app那边禁用定位，这个值会返回e为2
                        if (typeof e === 'number' && e === 2) e = { code: 1 };
                        RunCallback('onPosError', [msg, e], true);
                    }, true);

                }
            },
            /**
            * 取消某个请求服务
            */
            UnSubscribe: function (name) {
                name = _.isArray(name) ? name : [name];
                for (var i = 0; i < name.length; i++) delete handler[name[i]];
            },
            /**
            * 清空缓存
            */
            ClearPosition: function () {
                posStore.remove();
            }
        };
    } ();

    /**
    * 获得周边查询信息
    */
    Geo.GeoAround = function () {

        return {
            /**
            * 获得周边查询信息
            * @param onComplete {Function} 完成时的回调
            *		  onError {Function} 错误时的回调
            * @param scope {Object} 可选，当前执行上下文
            */
            Subscribe: function (pos, onComplete, onError, scope) {
                Geolocation.requestAroundInfo(pos, function (posinfo) {
                    onComplete.call(scope, posinfo);
                }, function (e) {
                    onError.call(scope);
                });
            }
        }

    } ();

    /**
    * 获得关键字查询信息
    */
    Geo.GeoKeyword = function () {

        return {
            /**
            * 获得关键字查询信息
            * @param onComplete {Function} 完成时的回调
            *		  onError {Function} 错误时的回调
            * @param scope {Object} 可选，当前执行上下文
            */
            Subscribe: function (keywords, city, onComplete, onError, scope) {
                Geolocation.requestKeywordInfo(keywords, city, function (posinfo) {
                    onComplete.call(scope, posinfo);
                }, function (e) {
                    onError.call(scope);
                });
            }
        }

    } ();

    return Geo;

});