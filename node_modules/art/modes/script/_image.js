var Class = require('../../core/class');
var Base = require('./base');

module.exports = Class(Base, {

	base_initialize: Base.prototype.initialize,
	
	initialize: function(src, width, height){
		this.base_initialize();
		if (src != null) this.draw.apply(this, arguments);
	},
	
	draw: function(){
		this.args = Array.prototype.slice.call(arguments);
		return this;
	},
	
	base_toExpression: Base.prototype.toExpression,

	toExpression: function(expr){
		var artImage = this.artVar.property('Image');
		if (!expr) expr = artImage.construct.apply(artImage, this.args);
		return this.base_toExpression(expr);
	}

});