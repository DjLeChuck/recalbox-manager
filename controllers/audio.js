module.exports = {
  index: function *() {
    var config = require('../config');
    var api = require('../api');

    this.state.audio = yield api.get('/audio');
    this.state.devices = config.recalbox.audio.devices;

    this.state.activePage = 'audio';

    yield this.render('audio');
  },
  save: function *() {
    var api = require('../api');
    var post = this.request.body;
    var requests = [];

    // Prepare requests
    Object.keys(post).forEach(function (key) {
      var val = post[key];
      val = Array.isArray(val) ? val[val.length - 1] : val;

      requests.push({ url: '/audio/' + key, body: val });
    });

    // Execute requests
    for (var i = 0; i < requests.length; i++) {
      yield api.put(requests[i]);
    }

    this.redirect('back');
  }
};
