var config;
var esSystems;

module.exports = {
  extend: function (target, source) {
    target = target || {};

    for (var prop in source) {
      if (typeof source[prop] === 'object') {
        target[prop] = this.extend(target[prop], source[prop]);
      } else {
        target[prop] = source[prop];
      }
    }

    return target;
  },

  getConfig: function (i18n) {
    if (undefined === config) {
      var prod = require('../config/production.js')(i18n);
      var dev = {};

      try {
        dev = require('../config/development.js');
      } catch (e) {}

      config = this.extend(prod, dev);
    }

    return config;
  },

  getDirectories: function (srcpath, excluded) {
    var fs = require('fs');
    var path = require('path');
    excluded = undefined !== excluded ? excluded : [];

    return fs.readdirSync(srcpath).filter(function (file) {
      return -1 === excluded.indexOf(file) && fs.statSync(path.join(srcpath, file)).isDirectory();
    });
  },

  getRoms: function (name, subpath) {
    var fs = require('fs');
    var path = require('path');
    var srcpath = path.join(this.getConfig().recalbox.romsPath, name, subpath || '');
    var romExtensions = this.getSystemRomsExtensions(name);

    return fs.readdirSync(srcpath).filter(function (file) {
      return fs.statSync(path.join(srcpath, file)).isFile() && -1 !== romExtensions.indexOf(path.extname(file));
    });
  },

  getSystemFullname: function (name) {
    this._setESSystems();

    return esSystems[name] ? esSystems[name].fullname : null;
  },

  getSystemRomsExtensions: function (name) {
    this._setESSystems();

    return esSystems[name] ? esSystems[name].extensions : [];
  },

  getSystemRomsBasePath: function (name) {
    return require('path').join(this.getConfig().recalbox.romsPath, name)
  },

  getSystemGamelist: function (name) {
    var fs = require('fs');
    var xml2js = require('xml2js');
    var parser = new xml2js.Parser({
      trim: true,
      explicitArray: false
    });
    var romsBasePath = this.getSystemRomsBasePath(name);

    var error = null;
    var json = null;

    parser.parseString(fs.readFileSync(require('path').join(romsBasePath, 'gamelist.xml')), function (innerError, innerJson) {
      error = innerError;
      json = innerJson;
    });

    if (error) {
      throw error;
    }

    if (!error && !json) {
      throw new Error('The callback was suddenly async or something.');
    }

    var list = {};
    var gameList = json.gameList.game || [];

    for (var i = 0; i < gameList.length; i++) {
      var game = json.gameList.game[i];

      list[game.path.substring(2)] = game;
    }

    return list;
  },

  formatGameReleaseDate: function (releaseDate) {
    var year = releaseDate.substring(0, 4);
    var month = releaseDate.substring(4, 6);
    var day = releaseDate.substring(6, 8);

    if ('' !== day) {
      return day + "/" + month + "/" + year;
    }

    if ('' !== month) {
      return day + "/" + month;
    }

    return year;
  },

  _setESSystems: function () {
    // Parse des systèmes d'ES
    if (undefined === esSystems) {
      var fs = require('fs');
      var xml2js = require('xml2js');
      var parser = new xml2js.Parser({
        trim: true,
        explicitArray: false
      });

      parser.parseString(fs.readFileSync(this.getConfig().recalbox.esSystemsCfgPath), function (err, result) {
        esSystems = [];

        for (var i = 0; i < result.systemList.system.length; i++) {
          var system = result.systemList.system[i];

          esSystems[system.name] = {
            name: system.name,
            fullname: system.fullname,
            path: system.path,
            extensions: system.extension ? system.extension.split(' ') : [],
            launchCommand: system.command
          };
        }
      });
    }
  }
}
