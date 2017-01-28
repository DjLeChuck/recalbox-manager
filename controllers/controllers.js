module.exports = {
  index: function *() {
    this.state.db9 = {
      enabled: this.state.api.load('controllers.db9.enabled'),
      args: this.state.api.load('controllers.db9.args'),
    };
    this.state.gamecon = {
      enabled: this.state.api.load('controllers.gamecon.enabled'),
      args: this.state.api.load('controllers.gamecon.args'),
    };
    this.state.gpio = {
      enabled: this.state.api.load('controllers.gpio.enabled'),
      args: this.state.api.load('controllers.gpio.args'),
    };
    this.state.ps3 = {
      enabled: this.state.api.load('controllers.ps3.enabled'),
      driver: this.state.api.load('controllers.ps3.driver'),
    };
    this.state.xboxdrv = {
      enabled: this.state.api.load('controllers.xboxdrv.enabled'),
      nbcontrols: this.state.api.load('controllers.xboxdrv.nbcontrols'),
    };

    this.state.ps3drivers = this.state.config.recalbox.controllers.ps3drivers;

    this.state.activePage = 'controllers';

    this.state.flash = this.flash;

    yield this.render('controllers');
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
