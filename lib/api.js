var api = {};
var request = require('co-request');
var config = require('../config');

api.get = function *(url) {
  var res = yield request.get('http://' + config.recalbox.ip + ':' + config.recalbox.port + url);

  return JSON.parse(res.body);
};

api.put = function *(options) {
  yield request.put({
    url: 'http://' + config.recalbox.ip + ':' + config.recalbox.port + options.url,
    body: options.body
  });
};

api.post = function *(url) {
  yield request.post('http://' + config.recalbox.ip + ':' + config.recalbox.port + url);
};

module.exports = api;
