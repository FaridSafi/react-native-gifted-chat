var Shape = require('./generic');

module.exports = Shape(function(width, height){

	this.width = width;
	this.height = height;

	var path = this.path;

	if (width < 0){
		path.move(width, 0);
		width = -width;
	}
	if (height < 0){
		path.move(0, height);
		height = -height;
	}

	if (width < height){
		var r = width / 2;
		path.move(0, r)
			.arc(width, 0, r)
			.line(0, height - width)
			.arc(-width, 0, r)
			.line(0, width - height);
	} else {
		var r = height / 2;
		path.move(r, 0)
			.line(width - height, 0)
			.arc(0, height, r)
			.line(height - width, 0)
			.arc(0, -height, r);
	}
	
	path.close();

});