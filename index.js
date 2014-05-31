'use strict';

var
  exec = require('child_process').exec;

var
  _ = require('underscore');

exec('df -kP', function (error, stdout) {

  if (error) { return; }

  var
    // split stdout into lines, strip column headers away
    lines = stdout.trim().split(/\r|\n|\r\n/).slice(1),

    output = _.map(lines, function (line) {
      var
        values = line
          .replace(/(\s+)(\d+)/g, function (match, p1, p2) { return '\t'+p2; })
          .replace(/\s+/g, '\t')
          .split(/\t/);

        return {
          filesystem: values[0],
          size: values[1],
          used: values[2],
          available: values[3],
          capacity: values[4],
          mountedOn: values[5]
        };
    });

    console.log(output);
});