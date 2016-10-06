module.exports = function () {
  var request = require('co-request');
  var config = require('./utils').getConfig().recalbox;

  return {
    get: function *(url) {
      var res = yield request.get('http://' + config.ip + ':' + config.port + url);

      return JSON.parse(res.body);
    },

    put: function *(options) {
      yield request.put({
        url: 'http://' + config.ip + ':' + config.port + options.url,
        body: options.body
      });
    },

    post: function *(url) {
      yield request.post('http://' + config.ip + ':' + config.port + url);
    }
  };
};
