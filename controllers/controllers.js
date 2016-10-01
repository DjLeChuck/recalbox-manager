module.exports = {
  index: function *() {
    var config = require('../config');
    var api = require('../api');

    this.state.curDb9 = yield api.get('/controllers/db9');
    this.state.curGamecon = yield api.get('/controllers/gamecon');
    this.state.curGpio = yield api.get('/controllers/gpio');
    this.state.curPs3 = yield api.get('/controllers/ps3');
    this.state.curXboxdrv = yield api.get('/controllers/xboxdrv');

    this.state.ps3drivers = config.recalbox.controllers.ps3drivers;

    yield this.render('controllers');
  },
  save: function *() {
    var api = require('../api');
    var post = this.request.body;
    var requests = [];

    // Prepare requests
    Object.keys(post).forEach(function (key) {
      var val = post[key];
      val = Array.isArray(val) ? val[val.length - 1] : val;

      // Traitement des champs de type tableau name[key]
      if (typeof val === 'object') {
        Object.keys(val).forEach(function (subkey) {
          var subval = val[subkey];
          subval = Array.isArray(subval) ? subval[subval.length - 1] : subval;

          requests.push({ url: '/controllers/' + key + '/' + subkey, body: subval });
        });
      } else {
        requests.push({ url: '/controllers/' + key, body: val });
      }
    });

    // Execute requests
    for (var i = 0; i < requests.length; i++) {
      yield api.put(requests[i]);
    }

    this.redirect('back');
  }
};
