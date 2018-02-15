var round = Math.round
var pow = Math.pow

module.exports = function(aValue, multiplier, precision, unit) {
    var value = parseInt(aValue, 10) * multiplier
    // TODO: precision should be valid or df should invoke callback with `err`
    // This is a breaking change to be made after release 0.1.4
    var hasPrecision = typeof precision === 'number'
    var amount

    if (hasPrecision) {
        amount = pow(10, precision)
        value = round(value * amount) / amount
    }

    if (unit != null) {
        // NOTE: this is to always show decimals even if value is an integer
        if (hasPrecision) {
            value = value.toFixed(precision)
        }
        value += unit
    }

    return value
}
