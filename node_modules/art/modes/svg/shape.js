var Class = require('../../core/class');
var Path = require('./path');
var Base = require('./base');

module.exports = Class(Base, {

	base_initialize: Base.prototype.initialize,

	initialize: function(path, width, height){
		this.base_initialize('path');
		this.element.setAttribute('fill-rule', 'evenodd');
		this.width = width;
		this.height = height;
		if (path != null) this.draw(path);
	},

	draw: function(path, width, height){
		if (!(path instanceof Path)) path = new Path(path);
		this.element.setAttribute('d', path.toSVG());
		if (width != null) this.width = width;
		if (height != null) this.height = height;
		return this;
	}

});
