/**
 * @author: xuweichen
 * @date: 14-2-13 上午11:07
 * @descriptions
 */
define(['cBase'], function(Base){
	var NOOP = function(){},
		Switch,
		mix = $.extend;


	function Switch(options){
		this.options = {
			wrap: null,
			cursor: null,
			cursorCls: '',
			turnOnCls: 'active',
			html: '<i>关</i>',
			isTurnOn: false,
			onChange: NOOP
		};
		this.initialize(options);
		this.turn();
	};
	Switch.prototype = {
		initialize: function(options){
			mix(this.options, options);
			this.isTurnOn = this.options.isTurnOn;
			this.wrap = this.options.wrap;
			this.wrap && this.renderHTML();
			if(this.options.cursor){
				this.cursor = this.options.cursor;
			}else{
				this.cursor = this.wrap.find(this.options.cursorCls);
			};
			this.bindEvents();
		},
		renderHTML: function(){
			this.wrap.html(this.options.html);
		},
		bindEvents: function(){
			var cursor = this.cursor;

			this._clickHandler = $.proxy(this.turn, this);
			cursor && cursor.length && cursor.bind('click', this._clickHandler);
		},
		unbindEvents: function(){
			this.cursor.unbind('click', this._clickHandler);
		},
		turn: function(isOn){
			var isTurnOn,
				options = this.options;
			//if isOn === false, force to turn off
			if(isOn===false){
				this.isTurnOn = true;
			};
			isTurnOn = this.isTurnOn;

			this.wrap && this.wrap[isTurnOn ? 'removeClass' : 'addClass'](options.turnOnCls);
			options.onChange.call(this, this.isTurnOn);
			this.isTurnOn = !isTurnOn;
		},
		on: function(){
			this.turn(true);
		},
		off: function(){
			this.turn(false);
		}
	};
	return Switch;
});