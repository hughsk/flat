var assert = require('assert')
  , flat = require('../index')
  , flatten = flat.flatten
  , unflatten = flat.unflatten

suite('Flatten Primitives', function(){
    test('String', function(){
        assert.deepEqual(flatten({hello:{world: "good morning"}}),{'hello.world':'good morning'})
    })
    test('Number', function(){
        assert.deepEqual(flatten({hello:{world: 1234.99}}),{'hello.world': 1234.99})
    })
    test('Boolean', function(){
        assert.deepEqual(flatten({hello:{world: true}}),{'hello.world': true})
        assert.deepEqual(flatten({hello:{world: false}}),{'hello.world': false})
    })
    test('Date', function(){
        var  d = new Date()
        assert.deepEqual(flatten({hello:{world: d}}),{'hello.world': d})
    })
    test('Null', function(){
        assert.deepEqual(flatten({hello:{world: null}}),{'hello.world': null})
    })
    test('Undefined', function(){
        assert.deepEqual(flatten({hello:{world: undefined}}),{'hello.world': undefined})
    })
})

suite('Unflatten Primitives', function(){
    test('String', function(){
        assert.deepEqual(unflatten({'hello.world':'good morning'}),{hello:{world: "good morning"}})
    })
    test('Number', function(){
        assert.deepEqual(unflatten({'hello.world': 1234.99}),{hello:{world: 1234.99}})
    })
    test('Boolean', function(){
        assert.deepEqual(unflatten({'hello.world': true}),{hello:{world: true}})
        assert.deepEqual(unflatten({'hello.world': false}),{hello:{world: false}})
    })
    test('Date', function(){
        var  d = new Date()
        assert.deepEqual(unflatten({'hello.world': d}),{hello:{world: d}})
    })
    test('Null', function(){
        assert.deepEqual(unflatten({'hello.world': null}),{hello:{world: null}})
    })
    test('Undefined', function(){
        assert.deepEqual(unflatten({'hello.world': undefined}),{hello:{world: undefined}})
    })
})

suite('Flatten', function() {
    test('Nested once', function() {
        assert.deepEqual(flatten({
            hello: {
                world: 'good morning'
            }
        }), {
            'hello.world': 'good morning'
        })
    })
    test('Nested twice', function() {
        assert.deepEqual(flatten({
            hello: {
                world: {
                    again: 'good morning'
                }
            }
        }), {
            'hello.world.again': 'good morning'
        })
    })
    test('Multiple Keys', function() {
        assert.deepEqual(flatten({
            hello: {
                lorem: {
                    ipsum: 'again',
                    dolor: 'sit'
                }
            },
            world: {
                lorem: {
                    ipsum: 'again',
                    dolor: 'sit'
                }
            }
        }), {
            'hello.lorem.ipsum': 'again',
            'hello.lorem.dolor': 'sit',
            'world.lorem.ipsum': 'again',
            'world.lorem.dolor': 'sit'
        })
    })
    test('Custom Delimiter', function() {
        assert.deepEqual(flatten({
            hello: {
                world: {
                    again: 'good morning'
                }
            }
        }, {
            delimiter: ':'
        }), {
            'hello:world:again': 'good morning'
        })
    })
})

suite('Unflatten', function() {
    test('Nested once', function() {
        assert.deepEqual({
            hello: {
                world: 'good morning'
            }
        }, unflatten({
            'hello.world': 'good morning'
        }))
    })
    test('Nested twice', function() {
        assert.deepEqual({
            hello: {
                world: {
                    again: 'good morning'
                }
            }
        }, unflatten({
            'hello.world.again': 'good morning'
        }))
    })
    test('Multiple Keys', function() {
        assert.deepEqual({
            hello: {
                lorem: {
                    ipsum: 'again',
                    dolor: 'sit'
                }
            },
            world: {
                lorem: {
                    ipsum: 'again',
                    dolor: 'sit'
                }
            }
        }, unflatten({
            'hello.lorem.ipsum': 'again',
            'hello.lorem.dolor': 'sit',
            'world.lorem.ipsum': 'again',
            'world.lorem.dolor': 'sit'
        }))
    })
    test('Custom Delimiter', function() {
        assert.deepEqual({
            hello: {
                world: {
                    again: 'good morning'
                }
            }
        }, unflatten({
            'hello world again': 'good morning'
        }, {
            delimiter: ' '
        }))
    })
    test('Messy', function() {
        assert.deepEqual({
            hello: { world: 'again' },
            lorem: { ipsum: 'another' },
            good: {
                morning: {
                    hash: {
                        key: { nested: {
                            deep: { and: { even: {
                                deeper: { still: 'hello' }
                            } } }
                        } }
                    },
                    again: { testing: { 'this': 'out' } }
                }
            }
        }, unflatten({
            'hello.world': 'again',
            'lorem.ipsum': 'another',
            'good.morning': {
                'hash.key': {
                    'nested.deep': {
                        'and.even.deeper.still': 'hello'
                    }
                }
            },
            'good.morning.again': {
                'testing.this': 'out'
            }
        }))
    })

    suite('.safe', function() {
        test('Should protect arrays when true', function() {
            assert.deepEqual(flatten({
                hello: [
                      { world: { again: 'foo' } }
                    , { lorem: 'ipsum' }
                ]
                , another: {
                    nested: [{ array: { too: 'deep' }}]
                }
                , lorem: {
                    ipsum: 'whoop'
                }
            }, {
                safe: true
            }), {
                hello: [
                      { world: { again: 'foo' } }
                    , { lorem: 'ipsum' }
                ]
                , 'lorem.ipsum': 'whoop'
                , 'another.nested': [{ array: { too: 'deep' }}]
            })
        })
        test('Should not protect arrays when false', function() {
            assert.deepEqual(flatten({
                hello: [
                      { world: { again: 'foo' } }
                    , { lorem: 'ipsum' }
                ]
            }, {
                safe: false
            }), {
                  'hello.0.world.again': 'foo'
                , 'hello.1.lorem': 'ipsum'
            })
        })
    })
});

suite('Arrays', function() {
    var object, flatObject;
    object = { "a": ["foo", "bar"] };
    flatObject = { "a.0": "foo", "a.1": "bar"};

    test('Should be able to flatten arrays properly', function() {
        assert.deepEqual(flatObject, flatten(object));
    });
    test('Should be able to revert and reverse array serialization via unflatten', function() {
        assert.deepEqual(object, unflatten(flatObject));
    });
    test('Array typed objects should be restored by unflatten', function () {
        assert.equal(Object.prototype.toString.call(object.a), Object.prototype.toString.call(unflatten(flatObject).a));
    })
});