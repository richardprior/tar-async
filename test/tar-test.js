'use strict';

var assert = require('chai').assert;
var fs = require('fs');
var path = require('path');
var Tar = require('../lib/tar');

var artifactsPath = path.join(__dirname, 'artifacts');
var outPath = path.join(__dirname, 'output');

var testFile1Path = path.join(artifactsPath, 'test-file-1.txt');

describe('tar', function () {
	it('can add a file with stream content', function (done) {
		var outTarPath = path.join(outPath, 'tar-async-test-1.tar');
		var tar = new Tar({
			output: fs.createWriteStream(outTarPath)
		});


		fs.stat(testFile1Path, function (err, stats) {
			if (err) return done(err);

			var opts = { size: stats.size };
			tar.append('somefile.txt', fs.createReadStream(testFile1Path), opts, function (err) {
				if (err) return done(err);

				tar.close();

				var archiveFilename = '';
				var inStream = fs.createReadStream(outTarPath, {start: 0, end: 11 });
				inStream.on('data', function (data) {
					archiveFilename += data;
				});
				inStream.on('end', function () {
					assert(archiveFilename === 'somefile.txt', 'Unexpected filename');

					var fileContent = '';
					var inStream = fs.createReadStream(outTarPath, {start: 512, end: 522 });
					inStream.on('data', function (data) {
						fileContent += data;
					});
					inStream.on('end', function () {
						assert(fileContent === 'Test File 1', 'File content doesn\'t match');
						done();
					});
				});
			});
		});
	});

	it('can add a file with string content', function (done) {
		var outTarPath = path.join(outPath, 'tar-async-test-2.tar');
		var tar = new Tar({
			output: fs.createWriteStream(outTarPath)
		});

		tar.append('somefile.txt', 'Some Data', function (err) {
			if (err) return done(err);

			tar.close();

			var archiveFilename = '';
			var inStream = fs.createReadStream(outTarPath, {start: 0, end: 11 });
			inStream.on('data', function (data) {
				archiveFilename += data;
			});
			inStream.on('end', function () {
				assert(archiveFilename === 'somefile.txt', 'Unexpected filename');

				var fileContent = '';
				var inStream = fs.createReadStream(outTarPath, {start: 512, end: 520 });
				inStream.on('data', function (data) {
					fileContent += data;
				});
				inStream.on('end', function () {
					assert(fileContent === 'Some Data', 'File content doesn\'t match');
					done();
				});
			});
		});
	});
});