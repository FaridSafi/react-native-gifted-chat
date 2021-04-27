var Class = require('../../core/class');
var Base = require('./base');

module.exports = Class(Base, {

	base_initialize: Base.prototype.initialize,
	
	initialize: function(text){
		this.base_initialize();
		if (text != null) this.draw.apply(this, arguments);
	},
	
	draw: function(){
		this.args = Array.prototype.slice.call(arguments);
		return this;
	},
	
	base_toExpression: Base.prototype.toExpression,

	toExpression: function(expr){
		var artText = this.artVar.property('Text');
		if (!expr) expr = artText.construct.apply(artText, this.args);
		return this.base_toExpression(expr);
	}

});