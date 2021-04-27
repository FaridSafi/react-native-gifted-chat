var Class = require('../core/class');

function elementFrom(node){
	if (node.toElement) return node.toElement();
	if (node.getDOMNode) return node.getDOMNode();
	if (node.getNode) return node.getNode();
	return node;
}

module.exports = Class({

	// conventions

	toElement: function(){
		return this.element;
	},

	getDOMNode: function(){
		return this.toElement();
	},

	getNode: function(){
		return this.toElement();
	},

	// placement

	inject: function(container){
		(container.containerElement || elementFrom(container))
			.appendChild(this.element);
		return this;
	},

	injectBefore: function(sibling){
		var element = elementFrom(sibling);
		element.parentNode.insertBefore(this.element, element);
		return this;
	},

	eject: function(){
		var element = this.element, parent = element.parentNode;
		if (parent) parent.removeChild(element); // TODO: VML Nodes are dead after being ejected
		return this;
	},

	// events

	subscribe: function(type, fn, bind){
		if (typeof type != 'string'){ // listen type / fn with object
			var subscriptions = [];
			for (var t in type) subscriptions.push(this.subscribe(t, type[t]));
			return function(){ // unsubscribe
				for (var i = 0, l = subscriptions.length; i < l; i++)
					subscriptions[i]();
				return this;
			};
		} else { // listen to one
			if (!bind) bind = this;
			var bound;
			if (typeof fn === 'function'){
				bound = fn.bind ? fn.bind(bind)
					: function(){ return fn.apply(bind, arguments); };
			} else {
				bound = fn;
			}
			var element = this.element;
			if (element.addEventListener){
				element.addEventListener(type, bound, false);
				return function(){ // unsubscribe
					element.removeEventListener(type, bound, false);
					return this;
				};
			} else {
				element.attachEvent('on' + type, bound);
				return function(){ // unsubscribe
					element.detachEvent('on' + type, bound);
					return this;
				};
			}
		}
	}

});
