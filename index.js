var isBuffer = require('is-buffer')

module.exports = flatten
flatten.flatten = flatten
flatten.unflatten = unflatten

function flatten (target, opts) {
  opts = opts || {}

  var delimiter = opts.delimiter || '.'
  var maxDepth = opts.maxDepth
  var coercion = opts.coercion
  var filters = opts.filters
  var output = {}

  function transform (key, value) {
    if (!coercion) { return value }
    var transformed = value

    coercion.forEach(function (c) {
      transformed = c.test(key, transformed) ? c.transform(transformed) : transformed
    })

    return transformed
  }

  function isFiltered (key, value) {
    if (!filters) { return false }

    var filtered = false
    filters.forEach(function (filter) {
      if (filter.test(key, value)) {
        filtered = true
      }
    })
    return filtered
  }

  function shouldTraverse (value, transformedValue, currentDepth, filters) {
    var type = Object.prototype.toString.call(value)
    var isarray = opts.safe && Array.isArray(value)
    var isbuffer = isBuffer(value)
    var isobject = (
      type === '[object Object]' ||
      type === '[object Array]'
    )

    return transformedValue === value &&
      !isarray &&
      !isbuffer &&
      isobject &&
      Object.keys(value).length &&
      (!opts.maxDepth || currentDepth < maxDepth)
  }

  function step (object, prev, currentDepth) {
    currentDepth = currentDepth || 1
    Object.keys(object).forEach(function (key) {
      var value = object[key]

      var newKey = prev
        ? prev + delimiter + key
        : key

      const transformedValue = transform(key, value)

      if (shouldTraverse(value, transformedValue, currentDepth) && !isFiltered(key, value)) {
        return step(value, newKey, currentDepth + 1)
      }

      output[newKey] = transformedValue
    })
  }

  step(target)

  return output
}

function unflatten (target, opts) {
  opts = opts || {}

  var delimiter = opts.delimiter || '.'
  var overwrite = opts.overwrite || false
  var result = {}

  var isbuffer = isBuffer(target)
  if (isbuffer || Object.prototype.toString.call(target) !== '[object Object]') {
    return target
  }

  // safely ensure that the key is
  // an integer.
  function getkey (key) {
    var parsedKey = Number(key)

    return (
      isNaN(parsedKey) ||
      key.indexOf('.') !== -1 ||
      opts.object
    ) ? key
      : parsedKey
  }

  var sortedKeys = Object.keys(target).sort(function (keyA, keyB) {
    return keyA.length - keyB.length
  })

  sortedKeys.forEach(function (key) {
    var split = key.split(delimiter)
    var key1 = getkey(split.shift())
    var key2 = getkey(split[0])
    var recipient = result

    while (key2 !== undefined) {
      var type = Object.prototype.toString.call(recipient[key1])
      var isobject = (
        type === '[object Object]' ||
        type === '[object Array]'
      )

      // do not write over falsey, non-undefined values if overwrite is false
      if (!overwrite && !isobject && typeof recipient[key1] !== 'undefined') {
        return
      }

      if ((overwrite && !isobject) || (!overwrite && recipient[key1] == null)) {
        recipient[key1] = (
          typeof key2 === 'number' &&
          !opts.object ? [] : {}
        )
      }

      recipient = recipient[key1]
      if (split.length > 0) {
        key1 = getkey(split.shift())
        key2 = getkey(split[0])
      }
    }

    // unflatten again for 'messy objects'
    recipient[key1] = unflatten(target[key], opts)
  })

  return result
}
