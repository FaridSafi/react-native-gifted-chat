(Slick is an official [MooTools](http://mootools.net) project)

Slick
=====
A new standalone selector engine that is totally slick!
-------------------------------------------------------

### Create your own custom pseudo-classes!
Ever want to make your own `:my-widget(rocks)` pseudoclass? Now you can!

### Use your own custom getAttribute code!
EG: Use MooTool's Element.get method or jQuery's $.attr

### Use your own parser!
Want to support XPATH selectors? JSONPath selectors? Pre-cached JS Object selctors? Just swap out the default parser and make your own.

### Use the parser by itself!
Want to integrate a CSS3 Selector parser into your own app somehow? Use the slick selector CSS3 parser by itself and get a JS Object representation of your selector.

---

Slick Selector Engine
=====================

Usage
-----

### `search` context for selector
Search this context for any nodes that match this selector.

Expects: 
* context: document or node or array of documents or nodes
* selector: String or SelectorObject
* (**optional**) append: Array or Object with a push method

Returns: append argument or Array of 0 or more nodes

	Slick.search(document, "#foo > bar.baz") → [<bar>, <bar>, <bar>]
	Slick.search([<ol>, <ul>], "li > a") → [<a>, <a>, <a>]
	Slick.search(document, "#foo > bar.baz", { push:function(){} }) → { push:function(){}, 0:<bar>, 1:<bar>, 2:<bar> }


### `find` first in context with selector or null
Find the first node in document that matches selector or null if none are found.

Expects:
* context: document or node or array of documents or nodes
* selector: String or SelectorObject

Returns: Element or null

	Slick.find(document, "#foo > bar.baz") → <bar>
	Slick.find(node, "#does-not-exist") → null


### node `match` selector?
Does this node match this selector?

Expects:
* node
* node, String or SelectorObject

Returns: true or false

	Slick.match(<div class=rocks>, "div.rocks") → true
	Slick.match(<div class=lame>, "div.rocks") → false
	Slick.match(<div class=lame>, <div class=rocks>) → false


### context `contains` node?
Does this context contain this node? Is the context a parent of this node?

Expects:
* context: document or node
* node: node

Returns: true or false

	Slick.contains(<ul>, <li>) → true
	Slick.contains(<body>, <html>) → false


---


Slick CSS Selector Parser
=========================
Parse a CSS selector string into a JavaScript object
----------------------------------------------------

Usage
-----

### `parse` selector into object
Parse a CSS Selector String into a Selector Object.

Expects: String

Returns: SelectorObject

	Slick.parse("#foo > bar.baz") → SelectorObject


SelectorObject format
---------------------

### `#foo > bar.baz`

	{
		"raw":"#foo > bar.baz",
		"expressions": [[
			{ "combinator":" ", "tag":"*", "id":"foo" },
			{ "combinator":">", "tag":"bar", "classList": ["baz"], "classes": [{"value":"baz", "regexp":RegExp }]}
		]]
	}

### `h1, h2, ul > li, .things`

	{
		"raw": "h1, h2, ul > li, .things",
		"expressions": [
			[{ "combinator":" ", "tag": "h1" }],
			[{ "combinator":" ", "tag": "h2" }],
			[{ "combinator":" ", "tag": "ul" }, { "combinator": ">", "tag": "li" }],
			[{ "combinator":" ", "tag": "*", "classList": ["things"], "classes": [{"value": "things", "regexp":RegExp }] }]
		]
	}
