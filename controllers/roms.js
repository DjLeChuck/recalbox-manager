module.exports= {
  list: function * () {
    var utils = require('../lib/utils');
    var systems = [];

    // Dossiers de ROMs existants
    var currentSystems = utils.getDirectories(this.state.config.recalbox.romsPath);

    // Recherche des "noms complets"
    for (var i = 0; i < currentSystems.length; i++) {
      var fullname = utils.findSystemFullname(currentSystems[i]) || currentSystems[i];

      systems[i] = {
        name: currentSystems[i],
        fullname: fullname
      };
    }

    this.state.systems = systems;

    this.state.activePage = 'roms';

    yield this.render('roms-list');
  },

  view: function * (name) {
    var utils = require('../lib/utils');

    this.state.fullname = utils.findSystemFullname(name) || name;

    var list = [];
    var romsList = utils.getRoms(name);

    for (var i = 0; i < romsList.length; i++) {
      list[i] = {
        fullname: romsList[i],
      };
    }

    this.state.roms = {
      path: require('path').join(this.state.config.recalbox.romsPath, name),
      list: list
    };

    this.state.activePage = 'roms';

    yield this.render('roms-view');
  }
};
