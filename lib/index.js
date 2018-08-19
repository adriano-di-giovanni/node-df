var exec = require('child_process').exec
var utils = require('./utils')
var parsePosix = require('./parse-posix')
var parseWin = require('./parse-win')
var path = require('path')

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
    var command = null;
    var isWin = process.platform === 'win32'
    var file = options.file
    if (isWin) {
        var disk = null
        command = 'wmic LOGICALDISK '
        if (file) {
            file = path.win32.normalize(file)
            disk = path.parse(file).root.slice(0, -1)
            command += disk
        } else {
            command += ' where "DRIVETYPE=3 or DRIVETYPE=4"'
        }
        command += ' get name, filesystem, size, freespace'
    } else {
        var command = 'df -kP'
        if (file) {
            command += ' ' + file
        }
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

        var entries = null;
        if (isWin) {
            entries = parseWin(stdout, options)
        } else {
            entries = parsePosix(stdout, options)
        }

        callback(null, entries)
    })
}
