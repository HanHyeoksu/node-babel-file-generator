#!/usr/bin/env node
var Transpiler = require('./');
var transpiler = new Transpiler();

var testfile = 'testfiles/test.js';

transpiler.transformFile({
	srcfile: testfile,
	opts: {
		minified: true
	}
	
})
.then(function(res) {
	console.log(res);
});