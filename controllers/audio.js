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
    var utils = require('../lib/utils');
    var post = this.request.fields;

    utils.handleRecalboxConfigUpdate(post, this.state.api);

    // Set volume
    try {
      require('child_process').execSync(this.state.config.recalbox.configScript + " volume " + post['audio.volume']);
    } catch (error) {
      // TODO Add log system...
      //console.error(error);
    }

    this.flash = { success: this.state.gt.gettext('La configuration a bien été sauvegardée.') };

    this.redirect('back');
  }
};
