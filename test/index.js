'use strict';

var
  assert = require('assert');

var
  _ = require('underscore');

var
  df = require('../lib/df');

describe('df', function () {
  it('should do the job', function (done) {
    df(function (error, response) {
      if (error) { return done(error); }

      assert.equal(_.isObject(response), true);

      console.log(JSON.stringify(response, null, 2));

      done();
    });
  });
});