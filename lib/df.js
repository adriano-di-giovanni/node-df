'use strict';

(function (exec, _) {

  function noop() {}

  function _formatter(s, factor) {
    factor = factor || 1;
    return parseInt(s, 10) * factor;
  }

  function df(options, callback) {
    var
      cmd = 'df -kP';

    if ( ! _.isFunction(callback)) {
      callback = _.isFunction(options) ? options : noop;
    }

    if (_.isFunction(options) || ! _.isObject(options)) {
      options = {};
    }

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
                size = _formatter(columns[1]),
                used = _formatter(columns[2]),
                available = _formatter(columns[3]),
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