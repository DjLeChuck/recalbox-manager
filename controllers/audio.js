module.exports = {
  index: function *() {
    this.state.audio = yield this.state.api.get('/audio');
    this.state.devices = this.state.config.recalbox.audio.devices;

    this.state.activePage = 'audio';

    this.state.flash = this.flash;

    yield this.render('audio');
  },
  save: function *() {
    var post = this.request.fields;
    var requests = [];

    // Prepare requests
    Object.keys(post).forEach(function (key) {
      var val = post[key];
      val = Array.isArray(val) ? val[val.length - 1] : val;

      requests.push({ url: '/audio/' + key, body: val });
    });

    // Execute requests
    for (var i = 0; i < requests.length; i++) {
      yield this.state.api.put(requests[i]);
    }

    // Set volume
    require('child_process').execSync(this.state.config.recalbox.configScript + " volume " + post.volume);

    this.flash = { success: 'La configuration a bien été sauvegardée.' };

    this.redirect('back');
  }
};
