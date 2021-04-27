var SVGParser = require('./core');
var Slick = require('../../lib/slick/Source/slick').Slick;
var SheetCascade = require('../../lib/Sheet.Cascade').SheetCascade;

var applyStyles = SVGParser.prototype.applyStyles;

SVGParser.implement({

	applyStyles: function(element, target){
		this.findCSS(element.ownerDocument).applyStyle(element, target);
		for (var key in target)
			if (target.hasOwnProperty(key) && target[key] == 'inherit')
				delete target[key];
		if (target.hasOwnProperty('fill')) target['fill_document'] = element.ownerDocument;
		applyStyles.call(this, element, target);
	},
	
	findCSS: function(document){
		if (this.cssDocument != document){
			this.cssDocument = document;
			var css = this.css = new SheetCascade();
			var sheets = Slick.search(document, 'style');
			for (var i = 0, l = sheets.length; i < l; i++){
				css.addSheet(sheets[i]);
			}
			return css;
		} else {
			return this.css;
		}
	}

});
