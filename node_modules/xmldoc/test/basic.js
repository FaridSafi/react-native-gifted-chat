var XmlDocument = require('../').XmlDocument
var t = require('tap')

t.test('verify sax global in browser', function (t) {

  // "un-require" the xmldoc module that we loaded up top
  delete require.cache[require.resolve('../')];

  // also un-require the actual xmldoc module pulled in by index.js ('../')
  delete require.cache[require.resolve('../lib/xmldoc.js')];

  // this signal will be picked up on by xmldoc.js
  global.xmldocAssumeBrowser = true;

  t.throws(function() {
    require('../');
  });

  // try again, but this time satisfy the sax check
  delete require.cache[require.resolve('../')];
  delete require.cache[require.resolve('../lib/xmldoc.js')];
  global.sax = {};
  require('../');
  t.ok(global.XmlDocument);

  t.end();
})

t.test('extend util', function(t) {
  delete require.cache[require.resolve('../')];
  delete require.cache[require.resolve('../lib/xmldoc.js')];
  Object.prototype.cruftyExtension = "blah";
  try {
    require('../');
  }
  finally {
    delete Object.prototype.cruftyExtension;
  }
  t.end();
})

t.test('parse xml', function (t) {

  var xmlString = '<hello>world</hello>';
  var parsed = new XmlDocument(xmlString);
  t.ok(parsed);
  t.throws(function() { new XmlDocument(); });
  t.throws(function() { new XmlDocument("  "); });
  t.end();
})

t.test('cdata handling', function (t) {

  var xmlString = '<hello><![CDATA[<world>]]></hello>';
  var parsed = new XmlDocument(xmlString);
  t.equal(parsed.val, "<world>");
  t.end();
})

t.test('cdata and text handling', function (t) {

  var xmlString = '<hello>(<![CDATA[<world>]]>)</hello>';
  var parsed = new XmlDocument(xmlString);
  t.equal(parsed.val, "(<world>)");
  t.end();
})

t.test('doctype handling', function (t) {

  var docWithType = new XmlDocument('<!DOCTYPE HelloWorld><hello>world</hello>');
  t.equal(docWithType.doctype, " HelloWorld");

  var docWithoutType = new XmlDocument('<hello>world</hello>');
  t.equal(docWithoutType.doctype, "");

  t.throws(function() {
    new XmlDocument('<hello><!DOCTYPE HelloWorld>world</hello>');
  });

  t.end();
})

t.test('comment handling', function (t) {

  var xmlString = '<hello><!-- World --></hello>';
  var parsed = new XmlDocument(xmlString);
  t.equal(parsed.val, "");
  t.end();
})

t.test('comment and text handling', function (t) {

  var xmlString = '<hello>(<!-- World -->)</hello>';
  var parsed = new XmlDocument(xmlString);
  t.equal(parsed.val, "()");
  t.end();
})

t.test('text, cdata, and comment handling', function (t) {

  var xmlString = '<hello>Hello<!-- , --> <![CDATA[<world>]]>!</hello>';
  var parsed = new XmlDocument(xmlString);
  t.equal(parsed.val, "Hello <world>!");
  t.end();
})

t.test('text with elements handling', function (t) {

  var xmlString = '<hello>hello, <world/>!</hello>';
  var parsed = new XmlDocument(xmlString);
  t.equal(parsed.val, "hello, !");
  t.end();
})

t.test('text before root node', function (t) {

  var xmlString = '\n\n<hello>*</hello>';
  var xml = new XmlDocument(xmlString);

  t.equal(xml.val, '*');
  t.equal(xml.children.length, 1);
  t.end();
})

t.test('text after root node', function (t) {

  var xmlString = '<hello>*</hello>\n\n';
  var xml = new XmlDocument(xmlString);

  t.equal(xml.val, '*');
  t.equal(xml.children.length, 1);
  t.end();
})

t.test('text before root node with version', function (t) {

  var xmlString = '<?xml version="1.0"?>\n\n<hello>*</hello>';
  var xml = new XmlDocument(xmlString);

  t.equal(xml.val, '*');
  t.equal(xml.children.length, 1);
  t.end();
})

t.test('text after root node with version', function (t) {

  var xmlString = '<?xml version="1.0"?><hello>*</hello>\n\n';
  var xml = new XmlDocument(xmlString);

  t.equal(xml.val, '*');
  t.equal(xml.children.length, 1);
  t.end();
})

