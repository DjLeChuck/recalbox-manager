module.exports = {
  index: function * () {
    this.state.recalboxConf = {
      path: this.state.config.recalbox.confPath,
      content: yield require('../lib/utils').readFile(this.state.config.recalbox.confPath)
    };

    this.state.activePage = 'recalbox-conf';

    this.state.flash = this.flash;

    yield this.render('recalbox-conf');
  },

  save: function * () {
    yield require('../lib/utils').writeFile(this.state.config.recalbox.confPath, this.request.body.recalbox_conf);

    this.flash = { success: 'Le fichier a bien été sauvegardé.' };

    this.redirect('back');
  }
};