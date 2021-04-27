var Class = require('../../core/class');
var Path = require('../../core/path');

var precision = 100;

var round = Math.round;

var VMLPath = Class(Path, {

	initialize: function(path){
		this.reset();
		if (path instanceof VMLPath){
			this.path = [Array.prototype.join.call(path.path, ' ')];
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
		this.path.push('m', round(x * precision), round(y * precision));
	},

	onLine: function(sx, sy, x, y){
		this.path.push('l', round(x * precision), round(y * precision));
	},

	onBezierCurve: function(sx, sy, p1x, p1y, p2x, p2y, x, y){
		this.path.push('c',
			round(p1x * precision), round(p1y * precision),
			round(p2x * precision), round(p2y * precision),
			round(x * precision), round(y * precision)
		);
	},

	_arcToBezier: Path.prototype.onArc,

	onArc: function(sx, sy, ex, ey, cx, cy, rx, ry, sa, ea, ccw, rotation){
		if (rx != ry || rotation) return this._arcToBezier(sx, sy, ex, ey, cx, cy, rx, ry, sa, ea, ccw, rotation);
		cx *= precision;
		cy *= precision;
		rx *= precision;
		this.path.push(ccw ? 'at' : 'wa',
			round(cx - rx), round(cy - rx),
			round(cx + rx), round(cy + rx),
			round(sx * precision), round(sy * precision),
			round(ex * precision), round(ey * precision)
		);
	},

	onClose: function(){
		this.path.push('x');
	},

	toVML: function(){
		return this.path.join(' ');
	}

});

VMLPath.prototype.toString = VMLPath.prototype.toVML;

module.exports = VMLPath;