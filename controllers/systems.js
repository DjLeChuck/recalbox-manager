module.exports = {
  index: function *() {
    // En attente de pouvoir l'exécuter sur le Pi directement
    /*var exec = require('child_process').exec;

    function puts(error, stdout, stderr) {
      sys.puts(stdout);
    }

    exec('tvservice -m CEA', function (error, stdout, stderr) {
      if (!error) {
        // things worked!
      }
    });*/

    this.state.systems = yield this.state.api.get('/systems/default');

    this.state.ratio = this.state.config.recalbox.systems.ratio;
    this.state.shaderset = this.state.config.recalbox.systems.shaderset;

    this.state.activePage = 'systems';

    this.state.flash = this.flash;

    yield this.render('systems');
  },
  save: function *() {
    var post = this.request.body;
    var requests = [];

    // Prepare requests
    Object.keys(post).forEach(function (key) {
      var val = post[key];
      val = Array.isArray(val) ? val[val.length - 1] : val;

      requests.push({ url: '/systems/default/' + key, body: val });
    });

    // Execute requests
    for (var i = 0; i < requests.length; i++) {
      yield this.state.api.put(requests[i]);
    }

    this.flash = { success: 'La configuration a bien été sauvegardée.' };

    this.redirect('back');
  }
};
