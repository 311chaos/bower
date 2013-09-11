#!/usr/bin/env node

var fs = require('fs'),
	cp = require('child_process'),
	path = require('path'),
	json = require( path.join(__dirname, '..', '..', 'package.json') ),
	parent = path.join(__dirname, '..'),
	relative = path.relative(path.join(parent, '..'), parent);

function exec(cmd, callback) {
	cp.exec(cmd, {}, function(error, stdout, stderr) {
		if (error !== null) { return console.log('exec error: ' + error); }
		callback(error, stdout, stderr);
	});
}

// Copy files from grunt-ed output
exec('grunt --dist="'+relative+'" --stable', function() {

	// Also generate basic files
	exec('grunt basic --dist="'+relative+'" --stable', function() {

		// Add the files to the git repo
		cp.exec('git add *');

		// Output to bower.json
		fs.writeFile('bower.json', JSON.stringify({
			"name": json.name.toLowerCase(),
			"description": json.description,
			"version": json.version,
			"homepage": "http://qtip2.com",
			"location": "https://github.com/arrayjam/bower-qtip2/",
			"repository": json.repository,
			"authors": [ json.author ],
			"license": json.licenses.map(function(license) { return license.type }),
			"keywords": json.keywords,
			"main": [
				"./jquery.qtip.js",
				"./basic/jquery.qtip.js"
			],
			"ignore": [
				"bin"
			]
		}, null, 4));
	});
});
