var Class = require('../core/class');
var Mode = require('../modes/current');

module.exports = function(drawFunction){

	return Class(Mode.Shape, {

		shape_initialize: Mode.Shape.prototype.initialize,
		shape_draw: Mode.Shape.prototype.draw,

		initialize: function(arg){
			this.shape_initialize();
			this.path = new Mode.Path();
			if (arg != null) this.draw.apply(this, arguments);
		},

		draw: function(){
			this.path.reset();
			this._draw_function.apply(this, arguments);
			this.shape_draw(this.path, this.width, this.height);
			return this;
		},

		_draw_function: drawFunction

	});

};