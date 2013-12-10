define(['cBase', 'cStore', 'cStorage', 'cUtility'], function (cBase, AbstractStore, cStorage, cUtility) {
    var Common = {};
    Common.UserStore = new cBase.Class(AbstractStore, {
        __propertys__: function () {
            this.key = 'USER';
            this.lifetime = '1D';
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
            var timeout = new cBase.Date(cBase.getServerDate()).addDay(2).format('Y-m-d');
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
        getAuth: function () {
            var HeadStore = Common.HeadStore.getInstance();
            return HeadStore.getAttr('auth');
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
            this.lifetime = '15D';
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
                }
                if (userinfo && userinfo.Auth) {
                    head.auth = userinfo.Auth;
                    this.set(head);
                }
                return head;
            }
        },
        initialize: function ($super, options) {
            $super(options);
        }
    });

    //分销联盟Store
    Common.UnionStore = new cBase.Class({
        __propertys__: function () {
            this.key = 'UNION';
            this.lifetime = '7D';
            this.store = cStorage.localStorage;
        },
        initialize: function () {

        },
        get: function () {
            var data = this.store.oldGet(this.key);
            return data && data.data || null;
        },
        set: function (data, timeout) {
            timeout = timeout ? new cBase.Date(timeout) : new cBase.Date(cUtility.getServerDate());
            var json = {
                data: data,
                timeout: timeout.format('Y/m/d H:i:s')
            };

            this.store.oldSet(this.key, JSON.stringify(json));
        }
    });

    //渠道Store
    Common.SalesStore = new cBase.Class({
        __propertys__: function () {
            this.key = 'SALES';
            this.lifetime = '30D';
            this.store = cStorage.localStorage;
        },
        initialize: function () {

        },
        get: function () {
            var data = this.store.oldGet(this.key);
            return data && data.data || null;
        },
        set: function (data, timeout) {
            timeout = timeout ? new cBase.Date(timeout) : new cBase.Date(cUtility.getServerDate()).addDay(3);
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