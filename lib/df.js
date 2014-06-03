'use strict';

(function (exec, _) {

  var
    prefixMultipliers = (function (pow) {

      function pow2(exponent) { return pow(2, exponent); }
      function pow10(exponent) { return pow(10, exponent); }

      return {
        'kib': pow2(10), 'mib': pow2(20), 'gib': pow2(30), 'tib': pow2(40),
        'pib': pow2(50), 'eib': pow2(60), 'zib': pow2(70), 'yib': pow2(80),

        'kb': pow10(3), 'mb': pow10(6), 'gb': pow10(9), 'tb': pow10(12),
        'pb': pow10(15), 'eb': pow10(18), 'zb': pow10(21), 'yb': pow10(24),
      };
    }(Math.pow));

  function _getMultiplierByPrefix(prefix) {

    var
      defaultPrefix = 'KiB',
      multiplier = 1;

    // prefixes are case insensitive
    prefix = (prefix || defaultPrefix).toLowerCase();

    // invalid prefix multipliers are ignored
    if ( ! prefixMultipliers[prefix]) { prefix = defaultPrefix; }

    // df outputs sizes in KiB
    // nothing to do
    if (prefix === defaultPrefix) { return multiplier; }

    // convert to bytes then convert to unit of choice
    multiplier = 1024 / prefixMultipliers[prefix];

    return multiplier;
  }

  // default callback
  function _noop() {}

  function _formatter(s, multiplier, precision, displayedPrefixMultiplier) {
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
  }

  function df(options, callback) {
    var
      baseCmd = 'df -kP';

    if ( ! _.isFunction(callback)) {
      callback = _.isFunction(options) ? options : _noop;
    }

    if (_.isFunction(options) || ! _.isObject(options)) {
      options = {};
    }

    var
      cmd = options.file ? baseCmd+' '+options.file : baseCmd,
      multiplier = _getMultiplierByPrefix(options.prefixMultiplier),
      isDisplayPrefixMultiplier =  !! options.isDisplayPrefixMultiplier,
      displayedPrefixMultiplier = isDisplayPrefixMultiplier ? options.prefixMultiplier : null;

    exec(cmd, function (error, stdout, stderr) {

      if (error) { return callback(error); }

      if (stderr) {
        return callback(new Error(stderr));
      }

      var
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
                size = _formatter(columns[1], multiplier, 2, 
                  displayedPrefixMultiplier),
                used = _formatter(columns[2], multiplier, 2, 
                  displayedPrefixMultiplier),
                available = _formatter(columns[3], multiplier, 2, 
                  displayedPrefixMultiplier),
                capacity = _formatter(columns[4], 0.01),
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

        callback(null, response);
    });
  }

  module.exports = df;

}(require('child_process').exec, require('underscore')));