var Class = require('../../core/class');

// Utility command factories

var point = function(c){
	return function(x, y){
		return this.push(c, x, y);
	};
};

var arc = function(c, cc){
	return function(x, y, rx, ry, outer){
		return this.push(c, Math.abs(rx || x), Math.abs(ry || rx || y), 0, outer ? 1 : 0, cc, x, y);
	};
};

var curve = function(t, s, q, c){
	return function(c1x, c1y, c2x, c2y, ex, ey){
		var l = arguments.length, k = l < 4 ? t : l < 6 ? q : c;
		return this.push(k, c1x, c1y, c2x, c2y, ex, ey);
	};
};

// SVG Path Class

var SVGPath = Class({
	
	initialize: function(path){
		if (path instanceof SVGPath){
			this.path = [Array.prototype.join.call(path.path, ' ')];
		} else {
			if (path && path.applyToPath)
				path.applyToPath(this);
			else
				this.path = [path || 'm0 0'];
		}
	},
	
	push: function(){
		this.path.push(Array.prototype.join.call(arguments, ' '));
		return this;
	},
	
	reset: function(){
		this.path = [];
		return this;
	},
	
	move: point('m'),
	moveTo: point('M'),
	
	line: point('l'),
	lineTo: point('L'),
	
	curve: curve('t', 's', 'q', 'c'),
	curveTo: curve('T', 'S', 'Q', 'C'),
	
	arc: arc('a', 1),
	arcTo: arc('A', 1),
	
	counterArc: arc('a', 0),
	counterArcTo: arc('A', 0),
	
	close: function(){
		return this.push('z');
	},
	
	toSVG: function(){
		return this.path.join(' ');
	}

});

SVGPath.prototype.toString = SVGPath.prototype.toSVG;

module.exports = SVGPath;