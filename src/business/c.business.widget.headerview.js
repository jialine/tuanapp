define(['cCoreInherit', 'cWidgetFactory', 'cWidgetHeaderView'], function (cCoreInherit, WidgetFactory) {

	var HeaderView = WidgetFactory.create('HeaderView');

	var WIDGET_NAME = 'Business.HeaderView';

	var options = {};

	options.set = function (data) {
		if (data) {

			if (AppConfigMap && AppConfigMap.page_header) {
				if (typeof AppConfigMap.page_header === 'string') {
					AppConfigMap.page_header = JSON.parse(AppConfigMap.page_header);
				}

				for (var key in AppConfigMap.page_header) {
					if (data.data.hasOwnProperty(key)) {
						data.data[key] = AppConfigMap.page_header[key];
					}
				}
			}

			this.data = data;
			_setTemplate.call(this, { data: data });

			this.bindEvents = this.data.bindEvents;
			this.isCreate = false;
			this.hide();
		}
	};

	var BusinessHeaderView = new cCoreInherit.Class(HeaderView, options);

	WidgetFactory.register({
		name: WIDGET_NAME,
		fn: BusinessHeaderView
	});

})