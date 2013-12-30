// @deprecated
// 预备干掉！

define(['libs', 'cBase', 'cUIEventListener'], function (libs, base, cuiEventListener) {
    var cBase = base;
    var EventListener = cuiEventListener;
    var cType = cBase.Type;
    var DataSource = new cBase.Class(EventListener, {
        __propertys__: function () {
            this.data;
            this.filters = [];
            this.group = {};
            this.isUpdate = true;
        },
        initialize: function (options) {
            this.setOption(options);
        },
        setOption: function (options) {
            options = options || {};
            for (var i in options) {
                switch (i) {
                    case 'data':
                        this.setData(data);
                        break;
                }
            }
        },
        filter: function (filterfun, sortfun) {
            if (typeof filterfun !== 'function') throw 'Screening function did not fill in';
            this.filters = [];
            for (var i = 0, len = this.data.length; i < len; i++) {
                if (filterfun(i, this.data[i])) {
                    this.filters.push(this.data[i]);
                }
            }
            this.filters = this.filters || [];
            return typeof sortfun === 'function' ? this.filters.sort(sortfun) : this.filters;
        },
        groupBy: function (field, filterfun) {
            var group, key;
            if (this.isUpdate) {
                this.group = [];
                for (var i = 0, len = this.data.length; i < len; i++) {
                    key = this.data[i][field];
                    //if (key === undefined) throw 'The Field is not found!';
                    group = this.group[key] || [];
                    if (typeof filterfun === 'function') {
                        if (filterfun(this.data[i])) group.push(this.data[i]);
                    } else {
                        group.push(this.data[i]);
                    }
                    this.group[key] = group;
                }
            }
            return this.group;
        },
        setData: function (data) {
            this.data = data;
            this.isUpdate = true;
        }
    });
    return DataSource;
});