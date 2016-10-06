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

    delete: function *(url) {
      var res = yield request.del('http://' + config.ip + ':' + config.port + url);

      return res;
    },

    post: function *(url, data, raw) {
      raw = undefined !== typeof raw ? raw : false;
      var options = raw ? { body: data } : { form: data };

      yield request.post('http://' + config.ip + ':' + config.port + url, options);
    }
  };
};
