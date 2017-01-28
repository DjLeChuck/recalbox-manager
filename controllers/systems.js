module.exports = {
  index: function *() {
    // En attente de pouvoir l'exécuter sur le Pi directement
    //require('child_process').execSync('tvservice -m CEA').toString();

    this.state.global = {
      //videomode: this.state.api.load('global.videomode'),
      shaderset: this.state.api.load('global.shaderset'),
      integerscale: this.state.api.load('global.integerscale'),
      //shaders: this.state.api.load('global.shaders'),
      ratio: this.state.api.load('global.ratio'),
      smooth: this.state.api.load('global.smooth'),
      rewind: this.state.api.load('global.rewind'),
      autosave: this.state.api.load('global.autosave'),
      retroachievements: this.state.api.load('global.retroachievements'),
      "retroachievements.username": this.state.api.load('global.retroachievements.username'),
      "retroachievements.password": this.state.api.load('global.retroachievements.password'),
    };

    this.state.ratio = this.state.config.recalbox.systems.ratio;
    this.state.shaderset = this.state.config.recalbox.systems.shaderset;

    this.state.activePage = 'systems';

    this.state.flash = this.flash;

    this.state.retroAchievementsDesc = this.state.gt.gettext("RetroAchievements.org (%s) est un site communautaire qui permet de gagner des haut-faits sur mesure dans les jeux d'arcade grâce à l'émulation.");
    this.state.retroAchievementsDesc = this.state.retroAchievementsDesc.replace("%s", '<a href="http://retroachievements.org/">http://retroachievements.org/</a>');

    yield this.render('systems');
  },
  save: function *() {
    var post = this.request.fields;
    var api = this.state.api;

    // Set values
    Object.keys(post).forEach(function (key) {
      var val = post[key];
      val = Array.isArray(val) ? val[val.length - 1] : val;

      api.save(key, val);
    });

    this.flash = { success: this.state.gt.gettext('La configuration a bien été sauvegardée.') };

    this.redirect('back');
  }
};
