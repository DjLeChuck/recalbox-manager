module.exports = {
  index: function * () {
    this.state.recalboxConf = {
      path: this.state.config.recalbox.confPath,
      content: require('fs').readFileSync(this.state.config.recalbox.confPath)
    };

    this.state.activePage = 'recalbox-conf';

    this.state.flash = this.flash;

    yield this.render('recalbox-conf');
  },

  save: function * () {
    require('fs').writeFileSync(this.state.config.recalbox.confPath, this.request.fields.recalbox_conf);

    this.flash = { success: this.i18n.__('Le fichier a bien été sauvegardé.') };

    this.redirect('back');
  }
};
