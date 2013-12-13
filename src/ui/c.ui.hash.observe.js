define(['libs', 'cBase', 'cUIAbstractView'], function (libs, cBase) {

  var options = {};

  var _config = {
    prefix: 'cui-'
  };

  options.__propertys__ = function () {
    this.hash;
    this.callback;
    this._hashchange = $.proxy(function () {
      this.hashchange();
    }, this);
    this.isend = true;
    this.scope;
  };

  options.initialize = function (opts) {
    this.setOption(opts);
  };

  options.setOption = function (options) {
    var allowOptions = { hash: true, callback: true, scope: true };
    for (var i in options) {
      switch (true) {
        case allowOptions[i]:
          this[i] = options[i];
          break;
      }
    }
  };

  options.start = function () {
    this.isend = false;
    window.location.hash += '|' + this.hash;
    $(window).bind('hashchange', this._hashchange);
  };

  options.end = function () {
    $(window).unbind('hashchange', this._hashchange);
    if (!this.isend) {
      this.isend = true;
      window.history.go(-1);
    }
  };

  options.hashchange = function () {
    var hash = window.location.hash;
    if (!hash.match(new RegExp('\\b' + this.hash + '\\b', 'ig'))) {
      this.isend = true;
      this.callback.call(this.scope || this);
      this.end();
    }
  };

  return new cBase.Class(options);

});