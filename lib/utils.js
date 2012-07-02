(function () {
	"use strict";

  var util = require('util'),
      fileTypes = [
    'normal', 'hard-link', 'symbolic-link', 'character-special', 'block-special', 'directory', 'fifo', 'contiguous-file'
  ];

  function fileTypeToIndex(fileType, callback) {
    var index = fileTypes.indexOf(fileType);
    if (index < 0) {
      callback('Invalid fileType.', index);
    } else {
      callback(null, index);
    }
  }

  function getFileType(index) {
    return fileTypes[index];
  }

  function convertToTarDate(date) {
    return parseInt(date/1000);
  }

  function calculateTarDate(input, defaultDate) {
    if (typeof input === 'number') {
      return input;
    } else if (util.isDate(input)) {
      return convertToTarDate(input);
    } else if (typeof defaultDate == 'number') {
      return defaultDate;
    } else {
      return convertToTarDate(defaultDate);
    }
  }

	function clean(length) {
		var i, buffer = new Buffer(length);
		for (i = 0; i < length; i += 1) {
			buffer[i] = 0;
		}
		return buffer;
	}

	function pad(num, bytes, base) {
		num = num.toString(base || 8);
		return "000000000000".substr(num.length + 12 - bytes) + num;
	}	

	function readAll(cb, stream) {
		var bufs = [],
			size = 0;

		stream.on('error', cb);
		stream.on('data', function (data) {
			bufs.push(data);
			size += data.length;
		});
		stream.on('end', function () {
			var buf = new Buffer(size),
				offset = 0;

			bufs.forEach(function (data) {
				data.copy(buf, offset);
				offset += data.length;
			});

			cb(null, buf);
		});
	}

  module.exports.fileTypeToIndex = fileTypeToIndex;
  module.exports.getFileType = getFileType;
  module.exports.calculateTarDate = calculateTarDate;
	module.exports.clean = clean;
	module.exports.pad = pad;
	module.exports.readAll = readAll;
}());
