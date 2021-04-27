var Class = require('../../core/class');
var Container = require('../../dom/container');
var Modulizer = require('./modulizer');

module.exports = Class(Container, Modulizer, {

	initialize: function(width, height){
		this.resize(width, height);
	},

	resize: function(width, height){
		this.width = width;
		this.height = height;
		return this;
	},

	toExpression: function(){
		var expr = this.artVar.property('Surface').construct(this.width, this.height);
		if (!this.firstChild) return expr;
		var children = [], node = this.firstChild;
		while (node){
			children.push(node);
			node = node.nextSibling;
		}
		var grab = expr.property('grab');
		return grab.call.apply(grab, children);
	},

	// ignore
	
	subscribe: function(){
		return this;
	}

});