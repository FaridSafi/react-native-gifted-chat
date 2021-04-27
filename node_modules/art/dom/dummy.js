var Class = require('../core/class');

module.exports = Class({

	// placement

	_resetPlacement: function(){
		var container = this.parentNode;
		if (container){
			var previous = this.previousSibling, next = this.nextSibling;
			if (previous){
				previous.nextSibling = next;
			} else {
				container.firstChild = next;
			}
			if (next){
				next.previousSibling = previous;
			} else {
				container.lastChild = this.previousSibling;
			}
		}
		this.previousSibling = null;
		this.nextSibling = null;
		this.parentNode = null;
		return this;
	},

	inject: function(container){
		this._resetPlacement();
		var last = container.lastChild;
		if (last){
			last.nextSibling = this;
			this.previousSibling = last;
		} else {
			container.firstChild = this;
		}
		container.lastChild = this;
		this.parentNode = container;
		this._place();
		return this;
	},

	injectBefore: function(sibling){
		this._resetPlacement();
		var container = sibling.parentNode;
		if (!container) return this;
		var previous = sibling.previousSibling;
		if (previous){
			previous.nextSibling = this;
			this.previousSibling = previous;
		} else {
			container.firstChild = this;
		}
		sibling.previousSibling = this;
		this.nextSibling = sibling;
		this.parentNode = container;
		this._place();
		return this;
	},

	eject: function(){
		this._resetPlacement();
		this._place();
		return this;
	},

	_place: function(){},

	// events

	dispatch: function(event){
		var events = this._events,
			listeners = events && events[event.type];
		if (listeners){
			listeners = listeners.slice(0);
			for (var i = 0, l = listeners.length; i < l; i++){
				var fn = listeners[i], result;
				if (typeof fn == 'function')
					result = fn.call(this, event);
				else
					result = fn.handleEvent(event);
				if (result === false) event.preventDefault();
			}
		}
		if (this.parentNode && this.parentNode.dispatch){
			this.parentNode.dispatch(event);
		}
	},

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
			var bound = typeof fn === 'function' ? fn.bind(bind || this) : fn,
				events = this._events || (this._events = {}),
				listeners = events[type] || (events[type] = []);
			listeners.push(bound);
			return function(){
				// unsubscribe
				for (var i = 0, l = listeners.length; i < l; i++){
					if (listeners[i] === bound){
						listeners.splice(i, 1);
						break;
					}
				}
			}
		}
	}

});
