var pow = Math.pow

var DEFAULT_UNIT = 'kib'

// from kib to bytes
var TO_BYTES = pow(2, 10)

var multipliers = {}
multipliers[DEFAULT_UNIT] = 1

module.exports = function(aUnit) {
    var unit = (aUnit || DEFAULT_UNIT).toLowerCase()
    var multiplier = TO_BYTES

    if (!multipliers[unit]) {
        switch (unit) {
            case 'mib':
                multiplier /= pow(2, 20)
                break
            case 'gib':
                multiplier /= pow(2, 30)
                break
            case 'tib':
                multiplier /= pow(2, 40)
                break
            case 'pib':
                multiplier /= pow(2, 50)
                break
            case 'eib':
                multiplier /= pow(2, 60)
                break
            case 'zib':
                multiplier /= pow(2, 70)
                break
            case 'yib':
                multiplier /= pow(2, 80)
                break
            case 'kb':
                multiplier /= pow(10, 3)
                break
            case 'mb':
                multiplier /= pow(10, 6)
                break
            case 'gb':
                multiplier /= pow(10, 9)
                break
            case 'tb':
                multiplier /= pow(10, 12)
                break
            case 'pb':
                multiplier /= pow(10, 15)
                break
            case 'eb':
                multiplier /= pow(10, 18)
                break
            case 'zb':
                multiplier /= pow(10, 21)
                break
            case 'yb':
                multiplier /= pow(10, 24)
                break
            // TODO: default clsuse should be removed when `aUnit` is validated before invoking this function
            default:
                return multipliers[DEFAULT_UNIT]
        }

        multipliers[unit] = multiplier
    }

    return multipliers[unit]
}
