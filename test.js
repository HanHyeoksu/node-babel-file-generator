#!/usr/bin/env node
var Generator = require('./');
var generator = new Generator();

generator.transformFile({
  srcfile: 'testfiles/test.js',
  opts: {
    minified: true,
    modules: 'koa'
  }
})
.then(function(outputfile) {
  console.log('Output:', outputfile);
});