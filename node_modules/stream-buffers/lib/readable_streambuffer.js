var stream = require("stream"),
	constants = require("./constants"),
	util = require("util");

var ReadableStreamBuffer = module.exports = function(opts) {
	var that = this;

	stream.Stream.call(this);

	opts = opts || {};
	var frequency = opts.hasOwnProperty("frequency") ? opts.frequency : constants.DEFAULT_FREQUENCY;
	var chunkSize = opts.chunkSize || constants.DEFAULT_CHUNK_SIZE;
	var initialSize = opts.initialSize || constants.DEFAULT_INITIAL_SIZE;
	var incrementAmount = opts.incrementAmount || constants.DEFAULT_INCREMENT_AMOUNT;

	var size = 0;
	var buffer = new Buffer(initialSize);
	var encoding = null;

	this.readable = true;
	this.writable = false;

	var sendData = function() {
		var amount = Math.min(chunkSize, size);

		if (amount > 0) {
			var chunk = null;
			if(encoding) {
				chunk = buffer.toString(encoding, 0, amount);
			}
			else {
				chunk = new Buffer(amount);
				buffer.copy(chunk, 0, 0, amount);
			}

			that.emit("data", chunk);

			if(amount < buffer.length)
				buffer.copy(buffer, 0, amount, size);
			size -= amount;
		}

		if(size === 0 && !that.readable) {
			that.emit("end");
			that.emit("close");
			if (sendData && sendData.interval) {
				clearInterval(sendData.interval);
				sendData.interval = null;
			}
		}
	};

	this.size = function() {
		return size;
	};

	this.maxSize = function() {
		return buffer.length;
	};

	var increaseBufferIfNecessary = function(incomingDataSize) {
		if((buffer.length - size) < incomingDataSize) {
			var factor = Math.ceil((incomingDataSize - (buffer.length - size)) / incrementAmount);

			var newBuffer = new Buffer(buffer.length + (incrementAmount * factor));
			buffer.copy(newBuffer, 0, 0, size);
			buffer = newBuffer;
		}
	};

	this.put = function(data, encoding) {
		if(!that.readable) return;

		var wasEmpty = size === 0;
		if(Buffer.isBuffer(data)) {
			increaseBufferIfNecessary(data.length);
			data.copy(buffer, size, 0);
			size += data.length;
		}
		else {
			data = data + "";
			var dataSizeInBytes = Buffer.byteLength(data);
			increaseBufferIfNecessary(dataSizeInBytes);
			buffer.write(data, size, encoding || "utf8");
			size += dataSizeInBytes;
		}

		if (wasEmpty && size > 0) {
			this.emit('readable')
		}

		if (!this.isPaused && !frequency) {
			while (size > 0) {
				sendData();
			}
		}
	};

	this.pause = function() {
		this.isPaused = true;
		if(sendData && sendData.interval) {
			clearInterval(sendData.interval);
			delete sendData.interval;
		}
	};

	this.resume = function() {
		this.isPaused = false;
		if(sendData && !sendData.interval && frequency > 0) {
			sendData.interval = setInterval(sendData, frequency);
		}
	};

	this.destroy = function() {
		that.emit("end");
		if(sendData.interval) clearInterval(sendData.interval);
		sendData = null;
		that.readable = false;
		that.emit("close");
	};

	this.destroySoon = function() {
		that.readable = false;
		if (!sendData.interval) {
			that.emit("end");
			that.emit("close");
		}
	};

	this.setEncoding = function(_encoding) {
		encoding = _encoding;
	};

	this.resume();
};
util.inherits(ReadableStreamBuffer, stream.Stream);
