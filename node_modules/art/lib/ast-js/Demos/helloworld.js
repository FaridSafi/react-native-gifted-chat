var a = new AST.Variable('astr');
var b = new AST.Variable('bstr');

var alertFn = new AST.Variable('alert');

var newFn = new AST.Function(
	[a, b], null,
	alertFn.call(a.add(b))
);

newFn.compile()('Hello', ' world');

var klass = new AST.Variable('Class').construct({

	initialize: newFn

});

var ast = new AST(new AST.Variable('MyClass').assign(klass));

alert(ast.toString());
