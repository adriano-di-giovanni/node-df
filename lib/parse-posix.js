var format = require('./format')
var calcMultiplier = require('./calcMultiplier')

module.exports = function(stdout, options) {
    // TODO: this snould be removed because it never happens.
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
        .split(/\r|\n|\r\n/) // split into rows
        .slice(1) // strip column headers away
        .map(function(row) {
            var columns = row
                // one or more whitespaces followed by one or more digits
                // must be interpreted as column delimiter
                .replace(/\s+(\d+)/g, '\t$1')
                // one or more whitespaces followed by a slash
                // must be interpreted as the last column delimiter
                .replace(/\s+\//g, '\t/')
                // split into columns
                .split(/\t/)

            return {
                filesystem: columns[0],
                size: format(columns[1], multiplier, precision, unit),
                used: format(columns[2], multiplier, precision, unit),
                available: format(columns[3], multiplier, precision, unit),
                capacity: format(columns[4], 0.01),
                mount: columns.slice(5).join(' '),
            }
        })
}
