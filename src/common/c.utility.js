define(['libs', 'cBase', 'cStorage'], function (libs, cBase, cStorage) {
    var U = {},
    _slice = Array.prototype.slice,
    _push = Array.prototype.push,
    _toString = function (obj) {
        return Object.prototype.toString.call(obj);
    },
    CDate = cBase.Date,
    nStorage = cStorage.localStorage;

    /**
    * 对个数组格式json格式转换为正常的json格式
    */
    U.JsonArrayToObject = function (arr) {
        if (!arr) return [];
        var Keys = arr.shift(),
            List = [], obj;
        for (var i = 0, I = arr.length; i < I; i++) {
            obj = {};
            for (var t = 0, T = arr[i].length; t < T; t++) {
                switch (_toString(arr[i][t])) {
                    case '[object Array]':
                        obj[Keys[t]] = U.JsonArrayToObject(arr[i][t]);
                        break;
                    default:
                        obj[Keys[t]] = arr[i][t];
                }
            }
            List.push(obj);
        }
        return List;
    }

    //交合
    U.mix = function (obj, obj2, isEmtpy) {
        obj = obj || {};
        obj2 = obj2 || {};
        for (var i in obj2) {
            if (obj2.hasOwnProperty(i)) {
                if (!isEmtpy) {
                    obj[i] = obj2[i];
                } else if (obj2[i] !== null) {
                    obj[i] = obj2[i];
                }
            }
        }
        return obj;
    }

    /* 找出数组中指定值的位置 */
    U.indexOf = function (val, arr) {
        var index = -1, i;
        if (arr.indexOf && false) {
            index = arr.indexOf(val);
        } else {
            for (i = 0; i < arr.length; i++) {
                if (arr[i] === val) {
                    index = i;
                    break;
                }
            }
        }
        return index;
    };

    /**
    * 迭代函数
    * @param obj {Object|Array} 要循环的对象
    * @param fun {Function} 处理函数,会给该函数传递两个参数，第一个为key，第二个为value
    * @param scope {Object} 可选 ，设置处理函数this指向的对象，如不设置则为当前元素
    * @return void
    */
    U.each = function (obj, fun, scope) {
        obj = obj || {};
        fun = fun || function () { };
        var type = Object.prototype.toString.call(obj),
        i;
        if (type === '[object Array]') {
            for (i = 0; i < obj.length; i++) {
                fun.call(scope || obj[i], i, obj[i]);
            }
        } else if (type === '[object Object]') {
            for (i in obj) {
                if (obj.hasOwnProperty(i))
                    fun.call(scope || obj[i], i, obj[i]);
            }
        }
    };

    /**
    * 筛选函数
    * @param list {Array|Object} 要筛选的一个列表
    * @param filter {Function} 筛选函数
    * @return list {Array|Object} 被筛选过的结果
    */
    U.grep = function (obj, fun, onlyValue) {
        var result;
        obj = obj || {};
        fun = fun || function () { };
        var type = Object.prototype.toString.call(obj),
        i;
        if (type === '[object Array]') {
            result = [];
            for (i = 0; i < obj.length; i++) {
                if (fun(obj[i], i)) result.push(obj[i]);
            }
        } else if (type === '[object Object]') {
            onlyValue ? (result = []) : (result = {});
            for (i in obj) {
                if (obj.hasOwnProperty(i) && fun(obj[i], i)) {
                    onlyValue ? result.push(obj[i]) : (result[i] = obj[i]);
                }
            }
        }
        return result;
    };

    /**
    * 删除数组中的指定的值
    * @method U.deleteValue
    * @singleton
    * @param val {Object}
    * @param arr {Array}
    * @param {Array} 被删除的值
    */
    U.deleteValue = function (val, arr) {
        var index = U.indexOf(val, arr);
        if (index > -1) {
            return arr.splice(index, 1);
        }
        return null;
    };

    /**
    * 获取GUID
    * @returns {string}
    */
    U.getGuid = function () {
        function S4() {
            return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
        }

        function NewGuid() {
            return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
        }

        var guid = localStorage.GUID || '';
        if (!guid) {
            guid = NewGuid();
            localStorage.GUID = guid;
        }
        return guid;
    }

    /**
    * 去空格
    * @param {string} str
    * @returns {string}
    */
    U.trim = function () {
        //return str.replace(/(^\s*)|(\s*$)/g, "");
        //包括全角空格
        return function (str) {
            return str.replace(/(^[\s\u3000]*)|([\s\u3000]*$)/g, "");
        }
    };

    /**
    * 去掉字符串中的html标签
    * @param {string} str
    * @returns {string}
    */
    U.stripTags = function (str) {
        return (str || '').replace(/<[^>]+>/g, '');
    }

    U.jsonToQuery = (function () {
        var _fdata = function (data, isEncode) {
            data = data == null ? '' : data;
            data = U.trim(data.toString());
            if (isEncode) {
                return encodeURIComponent(data);
            } else {
                return data;
            }
        };
        return function (JSON, isEncode) {
            var _Qstring = [];
            if (typeof JSON == "object") {
                for (var k in JSON) {
                    if (JSON[k] instanceof Array) {
                        for (var i = 0, len = JSON[k].length; i < len; i++) {
                            _Qstring.push(k + "=" + _fdata(JSON[k][i], isEncode));
                        }
                    } else {
                        if (typeof JSON[k] != 'function') {
                            _Qstring.push(k + "=" + _fdata(JSON[k], isEncode));
                        }
                    }
                }
            }
            if (_Qstring.length) {
                return _Qstring.join("&");
            } else {
                return "";
            }
        };
    })();

    U.queryToJson = (function () {
        function isArray(o) {
            return Object.prototype.toString.call(o) === '[object Array]';
        }
        return function (QS, isDecode) {
            var _Qlist = U.trim(QS).split("&");
            var _json = {};
            var _fData = function (data) {
                if (isDecode) {
                    return decodeURIComponent(data);
                } else {
                    return data;
                }
            };
            for (var i = 0, len = _Qlist.length; i < len; i++) {
                if (_Qlist[i]) {
                    _hsh = _Qlist[i].split("=");
                    _key = _hsh[0];
                    _value = _hsh[1];

                    // 如果只有key没有value, 那么将全部丢入一个$nullName数组中
                    if (_hsh.length < 2) {
                        _value = _key;
                        _key = '$nullName';
                    }
                    // 如果缓存堆栈中没有这个数据
                    if (!_json[_key]) {
                        _json[_key] = _fData(_value);
                    }
                    // 如果堆栈中已经存在这个数据，则转换成数组存储
                    else {
                        if (isArray(_json[_key]) != true) {
                            _json[_key] = [_json[_key]];
                        }
                        _json[_key].push(_fData(_value));
                    }
                }
            }
            return _json;
        };
    })();

    /**
    * 数据类型检测，及表单效验
    * @param obj | {string}
    * @return  {Boolean}
    * @example
    * U.validate.isString(obj)
    * U.validate.isEmail(obj)
    */
    U.validate = (function () {
        var result = function () { };

        $.each("String Function Boolean RegExp Number Date Object Null Undefined".split(" "), function (i, name) {
            var fn;

            switch (name) {
                case 'Null':
                    fn = function (obj) { return obj === null; };
                    break;
                case 'Undefined':
                    fn = function (obj) { return obj === undefined; };
                    break;
                default:
                    fn = function (obj) { return new RegExp(name + ']', 'i').test(_toString(obj)) };
            }
            result['is' + name] = fn;

        });

        /**
        * validator的申明，key用来定义validator的名字，调用的时候可以使用
        * c.validate.is{Key}(value) 来调用，value用来定义validating的具体
        * 方法，方法可以定义为RegExp或者Function。
        */
        var validators = {
            Email: /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/, //email
            Qq: /^[1-9]\d{4,}$/,                   //qq
            Phone: /^[0-9]{3,4}-[0-9]{7,8}$/,      //座机
            //Url : /[a-zA-z]+://[^s]*/,              //网址
            Url: /^http(s)?:\/\/[A-Za-z0-9]+\.[A-Za-z0-9]+[\/=\?%\-&_~`@[\]\:+!]*([^<>])*$/,
            Mobile: /^1\d{10}/,                    //手机
            //IdCard : /^\d{15}$|^\d{18}$|^\d{17}[Xx]$/,//身份证
            Postcode: /^\d{6}$/,                   //邮编

            IP: function (obj) {                 //是否为IP
                if (!obj || result.isNull(obj)) return false;

                var re = /^(\d+)\.(\d+)\.(\d+)\.(\d+)$/g //匹配IP地址的正则表达式
                if (re.test(obj)) {
                    if (RegExp.$1 < 256 && RegExp.$2 < 256 && RegExp.$3 < 256 && RegExp.$4 < 256) return true;
                }

                return false;
            },

            EmptyObject: function (obj) {
                for (var name in obj) {
                    return false;
                }

                return true;
            },

            IdCard: function (idcard) {      // 验证身份证
                //var Errors = new Array("ok", "请输入正确的身份证号码!", "请输入正确的身份证号码!", "请输入正确的身份证号码!", "请输入正确的身份证号码!"); //请输入正确的身份证号码2012-9-19
                var area = { 11: "北京", 12: "天津", 13: "河北", 14: "山西", 15: "内蒙古", 21: "辽宁", 22: "吉林", 23: "黑龙江", 31: "上海", 32: "江苏", 33: "浙江", 34: "安徽", 35: "福建", 36: "江西", 37: "山东", 41: "河南", 42: "湖北", 43: "湖南", 44: "广东", 45: "广西", 46: "海南", 50: "重庆", 51: "四川", 52: "贵州", 53: "云南", 54: "西藏", 61: "陕西", 62: "甘肃", 63: "青海", 64: "宁夏", 65: "xinjiang", 71: "台湾", 81: "香港", 82: "澳门", 91: "国外" }
                var idcard, Y, JYM;
                var S, M;
                var idcard_array = new Array();
                idcard_array = idcard.split("");
                if (area[parseInt(idcard.substr(0, 2))] == null) return false;

                switch (idcard.length) {
                    case 18:
                        if (parseInt(idcard.substr(6, 4)) % 4 == 0 || (parseInt(idcard.substr(6, 4)) % 100 == 0 && parseInt(idcard.substr(6, 4)) % 4 == 0)) {
                            ereg = /^[1-9][0-9]{5}(19|20)[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|[1-2][0-9]))[0-9]{3}[0-9Xx]$/; //闰年出生日期的合法性正则表达式
                        }
                        else {
                            ereg = /^[1-9][0-9]{5}(19|20)[0-9]{2}((01|03|05|07|08|10|12)(0[1-9]|[1-2][0-9]|3[0-1])|(04|06|09|11)(0[1-9]|[1-2][0-9]|30)|02(0[1-9]|1[0-9]|2[0-8]))[0-9]{3}[0-9Xx]$/; //平年出生日期的合法性正则表达式
                        }
                        if (ereg.test(idcard)) {
                            S = (parseInt(idcard_array[0]) + parseInt(idcard_array[10])) * 7 + (parseInt(idcard_array[1]) + parseInt(idcard_array[11])) * 9 + (parseInt(idcard_array[2]) + parseInt(idcard_array[12])) * 10 + (parseInt(idcard_array[3]) + parseInt(idcard_array[13])) * 5 + (parseInt(idcard_array[4]) + parseInt(idcard_array[14])) * 8 + (parseInt(idcard_array[5]) + parseInt(idcard_array[15])) * 4 + (parseInt(idcard_array[6]) + parseInt(idcard_array[16])) * 2 + parseInt(idcard_array[7]) * 1 + parseInt(idcard_array[8]) * 6 + parseInt(idcard_array[9]) * 3;
                            Y = S % 11;
                            M = "F";
                            JYM = "10X98765432";
                            M = JYM.substr(Y, 1);
                            if (M.toUpperCase() == idcard_array[17].toUpperCase())
                                return true;
                            else
                                return false;
                        }
                        else
                            return false;
                        break;
                    default: return false; break;
                }
            },

            CharsLenWithinRange: function (value, max) {
                if (!result.isString(value)) return false;

                var reg = value.match(/\W/g);
                var length = reg == null ? value.length : value.length + reg.length;
                isValidate = length >= 0 && length <= max;

                if (!isValidate) {
                    return false;
                } else {
                    this.cutLen = value.length;
                }

                return true;
            },

            /**
            *  联系人输入控制
            *  0-13个汉字，0-26个字符
            */
            ContactName: function (value) {
                if (!result.isString(value)) return false;
                return validators.CharsLenWithinRange.call(this, value, 26);
            },

            /**
            * 备注输入控制
            * 0-50个汉字，0-100个字符
            */
            BookPS: function (value) {
                if (!result.isString(value)) return false;
                return validators.CharsLenWithinRange.call(this, value, 100);
            },

            /**
            * 备注输入控制
            * 0-50个汉字，0-100个字符
            */
            InvTitle: function (value) {
                if (!result.isString(value)) return false;
                return validators.CharsLenWithinRange.call(this, value, 100);
            },

            /**
            *
            */
            BoardTitle: function (value) {
                if (!result.isString(value)) return false;
                return validators.CharsLenWithinRange.call(this, value, 40);
            },

            /* 送达地输入控制
            *  0-40个汉字，80个字符
            */
            AreaTitle: function (value) {
                if (!result.isString(value)) return false;
                return validators.CharsLenWithinRange.call(this, value, 80);
            },

            /**
            * 11位规则
            * 不判非1规则。
            */
            MobileNumber: function (number) {
                if (!result.isString(number)) return false;

                var LEN = 11;

                return number.length == LEN && /^(\d| )+$/g.test(number);
            },

            /**
            * 少于3位或多于7位、输入含特殊字符、输入汉字等不符合航班号查询规则
            */
            FlightNumber: function (flightNumber) {
                if (!result.isString(flightNumber)) return false;

                var minLen = 3,
                    maxLen = 7;

                return flightNumber.length >= minLen && flightNumber.length <= maxLen && /^(\d|\w)+$/g.test(flightNumber);
            }
        };

        $.each(validators, function (key, value) {

            result["is" + key] = function (obj) {
                if (!obj || result.isNull(obj) || result.isNull(value)) { return false; }

                if (result.isFunction(value)) {
                    return value.call(this, obj);
                }

                if (result.isRegExp(value)) {
                    return value.test(obj);
                }

                return false;
            }
        });

        return result;

    })();

    U.cookie = (function () {
        /**
        * 读取cookie,注意cookie名字中不得带奇怪的字符，在正则表达式的所有元字符中，目前 .[]$ 是安全的。
        * @param {Object} cookie的名字
        * @return {String} cookie的值
        * @example
        * var value = co.getCookie(name);
        */
        var co = {};
        co.getCookie = function (name) {
            name = name.replace(/([\.\[\]\$])/g, '\\\$1');
            var rep = new RegExp(name + '=([^;]*)?;', 'i');
            var co = document.cookie + ';';
            var res = co.match(rep);
            if (res) {
                return unescape(res[1]) || "";
            }
            else {
                return "";
            }
        };

        /**
        * 设置cookie
        * @param {String} name cookie名
        * @param {String} value cookie值
        * @param {Number} expire Cookie有效期，单位：小时
        * @param {String} path 路径
        * @param {String} domain 域
        * @param {Boolean} secure 安全cookie
        * @example
        * co.setCookie('name','sina',null,"")
        */
        co.setCookie = function (name, value, expire, path, domain, secure) {
            var cstr = [];
            cstr.push(name + '=' + escape(value));
            if (expire) {
                var dd = new Date();
                var expires = dd.getTime() + expire * 3600000;
                dd.setTime(expires);
                cstr.push('expires=' + dd.toGMTString());
            }
            if (path) {
                cstr.push('path=' + path);
            }
            if (domain) {
                cstr.push('domain=' + domain);
            }
            if (secure) {
                cstr.push(secure);
            }
            document.cookie = cstr.join(';');
        };

        /**
        * 删除cookie
        * @param {String} name cookie名
        */
        co.deleteCookie = function (name) {
            document.cookie = name + '=;' + 'expires=Fri, 31 Dec 1999 23:59:59 GMT;';
        };
        return co;
    })();

    /**
    * 将目标字符串转换成日期对象
    * 2010/5/10 | July,2010,3,23 | Tuesday November 9 1996 7:30 PM | 2010-01-01 12:23:39
    * @param {string} source
    * @return  {Date}
    * @example
    * U.dateParse(source)
    */
    U.dateParse = function (source) {
        var reg = new RegExp("^\\d+(\\-|\\/)\\d+(\\-|\\/)\\d+\x24");
        if ('string' == typeof source) {
            if (reg.test(source) || isNaN(Date.parse(source))) {
                var d = source.split(/ |T/),
                    d1 = d.length > 1
                            ? d[1].split(/[^\d]/)
                            : [0, 0, 0],
                    d0 = d[0].split(/[^\d]/);
                return new Date(d0[0] - 0,
                                d0[1] - 1,
                                d0[2] - 0,
                                d1[0] - 0,
                                d1[1] - 0,
                                d1[2] - 0);
            } else {
                return new Date(source);
            }
        }
        return new Date();
    };

    /**
    * 获取系统时间
    * @return  {Date}
    * @example
    * U.getServerTime()
    */
    U.getServerTime = function () {
        var serverTime = U.cookie.getCookie('WAP_SERVERDATE');
        return U.dateParse(serverTime);
    }

    /**
    * 获得服务器时间
    */
    U.getServerDate = function (callback) {
        return cBase.getServerDate(callback);
    };

    /**
    * 获得设备经纬度
    * @param callback {Function} 获得经纬度的回调
    * @param error {Function} 发生错误时的回调
    * @author ouxz@ctrip.com
    * update caofu 更新提示语 2013-09-06
    */
    // U.requestGeographic = function (callback, error, timeout) {
    //     if (window.navigator.geolocation && window.navigator.geolocation.getCurrentPosition) {
    //         timeout = timeout || 12000;
    //         var isPosition = true;
    //         window.navigator.geolocation.getCurrentPosition(function (position) {
    //             isPosition = false;
    //             callback && callback(position);
    //         },
    //         function (err) {
    //             isPosition = false;
    //             var err_msg = '未能获取到您当前位置，请重试或选择城市'; // '获取经纬度失败!';
    //             switch (err.code) {
    //                 case err.TIMEOUT:
    //                     err_msg = "获取您当前位置超时，请重试或选择城市！";
    //                     break;
    //                 case err.PERMISSION_DENIED:
    //                     err_msg = "您拒绝了使用位置共享服务，查询已取消，请开启位置共享或选择城市！";
    //                     break;
    //                 case err.POSITION_UNAVAILABLE:
    //                     err_msg = "获取您当前位置信息失败，请重试或选择城市！";
    //                     break;
    //             }
    //             error && error(err, err_msg);
    //         }, { maximumAge: 864e5, timeout: timeout });
    //         setTimeout(function () {
    //             if (isPosition) {
    //                 callback = function () { };
    //                 error && error(null, '未能获取到您当前位置，请重试或选择城市');
    //             }
    //         }, timeout + 1000);
    //     } else {
    //         error && error('系统不支持定位功能！');
    //     }
    // };

    /**
    * 高德api经纬度获得城市信息
    * @param lng {Number} 经度
    * @param lat {Number} 纬度
    * @param callback {Function} 完成时回调,回传参数为高德下发城市数据
    * @param error {Function} 超时回调
    * @param timeout {Number} 超时的时间长度，默认为8秒
    * @author ouxingzhi
    */
    // U.requestAMapPosition = function (lng, lat, callback, error, timeout) {
    //     var param = $.param({
    //         'resType': 'json',
    //         'encode': 'utf-8',
    //         'range': 1,
    //         'roadnum': 0,
    //         'crossnum': 0,
    //         'poinum': 0,
    //         'retvalue': 1,
    //         'sid': 7001,
    //         'rid': 0,
    //         'region': '121.473704,31.230393',
    //         'ia': 1,
    //         'key': '0b895f63ca21c9e82eb158f46fe7f502',
    //         'region': lng + ',' + lat
    //     });

    //     var isComlete = false;
    //     timeout = timeout || 8000;
    //     window.AMap = window.AMap || {};
    //     window.AMap.MAjaxResult = [];
    //     $.ajax({
    //         url: "http://restapi.amap.com/rgeocode/simple?" + param,
    //         dataType: 'jsonp'
    //     });
    //     var reslink,
    //         getResponse = function () {
    //             if (window.AMap && window.AMap.MAjaxResult && window.AMap.MAjaxResult.length) {
    //                 clearTimeout(reslink);
    //                 isComlete = true;
    //                 var result = window.AMap.MAjaxResult[0].list && window.AMap.MAjaxResult[0].list[0] || null;
    //                 callback && callback(result);
    //             } else {
    //                 reslink = setTimeout(getResponse, 100);
    //             }
    //         };
    //     getResponse();
    //     setTimeout(function () {
    //         if (!isComlete) {
    //             callback = null;
    //             clearTimeout(reslink);
    //             error && error();
    //         }
    //     }, timeout);
    // };

    /**
    * 获得城市信息
    * @param callback {Function} 成功时的回调
    * @param erro {Function} 失败时的回调
    */
    // U.requestCityInfo = function (callback, error) {
    //     U.requestGeographic(function (pos) {
    //         var lng = pos.coords.longitude,
    //             lat = pos.coords.latitude;
    //         U.requestAMapPosition(lng, lat, function (data) {
    //             callback && callback(data);
    //         }, function () {
    //             error && error();
    //         });
    //     }, function (err, msg) {
    //         error && error(msg);
    //     });
    // }

    /**
    * 是否在APP中访问
    */
    U.isInApp = function () {
        // var data = nStorage.get('isInApp');

        // 旧版本
        var oldData = nStorage.oldGet('isInApp');
        if (oldData) {
            return oldData == '1' ? true : false;
        }

        // 新版本
        var data = nStorage.oldGet('ISINAPP');
        if (data) {
            return data == '1' ? true : false;
        }

    };


    U.isPreProduction = function () {
        var data = nStorage.oldGet('isPreProduction');
        return data
    };


    /**
    * 设置获取对象某个路径的值
    *
    */
    U.Object = {
        /**
        *   设置对象某个路径上的值
        */
        set: function (obj, path, value) {
            if (!path) return null;
            var ps = path.split('.');
            obj = obj || {}, tmp = obj;
            for (var i = 0, len = ps.length, last = Math.max(len - 1, 0); i < len; i++) {
                if (i < last) {
                    tmp = (tmp[ps[i]] = tmp[ps[i]] || {});
                } else {
                    tmp[ps[i]] = value;
                }
            }
            return obj;
        },
        /**
        *   获得对象在某个路径上的值
        */
        get: function (obj, path) {
            if (!obj || !path) return null;
            var ps = path.split('.');
            obj = obj || {}, tmp = obj;
            for (var i = 0, len = ps.length, last = Math.max(len - 1, 0); i < len; i++) {
                tmp = tmp[ps[i]];
                if (typeof tmp === 'null' || typeof tmp === 'undefined') {
                    return null;
                }
            }
            return tmp;
        }
    };

    /*****************
    * @description: 简单队列
    * @k
    */
    U.SimpleQueue = new cBase.Class({
        initialize: function () {
            this.index = 0;
            this.handlers = [];
            this.isStart = false;
        },
        add: function (handler) {
            this.handlers.push(handler);

            if (!this.isStart) {
                this.isStart = true;
                this._next();
            }
        },
        _next: function (args) {
            var handler = this.handlers.shift();
            if (handler) {
                handler.call(this, this, args);
            }
        },
        next: function () {
            this._next.apply(this, arguments);
            this.stop();

        },
        stop: function () {
            this.isStart = false;
        }
    });

    /************************
    * @description: 触发一个url
    * @author:  ouxz
    */
    U.tryUrl = function (url) {
        var iframe = document.createElement('iframe');
        iframe.height = 1;
        iframe.width = 1;
        iframe.frameBorder = 0;
        iframe.style.position = 'absolute';
        iframe.style.left = '-9999px';
        iframe.style.top = '-9999px';
        document.body.appendChild(iframe);
        U.tryUrl = function (url) {
            iframe.src = url;
        };
        U.tryUrl(url);
    };
    return U;
});
