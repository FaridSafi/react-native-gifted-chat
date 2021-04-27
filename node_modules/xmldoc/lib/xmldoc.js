(function () {

var sax;

if (typeof module !== 'undefined' && module.exports && !global.xmldocAssumeBrowser) {
  // We're being used in a Node-like environment
  sax = require('sax');
}
else {
  // assume it's attached to the Window object in a browser
  sax = this.sax;

  if (!sax) // no sax for you!
    throw new Error("Expected sax to be defined. Make sure you're including sax.js before this file.");
}

/*
XmlElement is our basic building block. Everything is an XmlElement; even XmlDocument
behaves like an XmlElement by inheriting its attributes and functions.
*/

function XmlElement(tag) {
  // Capture the parser object off of the XmlDocument delegate
  var parser = delegates[delegates.length - 1].parser;

  this.name = tag.name;
  this.attr = tag.attributes;
  this.val = "";
  this.children = [];
  this.firstChild = null;
  this.lastChild = null;

  // Assign parse information
  this.line = parser.line;
  this.column = parser.column;
  this.position = parser.position;
  this.startTagPosition = parser.startTagPosition;
}

// Private methods

XmlElement.prototype._addChild = function(child) {
  // add to our children array
  this.children.push(child);

  // update first/last pointers
  if (!this.firstChild) this.firstChild = child;
  this.lastChild = child;
};

// SaxParser handlers

XmlElement.prototype._opentag = function(tag) {

  var child = new XmlElement(tag);

  this._addChild(child);

  delegates.unshift(child);
};

XmlElement.prototype._closetag = function() {
  delegates.shift();
};

XmlElement.prototype._text = function(text) {
  if (typeof this.children === 'undefined')
    return

  this.val += text;

  this._addChild(new XmlTextNode(text));
};

XmlElement.prototype._cdata = function(cdata) {
  this.val += cdata;

  this._addChild(new XmlCDataNode(cdata));
};

XmlElement.prototype._comment = function(comment) {
  if (typeof this.children === 'undefined')
    return

  this._addChild(new XmlCommentNode(comment));
};

XmlElement.prototype._error = function(err) {
  throw err;
};

// Useful functions

XmlElement.prototype.eachChild = function(iterator, context) {
  for (var i=0, l=this.children.length; i<l; i++)
    if (this.children[i].type === "element")
      if (iterator.call(context, this.children[i], i, this.children) === false) return;
};

XmlElement.prototype.childNamed = function(name) {
  for (var i=0, l=this.children.length; i<l; i++) {
    var child = this.children[i];
    if (child.name === name) return child;
  }
  return undefined;
};

XmlElement.prototype.childrenNamed = function(name) {
  var matches = [];

  for (var i=0, l=this.children.length; i<l; i++)
    if (this.children[i].name === name)
      matches.push(this.children[i]);

  return matches;
};

XmlElement.prototype.childWithAttribute = function(name,value) {
  for (var i=0, l=this.children.length; i<l; i++) {
    var child = this.children[i];
    if (child.type === "element" && ((value && child.attr[name] === value) || (!value && child.attr[name])))
      return child;
  }
  return undefined;
};

XmlElement.prototype.descendantWithPath = function(path) {
  var descendant = this;
  var components = path.split('.');

  for (var i=0, l=components.length; i<l; i++)
    if (descendant && descendant.type === "element")
      descendant = descendant.childNamed(components[i]);
    else
      return undefined;

  return descendant;
};

XmlElement.prototype.valueWithPath = function(path) {
  var components = path.split('@');
  var descendant = this.descendantWithPath(components[0]);
  if (descendant)
    return components.length > 1 ? descendant.attr[components[1]] : descendant.val;
  else
    return undefined;
};

// String formatting (for debugging)

XmlElement.prototype.toString = function(options) {
  return this.toStringWithIndent("", options);
};

XmlElement.prototype.toStringWithIndent = function(indent, options) {
  var s = indent + "<" + this.name;
  var linebreak = options && options.compressed ? "" : "\n";
  var preserveWhitespace = options && options.preserveWhitespace;

  for (var name in this.attr)
    if (Object.prototype.hasOwnProperty.call(this.attr, name))
        s += " " + name + '="' + escapeXML(this.attr[name]) + '"';

  if (this.children.length === 1 && this.children[0].type !== "element") {
    s += ">" + this.children[0].toString(options) + "</" + this.name + ">";
  }
  else if (this.children.length) {
    s += ">" + linebreak;

    var childIndent = indent + (options && options.compressed ? "" : "  ");

    for (var i=0, l=this.children.length; i<l; i++) {
      s += this.children[i].toStringWithIndent(childIndent, options) + linebreak;
    }

    s += indent + "</" + this.name + ">";
  }
  else if (options && options.html) {
    var whiteList = [
      "area", "base", "br", "col", "embed", "frame", "hr", "img", "input",
      "keygen", "link", "menuitem", "meta", "param", "source", "track", "wbr"
    ];
    if (whiteList.indexOf(this.name) !== -1) s += "/>";
    else s += "></" + this.name + ">";
  }
  else {
    s += "/>";
  }

  return s;
};

// Alternative XML nodes

function XmlTextNode (text) {
  this.text = text;
}

XmlTextNode.prototype.toString = function(options) {
  return formatText(escapeXML(this.text), options);
};

XmlTextNode.prototype.toStringWithIndent = function(indent, options) {
  return indent+this.toString(options);
};

function XmlCDataNode (cdata) {
  this.cdata = cdata;
}

XmlCDataNode.prototype.toString = function(options) {
  return "<![CDATA["+formatText(this.cdata, options)+"]]>";
};

XmlCDataNode.prototype.toStringWithIndent = function(indent, options) {
  return indent+this.toString(options);
};

function XmlCommentNode (comment) {
  this.comment = comment;
}

XmlCommentNode.prototype.toString = function(options) {
  return "<!--"+formatText(escapeXML(this.comment), options)+"-->";
};

XmlCommentNode.prototype.toStringWithIndent = function(indent, options) {
  return indent+this.toString(options);
};

// Node type tag

XmlElement.prototype.type = "element";
XmlTextNode.prototype.type = "text";
XmlCDataNode.prototype.type = "cdata";
XmlCommentNode.prototype.type = "comment";

/*
XmlDocument is the class we expose to the user; it uses the sax parser to create a hierarchy
of XmlElements.
*/

function XmlDocument(xml) {
  xml && (xml = xml.toString().trim());

  if (!xml)
    throw new Error("No XML to parse!");

  // Stores doctype (if defined)
  this.doctype = "";

  // Expose the parser to the other delegates while the parser is running
  this.parser = sax.parser(true); // strict
  addParserEvents(this.parser);

  // We'll use the file-scoped "delegates" var to remember what elements we're currently
  // parsing; they will push and pop off the stack as we get deeper into the XML hierarchy.
  // It's safe to use a global because JS is single-threaded.
  delegates = [this];

  this.parser.write(xml);

  // Remove the parser as it is no longer needed and should not be exposed to clients
  delete this.parser;
}

// make XmlDocument inherit XmlElement's methods
extend(XmlDocument.prototype, XmlElement.prototype);

XmlDocument.prototype._opentag = function(tag) {
  if (typeof this.children === 'undefined')
    // the first tag we encounter should be the root - we'll "become" the root XmlElement
    XmlElement.call(this,tag);
  else
    // all other tags will be the root element's children
    XmlElement.prototype._opentag.apply(this,arguments);
};

XmlDocument.prototype._doctype = function(doctype) {
  this.doctype += doctype;
}

// file-scoped global stack of delegates
var delegates = null;

/*
Helper functions
*/

function addParserEvents(parser) {
  parser.onopentag = parser_opentag;
  parser.onclosetag = parser_closetag;
  parser.ontext = parser_text;
  parser.oncdata = parser_cdata;
  parser.oncomment = parser_comment;
  parser.ondoctype = parser_doctype;
  parser.onerror = parser_error;
}

// create these closures and cache them by keeping them file-scoped
function parser_opentag() { delegates[0] && delegates[0]._opentag.apply(delegates[0],arguments) }
function parser_closetag() { delegates[0] && delegates[0]._closetag.apply(delegates[0],arguments) }
function parser_text() { delegates[0] && delegates[0]._text.apply(delegates[0],arguments) }
function parser_cdata() { delegates[0] && delegates[0]._cdata.apply(delegates[0],arguments) }
function parser_comment() { delegates[0] && delegates[0]._comment.apply(delegates[0],arguments) }
function parser_doctype() { delegates[0] && delegates[0]._doctype.apply(delegates[0],arguments) }
function parser_error() { delegates[0] && delegates[0]._error.apply(delegates[0],arguments) }

// a relatively standard extend method
function extend(destination, source) {
  for (var prop in source)
    if (source.hasOwnProperty(prop))
      destination[prop] = source[prop];
}

// escapes XML entities like "<", "&", etc.
function escapeXML(value){
  return value.toString().replace(/&/g, '&amp;').replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/'/g, '&apos;').replace(/"/g, '&quot;');
}

// formats some text for debugging given a few options
function formatText(text, options) {
  var finalText = text;

  if (options && options.trimmed && text.length > 25)
    finalText = finalText.substring(0,25).trim() + "…";
  if (!(options && options.preserveWhitespace))
    finalText = finalText.trim();

  return finalText;
}

// Are we being used in a Node-like environment?
if (typeof module !== 'undefined' && module.exports && !global.xmldocAssumeBrowser)
    module.exports.XmlDocument = XmlDocument;
else
    this.XmlDocument = XmlDocument;

})();
