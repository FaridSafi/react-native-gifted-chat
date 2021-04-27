var SVGParser = require('./core');

SVGParser.implement({

	findLinkedAttributes: function(element, callback){
		var self = this;

		var cb = function(result){
			var attributes = element.attributes;
			for (var i = 0, l = attributes.length; i < l; i++){
				var attribute = attributes[i];
				result[attribute.nodeName] = attribute.nodeValue;
			}
			if (element.childNodes.length > 0) result.container = element;
			callback.call(self, result);
		};
		
		var href = element.getAttribute('xlink:href') || element.getAttribute('href');
		if (!href){ cb.call(this, {}); return; }
		
		this.findByURL(element.ownerDocument, href, function(parent){
			if (!parent) cb.call(this, {});
			else this.findLinkedAttributes(parent, function(parentResult){
				cb.call(this, parentResult);
			});
		});
	},

	getBBox: function(graphic){
		var path = graphic.getPath && graphic.getPath();
		return path ? path.measure() : graphic;
	},
	
	parseBBLength: function(value, bbox, dimension){
		value = /%/.test(value) ? parseFloat(value) / 100 : parseFloat(value);
		if (dimension == 'x') return (bbox.left || 0) + (bbox.width || 0) * value;
		if (dimension == 'y') return (bbox.top || 0) + (bbox.height || 0) * value;
	},

	getGradientStops: function(element, styles){
		var stops = null, node = element.firstChild;
		while (node){
			if (node.nodeName == 'stop'){
				var stopStyles = this.parseStyles(node, styles);
				var color = this.parseColor(stopStyles['stop-color'] || 'black', stopStyles['stop-opacity'], stopStyles),
				    offset = node.getAttribute('offset');
				if (color && offset){
					offset = /%/.test(offset) ? parseFloat(offset) / 100 : parseFloat(offset);
					if (offset < 0) offset = 0;
					if (offset > 1) offset = 1;
					if (!stops) stops = {};
					stops[offset.toFixed(4)] = color;
				}
			}
			node = node.nextSibling;
		}
		return stops;
	},
	
	radialGradientFill: function(element, styles, target, x, y){
		this.findLinkedAttributes(element, function(attrs){
			if (!attrs.container) return;
			
			var stops = this.getGradientStops(attrs.container, styles);
			if (!stops) return;
			
			// TODO: Transform
			
			var cx = attrs.cx || '50%',
			    cy = attrs.cy || '50%',
			    rx = attrs.r || '50%', ry,
			    fx = attrs.fx || cx,
			    fy = attrs.fy || cy;
			
			if (attrs['gradientUnits'] == 'userSpaceOnUse'){
				cx = this.parseLength(cx, styles, 'x') - x;
				cy = this.parseLength(cy, styles, 'y') - y;
				rx = ry = this.parseLength(rx, styles);
				fx = this.parseLength(fx, styles, 'x') - x;
				fy = this.parseLength(fy, styles, 'y') - y;
			} else {
				var bb = this.getBBox(target);
				cx = this.parseBBLength(cx, bb, 'x');
				cy = this.parseBBLength(cy, bb, 'y');
				rx = this.parseBBLength(rx, bb, 'x');
				ry = rx * (bb.height / bb.width);
				fx = this.parseBBLength(fx, bb, 'x');
				fy = this.parseBBLength(fy, bb, 'y');
			}
			
			target.fillRadial(stops, fx, fy, rx, ry, cx, cy);
		
		});
	},

	linearGradientFill: function(element, styles, target, x, y){
		this.findLinkedAttributes(element, function(attrs){
			if (!attrs.container) return;

			var stops = this.getGradientStops(attrs.container, styles);
			if (!stops) return;

			var x1 = attrs.x1 || 0,
			    y1 = attrs.y1 || 0,
			    x2 = attrs.x2 || '100%',
			    y2 = attrs.y2 || 0;
			
			// TODO: Transform
			
			if (attrs['gradientUnits'] == 'userSpaceOnUse'){
				x1 = this.parseLength(x1, styles, 'x') - x;
				y1 = this.parseLength(y1, styles, 'y') - y;
				x2 = this.parseLength(x2, styles, 'x') - x;
				y2 = this.parseLength(y2, styles, 'y') - y;
			} else {
				x1 = /%/.test(x1) ? parseFloat(x1) / 100 : parseFloat(x1);
				y1 = /%/.test(y1) ? parseFloat(y1) / 100 : parseFloat(y1);
				x2 = /%/.test(x2) ? parseFloat(x2) / 100 : parseFloat(x2);
				y2 = /%/.test(y2) ? parseFloat(y2) / 100 : parseFloat(y2);
				
				// If both points are close to the opposite edges, use rotation angle instead
				var closeToEdge =
					(x1 > -0.01 && x1 < 0.01 && x2 > 0.99 && x2 < 1.01) ||
					(x1 > 0.99 && x1 < 1.01 && x2 > -0.01 && x2 < 0.01) ||
				    (y1 > -0.01 && y1 < 0.01 && y2 > 0.99 && y2 < 1.01) ||
				    (y1 > 0.99 && y1 < 1.01 && y2 > -0.01 && y2 < 0.01);
				
				if (closeToEdge){
					var angle = Math.atan2(y1 - y2, x2 - x1) * 180 / Math.PI;
					target.fillLinear(stops, angle);
					return;
				}
				
				// TODO: Always use rotation angle, but offset stops instead to adjust
				// TODO2: Never use rotation angle because measuring is deprecated
				var bb = this.getBBox(target);
				x1 = this.parseBBLength(x1, bb, 'x');
				y1 = this.parseBBLength(y1, bb, 'y');
				x2 = this.parseBBLength(x2, bb, 'x');
				y2 = this.parseBBLength(y2, bb, 'y');
			}
			target.fillLinear(stops, x1, y1, x2, y2);
		});
	},
	
	patternFill: function(element, styles, target, x, y){
		// TODO: If the pattern is an image, fillImage
	}

});
