module.exports = {
  index: function *() {
    this.state.audio = {
      volume: this.state.api.load('audio.volume'),
      device: this.state.api.load('audio.device'),
      bgmusic: this.state.api.load('audio.bgmusic')
    };
    this.state.devices = this.state.config.recalbox.audio.devices;

    this.state.activePage = 'audio';

    this.state.flash = this.flash;

    yield this.render('audio');
  },
  save: function *() {
    var post = this.request.fields;
    var api = this.state.api;

    // Save values
    Object.keys(post).forEach(function (key) {
      var val = post[key];
      val = Array.isArray(val) ? val[val.length - 1] : val;

      api.save(key, val);
    });

    // Set volume
    require('child_process').execSync(this.state.config.recalbox.configScript + " volume " + post['audio.volume']);

    this.flash = { success: 'La configuration a bien été sauvegardée.' };

    this.redirect('back');
  }
};
