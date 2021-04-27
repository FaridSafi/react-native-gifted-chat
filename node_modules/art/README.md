# ART

ART is a retained mode vector drawing API designed for multiple output modes.
There's also a built-in SVG parser. It uses Node style CommonJS modules.

The first line in your program should select rendering mode by requiring either:

- __art/modes/canvas__ - HTML5 Canvas
- __art/modes/svg__ - SVG for modern browsers and vector tools
- __art/modes/vml__ - VML for Internet Explorer or Office
- __art/modes/script__ - Code generation for ART modules
- __art/modes/dom__ - SVG or VML depending on environment
- __art/modes/fast__ - Canvas, SVG or VML depending on environment

These modules exposes four core rendering classes:

- __Surface__ - Required rectangular rendering area. Container for the rest.
- __Group__ - Container for Shapes, Text or other Groups.
- __Shape__ - Fill and/or stroke an arbitrary vector path.
- __Text__ - Fill and/or stroke text content rendered using native fonts.

There are also helper classes to work with vector paths, 3x3 transformation
matrices, colors, morphing, common shapes etc.

#Demos

[See ./demos](./demos)
