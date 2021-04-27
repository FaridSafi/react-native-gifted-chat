var Class = require('../../core/class');
var Container = require('../../dom/container');
var Node = require('./node');

module.exports = Class(Node, Container, {
	
	initialize: function(width, height){
		this.width = width;
		this.height = height;
	},

	localHitTest: function(x, y){
		var node = this.lastChild;
		while (node){
			var hit = node.hitTest(x, y);
			if (hit) return hit;
			node = node.previousSibling;
		}
		return null;
	},

	renderLayerTo: function(context, xx, yx, xy, yy, x, y){
		if (this._invisible) return;

		x = xx * this.x + xy * this.y + x;
		y = yx * this.x + yy * this.y + y;

		var t = xx;
		xx = t * this.xx + xy * this.yx;
		xy = t * this.xy + xy * this.yy;
		t = yx;
		yx = t * this.xx + yy * this.yx;
		yy = t * this.xy + yy * this.yy;

		var node = this.firstChild;
		while (node){
			node.renderTo(context, xx, yx, xy, yy, x, y);
			node = node.nextSibling;
		}
	}

});
