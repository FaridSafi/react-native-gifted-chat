var Class = require('../../core/class');
var Base = require('./base');

module.exports = Class(Base, {

	base_initialize: Base.prototype.initialize,
	
	initialize: function(src, width, height){
		this.base_initialize();
		if (arguments.length == 3) this.draw.apply(this, arguments);
	},
	
	draw: function(src, width, height){
		this.width = width;
		this.height = height;
		return this.invalidate();
	},
	
	renderTo: function(){ }
	
});