# Node Stream Buffers

[![Build Status][badge-travis-img]][badge-travis-url]
[![Code Climate][badge-climate-img]][badge-climate-url]
[![Code Coverage][badge-coverage-img]][badge-coverage-url]

Simple Readable and Writable Streams that use a [Buffer][node-buffer-docs] to store received data, or for data to send out. Useful for test code, debugging, and a wide range of other utilities.

## Installation

[![NPM][badge-npm-img]][badge-npm-url]

## Usage

To use the stream buffers in your module, simply import it and away you go.

```js
var streamBuffers = require("stream-buffers");
```

### Writable StreamBuffer

Writable Stream Buffers implement the standardized writable stream interface. All write()'s to this object will accumulate in an internal Buffer. If the Buffer overflows it will be resized larger automatically. The initial size of the Buffer and the amount in which it grows can be configured in the constructor.

```js
var myWritableStreamBuffer = new streamBuffers.WritableStreamBuffer({
	initialSize: (100 * 1024),		// start as 100 kilobytes.
	incrementAmount: (10 * 1024)	// grow by 10 kilobytes each time buffer overflows.
});
```

The default initial size and increment amount are stored in the following constants:

```js
streamBuffers.DEFAULT_INITIAL_SIZE 		// (8 * 1024)
streamBuffers.DEFAULT_INCREMENT_AMOUNT	// (8 * 1024)
```

Writing is standard Stream stuff:

```js
myWritableStreamBuffer.write(myBuffer);
// - or -
myWritableStreamBuffer.write("\u00bd + \u00bc = \u00be", "utf8");
```

You can query the size of the data being held in the Buffer, and also how big the Buffer's max capacity currently is: 

```js
myWritableStreamBuffer.write("ASDF");
streamBuffers.size();			// 4.
streamBuffers.maxSize();		// Whatever was configured as initial size. In our example: (100 * 1024).
```

Retrieving the contents of the Buffer is simple:

```js
myWritableStreamBuffer.getContents();					// Gets all held data as a Buffer.
myWritableStreamBuffer.getContentsAsString("utf8");		// Gets all held data as a utf8 string.
myWritableStreamBuffer.getContents(5);					// Gets first 5 bytes as a Buffer.
myWritableStreamBuffer.getContentsAsString("utf8", 5);	// Gets first 5 bytes as a utf8 string.
```

Care should be taken when getting encoded strings from WritableStream, as it doesn't really care about the contents (multi-byte characters will not be respected).
 
Destroying or ending the WritableStream will not delete the contents of Buffer, but will disallow any further writes:

```js
myWritableStreamBuffer.write("ASDF");
myWritableStreamBuffer.destroy();

myWritableStreamBuffer.getContents();		// Returns ASDF in Buffer.
myWritableStreamBuffer.write("Yeah?");		// No effect.
```	

### Readable StreamBuffer

Readable Stream Buffers can have data inserted in them, which will then be pumped out via standard readable stream data events. The data to be sent out is held in a Buffer, which can grow in much the same way as a WritableStream Buffer does, if data is being put in Buffer faster than it's being pumped out. 

The frequency in which chunks are pumped out, and the size of the chunks themselves can be configured in the constructor. The initial size and increment amount of internal Buffer can be configured too.

```js
var myReadableStreamBuffer = new streamBuffers.ReadableStreamBuffer({
	frequency: 10,		// in milliseconds.
	chunkSize: 2048		// in bytes.
});
```

Default frequency and chunk size:

```js
streamBuffers.DEFAULT_CHUNK_SIZE 		// (1024)
streamBuffers.DEFAULT_FREQUENCY			// (1)
```

Putting data in Buffer to be pumped out is easy:

```js
myReadableStreamBuffer.put(aBuffer);
myReadableStreamBuffer.put("A String", "utf8");
```

Chunks are pumped out via standard readable stream spec: 

```js
myReadableStreamBuffer.on("data", function(data) {
	// Yup.
	assert.isTrue(data instanceof Buffer);
});
```

Chunks are pumped out by the interval that you specified in frequency. Setting the frequency to 0 will immediately stream the data (also in chunks), even if the stream has not been piped to a destination. This is useful for unit testing. 

setEncoding() for streams is respected too:

```js
myReadableStreamBuffer.setEncoding("utf8");
myReadableStreamBuffer.on("data", function(data) {
	assert.isTrue(data instanceof String);
});
```

Pause and resume are also implemented. pause()'ing stream will allow buffer to continue accumulating, but will not pump any of that data out until it is resume()'d again. 

Destroying the stream will immediately purge the buffer, unless destroySoon() is called, in which case the rest of the buffer will be written out. Either way, any further attempts to put data in the Buffer will be silently ignored. 

```js
myReadableStreamBuffer.destroySoon();
myReadableStreamBuffer.put("A String!");
myReadableStreamBuffer.size();			// will be 0.
```

## Disclaimer

Not supposed to be a speed demon, it's more for tests/debugging or weird edge cases. It works with an internal buffer that it copies contents to/from/around.

## Contributors

Thanks to the following people for taking some time to contribute to this project.

 * Igor Dralyuk <idralyuk@ebay.com>
 * Simon Koudijs <simon.koudijs@intellifi.nl>

## License

node-stream-buffer is free and unencumbered public domain software. For more information, see the accompanying UNLICENSE file.

[badge-travis-img]: http://img.shields.io/travis/samcday/node-stream-buffer.svg?style=flat-square
[badge-travis-url]: https://travis-ci.org/samcday/node-stream-buffer
[badge-climate-img]: http://img.shields.io/codeclimate/github/samcday/node-stream-buffer.svg?style=flat-square
[badge-climate-url]: https://codeclimate.com/github/samcday/node-stream-buffer
[badge-coverage-img]: http://img.shields.io/codeclimate/coverage/github/samcday/node-stream-buffer.svg?style=flat-square
[badge-coverage-url]: https://codeclimate.com/github/samcday/node-stream-buffer
[badge-npm-img]: https://nodei.co/npm/stream-buffers.png?downloads=true&downloadRank=true&stars=true
[badge-npm-url]: https://npmjs.org/package/stream-buffers

[node-buffer-docs]: http://nodejs.org/api/buffer.html
