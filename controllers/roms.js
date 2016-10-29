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
    var romBasePath = utils.getSystemRomsBasePath(name);
    subPath = subPath || '';

    this.state.system = {
      name: name,
      fullname: utils.getSystemFullname(name) || name
    };

    var list = [];
    var romsList = utils.getRoms(name, subPath);
    var gamelist = utils.getSystemGamelist(name);

    for (var i = 0; i < romsList.length; i++) {
      var fullname = romsList[i];
      var image = '';

      if (undefined !== gamelist[romsList[i]]) {
        fullname = undefined !== gamelist[romsList[i]].name ? gamelist[romsList[i]].name : fullname;
        image = undefined !== gamelist[romsList[i]].image ? path.join('/', name, gamelist[romsList[i]].image) : image;
      }

      list[i] = {
        fullname: fullname,
        image: image
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
    this.state.currentPath = path.join(romBasePath, subPath);
    this.state.subDirectories = utils.getDirectories(this.state.currentPath, this.state.config.recalbox.romsExcludedFolders);

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
  },

  upload: function * () {
    var path = require('path');
    var fs = require('fs');
    var uploadPath = this.request.fields.upload_path;

    for (var i = 0; i < this.request.files.length; i++) {
      var file = this.request.files[i];

      fs.readFile(file.path, function (err, data) {
        fs.writeFileSync(path.join(uploadPath, file.name), data);
      });
    }

    this.body = 'OK';
  }
};
