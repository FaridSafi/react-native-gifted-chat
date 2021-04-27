'use strict';
const normalizeUrl = require('normalize-url');

module.exports = (a, b) => {
	if (a === b) {
		return true;
	}

	return normalizeUrl(a) === normalizeUrl(b);
};
