var Class = require('../../core/class');
var Transform = require('../../core/transform');
var Element = require('../../dom/dummy');

var CanvasNode = Class(Transform, Element, {
	
	invalidate: function(){
		if (this.parentNode) this.parentNode.invalidate();
		if (this._layer) this._layerCache = null;
		return this;
	},

	_place: function(){
		this.invalidate();
	},
	
	_transform: function(){
		this.invalidate();
	},
	
	blend: function(opacity){
		if (opacity >= 1 && this._layer) this._layer = null;
		this._opacity = opacity;
		if (this.parentNode) this.parentNode.invalidate();
		return this;
	},
	
	// visibility
	
	hide: function(){
		this._invisible = true;
		if (this.parentNode) this.parentNode.invalidate();
		return this;
	},
	
	show: function(){
		this._invisible = false;
		if (this.parentNode) this.parentNode.invalidate();
		return this;
	},
	
	// interaction
	
	indicate: function(cursor, tooltip){
		this._cursor = cursor;
		this._tooltip = tooltip;
		return this.invalidate();
	},

	hitTest: function(x, y){
		if (this._invisible) return null;
		var point = this.inversePoint(x, y);
		if (!point) return null;
		return this.localHitTest(point.x, point.y);
	},

	// rendering

	renderTo: function(context, xx, yx, xy, yy, x, y){
		var opacity = this._opacity;
		if (opacity == null || opacity >= 1){
			return this.renderLayerTo(context, xx, yx, xy, yy, x, y);
		}

		// Render to a compositing layer and cache it

		var layer = this._layer, canvas, isDirty = true,
			w = context.canvas.width, h = context.canvas.height;
		if (layer){
			layer.setTransform(1, 0, 0, 1, 0, 0);
			canvas = layer.canvas;
			if (canvas.width < w || canvas.height < h){
				canvas.width = w;
				canvas.height = h;
			} else {
				var c = this._layerCache;
				if (c && c.xx === xx && c.yx === yx && c.xy === xy
					&& c.yy === yy && c.x === x && c.y === y){
					isDirty = false;
				} else {
					layer.clearRect(0, 0, w, h);
				}
			}
		} else {
			canvas = document.createElement('canvas');
			canvas.width = w;
			canvas.height = h;
			this._layer = layer = canvas.getContext('2d');
		}

		if (isDirty){
			this.renderLayerTo(layer, xx, yx, xy, yy, x, y);
			this._layerCache = {
				xx: xx,
				yx: yx,
				xy: xy,
				yy: yy,
				x: x,
				y: y
			};
		}

		context.globalAlpha = opacity;
		context.setTransform(1, 0, 0, 1, 0, 0);
		context.drawImage(
			canvas,
			0, 0, w, h,
			0, 0, w, h
		);
		context.globalAlpha = 1;
	}

});

module.exports = CanvasNode;