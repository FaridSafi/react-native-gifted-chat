var Class = require('../../core/class');
var Transform = require('../../core/transform');
var Modulizer = require('./modulizer');
var Element = require('../../dom/dummy');

module.exports = Class(Modulizer, Transform, Element, {

	initialize: function(){
		this._calls = [];
	},

	_addCall: function(property, args){
		this._calls.push({ prop: property, args: Array.prototype.slice.call(args) });
		return this;
	},
	
	toExpression: function(expr){
		var calls = this._calls, propExpr;
		for (var i = 0, l = calls.length; i < l; i++){
			var call = calls[i];
			propExpr = expr.property(call.prop);
			expr = propExpr.call.apply(propExpr, call.args);
		}
		if (this.xx != 1 || this.xy != 0 || this.yx != 0 || this.yy != 1){
			propExpr = expr.property('transform');
			expr = propExpr.call.apply(propExpr, (this.x != 0 || this.y != 0) ? [
				this.xx, this.xy,
				this.yx, this.yy,
				this.x, this.y
			] : [
				this.xx, this.xy,
				this.yx, this.yy
			]);
		} else if (this.x != 0 || this.y != 0){
			expr = expr.property('move').call(this.x, this.y);
		}
		return expr;
	},

	// transforms
	
	blend: function(opacity){ return this._addCall('blend', arguments); },

	// visibility
	
	hide: function(){ return this._addCall('hide', arguments); },
	
	show: function(){ return this._addCall('show', arguments); },
	
	// interaction
	
	indicate: function(){ return this._addCall('indicate', arguments); },
	
	// ignore
	
	subscribe: function(){
		return this;
	}
	
});