'use strict';

(function (DFHelper, exec, _) {

  function df(options, callback) {

    if ( ! _.isFunction(callback)) {
      callback = _.isFunction(options) ? options : DFHelper.noop;
    }

    if (_.isFunction(options) || ! _.isObject(options)) {
      options = {};
    }

    var
      baseCmd = 'df -kP',
      cmd = options.file ? baseCmd+' '+options.file : baseCmd;

    exec(cmd, function (error, stdout, stderr) {

      if (error) { return callback(error); }

      if (stderr) {
        return callback(new Error(stderr));
      }

      var
        response = DFHelper.parse(stdout, options);

        callback(null, response);
    });
  }

  df.Helper = DFHelper;

  module.exports = df;

}(
  require('./helpers/DFHelper'),
  require('child_process').exec,
  require('underscore')
  )
);