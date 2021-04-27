Sheet.js by Thomas Aylott of MooTools

**STATE: well tested and stable**

This project uses semver.org standard version numbering.

Sheet.js
========
Parse CSS in JavaScript

* Test-first Development
* UniversalJS
* Zero dependencies
* DOM-less (no document necessary)
* CommonJS Modules 1.0+ with global fallback
* Browser support
* Implements W3C `document.styleSheets` API
* Implements WebKit CSS Animation API


Flexible Parsing
----------------

* Supports WebKit CSS Animation syntax
* Supports custom selectors, @rules, properties and values
* Supports nested rules
* Supports HTML style attribute values  
	i.e. CSS rules without the selectors and brackets

### Coming Soon…

* Support for custom CSS-like languages like the Sass 3.0 SCSS (Sassy CSS) and Less CSS


Basic Usage
-----------

ClientSide / Browser Usage

	var myStyleSheet = new Sheet("#selector { color:blue }");
	myStyleSheet.cssRules[0].style.color; // blue
	// etc…

ServerSide / CommonJS Usage

	require.paths.push('path/to/Sheet.js/Source'); // You might not need this
	var Sheet = require('Sheet').Sheet;
	
	var myStyleSheet = new Sheet("#selector { color:blue }");
	myStyleSheet.cssRules[0].style.color; // blue
	// etc…


Advanced ClientSide Namespacing
-------------------------------
If you need to move Sheet.js to its own custom namespace simply define a global `exports` object before loading Sheet.js. Sheet.js will see that object, assume that it's in a CommonJS environment and then attach itself onto that object instead of including itself globally.

You really shouldn't need to do that.
But isn't it great to know you could?