module.exports = {
  index: function *() {
    var config = require('../config');
    var api = require('../lib/api');

    this.state.curKeyboardlayout = yield api.get('/keyboardlayout');
    this.state.curLocale = yield api.get('/locale');
    this.state.curHostname = yield api.get('/hostname');
    this.state.curTimezone = yield api.get('/timezone');
    this.state.wifi = yield api.get('/wifi');
    this.state.kodi = yield api.get('/kodi');
    this.state.updates = yield api.get('/updates/enabled');

    this.state.keyboardlayouts = config.recalbox.configuration.keyboardlayouts;
    this.state.systemlocales = config.recalbox.configuration.systemlocales;
    this.state.timezones = config.recalbox.configuration.timezones;

    this.state.activePage = 'configuration';

    yield this.render('configuration');
  },
  save: function *() {
    var api = require('../api');
    var post = this.request.body;
    var requests = [];

    // Gestion du redémarrage / arrêt
    if (undefined !== post.shutdown) {
      switch (post.shutdown) {
        case 'reboot':
          // @todo Wait for reboot. The manager will be unreachable for a while.
          yield api.post('/reboots');
          break;
        case 'halt':
          // @todo What to do? The manager will become unreachable.
          yield api.post('/shutdowns');
          break;
        default:
          this.throw('Unknown shutdown action.');
      }
    }

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
      yield api.put(requests[i]);
    }

    this.redirect('back');
  }
};
