var Class = require('../core/class');
var Dummy = require('./dummy');
var Native = require('./native');

module.exports = Class(Dummy, Native, {

	dummy_inject: Dummy.prototype.inject,
	dummy_injectBefore: Dummy.prototype.injectBefore,
	dummy_eject: Dummy.prototype.eject,
	native_inject: Native.prototype.inject,
	native_injectBefore: Native.prototype.injectBefore,
	native_eject: Native.prototype.eject,

	inject: function(container){
		this.dummy_inject(container);
		this.native_inject(container);
		return this;
	},

	injectBefore: function(sibling){
		this.dummy_injectBefore(sibling);
		this.native_injectBefore(sibling);
		return this;
	},

	eject: function(){
		this.dummy_eject();
		this.native_eject();
		return this;
	}

});
