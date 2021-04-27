var AST = require('./program');

AST.Statement = function(label){
	this.label = label;
};

AST.Statement.prototype = {

	writeTo: function(compressed){ },

	toString: function(compressed){
		var output = [];
		this.writeTo(function(str){
			output.push(str);
		}, compressed);
		return output.join('');
	}

};

AST.Return = function(expr){
	if (arguments.length) this.expression = AST.Expression(expr);
};

AST.Return.prototype = new AST.Statement();

AST.Return.prototype.writeTo = function(write, format){
	write('return');
	if (!this.expression) return;
	write(' ');
	this.expression.writeTo(write, format);
};

AST.Break = function(){
};

AST.Break.prototype = new AST.Statement();

AST.Break.prototype.writeTo = function(write, format){
	write('break');
};
