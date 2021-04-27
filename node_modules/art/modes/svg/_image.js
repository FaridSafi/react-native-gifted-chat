var Class = require('../../core/class');
var Base = require('./base');
var DOM = require('./dom');

module.exports = Class(Base, {

	base_initialize: Base.prototype.initialize,

	initialize: function(src, width, height){
		this.base_initialize('image');
		if (arguments.length == 3) this.draw.apply(this, arguments);
	},
	
	draw: function(src, width, height){
		var element = this.element;
		DOM.link(element, src);
		element.setAttribute('width', width);
		element.setAttribute('height', height);
		this.width = width;
		this.height = height;
		return this;
	}
	
});
