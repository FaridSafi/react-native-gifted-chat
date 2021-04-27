var Shape = require('./generic');

module.exports = Shape(function(innerRadius, outerRadius, startAngle, endAngle){

	var circle = Math.PI * 2,
		radiansPerDegree = Math.PI / 180,
		sa = startAngle * radiansPerDegree % circle || 0,
		ea = endAngle * radiansPerDegree % circle || 0,
		ir = Math.min(innerRadius || 0, outerRadius || 0),
		or = Math.max(innerRadius || 0, outerRadius || 0),
		a = sa > ea ? circle - sa + ea : ea - sa;

	this.width = this.height = or * 2;
	var path = this.path;

	if (a >= circle){

		path.move(0, or).arc(or * 2, 0, or).arc(-or * 2, 0, or);
		if (ir) path.move(or - ir, 0).counterArc(ir * 2, 0, ir).counterArc(-ir * 2, 0, ir);

	} else {

		var ss = Math.sin(sa), es = Math.sin(ea),
			sc = Math.cos(sa), ec = Math.cos(ea),
			ds = es - ss, dc = ec - sc, dr = ir - or,
			large = a > Math.PI;

		path.move(or + or * ss, or - or * sc).arc(or * ds, or * -dc, or, or, large).line(dr * es, dr * -ec);
		if (ir) path.counterArc(ir * -ds, ir * dc, ir, ir, large);

	}

	path.close();

});