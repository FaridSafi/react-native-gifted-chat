var UID = +new Date();

exports.uniqueID = function(){
	return (UID++).toString(36);
};
	
var NS = 'http://www.w3.org/2000/svg',
	XLINK = 'http://www.w3.org/1999/xlink',
	XML = 'http://www.w3.org/XML/1998/namespace';

exports.NS = NS;

exports.createElement = function(tag){
    return document.createElementNS(NS, tag);
};

exports.link = function(element, url){
	element.setAttributeNS(XLINK, 'href', url);
};

exports.preserveSpace = function(element){
	element.setAttributeNS(XML, 'space', 'preserve');
};

exports.createTextNode = function(text){
	return document.createTextNode(text);
}