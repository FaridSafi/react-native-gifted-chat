var Class = require('../../core/class');
var Transform = require('../../core/transform');
var Element = require('../../dom/shadow');
var DOM = require('./dom');

module.exports = Class(Element, Transform, {

	initialize: function(tag){
		this.uid = DOM.uniqueID();
		var element = this.element = DOM.createElement(tag);
		element.setAttribute('id', 'e' + this.uid);
	},
	
	// transforms

	_transform: function(){
		var m = this;
		this.element.setAttribute('transform', 'matrix(' + [m.xx, m.yx, m.xy, m.yy, m.x, m.y] + ')');
	},
	
	blend: function(opacity){
		this.element.setAttribute('opacity', opacity);
		return this;
	},
	
	// visibility
	
	hide: function(){
		this.element.setAttribute('display', 'none');
		return this;
	},
	
	show: function(){
		this.element.setAttribute('display', '');
		return this;
	},
	
	// interaction
	
	indicate: function(cursor, tooltip){
		var element = this.element;
		if (cursor) this.element.style.cursor = cursor;
		if (tooltip){
			var title = this.titleElement; 
			if (title){
				title.firstChild.nodeValue = tooltip;
			} else {
				this.titleElement = title = DOM.createElement('title');
				title.appendChild(DOM.createTextNode(tooltip));
				element.insertBefore(title, element.firstChild);
			}
		}
		return this;
	}

});