'use strict';

var
  _ = require('underscore');

function DFHelper() {}

_.extend(DFHelper, {
  noop: function () {},
  parse: function (stdout, options) {

    if ( ! stdout) { return void 0; }

    var
      multiplier = DFHelper.getMultiplierByPrefix(options.prefixMultiplier),
      isDisplayPrefixMultiplier =  !! options.isDisplayPrefixMultiplier,
      displayedPrefixMultiplier = isDisplayPrefixMultiplier ? options.prefixMultiplier : null,

      format = DFHelper.format,
      response = _(stdout
        .trim()

        // split into rows
        .split(/\r|\n|\r\n/)

        // strip column headers away
        .slice(1))

          .map(function (row) {

            var
              columns = row

                // one or more whitespaces followed by one or more digits
                // must be interpreted as column delimiter
                .replace(/\s+(\d+)/g, '\t$1')

                // one or more whitespaces followed by a slash
                // must be interpreted as the last column delimiter
                .replace(/\s+\//g, '\t/')

                // split into columns
                .split(/\t/);

            var
              filesystem = columns[0],
              size = format(columns[1], multiplier, 2, 
                displayedPrefixMultiplier),
              used = format(columns[2], multiplier, 2, 
                displayedPrefixMultiplier),
              available = format(columns[3], multiplier, 2, 
                displayedPrefixMultiplier),
              capacity = format(columns[4], 0.01),
              mount = _.rest(columns, 5).join(' ');

            return {
              filesystem: filesystem,
              size: size,
              used: used,
              available: available,
              capacity: capacity,
              mount: mount
            };
          });

    return response;
  },
  format: function (s, multiplier, precision, displayedPrefixMultiplier) {
    multiplier = multiplier || 1;

    var
      tmp = parseInt(s, 10) * multiplier,
      amount = Math.pow(10, precision);

    if (precision && _.isNumber(precision)) {
      tmp = Math.round(tmp * amount) / amount;
    }

    if (displayedPrefixMultiplier) {
      tmp = tmp+displayedPrefixMultiplier;
    }

    return tmp;
  },
  getMultiplierByPrefix: function (prefix) {
    var
      prefixMultipliers = DFHelper.getPrefixMultipliers();

    var
      defaultPrefix = 'KiB',
      defaultMultiplier = 1024,

      multiplier = 1;

    // prefixes are case insensitive
    prefix = (prefix || defaultPrefix).toLowerCase();

    // invalid prefix multipliers are ignored
    if ( ! prefixMultipliers[prefix]) { prefix = defaultPrefix; }

    // df outputs sizes in KiB
    // nothing to do
    if (prefix === defaultPrefix) { return multiplier; }

    // convert to bytes then convert to unit of choice
    multiplier = defaultMultiplier / prefixMultipliers[prefix];

    return multiplier;
  },
  getPrefixMultipliers: function () {

    if (DFHelper._prefixMultipliers) { return DFHelper._prefixMultipliers; }

    var
      pow2 = DFHelper._pow2,
      pow10 = DFHelper._pow10;

    DFHelper._prefixMultipliers = {
      'kib': pow2(10), 'mib': pow2(20), 'gib': pow2(30), 'tib': pow2(40),
      'pib': pow2(50), 'eib': pow2(60), 'zib': pow2(70), 'yib': pow2(80),

      'kb': pow10(3), 'mb': pow10(6), 'gb': pow10(9), 'tb': pow10(12),
      'pb': pow10(15), 'eb': pow10(18), 'zb': pow10(21), 'yb': pow10(24),
    };

    return DFHelper._prefixMultipliers;
  },
  _pow2: function (exponent) {
    return Math.pow(2, exponent);
  },
  _pow10: function (exponent) {
    return Math.pow(10, exponent);
  },
  _prefixMultipliers: null
});

module.exports = DFHelper;