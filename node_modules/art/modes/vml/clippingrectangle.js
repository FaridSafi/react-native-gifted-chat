var Class = require('../../core/class');
var Transform = require('../../core/transform');
var Container = require('../../dom/container');
var Node = require('./node');

module.exports = Class(Node, Container, {

  element_initialize: Node.prototype.initialize,

  initialize: function(width, height){
    this.element_initialize('clippingrectangle');
    this.width = width;
    this.height = height;
  },

  _transform: function(){
    var element = this.element;
    element.clip = true;
    element.coordorigin = -this.x + ',' + (-1 * this.y);
    element.coordsize = this.width + ',' + this.height;
    // IE8 doesn't like clipBottom.  Don't ask me why.
    // element.style.clipBottom = this.height + this.y;
    element.style.clipLeft = this.x;
    element.style.clipRight = this.width + this.x;
    element.style.clipTop = this.y;
    element.style.left = -this.x;
    element.style.top = -this.y;
    element.style.width = this.width + this.x;
    element.style.height = this.height + this.y;
    element.style.rotation = 0;

    var container = this.parentNode;
    this._activeTransform = container ? new Transform(container._activeTransform).transform(this) : this;
    var node = this.firstChild;
    while (node){
      node._transform();
      node = node.nextSibling;
    }
  }

});
