var AST = require('./program');

// Based on the MooTools JSON implementation

var specialChars = {'\b': '\\b', '\t': '\\t', '\n': '\\n', '\f': '\\f', '\r': '\\r', '"' : '\\"', '\\': '\\\\'},

	escapable = new RegExp('[\\\\"\\x00-\\x1f]', 'g'), // RegExp Literal doesn't work in ExtendScript

    replaceChars = function(chr){
		return specialChars[chr] || ('\\u00' + Math.floor(chr.charCodeAt() / 16).toString(16) + (chr.charCodeAt() % 16).toString(16));
	},

    encode = function(write, obj, format){
		if (obj === null){
			write('null');
			return;
		}
		if (typeof obj === 'undefined'){
			write('undefined');
			return;
		}
		if (typeof obj.toExpression == 'function')
		{
			obj = obj.toExpression();
		}
		if (obj instanceof AST.Expression){
			obj.writeTo(write, format);
			return;
		}
		if (typeof obj == 'string'){
			write('"' + obj.replace(escapable, replaceChars) + '"');
			return;
		}
		if (typeof obj == 'object' && Object.prototype.toString.call(obj) != '[object RegExp]'){

			var first = true;
			
			if (Object.prototype.toString.call(obj) == '[object Array]'){

				write('[');
				for (var i = 0, l = obj.length; i < l; i++){
					if (!Object.hasOwnProperty.call(obj, key)) continue;
					if (first) first = false; else write(', ');
					encode(write, obj, format);
				}
				write(']');

			} else {

				write('{');
				for (var key in obj){
					if (!Object.hasOwnProperty.call(obj, key)) continue;
					if (first) first = false; else write(', ');
					encode(write, key, format);
					write(': ');
					encode(write, obj[key], format);
				}
				write('}');
			}
			
			return;
		}

		write(String(obj));
	};

AST.Literal = function(value){
	this.value = value;
};

AST.Literal.prototype = new AST.Expression();

AST.Literal.prototype.writeTo = function(writer, format){
	encode(writer, this.value, format);
};