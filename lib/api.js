module.exports = function () {
  var request = require('co-request');
  var config = require('./utils').getConfig();

  return {
    get: function *(url) {
      var res = yield request.get('http://' + config.recalbox.ip + ':' + config.recalbox.port + url);

      return JSON.parse(res.body);
    },

    put: function *(options) {
      yield request.put({
        url: 'http://' + config.recalbox.ip + ':' + config.recalbox.port + options.url,
        body: options.body
      });
    },

    post: function *(url) {
      yield request.post('http://' + config.recalbox.ip + ':' + config.recalbox.port + url);
    }
  };
};
