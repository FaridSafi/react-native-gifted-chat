var Class = require('../../core/class');
var Container = require('../../dom/container');
var Node = require('./node');

module.exports = Class(Node, Container, {

	initialize: function(width, height){
		this.width = width;
		this.height = height;
	},

	localHitTest: function(x, y) {
		var node = this.lastChild;
		while (node){
			var hit = node.hitTest(x, y);
			if (hit) return hit;
			node = node.previousSibling;
		}
		return null;
	},

	renderLayerTo: function(context, xx, yx, xy, yy, x, y) {
		context.setTransform(xx, yx, xy, yy, x, y);
		context.save();
		// Need beginPath to fix Firefox bug. See 3354054.
		context.beginPath();
		context.rect(this.x, this.y, this.width, this.height);
		context.clip();

		var node = this.firstChild;
		while(node) {
			node.renderTo(context, xx, yx, xy, yy, x, y);
			node = node.nextSibling;
		}
		context.restore();
	}
});
