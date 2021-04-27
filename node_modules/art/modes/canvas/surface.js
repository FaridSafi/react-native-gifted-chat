var Class = require('../../core/class');
var Container = require('../../dom/container');
var Element = require('../../dom/native');

var fps = 1000 / 60, invalids = [], renderTimer, renderInvalids = function(){
	clearTimeout(renderTimer);
	renderTimer = null;
	var canvases = invalids;
	invalids = [];
	for (var i = 0, l = canvases.length; i < l; i++){
		var c = canvases[i];
		c._valid = true;
		c.render();
	}
};

var resolution = typeof window !== 'undefined' && window.devicePixelRatio || 1;

var previousHit = null, previousHitSurface = null;

var CanvasSurface = Class(Element, Container, {

	initialize: function(width, height, existingElement){
		var element = this.element = existingElement || document.createElement('canvas');
		var context = this.context = element.getContext('2d');
		this._valid = true;
		if (width != null && height != null) this.resize(width, height);

		element.addEventListener('mousemove', this, false);
		element.addEventListener('mouseout', this, false);
		element.addEventListener('mouseover', this, false);
		element.addEventListener('mouseup', this, false);
		element.addEventListener('mousedown', this, false);
		element.addEventListener('click', this, false);
	},

	handleEvent: function(event){
		if (event.clientX == null) return;
		var element = this.element,
			rect = element.getBoundingClientRect(),
			x = event.clientX - rect.left - element.clientLeft,
			y = event.clientY - rect.top - element.clientTop,
			hit = this.hitTest(x, y);

		if (hit !== previousHit){
			if (previousHit){
				previousHit.dispatch({
					type: 'mouseout',
					target: previousHit,
					relatedTarget: hit,
					sourceEvent: event
				});
			}
			if (hit){
				hit.dispatch({
					type: 'mouseover',
					target: hit,
					relatedTarget: previousHit,
					sourceEvent: event
				});
			}
			previousHit = hit;
			previousHitSurface = this;
			this.refreshCursor();
		}

		if (hit) hit.dispatch(event);
	},

	refreshCursor: function(){
		if (previousHitSurface !== this) return;
		var hit = previousHit, hitCursor = '', hitTooltip = '';
		while (hit){
			if (!hitCursor && hit._cursor){
				hitCursor = hit._cursor;
				if (hitTooltip) break;
			}
			if (!hitTooltip && hit._tooltip){
				hitTooltip = hit._tooltip;
				if (hitCursor) break;
			}
			hit = hit.parentNode;
		}
		// TODO: No way to set cursor/title on the surface
		this.element.style.cursor = hitCursor;
		this.element.title = hitTooltip;
	},

	resize: function(width, height){
		var element = this.element;
		element.setAttribute('width', width * resolution);
		element.setAttribute('height', height * resolution);
		element.style.width = width + 'px';
		element.style.height = height + 'px';
		this.width = width;
		this.height = height;
		return this;
	},

	invalidate: function(left, top, width, height){
		if (this._valid){
			this._valid = false;
			invalids.push(this);
			if (!renderTimer){
				if (window.mozRequestAnimationFrame){
					renderTimer = true;
					window.mozRequestAnimationFrame(renderInvalids);
				} else {
					renderTimer = setTimeout(renderInvalids, fps);
				}
			}
		}
		return this;
	},

	hitTest: function(x, y){
		if (x < 0 || y < 0 || x > this.width || y > this.height) return null;
		var node = this.lastChild;
		while (node){
			var hit = node.hitTest(x, y);
			if (hit) return hit;
			node = node.previousSibling;
		}
		return null;
	},

	render: function(){
		var node = this.firstChild, context = this.context;
		context.setTransform(resolution, 0, 0, resolution, 0, 0);
		context.clearRect(0, 0, this.width, this.height);
		while (node){
			node.renderTo(context, resolution, 0, 0, resolution, 0, 0);
			node = node.nextSibling;
		}
		this.refreshCursor();
	}

});

CanvasSurface.tagName = 'canvas';

module.exports = CanvasSurface;