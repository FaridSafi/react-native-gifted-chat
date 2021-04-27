var Class = require('../../core/class');
var Base = require('./base');
var Path = require('./path');

module.exports = Class(Base, {

	base_initialize: Base.prototype.initialize,
	
	initialize: function(path){
		this.base_initialize();
		if (path != null) this.draw(path);
	},
	
	draw: function(path, width, height){
		path = ((path instanceof Path) ? path : new Path(path)).toString();
		this.args = arguments.length < 3 ? [ path ] : [ path, width, height ];
		return this;
	},
	
	base_toExpression: Base.prototype.toExpression,

	toExpression: function(expr){
		var artShape = this.artVar.property('Shape');
		if (!expr) expr = artShape.construct.apply(artShape, this.args);
		return this.base_toExpression(expr);
	}

});