t.test('comment before root node', function (t) {

  var xmlString = '<!-- hello --><world>*</world>';
  var xml = new XmlDocument(xmlString);

  t.equal(xml.val, '*');
  t.equal(xml.children.length, 1);
  t.end();
})

t.test('comment after root node', function (t) {

  var xmlString = '<hello>*</hello><!-- world -->';
  var xml = new XmlDocument(xmlString);

  t.equal(xml.val, '*');
  t.equal(xml.children.length, 1);
  t.end();
})

t.test('error handling', function (t) {

  var xmlString = '<hello><unclosed-tag></hello>';

  t.throws(function() {
    var parsed = new XmlDocument(xmlString);
  });

  t.end();
})

t.test('tag locations', function (t) {

  var xmlString = '<books><book title="Twilight"/></books>';
  var books = new XmlDocument(xmlString);

  var book = books.children[0];
  t.equal(book.attr.title, "Twilight");
  t.equal(book.startTagPosition, 8);
  t.equal(book.line, 0);
  t.equal(book.column, 31);
  t.equal(book.position, 31);
  t.end();
})

t.test('eachChild', function (t) {

  var xmlString = '<books><book title="Twilight"/><book title="Twister"/></books>';
  var books = new XmlDocument(xmlString);

  expectedTitles = ["Twilight", "Twister"];

  books.eachChild(function(book, i, books) {
    t.equal(book.attr.title, expectedTitles[i]);
  });

  called = 0;
  books.eachChild(function(book, i, books) {
    called++;
    return false; // test that returning false short-circuits the loop
  });
  t.equal(called, 1);

  t.end();
})

t.test('eachChild with text and comments', function (t) {

  var xmlString = '<books><book title="Twilight"/>text!<book title="Twister"/><!--comment!--></books>';
  var books = new XmlDocument(xmlString);

  expectedTitles = ["Twilight", "Twister"];

  var elI = 0;

  books.eachChild(function(book, i, books) {
    t.equal(book.attr.title, expectedTitles[elI++]);
  });

  called = 0;
  books.eachChild(function(book, i, books) {
    called++;
    return false; // test that returning false short-circuits the loop
  });
  t.equal(called, 1);

  t.end();
})

t.test('childNamed', function (t) {

  var xmlString = '<books><book/><good-book/></books>';
  var books = new XmlDocument(xmlString);

  var goodBook = books.childNamed('good-book');
  t.equal(goodBook.name, 'good-book');

  var badBook = books.childNamed('bad-book');
  t.equal(badBook, undefined);

  t.end();
})

t.test('childNamed with text', function (t) {

  var xmlString = '<books><book/>text<good-book/></books>';
  var books = new XmlDocument(xmlString);

  var goodBook = books.childNamed('good-book');
  t.equal(goodBook.name, 'good-book');

  var badBook = books.childNamed('bad-book');
  t.equal(badBook, undefined);

  t.end();
})

t.test('childNamed', function (t) {

  var xmlString = '<fruits><apple sweet="yes"/><orange/><apple sweet="no"/><banana/></fruits>';
  var fruits = new XmlDocument(xmlString);

  var apples = fruits.childrenNamed('apple');
  t.equal(apples.length, 2);
  t.equal(apples[0].attr.sweet, 'yes');
  t.equal(apples[1].attr.sweet, 'no');
  t.end();
})

t.test('childWithAttribute', function (t) {

  var xmlString = '<fruits><apple pick="no"/><orange rotten="yes"/><apple pick="yes"/><banana/></fruits>';
  var fruits = new XmlDocument(xmlString);

  var pickedFruit = fruits.childWithAttribute('pick', 'yes');
  t.equal(pickedFruit.name, 'apple');
  t.equal(pickedFruit.attr.pick, 'yes');

  var rottenFruit = fruits.childWithAttribute('rotten');
  t.equal(rottenFruit.name, 'orange');

  var peeled = fruits.childWithAttribute('peeled');
  t.equal(peeled, undefined);

  t.end();
})

t.test('childWithAttribute with text', function (t) {

  var xmlString = '<fruits><apple pick="no"/><orange rotten="yes"/>text<apple pick="yes"/><banana/></fruits>';
  var fruits = new XmlDocument(xmlString);

  var pickedFruit = fruits.childWithAttribute('pick', 'yes');
  t.equal(pickedFruit.name, 'apple');
  t.equal(pickedFruit.attr.pick, 'yes');

  var rottenFruit = fruits.childWithAttribute('rotten');
  t.equal(rottenFruit.name, 'orange');

  var peeled = fruits.childWithAttribute('peeled');
  t.equal(peeled, undefined);

  t.end();
})

