module.exports = {
  index: function *() {
    this.state.curDb9 = yield this.state.api.get('/controllers/db9');
    this.state.curGamecon = yield this.state.api.get('/controllers/gamecon');
    this.state.curGpio = yield this.state.api.get('/controllers/gpio');
    this.state.curPs3 = yield this.state.api.get('/controllers/ps3');
    this.state.curXboxdrv = yield this.state.api.get('/controllers/xboxdrv');

    this.state.ps3drivers = this.state.config.recalbox.controllers.ps3drivers;

    this.state.activePage = 'controllers';

    this.state.flash = this.flash;

    yield this.render('controllers');
  },
  save: function *() {
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
      yield this.state.api.put(requests[i]);
    }

    this.flash = { success: 'La configuration a bien été sauvegardée.' };

    this.redirect('back');
  }
};
