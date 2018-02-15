var async = require('async')
var df = require('../lib')

it('should be a function', function() {
    expect(typeof df).toBe('function')
})

it("should accept a 'callback' function as first argument", function(done) {
    expect(function() {
        df(done)
    }).not.toThrow()
})

it("should accept an 'options' object as first argument", function(done) {
    expect(function() {
        df({}, done)
    }).not.toThrow()
})

// TODO: should throw
// Breaking change to be made after releasing 0.1.4
it('should fallback to default options if arguments are missing', function() {
    expect(function() {
        df()
    }).not.toThrow()
})

// TODO: should throw
// Breaking change to be made after releasing 0.1.4
it('should fallback to default options if first argument is not an object', function() {
    expect(function() {
        df(true)
    }).not.toThrow()
})

it('should return an array of objects', function(done) {
    df(function(err, entries) {
        if (err) {
            done(err)
            return
        }

        expect(Array.isArray(entries)).toBe(true)
        entries.forEach(function(entry) {
            expect(entry).toEqual(
                expect.objectContaining({
                    filesystem: expect.any(String),
                    size: expect.any(Number),
                    used: expect.any(Number),
                    available: expect.any(Number),
                    capacity: expect.any(Number),
                    mount: expect.any(String),
                })
            )
        })

        done()
    })
})

// TODO: isDisplayPrefixMultiplier should be considered even if prefixMultiplier is not
// specificied because the default prefixMultiplier is KiB
it("should ignore 'isDisplayPrefixMultiplier' if 'prefixMultiplier' is not specified", function(done) {
    var options = {
        isDisplayPrefixMultiplier: true,
    }

    df(options, function(err, entries) {
        if (err) {
            done(err)
            return
        }

        expect(Array.isArray(entries)).toBe(true)
        entries.forEach(function(entry) {
            expect(entry).toEqual(
                expect.objectContaining({
                    filesystem: expect.any(String),
                    size: expect.any(Number),
                    used: expect.any(Number),
                    available: expect.any(Number),
                    capacity: expect.any(Number),
                    mount: expect.any(String),
                })
            )
        })

        done()
    })
})

it('should display prefix multiplier', function(done) {
    var options = {
        // NOTE: isDisplayPrefixMultiplier is ignored if prefiMultiplier is not specified
        // TODO: isDisplayPrefixMultiplier should be considered even if prefixMultiplier is not
        // specificied because the default prefixMultiplier is KiB
        prefixMultiplier: 'KiB',
        isDisplayPrefixMultiplier: true,
    }
    df(options, function(err, entries) {
        if (err) {
            done(err)
            return
        }

        entries.forEach(function(entry) {
            expect(entry).toEqual(
                expect.objectContaining({
                    size: expect.any(String),
                    used: expect.any(String),
                    available: expect.any(String),
                })
            )

            expect(entry).toEqual(
                expect.objectContaining({
                    size: expect.stringMatching(/KiB$/),
                    used: expect.stringMatching(/KiB$/),
                    available: expect.stringMatching(/KiB$/),
                })
            )
        })

        done()
    })
})

// TODO: should invoke callback with `err`
// It's a breaking change to be made after releasing 0.1.4
it("should throw if 'prefixMultiplier' is not a string", function() {
    expect(function() {
        var options = {
            prefixMultiplier: true,
        }
        df(options)
    })
})

// TODO: should invoke callback with `err`
// It's a breaking change to be made after releasing 0.1.4
it("should ignore 'prefixMultiplier' if it is not a valid one", function(done) {
    var options = {
        prefixMultiplier: 'invalid',
    }
    df(options, function(err, entries) {
        if (err) {
            done(err)
            return
        }

        expect(Array.isArray(entries)).toBe(true)
        entries.forEach(function(entry) {
            expect(entry).toEqual(
                expect.objectContaining({
                    filesystem: expect.any(String),
                    size: expect.any(Number),
                    used: expect.any(Number),
                    available: expect.any(Number),
                    capacity: expect.any(Number),
                    mount: expect.any(String),
                })
            )
        })

        done()
    })
})

