'use strict';

var assert = require('chai').assert;
var fs = require('fs');
var path = require('path');
var Untar = require('../lib/untar');

var artifactsPath = path.join(__dirname, 'artifacts');

var testTarPath = path.join(artifactsPath, 'untar-test.tar');
var testFile1Path = path.join(artifactsPath, 'test-file-1.txt');

describe('untar', function () {
	it('can untar an archive', function (done) {
		var fileCount = 0;
		var untar = new Untar(function (err, header, data) {
			if (err) return done(err);
			fileCount++;

			assert(header, 'No header provided');
			assert(header.name === 'somefile.txt', 'Filename does not match');

			var fileContent = '';
			data.on('data', function (data) {
				fileContent += data;
			});
			data.on('end', function () {
				assert(fileContent === 'Test File 1', 'Unexpected filename');
			});
		});

		untar.on('end', function () {
			assert(fileCount === 1, 'Did not receive the expected number of files');
			done();
		});

		var inStream = fs.createReadStream(testTarPath);
		inStream.pipe(untar);
	});
});