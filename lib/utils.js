'use strict';
// From loopback
// https://github.com/strongloop/loopback/blob/77a35231dc0e8a480feb5b8e9e48429ab5bdd037/lib/utils.js#L16
exports.createPromiseCallback = function createPromiseCallback() {
    var cb = null;
    var promise = new Promise(function(resolve, reject) {
        cb = function(err, data) {
            if (err) {
                return reject(err);
            }
            return resolve(data);
        };
    });
    cb.promise = promise;
    return cb;
};
