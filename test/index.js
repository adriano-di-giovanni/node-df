'use strict';

var
  assert = require('assert');

var
  _ = require('underscore');

var
  df = require('../lib/df');

describe('df', function () {
  it('! options', function (done) {
    df(function (error, response) {
      if (error) { return done(error); }

      assert.equal(_.isObject(response), true);

      console.log(JSON.stringify(response, null, 2));

      done();
    });
  });

  it('options', function (done) {
    var
      options = {
        file: '/',
        prefixMultiplier: 'GB',
        isDisplayPrefixMultiplier: true,
        precision: 2
      };

    df(options, function (error, response) {
      if (error) { return done(error); }

      assert.equal(_.isObject(response), true);

      console.log(JSON.stringify(response, null, 2));

      done();
    });
  });
});