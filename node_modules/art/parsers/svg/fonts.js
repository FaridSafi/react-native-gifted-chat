var Class = require('../../core/class');
var Path = require('../../core/path');
var SVGParser = require('./core');
var Font = require('../../shapes/font');

var parse = SVGParser.prototype.parse;

var matchFontURL = /url\(['"\s]*([^\)]*?)['"\s]*\)\s+format\(['"]?svg['"]?\)/i;

var trimFontFamily = /^['"\s]+|['"\s]+$|,.*$/g;

var fillFaceAttributes = function(element, face){
	var attributes = element.attributes;
	for (var i = 0, l = attributes.length; i < l; i++){
		var attribute = attributes[i];
		if (!(attribute.nodeName in face)){
			face[attribute.nodeName] = attribute.nodeValue;
		}
	}
};

SVGParser.implement({

	parse: function(element, styles){
		if (element.documentElement && element != this.fontDocument){
			this.fontDocument = element;
			this.findFonts(element);
		}
		return parse.apply(this, arguments);
	},
	
	findFonts: function(document){
		var fonts = this.fonts || (this.fonts = {});
		var root = document.documentElement, node = root;
		treewalker: while (node){
			if (node.nodeType == 1 && node.nodeName == 'font-face'){
				this.fontFace(node);
			}
			if (node.firstChild){
				node = node.firstChild;
			} else {
				while (!node.nextSibling){
					node = node.parentNode;
					if (!node || node == root) break treewalker;
				}
				node = node.nextSibling;
			}
		}

		if (this.findCSS){
			var rules = this.findCSS(document).cssRules;
			for (var i = 0, l = rules.length; i < l; i++){
				var rule = rules[i];
				if (rule.fontFace){
					var url = matchFontURL.exec(rule.style.src);
					if (url) this.fontURL(document, url[1], rule.style);
				}
			}
		}
	},
	
	fontFace: function(element){
		var face = {};
		fillFaceAttributes(element, face);
		if (element.parentNode.nodeName == 'font') this.font(element.parentNode, face);
		var node = element.firstChild;
		while (node){
			if (node.nodeName == 'font-face-src'){
				node = node.firstChild;
				continue;
			}
			if (node.nodeName == 'font-face-uri'){
				var url = node.getAttribute('xlink:href');
				this.fontURL(element.ownerDocument, url, face);
			}
			node = node.nextSibling;
		}
	},
	
	fontURL: function(document, url, face){
		if (!face['font-family']) return;
		var pendingFonts = this.pendingFonts || (this.pendingFonts = {});
		var family = face['font-family'].replace(trimFontFamily, '');
		var callbacks = pendingFonts[family] = [];
		this.findByURL(document, url, function(font){
			delete pendingFonts[family];
			if (font){
				var f = this.font(font, face);
				for (var i = 0, l = callbacks.length; i < l; i++)
					callbacks[i].call(this, f);
			}
		});
	},
	
	findFont: function(styles, callback){
		var family = styles['font-family'].replace(trimFontFamily, '');
		var callbacks = this.pendingFonts && this.pendingFonts[family];
		if (callbacks){
			callbacks.push(callback);
		} else if (this.fonts){
			callback.call(this, this.fonts[family]);
		} else {
			callback.call(this, null);
		}
	},
	
	font: function(element, face){
		var glyphs = {}, font = { face: face, glyphs: glyphs };

		var w = element.getAttribute('horiz-adv-x');
		if (w) font.w = parseInt(w, 10);
		
		var node = element.firstChild;
		while (node){
			switch(node.nodeName){
				case 'font-face':
					fillFaceAttributes(node, face);
					break;
				case 'missing-glyph':
				case 'glyph':
					var glyph = {},
						code = node.nodeName == 'missing-glyph' ? 'missing' : node.getAttribute('unicode'),
						w = node.getAttribute('horiz-adv-x'),
						d = node.getAttribute('d');
					if (!code) break;
					if (w) glyph.w = parseInt(w, 10);

					if (d){
						// Flip path
						var path = new FlippedVMLPathAtNormalPrecision(d);
						glyph.d = path.toVML().substr(1);
					}
					glyphs[code] = glyph;
					break;
				// TODO: Kerning
			}
			node = node.nextSibling;
		}
		
		var units = face['units-per-em'];
		
		if (isNaN(units)) face['units-per-em'] = units = 1000;

		if (face.ascent == null) face.ascent = face.descent == null ? 0.8 * units : units - face.descent;
		if (face.descent == null) face.descent = face.ascent - units;
		
		var family = face['font-family'];
		if (!family) return;
		face['font-family'] = family = family.replace(trimFontFamily, '');

		var fonts = this.fonts || (this.fonts = {});
		if (face.ascent) face.ascent = +face.ascent;
		if (face.descent) face.descent = +face.descent;
		fonts[family] = font;
		if (this.MODE.Font)
			this.MODE.Font.register(font);
		else
			Font.register(font);
		return font;
	}

});

var round = Math.round;

var FlippedVMLPathAtNormalPrecision = Class(Path, {

	initialize: function(path){
		this.reset();
		if (path){
			this.push(path);
		}
	},

	onReset: function(){
		this.path = [];
	},

	onMove: function(sx, sy, x, y){
		this.path.push('m', round(x), -round(y));
	},

	onLine: function(sx, sy, x, y){
		this.path.push('l', round(x), -round(y));
	},

	onBezierCurve: function(sx, sy, p1x, p1y, p2x, p2y, x, y){
		this.path.push('c',
			round(p1x), -round(p1y),
			round(p2x), -round(p2y),
			round(x), -round(y)
		);
	},

	onClose: function(){
		this.path.push('x');
	},

	toVML: function(){
		return this.path.join(' ');
	}

});
