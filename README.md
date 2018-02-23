# node-babel-file-generator

[![node][node-image]][node-url]
[![npm][npm-image]][npm-url]

[node-image]: https://img.shields.io/node/v/@stdlib/stdlib.svg
[node-url]: https://nodejs.org

[npm-image]: https://img.shields.io/badge/npm-1.0.0-blue.svg
[npm-url]: https://www.npmjs.com/

## About
**Input**: Node.js file(s) that is written with ECMA5 or higher in old version Node.js.
```js
[1, 2, 3].map(n => n ** 2);

var [a,,b] = [1,2,3];

const x = [1, 2, 3];
foo([...x]);

var obj = {
  shorthand,
  method() {
    return "😀";
  }
};

var name = "Guy Fieri";
var place = "Flavortown";

`Hello ${name}, ready for ${place}?`;

let yourTurn = "Type some code in here!";
```

**Output**: New Node.js file(s) processed with [babel](http://babeljs.io/).
```js
"use strict";

[1, 2, 3].map(function (n) {
  return Math.pow(n, 2);
});

var _ref = [1, 2, 3],
    a = _ref[0],
    b = _ref[2];

var x = [1, 2, 3];
foo([].concat(x));

var obj = {
  shorthand: shorthand,
  method: function method() {
    return "😀";
  }
};

var name = "Guy Fieri";
var place = "Flavortown";

"Hello " + name + ", ready for " + place + "?";

var yourTurn = "Type some code in here!";
```
All methods are asynchronous functions using [bluebird](http://bluebirdjs.com/docs/getting-started.html) module.
So, you can use an useful [bluebird's promise functions](http://bluebirdjs.com/docs/api-reference.html) at the return value.

## Create instance
```js
var Generator = require('node-babel-file-generator');
var generator = new Generator();
```

## generator.transformFile(info)
**Return**: full path of output file(s)

**info**: *object*
- **srcfile**: *string* | *stringArray*
- **dstpath**: *string* (**Default**: './')
- **dstfilename**: *string* (**Default**: _srcfilename)
- **opts**: *object*
  - **minified**: *boolean* (**Default**: false)
  - **modules**: *string* | *stringArray* (**Default**: [])


`srcfile` should be full path of source file and it also could be array of the paths. `dstpath` and `dstfilename` are ignored and setted as `Default` when `srcfile` is array.

If `opts.modules` option is setted then the generator will find the module by the given name in node_modules directory and processing [babel](http://babeljs.io/) with the module(s). As a result two files are generated. The one is js file that is processed by [babel](http://babeljs.io/) and another is a file that include babel-polyfill and babel-register module and the precessed js file.

Here is an example below:

**input**: test.js
```js
const Koa = require('koa');
const func = (a,b) => a+b
```

```js
generator.transformFile({
  srcfile: './test.js',
  opts: {
    modules: 'koa'
  }
})
```

**output1**: _test.js
```js
require('babel-polyfill');
require('babel-register')({ ignore: /node_modules\/(?!koa)/ });
require('./__test.js');
```

**output2**: __test.js
```js
'use strict';

var Koa = require('koa');

var func = function func(a, b) {
  return a + b;
};
```

## generator.clear()

Remove all generated files since its instance is generated.