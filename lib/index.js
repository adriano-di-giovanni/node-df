var exec = require('child_process').exec
var parse = require('./parse')
var utils = require('./utils')

module.exports = function df(aOptions, aCallback) {
    var options
    var callback

    if (!aCallback && !aOptions) { // df()
        callback = utils.createPromiseCallback()
        options = {}
    } else if (!aCallback && typeof aOptions === 'function') { // df(cb)
        callback = aOptions
        options = {}
    } else if (!aCallback && typeof aOptions !== 'function') {// cb(options)
        callback = utils.createPromiseCallback()
        options = aOptions
    } else {// df(options, cb)
        callback = aCallback
        options = aOptions
    }

    // TODO: should validate options and merge with defaults
    // It's a breaking change to be made after releasing 0.1.4

    // TODO: should throw if prefixMultiplier is not a string
    // It should invoke callback with `err` but it's a breaking change

    // TODO: should fail if unit is not a string

    var command = 'df -kP'
    if (options.file) {
        command += ' ' + options.file
    }

    exec(command, function(err, stdout, stderr) {
        if (err) {
            callback(err)
            return
        }

        if (stderr) {
            callback(new Error(err))
            return
        }

        var entries = parse(stdout, options)

        callback(null, entries)
    })
}
