exports.Surface = require('./svg/surface');
exports.Path = require('./svg/path');
exports.Shape = require('./svg/shape');
exports.Group = require('./svg/group');
exports.ClippingRectangle = require('./svg/group');
exports.Text = require('./svg/text');

require('./current').setCurrent(exports);
