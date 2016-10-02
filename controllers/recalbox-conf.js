module.exports = {
  index: function * () {
    this.state.recalboxConf = {
      path: this.state.config.recalbox.confPath,
      content: yield require('../lib/utils').readFile(this.state.config.recalbox.confPath)
    };

    this.state.activePage = 'recalbox-conf';

    yield this.render('recalbox-conf');
  },

  save: function * () {
    yield require('../lib/utils').writeFile(this.state.config.recalbox.confPath, this.request.body.recalbox_conf);

    this.redirect('back');
  }
};
