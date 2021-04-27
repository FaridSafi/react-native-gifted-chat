var Shape = require('./generic');

module.exports = Shape(function(width, height){

	this.width = width;
	this.height = height;

	var rx = width / 2, ry = height / 2;

	this.path
		.move(0, ry)
		.arc(width, 0, rx, ry)
		.arc(-width, 0, rx, ry)
		.close();

});