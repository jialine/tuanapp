define(['libs', 'c'], function (libs, c) {
    /**
    * 多model数据加载类
    * @options models {Model}  设置多个要加载model类
    * author:Od
    */
    var cBase = c.base;
    var MultipleData = new cBase.Class({
        __propertys__: function () {
            this.models = new cBase.Hash();
            this.index = 0;
            this.results = {};
        },
        initialize: function (options) {
            this.setOption(options);
        },
        setOption: function (options) {
            for (var i in options) {
                switch (i) {
                    case 'models':
                        this.addModels(options[i]);
                        break;
                }
            }
        },
        addModel: function (name, model) {
            this.models.add(name, model);
        },
        addModels: function (models) {
            for (var i in models) {
                if (models.hasOwnProperty(i)) this.models.add(i, models[i]);
            }
        },
        removeModelByName: function (name) {
            this.models.del(name);
        },
        removeModelByIndex: function (index) {
            this.models.delByIndex(index);
        },
        excute: function (onComplete, onError, isAjax, scope, onAbort) {
            if (!this.models.length()) {
                throw 'No model';
            }
            this.index = 0;
            this._request(onComplete, onError, isAjax, scope, onAbort);
        },
        _request: function (onComplete, onError, isAjax, scope, onAbort) {
            var curModel = this.models.index(this.index), self = this;
            curModel.excute(function (data) {
                self.results[self.models.getKey(self.index)] = data;
                self.index++;
                if (self.index >= self.models.length()) {
                    onComplete && onComplete.call(this, self.results);
                    self.results = {};
                    return;
                }
                self._request(onComplete, onError, isAjax, scope, onAbort);
            }, function (e) {
                onError && onError.call(this, e);
            }, isAjax, scope, onAbort);
        }
    });
    return MultipleData;
});