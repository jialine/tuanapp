define(["cBase", "cStorage", "cUtility"], function (a, b, c) {
	CDate = a.Date, HObject = c.Object;
	var d = new a.Class({__propertys__:function () {
		this.NULL = {}, this.key = this.NULL, this.lifeTime = "30M", this.useServerTime = !1, this.isLocal = !0, this.defaultData = null, this.rollbackEnabled = !1, this.sProxy = this.NULL
	}, initialize                     :function (a) {
		for (var c in a)this[c] = a[c];
		this.assert(), this.sProxy = this.isLocal ? b.localStorage : b.sessionStorage
	}, assert                         :function () {
		if (this.key === this.NULL)throw"not override key property"
	}, set                            :function (a, b, c) {
		var d = this._getNowTime();
		d.addSeconds(this._getLifeTime()), this.rollbackEnabled && !c && (c = a), this.sProxy.set(this.key, a, d, b, null, c)
	}, setLifeTime                    :function (a, b) {
		this.lifeTime = a;
		var c, d = this.getTag(), e = this.get();
		c = b ? this._getNowTime() : this.sProxy.getSaveDate(this.key, !0) || this._getNowTime();
		var f = new CDate(c.valueOf()).format("Y/m/d H:i:s");
		c.addSeconds(this._getLifeTime()), this.sProxy.set(this.key, e, c, d, f)
	}, setAttr                        :function (a, b, c) {
		if (!_.isObject(a)) {
			var d = this.get(c) || {}, e = {};
			if (d) {
				if (this.rollbackEnabled) {
					e = this.get(c, !0);
					var f = HObject.get(d, a);
					HObject.set(e, a, f)
				}
				return HObject.set(d, a, b), this.set(d, c, e)
			}
			return!1
		}
		for (var g in a)a.hasOwnProperty(g) && this.setAttr(g, a[g], b)
	}, get                            :function (b, c) {
		var d = null, e = !0;
		"[object Array]" === Object.prototype.toString.call(this.defaultData) ? d = this.defaultData.slice(0) : this.defaultData && (d = _.clone(this.defaultData));
		var f = this.sProxy.get(this.key, b, c), g = typeof f;
		if ({string:!0, number:!0, "boolean":!0}[g])return f;
		if (f)if ("[object Array]" == Object.prototype.toString.call(f)) {
			d = [];
			for (var h = 0, i = f.length; i > h; h++)d[h] = f[h]
		} else f && !d && (d = {}), a.extend(d, f);
		for (var j in d) {
			e = !1;
			break
		}
		return e ? null : d
	}, getAttr                        :function (a, b) {
		var c = this.get(b), d = null;
		return c && (d = HObject.get(c, a)), d
	}, getTag                         :function () {
		return this.sProxy.getTag(this.key)
	}, remove                         :function () {
		this.sProxy.remove(this.key)
	}, removeAttr                     :function (a) {
		var b = this.get() || {};
		b[a] && delete b[a], this.set(b)
	}, getExpireTime                  :function () {
		var a = null;
		try {
			a = this.sProxy.getExpireTime(this.key)
		} catch (b) {
			console && console.log(b)
		}
		return a
	}, setExpireTime                  :function (a) {
		var b = this.get(), c = new CDate(a);
		this.sProxy.set(this.key, b, c)
	}, _getNowTime                    :function () {
		return this.useServerTime ? new CDate(a.getServerDate()) : new CDate
	}, _getLifeTime                   :function () {
		var a = 0, b = this.lifeTime + "", c = b.charAt(b.length - 1), d = +b.substring(0, b.length - 1);
		return c = "number" == typeof c ? "M" : c.toUpperCase(), a = "D" == c ? 24 * d * 60 * 60 : "H" == c ? 60 * d * 60 : "M" == c ? 60 * d : "S" == c ? d : 60 * d
	}, rollback                       :function (a) {
		if (this.rollbackEnabled) {
			var b = this.getTag(), c = this.sProxy.get(this.key, b), d = this.sProxy.get(this.key, b, !0);
			if (a && a instanceof Array)for (var e in a) {
				var f = a[e], g = d[f];
				"undefined" != typeof g && (c[f] = g)
			} else c = d, d = {};
			this.set(c, b, d)
		}
	}});
	return d.getInstance = function () {
		return this.instance ? this.instance : this.instance = new this
	}, d
});