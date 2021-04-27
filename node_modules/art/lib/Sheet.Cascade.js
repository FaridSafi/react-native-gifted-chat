var Slick = require('./slick/Source/slick').Slick;
var CSS = require('./sheet.js/Source/SheetParser.CSS').SheetParser.CSS;

function calculateSpecificity(expression){
	var specificity = 0;
	for (var i = 0, l = expression.length; i < l; i++){
		var part = expression[i];
		if (part.id) specificity += 10000;
		if (part.classes) specificity += part.classes.length * 1000;
		if (part.pseudos) specificity += part.pseudos.length * 1000;
		if (part.attributes) specificity += part.attributes.length * 1000;
		if (part.tag && part.tag != '*') specificity += 100;
	}
	return specificity;
};

function sortRules(rules){
	rules.sort(function(a,b){
		if (a.specificity < b.specificity)
			return -1;
		else if (a.specificity > b.specificity)
			return 1;
		return 0;
	});
};

function nodeContent(node){
	var n = node.firstChild, text = '';
	while (n){
		text += n.nodeValue;
		n = n.nextSibling;
	}
	return text;
}

var SheetCascade = function(){
	this.rules = [];
	this.cssRules = [];
};

SheetCascade.prototype = {

	addSheet: function(sheet){
		var rules = sheet.cssRules || CSS.parse(sheet.innerHTML || nodeContent(sheet) || sheet);
		for (var i = 0, l = rules.length; i < l; i++){
			var rule = rules[i];
			this.cssRules.push(rule);
			this.addRule(rule.selectorText, rule.style);
		}
	},
	
	addRule: function(selector, style){
		var parsed = Slick.parse(selector);
		if (!parsed) return;
		var expressions = parsed.expressions;
		for (var i = 0, l = expressions.length; i < l; i++){
			var expression = expressions[i],
			    specificity = calculateSpecificity(expression) + this.rules.length;
			this.rules.push({
				specificity: specificity,
				expression: expression,
				style: style
			});
		}
		this.sorted = false;
	},

	getStyle: function(node){
		var style = {};
		this.applyStyle(node, style);
		return style;
	},

	applyStyle: function(node, targetStyle){
		var rules = this.rules;
		if (!this.sorted){ sortRules(rules); this.sorted = true; }
		
		for (var i = 0, l = rules.length; i < l; i++){
			var rule = rules[i];
			if (Slick.match(node, { Slick: true, expressions: [rule.expression] })){
				var ruleStyle = rule.style;
				for (var name in ruleStyle) targetStyle[name] = ruleStyle[name];
			}
		}

		var cssText = node.getAttribute('style');
		if (cssText){
			var inlineStyle = CSS.parse(cssText);
			for (var name in inlineStyle) targetStyle[name] = inlineStyle[name];
		}
	}

};

exports.SheetCascade = SheetCascade;