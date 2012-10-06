var flat = module.exports = {}

var flatten = flat.flatten = function (target, delimeter) {
    var output = {}
      , delimeter = delimeter || '.'

    function getkey(key, prev) {
        return prev ? prev + delimeter + key : key
    };

    function step(object, prev) {
        Object.keys(object).forEach(function(key) {
            if (typeof object[key] === 'object') {
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

var unflatten = flat.unflatten = function (target, delimeter) {
    if (typeof target !== 'object') return target

    target = flatten(target, delimeter)

    var keys = Object.keys(target)
      , delimeter = delimeter || '.'

    var unflat = keys.reduce(function (memo, key) {
        var split = key.split(delimeter)
          , first = split.shift()

        if (split.length < 1) {
            memo[key] = target[key]
            return memo
        }

        memo[first] = memo[first] || {}
        memo[first][split.join(delimeter)] = target[key]

        memo[first] = unflatten(memo[first], delimeter)

        return memo;
    }, {})

    return unflat
};