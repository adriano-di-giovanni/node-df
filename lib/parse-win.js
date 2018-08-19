var format = require('./format')
var calcMultiplier = require('./calcMultiplier')

module.exports = function (stdout, options) {
    // TODO: this should be removed because it never happens.
    // Nonetheless, I want to consider it a breaking changed that's to be made after releasing 0.1.4
    if (!stdout) {
        return void 0
    }

    // TODO: `options.prefixMultiplier` should become `options.unit`
    // I should deprecate the use of `options.prefixMultiplier` in 0.1.4
    var multiplier = calcMultiplier(options.prefixMultiplier)
    var precision = options.precision
    // TODO: `options.isDisplayPrefixMultiplier` should become `options.showUnit`
    // I should deprecate the use of options.isDisplayPrefixMultiplier in 0.1.4
    var unit = options.isDisplayPrefixMultiplier ? options.prefixMultiplier : null

    return stdout
        .trim()
        .split(/\r\r\n/) // split into rows
        .slice(1) // strip column headers away
        .map(function (row) {
            var columns = row
                .trim()
                // one or more whitespaces followed by one or more digits
                // must be interpreted as column delimiter
                .replace(/\s+(\d+)/g, '\t$1')
                // one or more whitespaces followed by a letter
                // must be interpreted as column delimiter
                .replace(/\s+([a-zA-Z])/g, '\t$1')
                // comma followed by one or more whitespaces must be
                // interpreted as the last column delimiter
                .replace(/(\:)\s+/g, '$1\t')
                // split into columns
                .split(/\t/)
            var size = parseInt(columns[3], 10)
            var free = parseInt(columns[1], 10)
            var used = size - free
            var capacity = 1 - free / size
            return {
                filesystem: columns[0],
                size: format(size, multiplier, precision, unit),
                used: format(used, multiplier, precision, unit),
                available: format(free, multiplier, precision, unit),
                capacity: precision ? capacity.toFixed(precision) : capacity,
                mount: columns[2],
            }
        })
}
