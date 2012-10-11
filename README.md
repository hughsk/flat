# flat [![Build Status](https://secure.travis-ci.org/hughsk/flat.png?branch=master)](http://travis-ci.org/hughsk/flat)

Take a nested Javascript object and flatten it, or unflatten an object with
delimited keys.

## Installion

``` bash
$ npm install flat
```

## Methods

### flat.flatten(original, options)

Flattens the object - it'll return an object one level deep, regardless of how
nested the original object was:

``` javascript
var flatten = require('flat').flatten

flatten({
    key1: {
        keyA: 'valueI'
    },
    key2: {
        keyB: 'valueII'
    },
    key3: { a: { b: { c: 2 } } }
})

// {
//   'key1.keyA': 'valueI',
//   'key2.keyB': 'valueII',
//   'key3.a.b.c': 2
// }
```

### flat.flatten(original, options)

Flattening is reversible too, you can call `flat.unflatten()` on an object:

``` javascript
var unflatten = require('flat').unflatten

unflatten({
    'three.levels.deep': 42,
    'three.levels': {
        nested: true
    }
})

// {
//     three: {
//         levels: {
//             deep: 42,
//             nested: true
//         }
//     }
// }
```

## Options

### delimiter

Use a custom delimiter for (un)flattening your objects, instead of `.`.

### safe

When enabled, both `flat` and `unflatten` will preserve arrays and their
contents. This is disabled by default.

``` javascript
var flatten = require('flat').flatten

flatten({
    this: [
        { contains: 'arrays' },
        { preserving: {
              them: 'for you'
        }}
    ]
}, {
    safe: true
})

// {
//     'this': [
//         { contains: 'arrays' },
//         { preserving: {
//             them: 'for you'
//         }}
//     ]
// }
```