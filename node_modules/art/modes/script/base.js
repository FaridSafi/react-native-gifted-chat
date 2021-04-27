var Class = require('../../core/class');
var Color = require('../../core/color');
var Node = require('./node');

Color.prototype.toExpression = Color.prototype.toHEX;

module.exports = Class(Node, {

	/* styles */
	
	fill: function(color){ return this._addCall('fill', arguments); },

	fillRadial: function(stops, focusX, focusY, radius, centerX, centerY){ return this._addCall('fillRadial', arguments); },

	fillLinear: function(stops, angle){
		if (angle == null) return this._addCall('fill', stops);
		return this._addCall('fillLinear', arguments);
	},

	fillImage: function(){ return this._addCall('fillImage', arguments); },

	stroke: function(color, width, cap, join){ return this._addCall('stroke', arguments); }	
	
});
