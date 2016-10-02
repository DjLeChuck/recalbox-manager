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

  getConfig: function () {
    var prod = require('../config/production.js');
    var dev = require('../config/development.js') || {};

    return this.extend(prod, dev);
  }
}
