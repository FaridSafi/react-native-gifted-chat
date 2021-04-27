var SVGParser = require('./core');
var Font = require('../../shapes/font');

function fontStyles(styles){
	var font = {}, isFontStyle = /^(font|text-d|kerning|letter|word)[^\_]*$/;
	for (var style in styles)
		if (isFontStyle.test(style))
			font[style] = styles[style] + (style == 'font-size' ? 'px' : '');
	// Iffy
	font['font-weight'] = (font['font-weight'] > 500 || font['font-weight'] == 'bold' || font['font-weight'] == 'bolder') ? 'bold' : 'normal';
	font['font-style'] = font['font-style'] == 'oblique' || font['font-style'] == 'italic' ? 'italic' : 'normal';
	return font;
};

function progressRow(row, element, styles){
	var nx = element.getAttribute('x'),
		ny = element.getAttribute('y'),
		dx = element.getAttribute('dx'),
		dy = element.getAttribute('dy');
	
	var newRow = (nx != null && nx != '') || (ny != null && ny != '');

	if (newRow){
		adjustRow(row);
		row = [];
		row.anchor = styles['text-anchor'];
		row.x = row.y = 0;
	}

	if (dx) row.x += this.parseLength(dx.split(/[\s\,]+/)[0], styles, 'x');
	if (dy) row.y += this.parseLength(dy.split(/[\s\,]+/)[0], styles, 'y');
	if (nx != null && nx != '') row.x = this.parseLength(nx.split(/[\s\,]+/)[0], styles, 'x');
	if (ny != null && ny != '') row.y = this.parseLength(ny.split(/[\s\,]+/)[0], styles, 'y');
	
	if (newRow) row.ix = row.x;
	return row;
};

function adjustRow(row){
	var adjustment = row.anchor == 'end' ? (row.ix - row.x) : row.anchor == 'middle' ? (row.ix - row.x) / 2 : 0;
	if (adjustment)
		for (var i = 0, l = row.length; i < l; i++)
			row[i].transform(1,0,0,1,adjustment,0);
}

SVGParser.implement({

	textElement: function(element, styles){
		var group = new this.MODE.Group();
		this.transform(element, group);
		this.filter(styles, group);
		var row = [];
		row.ix = row.x = row.y = 0;
		row.anchor = styles['text-anchor'];
		this.tspanText(element, styles, row, group, adjustRow);
		return group;
	},
	
	tspanText: function(element, styles, row, target, continuation){
		row = progressRow.call(this, row, element, styles);

		var node = element.firstChild;
		
		var self = this;
		
		var next = function(row){
			if (node.nodeType == 3){
				var text = self.textContent(node, styles);
				node = node.nextSibling;
				self.createText(text, styles, row, target, null, function(shape){
					if (shape){
						if (shape.width) row.x += shape.width + (shape.left || 0); // TODO: Adjust for rotated text
						row.push(shape);
					}
					if (node) next(row); else continuation(row);
				});
			} else {
				var parseFn = self[node.nodeName + 'Text'];
				var current = node;
				node = node.nextSibling;
				if (parseFn) return parseFn.call(self, current, self.parseStyles(current, styles), row, target, node ? next : continuation);
				if (node) next(row); else continuation(row);
			}
		};
		
		if (node) next(row); else continuation(row);
	},
	
	aText: function(){
		return this.tspanText.apply(this, arguments);
	},

	textPathText: function(element, styles, row, target, continuation){
		this.findByURL(element.ownerDocument, element.getAttribute('xlink:href') || element.getAttribute('href'), function(path){
			if (!path || !(path = path.getAttribute('d'))) return;
			var text = this.elementTextContent(element, styles);
			this.createText(text, styles, null, target, path, function(){
				continuation(row);
			});
		});
	},
	
	trefText: function(element, styles, row, target, continuation){
		row = progressRow.call(this, row, element, styles);

		this.findByURL(element.ownerDocument, element.getAttribute('xlink:href') || element.getAttribute('href'), function(ref){
			if (!ref) return continuation(row);
			var text = this.elementTextContent(ref, styles);
			this.createText(text, styles, row, target, null, function(shape){
				if (shape){
					if (shape.width) row.x += shape.width + (shape.left || 0); // TODO: Adjust for rotated text
					row.push(shape);
				}
				continuation(row);
			});
		});
	},
	
	createText: function(text, styles, row, target, path, continuation){
		var fontstyle = fontStyles(styles);
		
		var create = function(font){
			if (font){
				var face = font.face;
				fontstyle = {
					fontFamily: font.face['font-family'],
					fontSize: fontstyle['font-size']
				};
				if (face['font-weight'] > 500) fontstyle.fontWeight = face['font-weight'];
				if (face['font-stretch'] == 'oblique' || face['font-style'] == 'oblique' || face['font-style'] == 'italic') fontstyle.fontStyle = 'italic';
			};

			var Text = font ? (this.MODE.Font || Font) : this.MODE.Text;

			if (row){
				var pad = row.pad || '';
				row.pad = (/[\s\xA0]*$/).exec(text)[0];
				if (row.length == 0) text = text.replace(/^\s+/, '');
				text = pad + text.replace(/\s+$/, '');
			} else {
				text = text.replace(/^\s+|\s+$/g, '');
			}
			
			if (text == ''){
				if (row && row.length == 0) row.pad = '';
				continuation();
				return;
			}
			
			var x = path ? 0 : row.x, y = path ? 0 : row.y - this.getBaseline(styles);
			
			var shape = new Text(text, fontstyle, 'start', path);
			
			shape.transform(1, 0, 0, 1, x, y);
			this.fill(styles, shape, x, y);
			this.stroke(styles, shape);
			this.filter(styles, shape);
			shape.inject(target);
			continuation(shape);
		}

		if (this.findFont)
			this.findFont(fontstyle, create);
		else
			create.call(this);
	},
	
	elementTextContent: function(element, styles){
		var node = element.firstChild, text = '';
		treewalker: while (node){
			if (node.nodeType == 3){
				text += this.textContent(node, styles);
			}
			if (node.firstChild){
				node = node.firstChild;
			} else {
				while (!node.nextSibling){
					node = node.parentNode;
					if (!node || node == element) break treewalker;
				}
				node = node.nextSibling;
			}
		}
		return text;
	},
	
	textContent: function(node, styles){
		var value = node.nodeValue;
		if (styles['xml:space'] == 'preserve'){
			value = value.replace(/\t|\r?\n/g, ' ');
		} else {
			value = value.replace(/\r?\n/g, '').replace(/\s+/g, ' ');
		}
		return value; //.replace(/^\s+|\s+$/g, '');
	},
	
	getBaseline: function(styles){
		var metrics = this.getTextMetrics(styles),
		    shift = styles['baseline-shift'];
		if (shift == 'baseline') shift = '0';
		else if (shift== 'sub') shift = '-0.5em';
		else if (shift == 'super') shift = '0.5em';
		shift = this.parseLength(shift, styles, 'font');
		return metrics.em + metrics.descent + shift;
	},

	getTextMetrics: function(styles){
		var fontFamily = styles['font-family'],
			weight = styles['font-weight'],
			style = styles['font-style'],
			size = styles['font-size'],
			font = this.fonts && this.fonts[fontFamily.replace(/^['"\s]+|['"\s]+$/, '')];
		
		if (font) return { em: size, descent: -(1- font.face.ascent / font.face['units-per-em']) * size };
		// TODO: Use cross-platform hack to get native font descent
		return { em: size, ascent: 0.85 * size, descent: -0.15 * size }; // Good guess for web safe fonts
	}

});
