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
    var prod = require('../config/production.js')(i18n);
    var dev = require('../config/development.js') || {};

    return this.extend(prod, dev);
  },

  getDirectories: function (srcpath) {
    var fs = require('fs');
    var path = require('path');

    return fs.readdirSync(srcpath).filter(function (file) {
      return fs.statSync(path.join(srcpath, file)).isDirectory();
    });
  }
}
