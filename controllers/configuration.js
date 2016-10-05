module.exports = {
  index: function *() {
    this.state.curKeyboardlayout = yield this.state.api.get('/keyboardlayout');
    this.state.curLocale = yield this.state.api.get('/locale');
    this.state.curHostname = yield this.state.api.get('/hostname');
    this.state.curTimezone = yield this.state.api.get('/timezone');
    this.state.wifi = yield this.state.api.get('/wifi');
    this.state.kodi = yield this.state.api.get('/kodi');
    this.state.updates = yield this.state.api.get('/updates/enabled');

    this.state.keyboardlayouts = this.state.config.recalbox.configuration.keyboardlayouts;
    this.state.systemlocales = this.state.config.recalbox.configuration.systemlocales;
    this.state.timezones = this.state.config.recalbox.configuration.timezones;

    this.state.activePage = 'configuration';

    this.state.flash = this.flash;

    yield this.render('configuration');
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

          requests.push({ url: '/' + key + '/' + subkey, body: subval });
        });
      } else {
        requests.push({ url: '/' + key, body: val });
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
