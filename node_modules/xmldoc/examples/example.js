
// Designed to be run from Node.js - i.e. "node example.js"

var XmlDocument = require('../lib/xmldoc').XmlDocument;

// Demonstrate parsing an in-memory XML string
var xmlString = '<suggestions><book title="Twilight"/><book title="Twister"/></suggestions>';

var suggestions = new XmlDocument(xmlString);

// Demonstrate how toString() will pretty-print the XML for debugging
console.log("Parsed: \n%s", suggestions);

// Demonstrate a simple eachChild() loop, printing our book titles
suggestions.eachChild(function(book) {
  console.log("Found book with title: '%s'", book.attr.title);
  console.log("==> The <book> tag started at position %s and the complete element ended at line %s, column %s, position %s.", book.startTagPosition, book.line, book.column, book.position);
});

// Now load an XML file from disk and parse it
var fs = require('fs'),
    path = require('path');

fs.readFile(path.join(__dirname, "test.xml"), 'utf8', function (err,data) {
  
  if (err) {
    return console.log(err);
  }

  // Parse the XML
  var results = new XmlDocument(data);

  // Demonstrate toString() with an option to abbreviate long strings and compress the output
  console.log("Parsed: \n%s", results.toString({trimmed:true, compressed:true}));

  // Pull out the <books> node
  var books = results.childNamed("books");

  // Demonstrate firstChild/lastChild
  console.log("First book has ISBN '%s', last book has ISBN '%s'", books.firstChild.attr.isbn, books.lastChild.attr.isbn);

  // Print out the ISBNs
  books.eachChild(function (book) {
    console.log("Found book with ISBN '%s'", book.attr.isbn);
  });

  // Look for all children with a certain node name
  var allBooks = books.childrenNamed("book");

  // The result is an array of <book> XmlElement instances
  console.log("Found %s books.", allBooks.length);

  // Search for a particular book
  var twilight = books.childWithAttribute("isbn","478-2-23-765712-2");

  // Result is a single XmlElement instance for <book>
  console.log("Title of book with given ISBN: '%s'", twilight.valueWithPath("title"));

  return null;
});