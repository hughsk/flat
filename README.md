# flatley [![Build Status](https://secure.travis-ci.org/antony/flatley.png?branch=master)](http://travis-ci.org/antony/flatley)

Take a nested Javascript object and flatten it, or unflatten an object with
delimited keys.

## Credits

Based on 'flat' by Hugh Kennedy (http://hughskennedy.com)

## Installation

``` bash
$ npm install flatley
```

## Methods

### flatten(original, options)

Flattens the object - it'll return an object one level deep, regardless of how
nested the original object was:

``` javascript
var flatten = require('flatley')

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

### unflatten(original, options)

Flattening is reversible too, you can call `flatten.unflatten()` on an object:

``` javascript
var unflatten = require('flatley').unflatten

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
var flatten = require('flatley')

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

### object

When enabled, arrays will not be created automatically when calling unflatten, like so:

``` javascript
unflatten({
    'hello.you.0': 'ipsum',
    'hello.you.1': 'lorem',
    'hello.other.world': 'foo'
}, { object: true })

// hello: {
//     you: {
//         0: 'ipsum',
//         1: 'lorem',
//     },
//     other: { world: 'foo' }
// }
```

### overwrite

When enabled, existing keys in the unflattened object may be overwritten if they cannot hold a newly encountered nested value:

```javascript
unflatten({
    'TRAVIS': 'true',
    'TRAVIS_DIR': '/home/travis/build/kvz/environmental'
}, { overwrite: true })

// TRAVIS: {
//     DIR: '/home/travis/build/kvz/environmental'
// }
```

Without `overwrite` set to `true`, the `TRAVIS` key would already have been set to a string, thus could not accept the nested `DIR` element.

This only makes sense on ordered arrays, and since we're overwriting data, should be used with care.


### maxDepth

Maximum number of nested objects to flatten.

``` javascript
var flatten = require('flatley')

flatten({
    key1: {
        keyA: 'valueI'
    },
    key2: {
        keyB: 'valueII'
    },
    key3: { a: { b: { c: 2 } } }
}, { maxDepth: 2 })

// {
//   'key1.keyA': 'valueI',
//   'key2.keyB': 'valueII',
//   'key3.a': { b: { c: 2 } }
// }
```

### coercion

Optionally run a test/set of tests on your incoming key/value(s) and transform the resulting value if it matches.

This is particularly useful in the case of transforming [https://www.npmjs.com/package/mongoose](mongoose) ObjectIds

```javascript
var ObjectId = mongoose.Types.ObjectId

var coercion = [{
    test: function (key, value) { return key === '_id' && ObjectId.isValid(value) }
    transform: function (value) { return value.valueOf() }
}]
var options = { coercion: coercion }

flatten({
    group1: {
        prop1: ObjectId('aaabbbcccdddeee')
    }
}, options)

// {
//    'group1.prop1': 'aaabbbcccdddeee'
// }
```


### filtering

Optionally run a test/set of tests on your incoming key/value(s) and don't transform this key's children if it matches.

```javascript

const someObject = {
    prop1: 'abc',
    prop2: 'def'
}

var filters = [{
    test: function (key, value) { return value.prop1 === 'abc' }
}]
var options = { filters: filters }

flatten({
    group1: {
        someObject: someObject
    }
}, options)

// {
//    'group1.someObject': {
//      'prop1': 'abc',
//      'prop2': 'def'
//    }
// }
```