var Class = require('../core/class');
var Path = require('../core/path');
var Transform = require('../core/transform');

module.exports = Class(Path, {

	onReset: function(){
		this.points = [];
		this.left = this.top = Infinity;
		this.right = this.bottom = -Infinity;
		this.width = this.height = 0;
		this.length = 0;
	},

	onMove: function(sx, sy, ex, ey){
		this.points.push(this.length, ex, ey);
	},

	onLine: function(sx, sy, ex, ey){
		var x = ex - sx, y = ey - sy;
		this.points.push((this.length += Math.sqrt(x * x + y * y)), ex, ey);
		this.left   = Math.min(this.left,   sx, x);
		this.right  = Math.max(this.right,  sx, x);
		this.top    = Math.min(this.top,    sy, y);
		this.bottom = Math.max(this.bottom, sy, y);
		this.width  = this.right - this.left;
		this.height = this.bottom - this.top;
	},

	point: function(lengthToPoint){
		// TODO: Binary search, store last distance-and-index to make second look ups faster
		var points = this.points, last = points.length - 3, next;
		if (last < 3) return null;
		for (var i = 3; i < last; i+=3)
			if (points[i] >= lengthToPoint)
				break;

		var l = points[i],
			x = points[i+1], y = points[i+2],

			dl = l - points[i-3],
		    dx = x - points[i-2], dy = y - points[i-1];

		var offset = (l - lengthToPoint) / dl,
		    cos = dx / dl, sin = dy / dl;
		x -= dx * offset; y -= dy * offset;
		return new Transform(cos, sin, -sin, cos, x, y);
	}

});