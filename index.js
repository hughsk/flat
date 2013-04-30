var flat = module.exports = {}

var flatten = flat.flatten = function (target, opts) {
    var output = {}
      , opts = opts || {}
      , delimiter = opts.delimiter || '.'

    function getkey(key, prev) {
        return prev ? prev + delimiter + key : key
    };

    function step(object, prev) {
        Object.keys(object).forEach(function(key) {
            var isarray = opts.safe && Array.isArray(object[key])
              , type = Object.prototype.toString.call(object[key])
              , isobject = (type === "[object Object]" || type === "[object Array]")

            if (!isarray && isobject) {
                return step(object[key]
                    , getkey(key, prev)
                )
            }

            output[getkey(key, prev)] = object[key]
        });
    };

    step(target)

    return output
};

var unflatten = flat.unflatten = function (target, opts) {
    var opts = opts || {}
      , delimiter = opts.delimiter || '.'
      , result = {}

    if (Object.prototype.toString.call(target) !== '[object Object]') {
        return target
    }

    function getkey(key) {
        var parsedKey = parseInt(key)
        return (isNaN(parsedKey) ? key : parsedKey)
    };

    Object.keys(target).forEach(function(key) {
        var split = key.split(delimiter)
          , firstNibble
          , secondNibble
          , recipient = result

        firstNibble = getkey(split.shift())
        secondNibble = getkey(split[0])

        while (secondNibble !== undefined) {
            if (recipient[firstNibble] === undefined) {
                recipient[firstNibble] = ((typeof secondNibble === 'number') ? [] : {})
            }

            recipient = recipient[firstNibble]
            if (split.length > 0) {
                firstNibble = getkey(split.shift())
                secondNibble = getkey(split[0])
            }
        }

        // unflatten again for 'messy objects'
        recipient[firstNibble] = unflatten(target[key])
    });

    return result
};
