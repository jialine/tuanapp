/**
 * @author: xuweichen
 * @date: 14-2-13 上午11:07
 * @descriptions
 */
define(['libs'], function(libs){
	var NOOP = function(){},
		mix = $.extend;

	function DropDown(options){
		var defaultOptions = {
			triggerEvent: 'click',
			trigger: null,
			panel: null,
			label: null,
			itemCls: 'li[data-type]',
			hasEffect: true,
			selectedIndex: 0,
			activeTriggerCls: '',
			selectedItemCls: 'typecrt',
			multiple: false,
			onSelect: NOOP
		};

		this.options = mix(defaultOptions, options);
		this.trigger = this.options.trigger;
		this.panel = this.options.panel;
		this.label = this.options.label;
		this.disabled = false;
		this.opened = false;
		this.items = this.panel.find(this.options.itemCls);
		this.reset(true);
		this._bindEvents();
	};

	DropDown.prototype = {
		constructor: DropDown,
		_bindEvents: function(){
			var options = this.options,
				trigger = this.trigger;

			this._showHandler = $.proxy(function(e){
				e.preventDefault();
				this.opened ? this.hide() : this.show();
			}, this);

			this._selectHandler = $.proxy(function(e){
				e.preventDefault();
				e.stopPropagation();
				this.select(e.target);
			}, this);

			this._hideHandler = $.proxy(function(e){
				var self = this;
				setTimeout(function(){
					self.hide();
				}, 200);//做延迟，保证blur触发后，dom短时还能点击
			}, this);

			trigger.on(options.triggerEvent, this._showHandler);
			trigger.on('blur', this._hideHandler);
			this.panel.on('click', options.itemCls, this._selectHandler);

		},
		_unbindEvents: function(){
			var options = this.options;

			this.trigger.off(options.triggerEvent,this._showHandler);
			this.panel.off('click', this._selectHandler);
		},
		disable: function(){
			this._unbindEvents();
			this.disabled = true;
		},
		enable: function(){
			this._bindEvents();
			this.disabled = false;
		},
		show: function(){
			var panel = this.panel;

			panel.show();
			if(this.options.hasEffect){
				panel.css({
					bottom: '0px',
					opacity: '0'
				});
				panel.animate({
					bottom: '40px',
					opacity: '1'
				});
			};
			this.trigger.addClass(this.options.activeTriggerCls);
			this.opened = true;
		},
		hide: function(){
			var self = this;
			self.panel.hide();

			this.trigger.removeClass(this.options.activeTriggerCls);
			this.opened = false;
		},
		/**
		 * select item
		 * @param item {DOM} , 被选中的选项dom
		 * @param noevent {Boolean}, 是否触发选择事件
		 */
		select: function(item, noevent){
			var options = this.options,
				selected = this._selected,
				selectedItemCls = options.selectedItemCls;

			selected && selected.removeClass(selectedItemCls);
			this.selectedIndex = this.items.indexOf(item);
			item = $(item);
			this.label.html(item.attr('data-name')||item.html());
			item.addClass(selectedItemCls);
			!noevent && this.options.onSelect.call(this, item);
			this._selected = item;
		},
		reset: function(noevent){
			this.select(this.items[this.options.selectedIndex], noevent)
		}
	};
	return DropDown;
});