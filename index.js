var Promise = require('bluebird');
var fs = require('fs');
var path = require('path');
var babel = require('babel-core');
var util = require('util');

var transformFileAsync = Promise.promisify(require('babel-core').transformFile);
var writeFileAsync = Promise.promisify(fs.writeFile);

// private members
var files = [];
var defaultOpts = {
  minified: false,
  modules: [],
};

// private functions
function Generator() {
  if (!(this instanceof Generator)) {
    return new Generator();
  }

  files = [];
}

function getBabelHeader(modules) {
  var polyfill, register, registerOpts = '';

  if (modules && typeof modules === 'string') {
    modules = [modules];
  }

  if (util.isArray(modules) && modules.length !== 0) {
    registerOpts = util.format('({ ignore: /node_modules\\/(?!%s)/ })', modules.join('|'));
  }

  polyfill = "require('babel-polyfill');";
  register = util.format("require('babel-register')%s;", registerOpts);
  
  return Promise.resolve([polyfill, register].join('\n'));
};

// public functions
Generator.prototype.clear = function() {
  return Promise.each(files, function(file) {
    return fs.unlinkSync(file);
  });
};

Generator.prototype.transformFile = function(info) {
  var srcfile = info.srcfile;
  var dstpath = info.dstpath || path.dirname(srcfile);
  var dstfilename = info.dstfilename || '_' + path.basename(srcfile);
  var dstfile = path.resolve(dstpath, dstfilename);
  var codefile = path.resolve(dstpath, '_' + dstfilename);

  var opts = info.opts || defaultOpts;
  var minified = opts.minified === true ? opts.minified : false;
  var modules = opts.modules;

  if (util.isArray(srcfile)) {
    return Promise.each(srcfile, (function(file) {
      return this.transformFile({srcfile: file, opts: opts})
    }).bind(this))
    .then(function(promises) {
      return Promise.all(promises);
    });
  }

  return transformFileAsync(srcfile, {minified: minified})
    .then(function(result) {
      return getBabelHeader(modules)
        .then(function(header) {
          return writeFileAsync(codefile, result.code)
            .then(function() {
              files.push(codefile);
              return util.format("%s\nmodule.exports = require('./%s');", header, path.basename(codefile));
            });
        });
    })
    .then(function(code) {
      return writeFileAsync(dstfile, code);
    })
    .then(function() {
      files.push(dstfile);
      return dstfile;
    });
};

module.exports = Generator;