// TODO: should fail
// It's a breaking change to be made after releasing 0.1.4
it("should ignore 'precision' if it is not a number", function(done) {
    async.series(
        [
            function(callback) {
                df({ prefixMultiplier: 'MiB' }, callback)
            },
            function(callback) {
                df({ prefixMultiplier: 'MiB', precision: '2' }, callback)
            },
        ],
        function(err, results) {
            if (err) {
                done(err)
                return
            }

            expect(results[0]).toEqual(results[1])

            done()
        }
    )
})

it('should use given prefix multiplier', function(done) {
    async.series(
        {
            kibEntries: df,
            mibEntries: function(callback) {
                df({ prefixMultiplier: 'MiB' }, callback)
            },
        },
        function(err, results) {
            if (err) {
                done(err)
                return
            }

            var kibEntries = results.kibEntries
            var mibEntries = results.mibEntries

            kibEntries.forEach(function(kibEntry, index) {
                var mibEntry = mibEntries[index]
                expect(kibEntry.filesystem).toBe(mibEntry.filesystem)

                expect(typeof kibEntry.size).toBe('number')
                expect(typeof mibEntry.size).toBe('number')
                if (kibEntry.size > 0) {
                    expect(kibEntry.size / mibEntry.size).toBe(1024)
                }

                expect(typeof kibEntry.used).toBe('number')
                expect(typeof mibEntry.used).toBe('number')
                if (kibEntry.used > 0) {
                    expect(kibEntry.used / mibEntry.used).toBe(1024)
                }

                expect(typeof kibEntry.available).toBe('number')
                expect(typeof mibEntry.available).toBe('number')
                if (kibEntry.available > 0) {
                    expect(kibEntry.available / mibEntry.available).toBe(1024)
                }
            })

            done()
        }
    )
})

it('should use given precision', function(done) {
    var options = {
        prefixMultiplier: 'MiB',
        precision: 0,
    }

    df(options, function(err, entries) {
        if (err) {
            done(err)
            return
        }

        entries.forEach(function(entry) {
            expect(typeof entry.size).toBe('number')
            expect(Math.floor(entry.size)).toEqual(entry.size)

            expect(typeof entry.used).toBe('number')
            expect(Math.floor(entry.used)).toEqual(entry.used)

            expect(typeof entry.available).toBe('number')
            expect(Math.floor(entry.available)).toEqual(entry.available)
        })

        done()
    })
})

it('should use given precision when prefix multiplier is displayed', function(done) {
    var options = {
        prefixMultiplier: 'MiB',
        isDisplayPrefixMultiplier: true,
        precision: 2,
    }

    df(options, function(err, entries) {
        if (err) {
            done(err)
            return
        }

        entries.forEach(function(entry) {
            expect(entry.size).toMatch(/\.\d{2}MiB/)
            expect(entry.used).toMatch(/\.\d{2}MiB/)
            expect(entry.available).toMatch(/\.\d{2}MiB/)
        })

        done()
    })
})

// TODO: change behavior and make df fail
// It's a breaking change to be made after releasing 0.1.4
it('should ignore invalid prefix multiplier and fallback to KiB', function(done) {
    async.series(
        [
            df,
            function(callback) {
                df({ prefixMultiplier: 'invalid' }, callback)
            },
        ],
        function(err, results) {
            if (err) {
                done(err)
                return
            }

            expect(results[0]).toEqual(results[1])

            done()
        }
    )
})

it('should return info about the filesystem containing the specified file', function(done) {
    var options = {
        file: '/',
    }

    df(options, function(err, entries) {
        if (err) {
            done(err)
            return
        }

        expect(Array.isArray(entries)).toBe(true)
        expect(entries.length).toBe(1)

        done()
    })
})

it("should fail if file doesn't exist", function(done) {
    var options = {
        file: '?',
    }
    df(options, function(err) {
        expect(err).toBeDefined()
        expect(err.message).toMatch(/No such file or directory/)
        done()
    })
})
