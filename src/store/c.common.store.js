define(['cBase', 'cStore', 'cStorage', 'cUtility'], function (cBase, AbstractStore, cStorage, cUtility) {
    var Common = {};
    Common.UserStore = new cBase.Class(AbstractStore, {
        __propertys__: function () {
            this.key = 'USER';
            this.lifeTime = '1D';
        },
        initialize: function ($super, options) {
            $super(options);
        },
        getUser: function () {
            var userinfo = cStorage.localStorage.oldGet('USERINFO');
            // var userinfo = window.localStorage.getItem('USERINFO');
            // userinfo = JSON.parse(userinfo);
            userinfo = userinfo && userinfo.data || null;

            this.set(userinfo);
            return userinfo;
        },
        setUser: function (UserInfo) {
            var timeout = cStorage.localStorage.getExpireTime('USERINFO');
            var userinfo = { data: UserInfo, timeout: timeout };
            cStorage.localStorage.oldSet('USERINFO', JSON.stringify(userinfo));
            this.set(UserInfo);
        },
        removeUser: function () {
            cStorage.localStorage.oldRemove('USERINFO');
            this.set(null);
        },
        isNonUser: function () {
            var user = this.getUser();
            return user && !!user.IsNonUser;
        },
        isLogin: function () {
            var user = this.getUser();
            return user && !!user.Auth && !user.IsNonUser;
        },
        getUserName: function () {
            var user = this.getUser();
            return user.UserName;
        },
        getUserId: function () {
            var user = this.getUser() || {};
            return user.UserID || cUtility.getGuid();
        },
        getAuth: function () {
            var HeadStore = Common.HeadStore.getInstance(),
                userinfo = this.getUser();
            if (userinfo && userinfo.Auth) HeadStore.setAttr('auth', userinfo.Auth);
            return HeadStore.getAttr('auth');
        },
        setAuth: function (auth) {
            var isLogin = this.isLogin(),
                userinfo = this.getUser() || {};

            userinfo.Auth = auth;
            userinfo.IsNonUser = isLogin ? false : true;
            this.setUser(userinfo);
        },
        setNonUser: function (auth) {
            var userinfo = cStorage.localStorage.oldGet('USERINFO');
            var HeadStore = Common.HeadStore.getInstance();
            var data = userinfo && userinfo.data || {};
            data.Auth = auth;
            data.IsNonUser = true;
            this.setUser(data);
            HeadStore.setAttr('auth', auth);
        }
    });
    Common.HeadStore = new cBase.Class(AbstractStore, {
        userStore: Common.UserStore.getInstance(),
        __propertys__: function () {
            this.key = 'HEADSTORE';
            this.lifeTime = '15D';
            this.defaultData = {
                "cid": cUtility.getGuid(),
                "ctok": "351858059049938",
                "cver": "1.0",
                "lang": "01",
                "sid": "8888",
                "syscode": '09',
                "auth": ""
            };
            var get = this.get;
            //重写get方法,获得userinfo中auth
            this.get = function () {
                var head = get.apply(this, arguments),
                    userinfo = this.userStore.getUser();
                //来源渠道
                var sales = Common.SalesObjectStore.getInstance().get();
                if (sales && sales.sid) {
                    head.sid = sales.sid;
                } else {
                    head.sid = '8888';
                }
                if (userinfo && userinfo.Auth) {
                    head.auth = userinfo.Auth;
                } else {
                    head.auth = '';
                }
                this.set(head);
                return head;
            }
        },
        initialize: function ($super, options) {
            $super(options);
        },
        setAuth: function (auth) {
            var userInfo = Common.UserStore.getInstance();
            userInfo.setAuth(auth);
            this.setAttr('auth', auth);
        }
    });

    //分销联盟Store
    Common.UnionStore = new cBase.Class(AbstractStore, {
        __propertys__: function () {
            this.key = 'UNION';
            this.lifeTime = '7D';
            this.store = cStorage.localStorage;
        },
        initialize: function ($super, options) {
            $super(options);
        },
        get: function () {
            var data = this.store.oldGet(this.key);
            return data && data.data || null;
        },
        set: function (data, timeout) {
            //fix 分销联盟时间超时时间保持不准确的bug shbzhang 2014/1/7
            if (!timeout) {
                timeout = new cBase.Date(cUtility.getServerDate())
                timeout.addSeconds(this._getLifeTime());
            }
            //timeout = timeout ? new cBase.Date(timeout) : new cBase.Date(cUtility.getServerDate()).addDay(7);
            var json = {
                data: data,
                timeout: timeout.format('Y/m/d H:i:s')
            };

            this.store.oldSet(this.key, JSON.stringify(json));
        }
    });

    //渠道Store
    Common.SalesStore = new cBase.Class(AbstractStore,{
        __propertys__: function () {
            this.key = 'SALES';
            this.lifeTime = '30D';
            this.store = cStorage.localStorage;
        },
        initialize: function ($super, options) {
            $super(options);
        },
        get: function () {
            var data = this.store.oldGet(this.key);
            return data && data.data || null;
        },
        set: function (data, timeout) {
            //fix 分销联盟时间超时时间保持不准确的bug shbzhang 2014/1/7
            if (!timeout) {
                timeout = new cBase.Date(cUtility.getServerDate())
                timeout.addSeconds(this._getLifeTime());
            }
           // timeout = timeout ? new cBase.Date(timeout) : new cBase.Date(cUtility.getServerDate()).addDay(3);
            var json = {
                data: data,
                timeout: timeout.format('Y/m/d H:i:s')
            };
            this.store.oldSet(this.key, JSON.stringify(json));
        }
    });

    //渠道Store
    Common.SalesObjectStore = new cBase.Class(AbstractStore, {
        __propertys__: function () {
            this.key = 'SALES_OBJECT';
            this.lifeTime = '30D';
        },
        initialize: function ($super, options) {
            $super(options);
        }
    });
    Common.UnionStore.getInstance = Common.SalesStore.getInstance = cBase.getInstance;
    return Common;
});