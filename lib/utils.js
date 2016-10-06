var config;
var esSystems;

module.exports = {
  readFile: function (src) {
    var fs = require('fs');

    return new Promise(function (resolve, reject) {
      fs.readFile(src, {'encoding': 'utf8'}, function (err, data) {
        if(err) return reject(err);
        resolve(data);
      });
    });
  },

  writeFile: function (src, data) {
    var fs = require('fs');

    return new Promise(function (resolve, reject) {
      fs.writeFile(src, data, {'encoding': 'utf8'}, function (err, data) {
        if(err) return reject(err);
        resolve(data);
      });
    });
  },

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
      var dev = require('../config/development.js') || {};

      config = this.extend(prod, dev);
    }

    return config;
  },

  getDirectories: function (srcpath) {
    var fs = require('fs');
    var path = require('path');

    return fs.readdirSync(srcpath).filter(function (file) {
      return fs.statSync(path.join(srcpath, file)).isDirectory();
    });
  },

  getRoms: function (name) {
    var fs = require('fs');
    var path = require('path');
    var srcpath = path.join(this.getConfig().recalbox.romsPath, name);
    var romExtensions = this.findSystemRomsExtensions(name);

    return fs.readdirSync(srcpath).filter(function (file) {
      return fs.statSync(path.join(srcpath, file)).isFile() && -1 !== romExtensions.indexOf(path.extname(file));
    });
  },

  findSystemFullname: function (name) {
    this._setESSystems();

    return esSystems[name] ? esSystems[name].fullname : null;
  },

  findSystemRomsExtensions: function (name) {
    this._setESSystems();

    return esSystems[name] ? esSystems[name].extensions : [];
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
