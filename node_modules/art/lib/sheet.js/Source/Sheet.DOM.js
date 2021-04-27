/*
---
name : Sheet.DOM
description : Sheet.DOM adds some handy stuff for working with the browser's native CSS capabilities.

authors   : Thomas Aylott
copyright : © 2010 Thomas Aylott
license   : MIT

provides : Sheet.DOM
...
*/
;(function(document,styleSheets){

if (typeof Sheet == 'undefined') Sheet = {}
if (Sheet.DOM == null) Sheet.DOM = {}

Sheet.DOM.createSheetNode = function(raw){
	var sheet = Sheet.DOM.createSheet(raw)
	var node = sheet.ownerNode
	node.parentNode.removeChild(node)
	return node
}

var UID = 0

Sheet.DOM.createSheet = createStyleSheetWithCSS
function createStyleSheetWithCSS(css){
	var styleElement = document.createElement("style")
	styleElement.appendChild(document.createTextNode(css))
	styleElement.setAttribute('name', styleElement.id = "SheetRuler-" + +new Date)
	document.getElementsByTagName('head')[0].appendChild(styleElement)

	return styleElement.sheet || styleElement.styleSheet
}

Sheet.DOM.createStyle = function(raw){
	var div = document.createElement('div')
	div.innerHTML = '<p style="' + String_escapeHTML.call(raw) + '"></p>'
	return div.firstChild.style
}

Sheet.DOM.createSheetStyle = function(raw){
	var className = 'Sheet' + +new Date
	var sheet = Sheet.DOM.createSheet("." + className + "{" + raw + "}")
	return (sheet.rules || sheet.cssRules)[0].style
}

Sheet.DOM.createRule = function(selector,style){
	var rule = selector + "{" + style + "}"
	
	var sheet = Sheet.DOM.createSheet(rule)
	var rules = sheet.rules || sheet.cssRules
	return rules[rules.length - 1]
}

Sheet.DOM.createStyleWrapped = function(raw){
	return {style:Sheet.DOM.createStyle(raw)}
}

function String_escapeHTML(){
	return ('' + this).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;')
}

}(document, document.styleSheets));
