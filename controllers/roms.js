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

    this.state.gameLaunchingAvailable = this.state.api.load('system.api.enabled');

    this.state.system = {
      name: name,
      fullname: utils.getSystemFullname(name) || name
    };

    var list = [];
    var romsList = utils.getRoms(name, subPath);
    var gamelist = utils.getSystemGamelist(name);

    for (var i = 0; i < romsList.length; i++) {
      var filename = romsList[i];
      var fullname = filename;
      var image = desc = genre = releasedate = developer = publisher = players = '';

      if (undefined !== gamelist[romsList[i]]) {
        if (gamelist[romsList[i]].releasedate) {
          releasedate = utils.formatGameReleaseDate(gamelist[romsList[i]].releasedate);
        }

        fullname = undefined !== gamelist[romsList[i]].name ? gamelist[romsList[i]].name : fullname;
        image = undefined !== gamelist[romsList[i]].image ? path.join('/', name, gamelist[romsList[i]].image) : image;
        desc = undefined !== gamelist[romsList[i]].desc ? gamelist[romsList[i]].desc : '';
        genre = undefined !== gamelist[romsList[i]].genre ? gamelist[romsList[i]].genre : '';
        developer = undefined !== gamelist[romsList[i]].developer ? gamelist[romsList[i]].developer : '';
        publisher = undefined !== gamelist[romsList[i]].publisher ? gamelist[romsList[i]].publisher : '';
        players = undefined !== gamelist[romsList[i]].players ? gamelist[romsList[i]].players : '';
      }

      list[i] = {
        filename: filename,
        fullname: fullname,
        image: image,
        desc: desc,
        genre: genre,
        releasedate: releasedate,
        developer: developer,
        publisher: publisher,
        players: players
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
    yield this.state.api.launchGame(this.request.fields.system, this.request.fields.rom);

    this.body = 'OK';
  },

  delete: function * () {
    var path = require('path');
    var fs = require('fs');
    var romPath = path.join(this.request.fields.current_path, this.request.fields.rom);

    try {
      fs.unlinkSync(romPath);

      this.body = 'OK';
    } catch (error) {
      this.throw('Unable to delete the ROM "' + romPath + '".');
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
