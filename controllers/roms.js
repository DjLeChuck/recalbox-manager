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
      var filepath = path.join(subPath, filename);
      var fullname = filename;
      var image = desc = genre = releasedate = developer = publisher = players = '';

      if (undefined !== gamelist[filepath]) {
        var romData = gamelist[filepath];
        releasedate = undefined !== romData.releasedate ? utils.formatGameReleaseDate(romData.releasedate) : '';
        fullname = undefined !== romData.name ? romData.name : fullname;
        image = undefined !== romData.image ? path.join('/', name, romData.image) : image;
        desc = undefined !== romData.desc ? romData.desc : '';
        genre = undefined !== romData.genre ? romData.genre : '';
        developer = undefined !== romData.developer ? romData.developer : '';
        publisher = undefined !== romData.publisher ? romData.publisher : '';
        players = undefined !== romData.players ? romData.players : '';
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
