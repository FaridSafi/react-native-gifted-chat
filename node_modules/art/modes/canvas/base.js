var Class = require('../../core/class');
var Color = require('../../core/color');
var Transform = require('../../core/transform');
var Node = require('./node');

var genericCanvas = typeof document !== 'undefined' && document.createElement('canvas'),
    genericContext = genericCanvas && genericCanvas.getContext && genericCanvas.getContext('2d');

function recolorImage(img, color1, color2){
	// TODO: Fix this experimental implementation
	color1 = Color.detach(color1);
	color2 = Color.detach(color2);
	var canvas = document.createElement('canvas'),
		context = canvas.getContext('2d');
	canvas.width = img.width;
	canvas.height = img.height;
	context.fillStyle = color2[0];
	context.fillRect(0, 0, img.width, img.height);
	context.globalCompositeOperation = 'lighter';
	context.drawImage(img, 0, 0);
	return canvas;
}

var Base = Class(Node, {

	initialize: function(){
		this._fill = null;
		this._pendingFill = null;
		this._fillTransform = null;
		this._stroke = null;
		this._strokeCap = null;
		this._strokeDash = null;
		this._strokeJoin = null;
		this._strokeWidth = null;
	},

	/* styles */

	_addColors: function(gradient, stops){
		// Enumerate stops, assumes offsets are enumerated in order
		// TODO: Sort. Chrome doesn't always enumerate in expected order but requires stops to be specified in order.
		if ('length' in stops) for (var i = 0, l = stops.length - 1; i <= l; i++)
			gradient.addColorStop(i / l, new Color(stops[i]).toString());
		else for (var offset in stops)
			gradient.addColorStop(offset, new Color(stops[offset]).toString());
		return gradient;
	},


	fill: function(color){
		if (arguments.length > 1) return this.fillLinear(arguments);
		if (this._pendingFill) this._pendingFill();
		this._fill = color ? new Color(color).toString() : null;
		return this.invalidate();
	},

	fillRadial: function(stops, focusX, focusY, radiusX, radiusY, centerX, centerY){
		if (focusX == null) focusX = (this.left || 0) + (this.width || 0) * 0.5;
		if (focusY == null) focusY = (this.top || 0) + (this.height || 0) * 0.5;
		if (radiusY == null) radiusY = radiusX || (this.height * 0.5) || 0;
		if (radiusX == null) radiusX = (this.width || 0) * 0.5;
		if (centerX == null) centerX = focusX;
		if (centerY == null) centerY = focusY;

		centerX += centerX - focusX;
		centerY += centerY - focusY;

		if (radiusX === 0 || radiusX === '0') return this.fillLinear(stops);
		var ys = radiusY / radiusX;

		if (this._pendingFill) this._pendingFill();

		var gradient = genericContext.createRadialGradient(focusX, focusY / ys, 0, centerX, centerY / ys, radiusX * 2);

		// Double fill radius to simulate repeating gradient
		if ('length' in stops) for (var i = 0, l = stops.length - 1; i <= l; i++){
			gradient.addColorStop(i / l / 2, new Color(stops[i]).toString());
			gradient.addColorStop(1 - i / l / 2, new Color(stops[i]).toString());
		} else for (var offset in stops){
			gradient.addColorStop(offset / 2, new Color(stops[offset]).toString());
			gradient.addColorStop(1- offset / 2, new Color(stops[offset]).toString());
		}

		this._fill = gradient;
		this._fillTransform = new Transform(1, 0, 0, ys);
		return this.invalidate();
	},

	fillLinear: function(stops, x1, y1, x2, y2){
		if (arguments.length < 5){
			var angle = ((x1 == null) ? 270 : x1) * Math.PI / 180;

			var x = Math.cos(angle), y = -Math.sin(angle),
				l = (Math.abs(x) + Math.abs(y)) / 2,
				w = this.width || 1, h = this.height || 1;

			x *= l; y *= l;

			x1 = 0.5 - x;
			x2 = 0.5 + x;
			y1 = 0.5 - y;
			y2 = 0.5 + y;
			this._fillTransform = new Transform(w, 0, 0, h);
		} else {
			this._fillTransform = null;
		}
		if (this._pendingFill) this._pendingFill();
		var gradient = genericContext.createLinearGradient(x1, y1, x2, y2);
		this._addColors(gradient, stops);
		this._fill = gradient;
		return this.invalidate();
	},

	fillImage: function(url, width, height, left, top, color1, color2){
		if (this._pendingFill) this._pendingFill();
		var img = url;
		if (!(img instanceof Image)){
			img = new Image();
			img.src = url;
		}
		if (img.width && img.height){
			return this._fillImage(img, width, height, left || 0, top || 0, color1, color2);
		}

		// Not yet loaded
		this._fill = null;
		var self = this,
			callback = function(){
				cancel();
				self._fillImage(img, width, height, left || 0, top || 0, color1, color2);
			},
			cancel = function(){
				img.removeEventListener('load', callback, false);
				self._pendingFill = null;
			};
		this._pendingFill = cancel;
		img.addEventListener('load', callback, false);
		return this;
	},

	_fillImage: function(img, width, height, left, top, color1, color2){
		var w = width ? width / img.width : 1,
			h = height ? height / img.height : 1;
		if (color1 != null) img = recolorImage(img, color1, color2);
		this._fill = genericContext.createPattern(img, 'repeat');
		this._fillTransform = new Transform(w, 0, 0, h, left || 0, top || 0);
		return this.invalidate();
	},

	stroke: function(color, width, cap, join, dash){
		this._stroke = color ? new Color(color).toString() : null;
		this._strokeWidth = (width != null) ? width : 1;
		this._strokeCap = (cap != null) ? cap : 'round';
		this._strokeJoin = (join != null) ? join : 'round';
		this._strokeDash = dash;
		return this.invalidate();
	},

	// Rendering

	element_renderTo: Node.prototype.renderTo,

	renderTo: function(context, xx, yx, xy, yy, x, y){
		var opacity = this._opacity;
		if (opacity == null || opacity >= 1){
			return this.renderLayerTo(context, xx, yx, xy, yy, x, y);
		}
		if (this._fill && this._stroke){
			return this.element_renderTo(context, xx, yx, xy, yy, x, y);
		}
		context.globalAlpha = opacity;
		var r = this.renderLayerTo(context, xx, yx, xy, yy, x, y);
		context.globalAlpha = 1;
		return r;
	},

	renderLayerTo: function(context, xx, yx, xy, yy, x, y){
		context.setTransform(xx, yx, xy, yy, x, y);
		this.renderShapeTo(context);
	}

});

Base._genericContext = genericContext;

module.exports = Base;
