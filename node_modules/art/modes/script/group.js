var Class = require('../../core/class');
var Container = require('../../dom/container');
var Node = require('./node');

module.exports = Class(Node, Container, {

	element_initialize: Node.prototype.initialize,

	initialize: function(){
		this.element_initialize();
	},

	element_toExpression: Node.prototype.toExpression,

	toExpression: function(){
		var artGroup = this.artVar.property('Group'),
		    grab = artGroup.construct().property('grab');
		var children = [], node = this.firstChild;
		while (node){
			children.push(node.toExpression());
			node = node.nextSibling;
		}
		return this.element_toExpression(grab.call.apply(grab, children));
	}

});