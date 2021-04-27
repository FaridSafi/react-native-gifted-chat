var hasCanvas = function(){

  var canvas = typeof window !== 'undefined' && window.document && window.document.createElement && document.createElement('canvas');
  return canvas && !!canvas.getContext;

};

if (hasCanvas()) {
  exports.Surface = require('./canvas/surface');
  exports.Path = require('./canvas/path');
  exports.Shape = require('./canvas/shape');
  exports.Group = require('./canvas/group');
  exports.ClippingRectangle = require('./canvas/clippingrectangle');
  exports.Text = require('./canvas/text');
} else {
  exports.Surface = require('./vml/surface');
  exports.Path = require('./vml/path');
  exports.Shape = require('./vml/shape');
  exports.Group = require('./vml/group');
  exports.ClippingRectangle = require('./vml/clippingrectangle');
  exports.Text = require('./vml/text');

  var DOM = require('./vml/dom');
  if (typeof document !== 'undefined') DOM.init(document);
}
