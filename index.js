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
              , isobject = typeof object[key] === 'object'

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
    if (typeof target !== 'object') return target

    var opts = opts || {}
      , delimiter = opts.delimiter || '.'

    if (opts.safe && Array.isArray(target)) {
        return target.map(function(value) {
            return unflatten(value, opts);
        });
    }

    target = flatten(target, opts)

    var unflat = Object.keys(target).reduce(function (memo, key) {
        var split = key.split(delimiter)
          , first = split.shift()

        if (split.length < 1) {
            memo[key] = target[key]
            return memo
        }

        memo[first] = memo[first] || {}
        memo[first][split.join(delimiter)] = target[key]

        memo[first] = unflatten(memo[first], opts)

        return memo;
    }, {})

    return unflat
};