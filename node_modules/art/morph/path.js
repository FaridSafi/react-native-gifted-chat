var Class = require('../core/class');
var Path = require('../core/path');

var MOVE = 0, CURVE = 1;

var MorphablePath = Class(Path, {

	initialize: function(path){
		this.reset();
		if (path instanceof MorphablePath){
			this.path = path.path.slice(0);
		} else if (path){
			this.push(path);
		}
	},

	onReset: function(){
		this.path = [];
	},

	onMove: function(sx, sy, x, y){
		this.path.push(MOVE, x, y);
	},

	onBezierCurve: function(sx, sy, p1x, p1y, p2x, p2y, x, y){
		this.path.push(CURVE, p1x, p1y, p2x, p2y, x, y);
	}

});

var Tween = Class({

	initialize: function(from, to){
		if (!(from instanceof MorphablePath)) from = new MorphablePath(from);
		if (!(to instanceof MorphablePath)) to = new MorphablePath(to);
		this.from = from.path;
		this.to = to.path;
		this.delta = 0;
	},

	tween: function(delta){
		this.delta = delta;
	},

	applyToPath: function(path){
		var f = this.from, t = this.to, r = path,
		    fi = 0, ti = 0, x, y, delta = this.delta;

		r.reset();

		// Unrolled and inlined for performance
		while (fi < f.length || ti < t.length){
			if (fi >= f.length){
				// FROM is over limit but TO is not
				x = f[fi - 2];
				y = f[fi - 1];
				if (t[ti] === MOVE){
					r.moveTo(
						(t[ti + 1] - x) * delta + x,
						(t[ti + 2] - y) * delta + y
					);
					ti += 3;
				} else {
					r.curveTo(
						(t[ti + 1] - x) * delta + x,
						(t[ti + 2] - y) * delta + y,
						(t[ti + 3] - x) * delta + x,
						(t[ti + 4] - y) * delta + y,
						(t[ti + 5] - x) * delta + x,
						(t[ti + 6] - y) * delta + y
					);
					ti += 7;
				}
			} else if (ti >= t.length){
				// TO is over limit but FROM is not
				x = t[ti - 2];
				y = t[ti - 1];
				if (f[fi] === MOVE){
					r.moveTo(
						(x - f[fi + 1]) * delta + f[fi + 1],
						(y - f[fi + 2]) * delta + f[fi + 2]
					);
					fi += 3;
				} else {
					r.curveTo(
						(x - f[fi + 1]) * delta + f[fi + 1],
						(y - f[fi + 2]) * delta + f[fi + 2],
						(x - f[fi + 3]) * delta + f[fi + 3],
						(y - f[fi + 4]) * delta + f[fi + 4],
						(x - f[fi + 5]) * delta + f[fi + 5],
						(y - f[fi + 6]) * delta + f[fi + 6]
					);
					fi += 7;
				}
			} else if (f[fi] === MOVE){
				if (t[ti] === MOVE){
					// Both are moving
					r.moveTo(
						(t[ti + 1] - f[fi + 1]) * delta + f[fi + 1],
						(t[ti + 2] - f[fi + 2]) * delta + f[fi + 2]
					);
					fi += 3;
					ti += 3;
				} else {
					// FROM is moving but TO has a curve
					x = f[fi - 2];
					y = f[fi - 1];
					r.curveTo(
						(t[ti + 1] - x) * delta + x,
						(t[ti + 2] - y) * delta + y,
						(t[ti + 3] - x) * delta + x,
						(t[ti + 4] - y) * delta + y,
						(t[ti + 5] - x) * delta + x,
						(t[ti + 6] - y) * delta + y
					);
					ti += 7;
				}
			} else {
				if (t[ti] === MOVE){
					// TO is moving but FROM has a curve
					x = t[ti - 2];
					y = t[ti - 1];
					r.curveTo(
						(x - f[fi + 1]) * delta + f[fi + 1],
						(y - f[fi + 2]) * delta + f[fi + 2],
						(x - f[fi + 3]) * delta + f[fi + 3],
						(y - f[fi + 4]) * delta + f[fi + 4],
						(x - f[fi + 5]) * delta + f[fi + 5],
						(y - f[fi + 6]) * delta + f[fi + 6]
					);
					fi += 7;
				} else {
					// Both have a curve
					r.curveTo(
						(t[ti + 1] - f[fi + 1]) * delta + f[fi + 1],
						(t[ti + 2] - f[fi + 2]) * delta + f[fi + 2],
						(t[ti + 3] - f[fi + 3]) * delta + f[fi + 3],
						(t[ti + 4] - f[fi + 4]) * delta + f[fi + 4],
						(t[ti + 5] - f[fi + 5]) * delta + f[fi + 5],
						(t[ti + 6] - f[fi + 6]) * delta + f[fi + 6]
					);
					fi += 7;
					ti += 7;
				}
			}
		}
	}

});

exports.Path = MorphablePath;
exports.Tween = Tween;
