var flat = module.exports = flatten
flatten.flatten = flatten
flatten.unflatten = unflatten

function flatten(target, opts) {
  opts = opts || {}

  var delimiter = opts.delimiter || '.'
  var maxDepth = opts.maxDepth
  var currentDepth = 1
  var output = {}

  function step(object, prev) {
    Object.keys(object).forEach(function(key) {
      var value = object[key]
      var isarray = opts.safe && Array.isArray(value)
      var type = Object.prototype.toString.call(value)
      var isbuffer = isBuffer(value)
      var isobject = (
        type === "[object Object]" ||
        type === "[object Array]"
      )

      var newKey = prev
        ? prev + delimit(delimiter, key)
        : key

      if (!opts.maxDepth) {
        maxDepth = currentDepth + 1;
      }

      if (!isarray && !isbuffer && isobject && Object.keys(value).length && currentDepth < maxDepth) {
        ++currentDepth
        return step(value, newKey)
      }

      output[newKey] = value
    })
  }

  step(target)

  return output
}

function unflatten(target, opts) {
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
  function getkey(key) {
    var parsedKey = Number(key)

    return (
      isNaN(parsedKey) ||
      key.indexOf('.') !== -1
    ) ? key
      : parsedKey
  }

  Object.keys(target).forEach(function(key) {
    var split = splitkey(key, delimiter)
    var key1 = getkey(split.shift())
    var key2 = getkey(split[0])
    var recipient = result

    while (key2 !== undefined) {
      var type = Object.prototype.toString.call(recipient[key1])
      var isobject = (
        type === "[object Object]" ||
        type === "[object Array]"
      )

      if ((overwrite && !isobject) || (!overwrite && recipient[key1] === undefined)) {
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

function isBuffer(value) {
  if (typeof Buffer === 'undefined') return false
  return Buffer.isBuffer(value)
}

// add delimiters to a key
// 1-2 characters
// 2 characters will be treated as brackets 
// ex. delimit('[]', 'hi') = '[hi]'
function delimit(delimiter, key) {
  if (delimiter.length == 1) {
    return delimiter + key
  }
  else {
    var delimiters = delimiter.split('')
    return delimiters[0] + key + delimiters[1]
  }
}

// split a key by a delimiter(s)
// 1 or 2 characters
// 2 characters treated as brackets
function splitkey(key, delimiter){
  if (delimiter.length == 1) {
    return key.split(delimiter)
  }
  else if (delimiter.length == 2) {
    var delimiters = delimiter.split('')
    var regex = new RegExp('\\'+delimiters[1] , 'g')
    //remove trailing bracket from string
    var result = key.replace(regex, '')
    //split on leading bracket
    return (result.split(delimiters[0]))
  }
}

