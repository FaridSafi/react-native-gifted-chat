var Class = require('../../core/class');
var Color = require('../../core/color');
var Mode = require('../../modes/current');
var Rectangle = require('../../shapes/rectangle');

// Regular Expressions

var matchURL = /^\s*url\(["'\s]*([^\)]*?)["'\s]*\)/,
	requiredNumber = '(?:\\s+|\\s*,\\s*)([^\\s,\\)]+)';
	number = '(?:' + requiredNumber + ')?',
	matchViewBox = new RegExp('^\\s*([^\\s,]+)' + requiredNumber + requiredNumber + requiredNumber),
	matchUnit = /^\s*([\+\-\d\.]+(?:e\d+)?)(|px|em|ex|in|pt|pc|mm|cm|%)\s*$/i;

// Environment Settings
var dpi = 72, emToEx = 0.5;

var styleSheet = function(){},
	defaultStyles = {
		'viewportWidth': 500,
		'viewportHeight': 500,
		'font-family': 'Arial',
		'font-size': 12,
		'color': 'black',
		'fill': 'black'
	},
	nonInheritedStyles = {
		'stop-color': 'black',
		'stop-opacity': 1,
		'clip-path': null,
		'filter': null,
		'mask': null,
		'opacity': 1,
		'cursor': null
	};

// Visitor

var SVGParser = Class({

	initialize: function(mode){
		this.MODE = mode;
	},

	// TODO Fix this silly API
	parseAsSurface: function(element, styles){
		return this.parse(element, styles, true);
	},

	parse: function(element, styles, asSurface){
		if (typeof element == 'string') element = this.parseXML(element);

		if (!styles)
			styles = this.findStyles(element);
		else
			for (var style in defaultStyles)
				if (!(style in styles))
					styles[style] = defaultStyles[style];

		if (element.documentElement || asSurface){
			element = element.documentElement || element;
			var canvas = new this.MODE.Surface(
				this.parseLength(element.getAttribute('width') || '100%', styles, 'x'),
				this.parseLength(element.getAttribute('height') || '100%', styles, 'y')
			);
			if (element.getAttribute('viewBox'))
				canvas.grab(this.parse(element, styles));
			else
				this.container(element, this.parseStyles(element, styles), canvas);
			return canvas;
		}
		if (element.nodeType != 1 || element.getAttribute('requiredExtensions') || element.getAttribute('systemLanguage') != null) return null;
		styles = this.parseStyles(element, styles);
		var parseFunction = this[element.nodeName + 'Element'];
		return parseFunction ? parseFunction.call(this, element, styles) : null;
	},
	
	parseXML: window.DOMParser ? function(text){
		return new DOMParser().parseFromString(text, 'text/xml');
	} : function(text){
		try {
			var xml;
			try { xml = new ActiveXObject('MSXML2.DOMDocument'); }
			catch (e){ xml = new ActiveXObject('Microsoft.XMLDOM'); }
			xml.resolveExternals = false;
			xml.validateOnParse = false;
			xml.async = false;
			xml.preserveWhiteSpace = true;
			xml.loadXML(text);
			return xml;
		} catch (e){
			return null;
		}
	},
	
	parseStyles: function(element, styles){
		styleSheet.prototype = styles;
		var newSheet = new styleSheet();
		for (var key in nonInheritedStyles) newSheet[key] = nonInheritedStyles[key];
		this.applyStyles(element, newSheet);
		if (newSheet.hasOwnProperty('font-size')){
			var newFontSize = this.parseLength(newSheet['font-size'], styles, 'font');
			if (newFontSize != null) newSheet['font-size'] = newFontSize;
		}
		if (newSheet.hasOwnProperty('text-decoration')){
			newSheet['text-decoration-color'] = newSheet.color;
		}
		return newSheet;
	},
	
	findStyles: function(element){
		if (!element || element.nodeType != 1) return defaultStyles;
		var styles = this.findStyles(element.parentNode);
		return this.parseStyles(element, styles);
	},
	
	applyStyles: function(element, target){
		var attributes = element.attributes;
		for (var i = 0, l = attributes.length; i < l; i++){
			var attribute = attributes[i],
			    name = attribute.nodeName,
			    value = attribute.nodeValue;
			if (value != 'inherit'){
				target[name] = value;
				if (name == 'fill') target['fill_document'] = element.ownerDocument;
			}
		}
		return target;
	},

	findById: function(document, id){
		// if (document.getElementById) return document.getElementById(id); Not reliable
		if (this.cacheDocument != document){
			this.ids = {};
			this.lastSweep = null;
			this.cacheDocument = document;
		}
		var ids = this.ids;
		if (ids[id] != null) return ids[id];
		var root = document.documentElement, node = this.lastSweep || root;
		treewalker: while (node){
			if (node.nodeType == 1){
				var newID = node.getAttribute('id') || node.getAttribute('xml:id');
				if (newID && ids[newID] == null) ids[newID] = node;
				if (newID == id){
					this.lastSweep = node;
					return node;
				}
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
		return null;
	},
	
	findByURL: function(document, url, callback){
		callback.call(this, url && url[0] == '#' ? this.findById(document, url.substr(1)) : null);
	},

	resolveURL: function(url){
		return url;
	},
	
	parseLength: function(value, styles, dimension){
		var match = matchUnit.exec(value);
		if (!match) return null;
		var result = parseFloat(match[1]);
		switch(match[2]){
			case '': case 'px': return result;
			case 'em': return result * styles['font-size'];
			case 'ex': return result * styles['font-size'] * emToEx;
			case 'in': return result * dpi;
			case 'pt': return result * dpi / 72;
			case 'pc': return result * dpi / 6;
			case 'mm': return result * dpi / 25.4;
			case 'cm': return result * dpi / 2.54;
			case '%':
				var w = styles.viewportWidth, h = styles.viewportHeight;
				if (dimension == 'font') return result * styles['font-size'] / 100;
				if (dimension == 'x') return result * w / 100;
				if (dimension == 'y') return result * h / 100;
				return result * Math.sqrt(w * w + h * h) / Math.sqrt(2) / 100;
		}
	},
	
	parseColor: function(value, opacity, styles){
		if (value == 'currentColor') value = styles.color;
		try {
			var color = new Color(value);
		} catch (x){
			// Ignore unparsable colors, TODO: log
			return null;
		}
		color.alpha = opacity == null ? 1 : +opacity;
		return color;
	},
	
	getLengthAttribute: function(element, styles, attr, dimension){
		return this.parseLength(element.getAttribute(attr) || 0, styles, dimension);
	},
	
	container: function(element, styles, container){
		if (container.width != null) styles.viewportWidth = container.width;
		if (container.height != null) styles.viewportHeight = container.height;
		this.filter(styles, container);
		this.describe(element, styles, container);
		var node = element.firstChild;
		while (node){
			var art = this.parse(node, styles);
			if (art) container.grab(art);
			node = node.nextSibling;
		}
		return container;
	},

	shape: function(element, styles, target, x, y){
		this.transform(element, target);
		target.transform(1, 0, 0, 1, x, y);
		this.fill(styles, target, x, y);
		this.stroke(styles, target);
		this.filter(styles, target);
		if (styles.visibility == 'hidden') target.hide();
		this.describe(element, styles, target);
		return target;
	},
	
	fill: function(styles, target, x, y){
		if (!styles.fill || styles.fill == 'none') return;
		var match;
		if (match = matchURL.exec(styles.fill)){
			this.findByURL(styles.fill_document, match[1], function(fill){
				var fillFunction = fill && this[fill.nodeName + 'Fill'];
				if (fillFunction) fillFunction.call(this, fill, this.findStyles(fill), target, x, y);
			});
		} else {
			target.fill(this.parseColor(styles.fill, styles['fill-opacity'], styles));
		}
	},
	
	stroke: function(styles, target){
		if (!styles.stroke || styles.stroke == 'none' || matchURL.test(styles.stroke)) return; // Advanced stroke colors are not supported, TODO: log
		var color = this.parseColor(styles.stroke, styles['stroke-opacity'], styles),
			width = this.parseLength(styles['stroke-width'], styles),
			cap = styles['stroke-linecap'] || 'butt',
			join = styles['stroke-linejoin'] || 'miter';
		target.stroke(color, width == null ? 1 : width, cap, join);
	},

	filter: function(styles, target){
		if (styles.opacity != 1 && target.blend) target.blend(styles.opacity);
		if (styles.display == 'none') target.hide();
	},
	
	describe: function(element, styles, target){
		var node = element.firstChild, title = '';
		if (element.nodeName != 'svg')
			while (node){
				if (node.nodeName == 'title') title += node.firstChild && node.firstChild.nodeValue;
				node = node.nextSibling;
			}
		if (styles.cursor || title) target.indicate(styles.cursor, title);
	},

	transform: function(element, target){
		var transform = element.getAttribute('transform'), match;
		var matchTransform = new RegExp('([a-z]+)\\s*\\(\\s*([^\\s,\\)]+)' + number + number + number + number + number + '\\s*\\)', 'gi');
		while(match = transform && matchTransform.exec(transform)){
			switch(match[1]){
				case 'matrix':
					target.transform(match[2], match[3], match[4], match[5], match[6], match[7]);
					break;
				case 'translate':
					target.transform(1, 0, 0, 1, match[2], match[3]);
					break;
				case 'scale':
					target.transform(match[2], 0, 0, match[3] || match[2]);
					break;
				case 'rotate':
					var rad = match[2] * Math.PI / 180, cos = Math.cos(rad), sin = Math.sin(rad);
					target.transform(1, 0, 0, 1, match[3], match[4])
						.transform(cos, sin, -sin, cos)
						.transform(1, 0, 0, 1, -match[3], -match[4]);
					break;
				case 'skewX':
					target.transform(1, 0, Math.tan(match[2] * Math.PI / 180), 1);
					break;
				case 'skewY':
					target.transform(1, Math.tan(match[2] * Math.PI / 180), 0, 1);
					break;
			}
		}
	},
	
	svgElement: function(element, styles){
		var viewbox = element.getAttribute('viewBox'),
		    match = matchViewBox.exec(viewbox),
		    x = this.getLengthAttribute(element, styles, 'x', 'x'),
		    y = this.getLengthAttribute(element, styles, 'y', 'y'),
		    width = this.getLengthAttribute(element, styles, 'width', 'x'),
		    height = this.getLengthAttribute(element, styles, 'height', 'y'),
		    group = match ? new this.MODE.Group(+match[3], +match[4]) : new this.MODE.Group(width || null, height || null);
		if (width && height) group.resizeTo(width, height); // TODO: Aspect ratio
		if (match) group.transform(1, 0, 0, 1, -match[1], -match[2]);
		this.container(element, styles, group);
		group.move(x, y);
		return group;
	},
	
	gElement: function(element, styles){
		var group = new this.MODE.Group();
		this.transform(element, group);
		this.container(element, styles, group);
		return group;
	},
	
	useElement: function(element, styles){
		var placeholder = new this.MODE.Group(),
		    x = this.getLengthAttribute(element, styles, 'x', 'x'),
		    y = this.getLengthAttribute(element, styles, 'y', 'y'),
		    width = this.getLengthAttribute(element, styles, 'width', 'x'),
		    height = this.getLengthAttribute(element, styles, 'height', 'y');
		
		this.transform(element, placeholder);
		placeholder.transform(1, 0, 0, 1, x, y);
		
		this.findByURL(element.ownerDocument, element.getAttribute('xlink:href') || element.getAttribute('href'), function(target){
			if (!target || target.nodeType != 1) return;
			
			var parseFunction = target.nodeName == 'symbol' ? this.svgElement : this[target.nodeName + 'Element'];
			if (!parseFunction) return;
			
			styles = this.parseStyles(element, this.parseStyles(target, styles));
			
			var symbol = parseFunction.call(this, target, styles);
			if (!symbol) return;
			if (width && height) symbol.resizeTo(width, height); // TODO: Aspect ratio, maybe resize the placeholder instead
			placeholder.grab(symbol);
		});
		
		return placeholder;
	},
	
	switchElement: function(element, styles){
		var node = element.firstChild;
		while (node){
			var art = this.parse(node, styles);
			if (art) return art;
			node = node.nextSibling;
		}
		return null;
	},
	
	aElement: function(element, styles){
		// For now treat it like a group
		return this.gElement(element, styles);
	},
	
	pathElement: function(element, styles){
		var shape = new this.MODE.Shape(element.getAttribute('d') || null);
		this.shape(element, styles, shape);
		return shape;
	},
	
	imageElement: function(element, styles){
		var href = this.resolveURL(element.getAttribute('xlink:href') || element.getAttribute('href')),
		    width = this.getLengthAttribute(element, styles, 'width', 'x'),
		    height = this.getLengthAttribute(element, styles, 'height', 'y'),
		    x = this.getLengthAttribute(element, styles, 'x', 'x'),
		    y = this.getLengthAttribute(element, styles, 'y', 'y'),
		    clipPath = element.getAttribute('clip-path'),
		    image,
		    match;
		
		if (clipPath && (match = matchURL.exec(clipPath)) && match[1][0] == '#'){
			var clip = this.findById(element.ownerDocument, match[1].substr(1));
			if (clip){
				image = this.switchElement(clip, styles);
				if (image){
					if (typeof image.fillImage == 'function'){
						image.fillImage(href, width, height);
						if (image.stroke) image.stroke(0);
					} else {
						image = null;
					}
				}
			}
		}
		if (!image){
			//image = new Image(href, width, height); TODO
			image = new Rectangle(width, height).fillImage(href, width, height);
		}
		this.filter(styles, image);
		if (styles.visibility == 'hidden') target.hide();
		this.describe(element, styles, image);
		this.transform(element, image);
		image.transform(1, 0, 0, 1, x, y);
		return image;
	}

});

SVGParser.parse = function(element, styles){
	return new SVGParser(Mode).parse(element, styles);
};

SVGParser.implement = function(obj){
	for (var key in obj)
		this.prototype[key] = obj[key];
};

module.exports = SVGParser;