t.test('descendantWithPath', function (t) {

  var xmlString = '<book><author><first>George R.R.</first><last>Martin</last></author></book>';
  var book = new XmlDocument(xmlString);

  var lastNameNode = book.descendantWithPath('author.last');
  t.equal(lastNameNode.val, 'Martin');

  var middleNameNode = book.descendantWithPath('author.middle');
  t.equal(middleNameNode, undefined);

  var publisherNameNode = book.descendantWithPath('publisher.first');
  t.equal(publisherNameNode, undefined);

  t.end();
})

t.test('descendantWithPath with text', function (t) {

  var xmlString = '<book><author>text<first>George R.R.</first><last>Martin</last></author></book>';
  var book = new XmlDocument(xmlString);

  var lastNameNode = book.descendantWithPath('author.last');
  t.equal(lastNameNode.val, 'Martin');

  var middleNameNode = book.descendantWithPath('author.middle');
  t.equal(middleNameNode, undefined);

  var publisherNameNode = book.descendantWithPath('publisher.first');
  t.equal(publisherNameNode, undefined);

  t.end();
})

t.test('valueWithPath', function (t) {

  var xmlString = '<book><author><first>George R.R.</first><last hyphenated="no">Martin</last></author></book>';
  var book = new XmlDocument(xmlString);

  var lastName = book.valueWithPath('author.last');
  t.equal(lastName, 'Martin');

  var lastNameHyphenated = book.valueWithPath('author.last@hyphenated');
  t.equal(lastNameHyphenated, "no");

  var publisherName = book.valueWithPath('publisher.last@hyphenated');
  t.equal(publisherName, undefined);

  t.end();
})

t.test('valueWithPath with text', function (t) {

  var xmlString = '<book><author>text<first>George R.R.</first><last hyphenated="no">Martin</last></author></book>';
  var book = new XmlDocument(xmlString);

  var lastName = book.valueWithPath('author.last');
  t.equal(lastName, 'Martin');

  var lastNameHyphenated = book.valueWithPath('author.last@hyphenated');
  t.equal(lastNameHyphenated, "no");

  var publisherName = book.valueWithPath('publisher.last@hyphenated');
  t.equal(publisherName, undefined);

  t.end();
})

t.test('toString', function (t) {

  var xmlString = '<books><book title="Twilight"/></books>';
  var doc = new XmlDocument(xmlString);

  t.equal(doc.toString(), '<books>\n  <book title="Twilight"/>\n</books>');
  t.equal(doc.toString({compressed:true}), '<books><book title="Twilight"/></books>');

  xmlString = '<hello> world </hello>';
  doc = new XmlDocument(xmlString);

  t.equal(doc.toString(), '<hello>world</hello>');
  t.equal(doc.toString({preserveWhitespace:true}), '<hello> world </hello>');

  xmlString = '<hello><![CDATA[<world>]]></hello>';
  doc = new XmlDocument(xmlString);

  t.equal(doc.toString(), '<hello><![CDATA[<world>]]></hello>');

  xmlString = '<hello>Hello<!-- , --> <![CDATA[<world>]]>!</hello>';
  doc = new XmlDocument(xmlString);

  t.equal(doc.toString({preserveWhitespace:true}), '<hello>\n  Hello\n  <!-- , -->\n   \n  <![CDATA[<world>]]>\n  !\n</hello>');

  xmlString = '<hello>hello, <world/>!</hello>';
  doc = new XmlDocument(xmlString);

  t.equal(doc.toString(), '<hello>\n  hello,\n  <world/>\n  !\n</hello>');

  xmlString = '<hello>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam et accumsan nisi.</hello>';
  doc = new XmlDocument(xmlString);

  t.equal(doc.toString(), xmlString);
  t.equal(doc.toString({trimmed:true}), '<hello>Lorem ipsum dolor sit ame…</hello>')

  try {
    // test that adding stuff to the Object prototype doesn't interfere with attribute exporting
    Object.prototype.cruftyExtension = "You don't want this string to be exported!";

    var xmlString = '<books><book title="Twilight"/></books>';
    var doc = new XmlDocument(xmlString);

    t.equal(doc.toString(), '<books>\n  <book title="Twilight"/>\n</books>');
  }
  finally {
    delete Object.prototype.cruftyExtensionMethod;
  }

  xmlString = '<hello>world<earth/><moon/></hello>';
  doc = new XmlDocument(xmlString);
  t.equal(doc.toString({compressed:true}), xmlString);

  t.end();
})
