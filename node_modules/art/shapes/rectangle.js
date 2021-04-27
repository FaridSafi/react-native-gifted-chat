var Shape = require('./generic');

module.exports = Shape(function(width, height, radius){

	this.width = width;
	this.height = height;

	var path = this.path;

	if (!radius){

		path.move(0, 0).line(width, 0).line(0, height).line(-width, 0).line(0, -height);

	} else {

		if (typeof radius == 'number') radius = [radius, radius, radius, radius];

		var tl = radius[0], tr = radius[1], br = radius[2], bl = radius[3];

		if (tl < 0) tl = 0;
		if (tr < 0) tr = 0;
		if (bl < 0) bl = 0;
		if (br < 0) br = 0;

		path.move(0, tl);

		if (width < 0) path.move(width, 0);
		if (height < 0) path.move(0, height);

		if (tl > 0) path.arc(tl, -tl);
		path.line(Math.abs(width) - (tr + tl), 0);

		if (tr > 0) path.arc(tr, tr);
		path.line(0, Math.abs(height) - (tr + br));

		if (br > 0) path.arc(-br, br);
		path.line(- Math.abs(width) + (br + bl), 0);

		if (bl > 0) path.arc(-bl, -bl);
		path.line(0, - Math.abs(height) + (bl + tl));
	}
	
	path.close();

});