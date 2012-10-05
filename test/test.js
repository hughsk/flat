var assert = require('assert')
  , flat = require('../index')
  , flatten = flat.flatten
  , unflatten = flat.unflatten

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
        }, ':'), {
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
        }, ' '))
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
})