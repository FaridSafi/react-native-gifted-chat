var XmlDocument = require('../').XmlDocument
var t = require('tap')

t.test('parsing comments outside XML scope [#27]', function (t) {
  
  var xmlString = '<hello>world</hello>\n<!--Thank you for your business!-->';
  var parsed = new XmlDocument(xmlString);
  
  // verify that the trailing comment is ignored (no sensible place to put it)
  t.equal(parsed.toString(), '<hello>world</hello>');
  
  t.end();
})

t.test('validating escaping of &lt; &gt; [#29]', function (t) {
  
  var xmlString = '<root><command>&lt; &gt;</command></root>';
  var parsed = new XmlDocument(xmlString);
  var result = parsed.toString({compressed:true})
  t.equal(result, xmlString);
  t.end();
})