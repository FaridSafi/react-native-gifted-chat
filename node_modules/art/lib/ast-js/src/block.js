var AST = require('./program');

AST.Block = function(obj){
	if (this instanceof AST.Block){
		if (Object.prototype.toString.call(obj) == '[object Array]')
			this.statements = Array.prototype.slice.call(obj);
		else
			this.statements = Array.prototype.slice.call(arguments);
		return;
	}

	if (obj instanceof AST.Block) return obj;
	var block = new AST.Block();
	if (Object.prototype.toString.call(obj) == '[object Array]')
		block.statements = Array.prototype.slice.call(obj);
	else
		block.statements = [obj];

	return block;
};

AST.Block.prototype = {

	writeTo: function(writer, format, curly){
		var body = this.statements;
		if (!body || !body.length) return;
		for (var i = 0, l = body.length; i < l; i++){
			var expr = body[i];
			if (!(expr instanceof AST.Statement)) body[i] = expr = new AST.Literal(expr);
			if (expr instanceof AST.Assignment && expr.left instanceof AST.Variable) writer('var '); // Temp hack - breaks sometimes
			expr.writeTo(writer, format);
			writer(';\n');
		}
	},

	toString: function(format){
		var output = [];
		this.writeTo(function(str){
			output.push(str);
		}, format);
		return output.join('');
	}

};

AST.prototype = AST.Block.prototype;