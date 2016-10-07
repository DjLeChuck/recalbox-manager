module.exports= {
  list: function * () {
    var utils = require('../lib/utils');
    var systems = [];

    // Dossiers de ROMs existants
    var currentSystems = utils.getDirectories(this.state.config.recalbox.romsPath);

    // Recherche des "noms complets"
    for (var i = 0; i < currentSystems.length; i++) {
      var fullname = utils.getSystemFullname(currentSystems[i]) || currentSystems[i];

      systems[i] = {
        name: currentSystems[i],
        fullname: fullname
      };
    }

    this.state.systems = systems;

    this.state.activePage = 'roms';

    yield this.render('roms-list');
  },

  view: function * (name, subPath) {
    var utils = require('../lib/utils');
    var path = require('path');
    var romBasePath = path.join(this.state.config.recalbox.romsPath, name);
    subPath = subPath || '';

    this.state.system = {
      name: name,
      fullname: utils.getSystemFullname(name) || name
    };

    var list = [];
    var romsList = utils.getRoms(name, subPath);

    for (var i = 0; i < romsList.length; i++) {
      list[i] = {
        fullname: romsList[i],
      };
    }

    this.state.roms = {
      path: romBasePath,
      list: list
    };

    this.state.breadCrumb = [['', this.i18n.__('Accueil')], ['roms', this.i18n.__('ROMs')], [name, this.state.system.fullname]];

    if ("" !== subPath) {
      this.state.breadCrumb = this.state.breadCrumb.concat(subPath.split('/'));
    }

    this.state.basePath = path.join('/roms', name, subPath);
    this.state.subDirectories = utils.getDirectories(path.join(romBasePath, subPath), this.state.config.recalbox.romsExcludedFolders);

    this.state.activePage = 'roms';

    yield this.render('roms-view');
  },

  launch: function * () {
    yield this.state.api.post('/systems/' + this.request.body.system + '/launcher', this.request.body.rom, true);

    this.body = 'OK';
  },

  delete: function * () {
    var res = yield this.state.api.delete('/systems/' + this.request.body.system + '/roms/' + this.request.body.rom);

    if (204 === res.statusCode) {
      this.body = 'OK';
    } else {
      this.throw('Unable to delete the ROM "' + this.request.body.system + ":" + this.request.body.rom + '".');
    }
  }
};
