module.exports = {
  index: function *() {
    this.state.system = {
      kblayout: this.state.api.load('system.kblayout'),
      language: this.state.api.load('system.language'),
      hostname: this.state.api.load('system.hostname'),
      timezone: this.state.api.load('system.timezone'),
      api: {
        enabled: this.state.api.load('system.api.enabled'),
      },
      es: {
        menu: this.state.api.load('system.es.menu'),
      },
      emulators: {
        specialkeys: this.state.api.load('system.emulators.specialkeys'),
      },
    };
    this.state.wifi = {
      enabled: this.state.api.load('wifi.enabled'),
      ssid: this.state.api.load('wifi.ssid'),
      key: this.state.api.load('wifi.key'),
    };
    this.state.kodi = {
      enabled: this.state.api.load('kodi.enabled'),
      atstartup: this.state.api.load('kodi.atstartup'),
      xbutton: this.state.api.load('kodi.xbutton'),
    };
    this.state.updates = {
      enabled: this.state.api.load('updates.enabled'),
      type: this.state.api.load('updates.type'),
    };

    this.state.keyboardlayouts = this.state.config.recalbox.configuration.keyboardlayouts;
    this.state.systemlocales = this.state.config.recalbox.configuration.systemlocales;
    this.state.timezones = this.state.config.recalbox.configuration.timezones;
    this.state.updatesTypes = this.state.config.recalbox.configuration.updatesTypes;
    this.state.esMenus = this.state.config.recalbox.configuration.esMenus;
    this.state.emulatorsSpecialkeys = this.state.config.recalbox.configuration.emulatorsSpecialkeys;

    this.state.activePage = 'configuration';

    this.state.flash = this.flash;

    yield this.render('configuration');
  },

  save: function *() {
    var utils = require('../lib/utils');

    utils.handleRecalboxConfigUpdate(this.request.fields, this.state.api);

    this.flash = { success: this.state.gt.gettext('La configuration a bien été sauvegardée.') };

    this.redirect('back');
  }
};
