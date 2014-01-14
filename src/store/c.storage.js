/**
*  Ctrip storage Module
*  Author: shbzhang@ctrip.com
**/
define(['cCoreDate', 'cBusinessServertime'], function (cCoreDate, cBusinessServertime) {
    var EJSON = window.JSON;
    // var CDate = cBase.Date;
    var Storage = (function () {
        function buildStorageObj(value, timeout, tag, savedate, oldVal) {
            return {
                value: value,
                oldvalue: oldVal || {},
                timeout: timeout,
                tag: tag,
                savedate: savedate
            }
        }

        function Stoge(proxy) {
            this.proxy = proxy;
        }
        Stoge.prototype = {
            constructor: Stoge,

            /**
            * 存储Key-Value
            * @param {String} key
            * @param {Object} value
            * @param {CDate} timeout 可选 超时时间
            * @param {String|Number} tag 可选 标记，用于标记数据
            * @param {Data} savedate
            * @param {Object} oldVal 可选,上个版本值
            * @return {boolean} 成功返回true,失败返回false
            */
            set: function (key, value, timeout, tag, savedate, oldVal) {
                savedate = savedate || (new CDate()).format('Y/m/d H:i:s');
                timeout = timeout ? new CDate(timeout) : new CDate().addDay(30);
                var entity = buildStorageObj(value, timeout.format('Y/m/d H:i:s'), tag, savedate, oldVal);
                try {
                    this.proxy.setItem(key, EJSON.stringify(entity));
                    return true;
                } catch (e) {
                    console && console.log(e);
                }
                return false;
            },


            /**
            * 根据key获取value值,如传递attrName,则返回value的指定属性值,
            * 如指定的key或attrName未定义返回null
            * @param {Sring} key
            * @param {String} tag
            * @param {boolean} oldFlag 默认为false,是否返回上一版本
            */
            get: function (key, tag, oldFlag) {
                var result, value = null;
                try {
                    result = this.proxy.getItem(key);
                    if (result) {
                        result = EJSON.parse(result);
                        if (CDate.parse(result.timeout,true) >= new Date()) {
                            if (tag) {
                                if (tag === result.tag) {
                                    value = oldFlag ? result.oldvalue : result.value;
                                }
                            } else {
                                value = oldFlag ? result.oldvalue : result.value;
                            }
                        }
                    }
                } catch (e) {
                    console && console.log(e);
                }
                return value;
            },
            getTag: function (key) {
                var result, value = null, tag = null;
                try {
                    result = this.proxy.getItem(key);
                    if (result) {
                        result = EJSON.parse(result);
                        tag = result && result.tag
                    }
                } catch (e) {
                    console && console.log(e);
                }
                return tag;
            },
            /**
            * 获得某个storage的保存时间
            */
            getSaveDate: function (key, useCDate) {
                var result, value = null;
                try {
                    result = this.proxy.getItem(key);
                    if (result) {
                        result = EJSON.parse(result);
                        if (result.savedate) {
                            value = CDate.parse(result.savedate);
                            if (!useCDate) value = value.valueOf();
                        }
                    }
                } catch (e) {
                    console && console.log(e);
                }
                return value;
            },
            /**
            * 返回指定key的超时时间
            * @param {String} key
            * @return {Number} timeout 超时时间,距离1970年的毫秒数
            */
            getExpireTime: function (key) {
                var result = null, time = null;
                try {
                    result = this.proxy.getItem(key);
                    if (result) {
                        result = EJSON.parse(result);
                        time = Date.parse(result.timeout);
                    }
                } catch (e) {
                    console && console.log(e);
                }
                return time;
            },

            /**
            * 清除指定key
            * @param {String} key
            */
            remove: function (key) {
                return this.proxy.removeItem(key);
            },

            /**
            * 返回storage存储的所有数据
            * @return {Array} result,形式如[{key:'aa',value:{}}]
            */
            getAll: function () {
                var ln = this.proxy.length;
                var vs = [];
                for (var i = 0; i < ln; i++) {
                    var key = this.proxy.key(i);
                    var obj = {
                        key: key,
                        value: this.get(key)
                    }
                    vs.push(obj);
                }
                return vs;
            },

            /**
            * 清空所有storage内容
            */
            clear: function () {
                this.proxy.clear();
            }
        };

        return {
            localStorage: new Stoge(window.localStorage),
            sessionStorage: new Stoge(window.sessionStorage)
        };
    })();
    //旧版的getStorage
    Storage.localStorage.oldGet = function (name) {
        var v = localStorage.getItem(name);
        var d = v ? JSON.parse(v) : null;
        if (d && d.timeout) {
            /*验证是否过期*/
            var n = new Date();
            var t = cCoreDate.parse(d.timeout).valueOf();
            if (d.timeby) {
                if (t - n >= 0) { return d; }
            } else {
                if (t - cCoreDate.parse(cCoreDate.format(n, 'Y-m-d')).valueOf() >= 0) { return d; }
            }
            localStorage.removeItem(name);
            return null;
        }
        return d;
    };
    //旧版的getStorage
    Storage.localStorage.oldSet = function (name, value) {
        localStorage.setItem(name, value);
    };

    //获得失效时间
    Storage.localStorage.getExpireTime = function (name) {
        var v = localStorage.getItem(name);
        var d = v ? JSON.parse(v) : null;
        if (d && d.timeout) {
            return d.timeout;
        } else {
            return new cCoreDate(cBusinessServertime.getServerDate()).addDay(2).format('Y-m-d');
        }
    };

    Storage.localStorage.oldRemove = function (name) {
        localStorage.removeItem(name);
    };
    return Storage;
});
