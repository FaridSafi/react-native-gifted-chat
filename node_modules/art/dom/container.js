var Class = require('../core/class');

module.exports = Class({

	grab: function(){
		for (var i = 0; i < arguments.length; i++) arguments[i].inject(this);
		return this;
	},

	empty: function(){
		var node;
		while (node = this.firstChild) node.eject();
		return this;
	}

});