var Class = require('../../core/class');
var Container = require('../../dom/container');
var Element = require('../../dom/native');
var DOM = require('./dom');

var precision = 100;

var VMLSurface = Class(Element, Container, {
	
	initialize: function VMLSurface(width, height, existingElement){
		this.element = existingElement || document.createElement('vml');
		this.containerElement = DOM.createElement('group');
		this.element.appendChild(this.containerElement);
		if (width != null && height != null) this.resize(width, height);
	},

	resize: function(width, height){
		this.width = width;
		this.height = height;
		
		var style = this.element.style;
		style.pixelWidth = width;
		style.pixelHeight = height;
		
		style = this.containerElement.style;
		style.width = width;
		style.height = height;
		
		var halfPixel = (0.5 * precision);
		
		this.containerElement.coordorigin = halfPixel + ',' + halfPixel;
		this.containerElement.coordsize = (width * precision) + ',' + (height * precision);

		return this;
	}
	
});

VMLSurface.tagName = 'av:vml';

module.exports = VMLSurface;