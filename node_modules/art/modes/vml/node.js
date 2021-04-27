var Class = require('../../core/class');
var Transform = require('../../core/transform');
var Element = require('../../dom/shadow');
var DOM = require('./dom');

module.exports = Class(Element, Transform, {

	initialize: function(tag){
		//this.uid = uniqueID();
		var element = this.element = DOM.createElement(tag);
		//element.setAttribute('id', 'e' + this.uid);
	},

	_place: function(){
		if (this.parentNode){
			this._transform();
		}
	},

	// visibility

	hide: function(){
		this.element.style.display = 'none';
		return this;
	},

	show: function(){
		this.element.style.display = '';
		return this;
	},

	// interaction

	indicate: function(cursor, tooltip){
		if (cursor) this.element.style.cursor = cursor;
		if (tooltip) this.element.title = tooltip;
		return this;
	}

});
