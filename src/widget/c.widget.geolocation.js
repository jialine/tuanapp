/**********************************
* @author:   cmli@Ctrip.com
* @description:  组件Geolocation
*
* 从cUtility中分离出来的定位组件
*/
define(['cBase', 'cUtility', 'cWidgetFactory', 'cStore', 'cHybridFacade'], function (cBase, Util, WidgetFactory, cStore, Facade) {
    "use strict";

    var WIDGET_NAME = 'Geolocation';

    var KEY = '0b895f63ca21c9e82eb158f46fe7f502';

    // 如果WidgetFactory已经注册了HeaderView，就无需重复注册
    if (WidgetFactory.hasWidget(WIDGET_NAME)) {
        return;
    }

    var Geolocation = Geolocation || {};

    /**
    * 获得设备经纬度
    * @param callback {Function} 获得经纬度的回调
    * @param error {Function} 发生错误时的回调
    *
    * update caofu 更新提示语 2013-09-06
    */
    Geolocation.requestGeographic = function (callback, error) {

        var successCallback = function (position) {
            if (callback) {
                callback(position);
            }
        };

        var errorCallback = function (err) {
            var err_msg = '未能获取到您当前位置，请重试或选择城市'; // '获取经纬度失败!';
            switch (err.code) {
                case err.TIMEOUT:
                    err_msg = "获取您当前位置超时，请重试或选择城市！";
                    break;
                case err.PERMISSION_DENIED:
                    err_msg = "您拒绝了使用位置共享服务，查询已取消，请开启位置共享或选择城市！";
                    break;
                case err.POSITION_UNAVAILABLE:
                    err_msg = "获取您当前位置信息失败，请重试或选择城市！";
                    break;
            }

            if (error) {
                error(err, err_msg);
            }
        };

        window.navigator.geolocation.getCurrentPosition(successCallback, errorCallback, { enableHighAccuracy: true, maximumAge: 5000, timeout: 20000 });
    };

    /**
    * 高德api经纬度获得详细地址信息
    * @param lng {Number} 经度
    * @param lat {Number} 纬度
    * @param callback {Function} 完成时回调,回传参数为高德下发城市数据
    * @param error {Function} 超时回调
    * @param timeout {Number} 超时的时间长度，默认为8秒
    * @author ouxingzhi
    */
    Geolocation.requestAMapAddress = function (lng, lat, callback, error, timeout) {
        var region = '121.473704,31.230393';
        if (lng && lat) {
            region = lng + ',' + lat;
        }
        var param = $.param({
            'location': region,
            'key': KEY,
            'radius': 0,
            'extensions': 'all'
        });

        timeout = timeout || 8000;

        $.ajax({
            url: "http://restapi.amap.com/v3/geocode/regeo?" + param,
            dataType: 'jsonp',
            success: function (data) {
                var addrs = (data && data.regeocode) || '',
                  citys = addrs.addressComponent.city,
                  province = addrs.addressComponent.province,
                  city = '';
                if (_.isString(citys)) {
                    city = citys;
                } else if (_.isString(province)) {
                    city = province;
                }
                var info = {
                    'address': _.isString(addrs.formatted_address) ? addrs.formatted_address : '',
                    'location': region,
                    'info': addrs && addrs.addressComponent,
                    'city': city,
                    'lng': lng,
                    'lat': lat
                };
                callback && callback(info);
            },
            error: function (e) {
                error && error(e);
            },
            timeout: timeout
        });
    };

    /**
    * 高德api经纬度获得周边信息
    * @param lng {Number} 经度
    * @param lat {Number} 纬度
    * @param callback {Function} 完成时回调,回传参数为高德下发城市数据
    * @param error {Function} 超时回调
    * @param timeout {Number} 超时的时间长度，默认为8秒
    */
    Geolocation.requestAMapAround = function (lng, lat, callback, error, timeout) {
        var region = '121.473704,31.230393';
        if (lng && lat) {
            region = lng + ',' + lat;
        }
        var param = $.param({
            'location': region,
            'key': KEY,
            'radius': 500,
            'offset': 4,
            'page': 1
        });

        timeout = timeout || 8000;

        $.ajax({
            url: "http://restapi.amap.com/v3/place/around?" + param,
            dataType: 'jsonp',
            success: function (data) {
                var pois = (data && data.pois) || [];
                callback && callback(pois);
            },
            error: function (e) {
                error && error(e);
            },
            timeout: timeout
        });
    };

    /**
    * 高德api关键字查询
    * @param lng {Number} 经度
    * @param lat {Number} 纬度
    * @param callback {Function} 完成时回调,回传参数为高德下发城市数据
    * @param error {Function} 超时回调
    * @param timeout {Number} 超时的时间长度，默认为8秒
    */
    Geolocation.requestAMapKeyword = function (keywords, city, callback, error, timeout) {
        //var region = '121.473704,31.230393';
        //if (lng && lat) {
        //    //region = lng + ',' + lat;
        //}
        var param = $.param({
            'keywords': keywords,
            'city': city,
            'key': KEY,
            'offset': 10,
            'page': 1

        });

        timeout = timeout || 8000;

        $.ajax({
            url: "http://restapi.amap.com/v3/place/text?" + param,
            dataType: 'jsonp',
            success: function (data) {
                var pois = (data && data.pois) || [];
                callback && callback(pois);
            },
            error: function (e) {
                error && error(e);
            },
            timeout: timeout
        });
    };

    /**
    * @description: 获取转换过的经纬度
    * @param lng {Number} 经度
    * @param lat {Number} 维度
    * @param callback {Function} 成功回调
    * @param error {Function} 错误回调
    * @author: ouxz
    */
    Geolocation.tansformLongitude = function (lng, lat, callback, error, timeout) {
        var param = $.param({
            locations: lng + ',' + lat,
            key: KEY,
            coordsys: 'gps'
        });

        timeout = timeout || 8000;

        $.ajax({
            url: "http://restapi.amap.com/v3/assistant/coordinate/convert?" + param,
            dataType: 'jsonp',
            success: function (data) {
                if (data && data.status === '1') {
                    var l = data.locations.split(',');
                    callback && callback(l[0], l[1]);
                } else {
                    error && error();
                }
            },
            error: function (e) {
                error && error(e);
            },
            timeout: timeout
        });
    }

    /*******************************************
    * 获得城市信息
    * @param callback {Function} 成功时的回调
    * @param erro {Function} 失败时的回调
    * @param posCallback {Function} 获取经纬度成功的回调
    * @param posError {Function} 获取经纬度失败的回调
    * @param isAccurate {Boolean} 是否通过高精度查询 (如果使用高精度定位会发起两次请求，定位会需要更多时间，如只需定位城市，不需开启此开关，此开关在app中无效)
    */
    Geolocation.requestCityInfo = function (callback, error, posCallback, posError, isAccurate) {

        var _HybridLocate = function () {
            var successCallback = function (info) {
                if (info && info.locateStatus) {
                    if (info.locateStatus == -1) errorCallback('网络不通，当前无法定位', 1);
                    else if (info.locateStatus == -2) errorCallback('定位没有开启', 2);
                }

                if (info && info.value && info.value.poi) {
                  //info.value.addrs = info.value.poi.address;
                  //info.value.lat = info.value.poi.y;
                  //info.value.lng = info.value.poi.x;
                  if (info.value.poi.address && info.value.poi.address != '') {
                    info.value.addrs = info.value.poi.address;
                  } else if (info.value.poi.name && info.value.poi.name != '') {
                    info.value.addrs = info.value.poi.name;
                  }
                  if (info.value.poi.y && info.value.poi.y != '') info.value.lat = info.value.poi.y;
                  if (info.value.poi.x && info.value.poi.x != '') info.value.lng = info.value.poi.x;
                }

                //ios传ctyName,android传province
                var _city = null;

                if (info && info.value && info.value.ctyName) {
                    _city = info.value.ctyName;
                } else if (info && info.value && info.value.cityName) {
                    _city = info.value.cityName;
                } else if (info && info.value && info.value.province) {
                    _city = info.value.province.indexOf('市') > -1 ? info.value.province : info.value.subLocality;
                }

                var _address = null;
                //if (info && info.value && info.value.poi && info.value.poi.address) {
                //    _address = info.value.poi.address;
                //} else if (info && info.value) {
                //    _address = info.value.addrs;
                //}
                if (info && info.value && info.value.addrs) _address = info.value.addrs;
                var _lat = info.value.lat;
                var _lng = info.value.lng;

                if (_city && _address) {
                    if (_address.indexOf(_city) > -1) {
                        callback({ city: _city, address: _address, lng: _lng, lat: _lat });
                    } else {
                        callback({ city: _city, address: _city + _address, lng: _lng, lat: _lat });
                    }
                } else if (_lat && _lng) {

                    var locateSuccessCallback = function (data) {
                        if (callback) {
                            data.lng = _lng;
                            data.lat = _lat;
                            callback(data);
                        }
                    };

                    var locateErrorCallback = function (err, msg) {

                        if (error) {
                            error();
                        }
                    };

                    Geolocation.requestAMapAddress(_lng, _lat, locateSuccessCallback, locateErrorCallback);
                } else {
                    errorCallback('Error', 0);
                }
            };

            var errorCallback = function (err, msg) {
                if (typeof posError === 'function') {
                    posError(err, msg);
                    return;
                }
                if (error) {
                    error(msg);
                }
            };

            Facade.request({ name: Facade.METHOD_LOCATE, success: successCallback, error: errorCallback });
        };

        var _WebLocate = function () {
            var successCallback = function (pos) {
                var lng = pos.coords.longitude;
                var lat = pos.coords.latitude;
                posCallback && posCallback(lng, lat);
                var locateSuccessCallback = function (data) {
                    if (callback) {
                        callback(data);
                    }
                };

                var locateErrorCallback = function (err, msg) {

                    if (error) {
                        error();
                    }
                };
                if (!isAccurate) {
                    Geolocation.requestAMapAddress(lng, lat, locateSuccessCallback, locateErrorCallback);
                } else {
                    Geolocation.tansformLongitude(lng, lat, function (lng, lat) {
                        Geolocation.requestAMapAddress(lng, lat, locateSuccessCallback, locateErrorCallback);
                    }, function (err) {
                        locateErrorCallback(err);
                    });
                }
            };

            var errorCallback = function (err, msg) {
                if (typeof posError === 'function') {
                    posError(msg, err);
                    return;
                }
                if (error) {
                    error(msg);
                }
            };

            Geolocation.requestGeographic(successCallback, errorCallback);
        };

        var Locate = Util.isInApp() ? _HybridLocate : _WebLocate;
        Locate();
    };

    /**
    * 获得周边信息
    * @param callback {Function} 成功时的回调
    * @param erro {Function} 失败时的回调
    */
    Geolocation.requestAroundInfo = function (pos, callback, error) {
        var lng = pos.split(',')[0];
        var lat = pos.split(',')[1];

        var locateSuccessCallback = function (data) {
            if (callback) {
                callback(data);
            }
        };

        var locateErrorCallback = function () {
            if (error) {
                error();
            }
        };

        Geolocation.requestAMapAround(lng, lat, locateSuccessCallback, locateErrorCallback);
    };

    /**
    * 获得关键字查询信息
    * @param callback {Function} 成功时的回调
    * @param erro {Function} 失败时的回调
    */
    Geolocation.requestKeywordInfo = function (keywords, city, callback, error) {
        var locateSuccessCallback = function (data) {
            if (callback) {
                callback(data);
            }
        };

        var locateErrorCallback = function () {
            if (error) {
                error();
            }
        };

        Geolocation.requestAMapKeyword(keywords, city, locateSuccessCallback, locateErrorCallback);
    };

    /*******************************************
    * 保存定位城市的城市名
    * @author ouxz@ctrip.com
    */
    var PositionStore = Geolocation.PositionStore = cBase.Class(cStore, {
        __propertys__: function () {
            this.key = 'POSITION_CITY';
            this.lifeTime = '10M';
        },
        initialize: function ($super, options) {
            $super(options);
        }
    });
    /**
    * 获取经过缓存的城市信息
    * @param callback 完成时的回调
    * @param error  报错时的回调
    * @param scope  回调函数执行的上下文环境
    * @author ouxz@ctrip.com
    */
    Geolocation.requestCacheCityInfo = function (callback, error, scope) {
        var posStore = PositionStore.getInstance(),
        posinfo = posStore.get();
        if (posinfo) {
            callback && callback.call(scope, posinfo);
        } else {
            Geolocation.requestCityInfo(function (posinfo) {
                posStore.set(posinfo);
                callback && callback.call(scope, posinfo);
            }, function (msg, e) {
                error && error.call(scope, msg, e);
            });
        }
    };

    WidgetFactory.register({
        name: WIDGET_NAME,
        fn: Geolocation
    });
});
