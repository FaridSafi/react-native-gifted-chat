var SVGParser = require('./core');
var Mode = require('../../modes/current');

var urlSuffix = '', baseUrl, urlAliases = {},
    urlParts = /^((?:\w+:)?(?:\/\/[^\/?#]*)?)(\.\.?$|(?:[^?#\/]*\/)*)(.*)/,
    endSlash = /\/$/;

function resolvePath(path, base){
	var parts = String(path).match(urlParts);
	if (!parts || parts[1]) return path;

	if (!base || path.charAt(0) !== '.') base = '';
	base = String(base).match(urlParts);

	var directory = parts[2];
	if (directory.charAt(0) != '/'){
		directory = (base[2] || '') + directory;
		var result = [], paths = directory.replace(endSlash, '').split('/');
		for (var i = 0, l = paths.length; i < l; i++){
			var dir = paths[i];
			if (dir === '..' && result.length > 0 && result[result.length - 1] != '..') result.pop();
			else if (dir !== '.') result.push(dir);
		};
		directory = result.join('/') + '/';
	}
	return base[1] + directory + parts[3];
}

SVGParser.prototype.findByURL = function(document, url, callback){
	if (!url){
		callback.call(this, null);
		return;
	}
	if (url.charAt(0) == '#'){
		callback.call(this, this.findById(document, url.substr(1)));
		return;
	}
	url = this.resolveURL(url);
	var self = this, i = url.indexOf('#'), id = i > -1 ? url.substr(i + 1) : null;
	if (i > -1) url = url.substr(0, i);
	this.pendingRequests = (this.pendingRequests || 0) + 1;

	var xhr = new XMLHttpRequest();
	xhr.open('GET', url, true);
	xhr.onreadystatechange = function(){
		if (xhr.readyState == 4){
			if (xhr.status == 200){
				var resolve = self.resolveURL,
				    doc = /*xhr.responseXML ||*/ self.parseXML(xhr.responseText);
				self.resolveURL = function(newurl){
					return resolvePath(newurl, url);
				}
				callback.call(self, !doc ? null : id ? self.findById(doc, id) : doc.documentElement);
				self.resolveURL = resolve;
			} else {
				callback.call(self, null);
			}
			if (--self.pendingRequests == 0 && self.oncomplete) self.oncomplete();
		}
	};
	xhr.send(null);
};

SVGParser.prototype.load = function(url, styles, callback){
	if (typeof styles == 'function'){ callback = styles; styles = null; }
	var parser = this, result = null;
	parser.oncomplete = function(){ callback(result); };
	parser.findByURL(null, url, function(doc){ result = parser.parse(doc.ownerDocument, styles); });
};

SVGParser.load = function(url, styles, callback){
	new SVGParser(Mode).load(url, styles, callback);
};
