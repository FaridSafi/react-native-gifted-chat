var AST = require('./program');

AST.Variable = function(name){
	this.name = name;
};

AST.Variable.prototype = new AST.Expression();

AST.Variable.prototype.writeTo = function(write){
	write(this.name);
};

AST.This = function(){
};

AST.This.prototype = new AST.Expression();

AST.This.prototype.writeTo = function(write){
	write('this');
};