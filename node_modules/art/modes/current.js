function warning(){
	throw new Error('You must require a mode before requiring anything else.');
}

exports.Surface = warning;
exports.Path = warning;
exports.Shape = warning;
exports.Group = warning;
exports.ClippingRectangle = warning;
exports.Text = warning;

exports.setCurrent = function(mode){
	for (var key in mode){
		exports[key] = mode[key];
	}
};
