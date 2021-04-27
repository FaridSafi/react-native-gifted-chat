var Class = require('../../core/class');
var Path = require('../../core/path');

var CanvasPath = Class(Path, {

	initialize: function(path){
		this.reset();
		if (path instanceof CanvasPath){
			this.path = path.path.slice(0);
		} else if (path){
			if (path.applyToPath)
				path.applyToPath(this);
			else
				this.push(path);
		}
	},

	onReset: function(){
		this.path = [];
	},

	onMove: function(sx, sy, x, y){
		this.path.push(function(context){
			context.moveTo(x, y);
		});
	},

	onLine: function(sx, sy, x, y){
		this.path.push(function(context){
			context.lineTo(x, y);
		});
	},

	onBezierCurve: function(sx, sy, p1x, p1y, p2x, p2y, x, y){
		this.path.push(function(context){
			context.bezierCurveTo(p1x, p1y, p2x, p2y, x, y);
		});
	},

	_arcToBezier: Path.prototype.onArc,

	onArc: function(sx, sy, ex, ey, cx, cy, rx, ry, sa, ea, ccw, rotation){
		if (rx != ry || rotation) return this._arcToBezier(sx, sy, ex, ey, cx, cy, rx, ry, sa, ea, ccw, rotation);
		this.path.push(function(context){
			context.arc(cx, cy, rx, sa, ea, ccw);
		});
	},

	onClose: function(){
		this.path.push(function(context){
			context.closePath();
		});
	},

	toCommands: function(){
		return this.path.slice(0);
	}

});

module.exports = CanvasPath;