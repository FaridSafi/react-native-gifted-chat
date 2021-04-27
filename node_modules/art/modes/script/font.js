var Class = require('../../core/class');
var Base = require('./base');
var Modulizer = require('./modulizer');
var fonts = {}, fontsInUse = null;

var artVar = Base.prototype.artVar, artFont = artVar.property('Font');

var parseFontString = function(font){
	var regexp = /^\s*((?:(?:normal|bold|italic)\s+)*)(?:(\d+(?:\.\d+)?)[ptexm\%]*(?:\s*\/.*?)?\s+)?\s*\"?([^\"]*)/i,
	    match = regexp.exec(font);
	return {
		fontFamily: match[3],
		fontSize: match[2],
		fontStyle: (/italic/.exec(match[1]) || ''),
		fontWeight: (/bold/.exec(match[1]) || '')
	};
};

var Font = Class(Base, {

	base_initialize: Base.prototype.initialize,
	
	initialize: function(text, font, alignment){
		this.base_initialize();
		if (text != null && font != null) this.draw(text, font, alignment);
	},

	draw: function(text, fontArg, alignment){
		var font = (typeof fontArg == 'string') ? parseFontString(fontArg) : fontArg;
		if (font){
			var family = font.fontFamily || font['font-family'],
				weight = font.fontWeight || font['font-weight'] || 'normal',
				style = font.fontStyle || font['font-style'] || 'normal',
				size = parseFloat(font.fontSize || font['font-size'] || font.size);

			this.font = font.glyphs ? null : weight + style + family;
		}
		this.args = Array.prototype.slice.call(arguments);
		return this;
	},
	
	base_toExpression: Base.prototype.toExpression,

	toExpression: function(expr){
		if (this.font && fontsInUse) fontsInUse[this.font] = fonts[this.font];
		if (!expr) expr = this.args ? artFont.construct.apply(artFont, this.args) : artFont.construct();
		return this.base_toExpression(expr);
	}

});

Font.register = function(font){
	var face = font.face,
	    family = face['font-family'],
	    weight = (face['font-weight'] > 500 ? 'bold' : 'normal'),
	    style = (face['font-stretch'] == 'oblique' || face['font-style'] == 'oblique' || face['font-style'] == 'italic' ? 'italic' : 'normal');
	fonts[weight + style + family] = font;
	return this;
};

var _toModuleStatements = Modulizer._toModuleStatements;

Modulizer._toModuleStatements = function(){
	fontsInUse = {};
	var statements = _toModuleStatements.call(this);
	for (var font in fontsInUse){
		var registerStatement = artFont.property('register').call(fontsInUse[font]);
		statements.push(registerStatement);
	}
	statements.push(statements[1]);
	statements.splice(1, 1);
	fontsInUse = null;
	return statements;
};

module.exports = Font;