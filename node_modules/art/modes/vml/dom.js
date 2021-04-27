var VMLCSS = 'behavior:url(#default#VML);display:inline-block;position:absolute;left:0px;top:0px;';

var styleSheet, styledTags = {}, styleTag = function(tag){
	if (styleSheet) styledTags[tag] = styleSheet.addRule('av\\:' + tag, VMLCSS);
};

exports.init = function(document){

	var namespaces;
	try { // IE9 workaround: sometimes it throws here
		namespaces = document.namespaces;
	} catch (e) {
	}
	if (!namespaces) return false;

	namespaces.add('av', 'urn:schemas-microsoft-com:vml');
	namespaces.add('ao', 'urn:schemas-microsoft-com:office:office');

	styleSheet = document.createStyleSheet();
	styleSheet.addRule('vml', 'display:inline-block;position:relative;overflow:hidden;');
/*	styleTag('skew');
	styleTag('fill');
	styleTag('stroke');
	styleTag('path');
	styleTag('textpath');
	styleTag('group');*/

	styleTag('vml');

	return true;

};

exports.createElement = function(tag){
	if (!(tag in styledTags)) styleTag(tag);
	return document.createElement('av:' + tag);
};
