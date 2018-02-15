# df

[![Build Status](https://travis-ci.org/adriano-di-giovanni/node-df.svg?branch=master)](https://travis-ci.org/adriano-di-giovanni/node-df)

`node-df` (abbreviation of **d**isk **f**ree) is a cross-platform Node.js wrapper around the standard Unix computer program, [df](http://en.wikipedia.org/wiki/Df_(Unix)).

## Installation

```
$ npm install node-df
```

## Usage

### Basic

```javascript
var
    df = require('node-df');

df(function (error, response) {
    if (error) { throw error; }

    console.log(JSON.stringify(response, null, 2));
});
```

Output from `df` looks like this:

```json
[
  {
    "filesystem": "/dev/disk0s2",
    "size": 487546976,
    "used": 164493356,
    "available": 322797620,
    "capacity": 0.34,
    "mount": "/"
  },
  {
    "filesystem": "devfs",
    "size": 186,
    "used": 186,
    "available": 0,
    "capacity": 1,
    "mount": "/dev"
  },
  {
    "filesystem": "map -hosts",
    "size": 0,
    "used": 0,
    "available": 0,
    "capacity": 1,
    "mount": "/net"
  },
  {
    "filesystem": "map auto_home",
    "size": 0,
    "used": 0,
    "available": 0,
    "capacity": 1,
    "mount": "/home"
  },
  {
    "filesystem": "localhost:/CPYpGwk1x_UGJYGx-93flp",
    "size": 487546976,
    "used": 487546976,
    "available": 0,
    "capacity": 1,
    "mount": "/Volumes/MobileBackups"
  }
]
```

Values for `size`, `used` and `available` are expressed in `KiB` (1024 bytes).

Value for `capacity` is a number between `0` and `1`. `capacity` is also known as `used%`

`node-df` correctly parsed output from `df` unix program for filesystems and mount folders with whitespaces in the name.

### Advanced

```
var
    options = {
        file: '/',
        prefixMultiplier: 'GB',
        isDisplayPrefixMultiplier: true,
        precision: 2
    };

df(options, function (error, response) {
    if (error) { throw error; }

    console.log(JSON.stringify(response, null, 2));
});
```

Output from `df` now looks like this:

```json
[
  {
    "filesystem": "/dev/disk0s2",
    "size": "499.25GB",
    "used": "168.44GB",
    "available": "330.54GB",
    "capacity": 0.34,
    "mount": "/"
  }
]
```

#### Options

* **file**: output the amount of free space of the file system containing the specified file;
* **prefixMultiplier**: convert `size`, `used` and `available` values from `KiB` to `MiB`, `GiB`, `PiB`, `EiB`, `ZiB`, `YiB`, `MB`, `GB`, `PB`, `EB`, `ZB`, `YB`;
* **isDisplayPrefixMultiplier**: if `true`, values for `size`, `used` and `available` are converted to strings and `prefixMultiplier` is displayed (see example above).
* **precision**: round `size`, `used` and `available` values to `precision` decimal digits.
