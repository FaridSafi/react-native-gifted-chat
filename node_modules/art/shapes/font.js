var Shape = require('./generic');

var fonts = {};

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

var Font = Shape(function(text, font, alignment){
	if (typeof font == 'string') font = parseFontString(font);
	if (font) this.font = font; else font = this.font;
	
	var family = font.fontFamily || font['font-family'],
		weight = font.fontWeight || font['font-weight'] || 'normal',
		style = font.fontStyle || font['font-style'] || 'normal',
		size = parseFloat(font.fontSize || font['font-size'] || font.size);
	
	font = font.glyphs ? font : fonts[weight + style + family];
	
	if (!font) throw new Error('The specified font has not been found.');
	
	var scale = size / font.face['units-per-em'];
	var width = 0, height = size, path = '', row = '';
	
	var x = 0, y = scale * font.face.ascent || size - (scale * font.face.descent);

	var regexp = /([mclrvxe])([^a-z]*)/g, match;
	
	// TODO: Refactor to use SVG paths as the source
	
	var cx = 0, cy = 0, fx = 0, fy = 0;
	for (var i = 0, l = text.length; i < l; ++i){
		if (text.charAt(i) == '\n'){
			if (alignment == 'end' || alignment == 'right'){
				cx -= x;
				path += 'm' + (-x) + ',0';
			}
			if (alignment == 'middle' || alignment == 'center'){
				cx -= x / 2;
				path += 'm' + (-x / 2) + ',0';
			}
			path += row;
			path += 'm' + (-cx) + ',' + (-cy);
			cx = cy = 0;
			row = '';
			x = 0;
			y += size * 1.1;
			height += size * 1.1;
			continue;
		}
		var glyph = font.glyphs[text.charAt(i)] || font.glyphs.missing || font.glyphs[' '];
		if (!glyph) continue;
		var w = scale * (glyph.w || font.w);
		if (glyph.d){
			var s = scale;
			
			if (glyph.path){
				var parts = glyph.path;
			} else {
				var parts = [], index = -1,
					bits = ('m' + glyph.d + 'x').match(/[a-df-z]|[\-+]?(?:[\d\.]e[\-+]?|[^\s\-+,a-z])+/ig),
					part;

				for (var j = 0, k = bits.length; j < k; j++){
					var bit = bits[j];
					if (bit.match(/^[a-z]/i)){
						parts[++index] = part = [bit];
					} else {
						part.push(Number(bit));
					}
				}
				glyph.path = parts;
			}

			for (var j = 0; j < parts.length; j++){
				var c = Array.prototype.slice.call(parts[j]), f = c.shift();
				switch (f){
					case 'l':
						row += 'l ' + (x + (s * c[0]) - cx) + ',' + (y + (s * c[1]) - cy);
						//row += 'L ' + (x + (s * c[0])) + ',' + (y + (s * c[1]));
						cx = x + (s * c[0]); cy = y + (s * c[1]);
						break;
					case 'c':
						row += 'c ' + (x + s * c[0] - cx) + ',' + (y + s * c[1] - cy) + ',' + (x + s * c[2] - cx) + ',' + (y + s * c[3] - cy) + ',' + (x + s * c[4] - cx) + ',' + (y + s * c[5] - cy);
						cx = x + (s * c[4]); cy = y + (s * c[5]);
						break;
					case 'v':
						row += 'c ' + (s * c[0]) + ',' + (s * c[1]) + ',' + (s * c[2]) + ',' + (s * c[3]) + ',' + (s * c[4]) + ',' + (s * c[5]);
						cx += (s * c[4]); cy += (s * c[5]);
						break;
					case 'r':
						row += 'l ' + (s * c[0]) + ',' + (s * c[1]);
						cx += (s * c[0]); cy += (s * c[1]);
						break;
					case 'm':
						row += 'm ' + (x + (s * c[0]) - cx) + ',' + (y + (s * c[1]) - cy);
						fx = cx = x + (s * c[0]);
						fy = cy = y + (s * c[1]);
						break;
					case 'x':
						row += 'z';
						cx = fx;
						cy = fy;
						break;
				}
			}
		}
		x += w;
		if (x > width) width = x;
	}
	
	if (alignment == 'end' || alignment == 'right') path += 'm' + (-x) + ',0';
	if (alignment == 'middle' || alignment == 'center') path += 'm' + (-x / 2) + ',0';
	path += row;
	this.path.push(path);
	this.width = width;
	this.height = height;
});

Font.register = function(font){
	var face = font.face,
	    family = face['font-family'],
	    weight = (face['font-weight'] > 500 ? 'bold' : 'normal'),
	    style = (face['font-stretch'] == 'oblique' || face['font-style'] == 'oblique' || face['font-style'] == 'italic' ? 'italic' : 'normal');
	fonts[weight + style + family] = font;
	return this;
};

module.exports = Font;