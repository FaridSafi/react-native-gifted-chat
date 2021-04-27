var SVG = require('./svg');
var VML = require('./vml');

var hasSVG = function(){

	var implementation = typeof document !== 'undefined' && document.implementation;
	return (implementation && implementation.hasFeature && implementation.hasFeature("http://www.w3.org/TR/SVG11/feature#BasicStructure", "1.1"));

};

var hasVML = function(){

	return typeof document !== 'undefined' && document.namespaces;

};

var MODE = hasSVG() ? SVG : hasVML() ? VML : {};

exports.Surface = MODE.Surface;
exports.Path = MODE.Path;
exports.Shape = MODE.Shape;
exports.Group = MODE.Group;
exports.ClippingRectangle = MODE.ClippingRectangle;
exports.Text = MODE.Text;

require('./current').setCurrent(exports);
