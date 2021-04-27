var VML = require('./vml');
var Canvas = require('./canvas');
var Base = require('./canvas/base');
//var Flash = require('./flash');

/*
var hasFlash = function(){

	var flash = navigator.plugins && navigator.plugins['Shockwave Flash'];
	try {
		flash = flash ? flash.description :
			new ActiveXObject('ShockwaveFlash.ShockwaveFlash')
			.GetVariable('$version');
	} catch (x){ }
	return flash && flash.match(/\d+/) >= 9;

};
*/

var MODE = Base._genericContext ? Canvas : /*hasFlash() ? Flash :*/ VML;

exports.Surface = MODE.Surface;
exports.Path = MODE.Path;
exports.Shape = MODE.Shape;
exports.Group = MODE.Group;
exports.ClippingRectangle = MODE.ClippingRectangle;
exports.Text = MODE.Text;

require('./current').setCurrent(exports);
