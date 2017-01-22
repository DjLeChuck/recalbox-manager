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
      var image = desc = genre = releasedate = developer =
          publisher = players = rating = '';

      if (undefined !== gamelist[filepath]) {
        var romData = gamelist[filepath];
        releasedate = undefined !== romData.releasedate ? utils.parseGameReleaseDate(romData.releasedate) : '';
        fullname = undefined !== romData.name ? romData.name : fullname;
        image = undefined !== romData.image ? path.join('/', name, romData.image) : image;
        desc = undefined !== romData.desc ? romData.desc : '';
        genre = undefined !== romData.genre ? romData.genre : '';
        developer = undefined !== romData.developer ? romData.developer : '';
        publisher = undefined !== romData.publisher ? romData.publisher : '';
        players = undefined !== romData.players ? romData.players : '';
        rating = undefined !== romData.rating ? romData.rating : 0;
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
        players: players,
        rating: rating
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

    this.state.subPath = subPath;
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

  update: function * () {
    var system = this.request.fields.system;

    if (!system) {
      this.throw('Unable to update the ROM "' + this.request.fields.rom + '".');
    }

    var path = require('path');
    var romPath = path.join(this.request.fields.sub_path || '', this.request.fields.rom);

    if (!romPath) {
      this.throw('Unable to update the ROM "' + this.request.fields.rom + '".');
    }

    var fs = require('fs');
    var xml2js = require('xml2js');
    var builder = new xml2js.Builder();
    var utils = require('../lib/utils');
    var rawGameList = utils.getSystemGamelist(system, true);
    var gameData = { path: './' + romPath };
    var gameIndex;

    for (var i = 0; i < rawGameList.gameList.game.length; i++) {
      var item = rawGameList.gameList.game[i];

      if ('./' + romPath === item.path) {
        gameData = item;
        gameIndex = i;

        break;
      }
    }

    // Update game data
    // image
    gameData.name = this.request.fields.name || gameData.name;
    gameData.desc = this.request.fields.desc.replace(/(\r\n|\r)/gm,"\n") || gameData.desc;
    gameData.developer = this.request.fields.developer || gameData.developer;
    gameData.publisher = this.request.fields.publisher || gameData.publisher;
    gameData.genre = this.request.fields.genre || gameData.genre;
    gameData.players = this.request.fields.players || gameData.players;
    gameData.rating = this.request.fields.rating || gameData.rating;
    var year = this.request.fields.releasedate_year || '0000';
    var month = this.request.fields.releasedate_month || '00';
    var day = this.request.fields.releasedate_day || '00';
    gameData.releasedate = year + month + day + 'T000000';

    // Save change
    if (undefined !== gameIndex) {
      // Replace existing entry
      rawGameList.gameList.game[gameIndex] = gameData;
    } else {
      // Add new entry
      rawGameList.gameList.game.push(gameData);
    }

    var xml = builder.buildObject(rawGameList);

    try {
      fs.writeFileSync(utils.getSystemGamelistPath(system), xml);

      this.body = 'OK';
    } catch (error) {
      console.error(error);

      this.throw('Unable to update the ROM "' + gameData.name + '".');
    }
  },

  delete: function * () {
    var path = require('path');
    var romName = this.request.fields.rom;
    var romPath = path.join(this.request.fields.sub_path || '', romName);

    if (!romPath) {
      this.throw('Unable to delete the ROM "' + romName + '".');
    }

    var romFullPath = path.join(this.request.fields.current_path, romName);

    if (!romFullPath) {
      this.throw('Unable to delete the ROM "' + romName + '".');
    }

    var fs = require('fs');

    try {
      fs.unlinkSync(romFullPath);

      var utils = require('../lib/utils');
      var system = this.request.fields.system;
      var rawGameList = utils.getSystemGamelist(system, true);
      var gameIndex;

      for (var i = 0; i < rawGameList.gameList.game.length; i++) {
        var item = rawGameList.gameList.game[i];

        if ('./' + romPath === item.path) {
          gameIndex = i;

          break;
        }
      }

      if (undefined !== gameIndex) {
        var xml2js = require('xml2js');
        var builder = new xml2js.Builder();

        delete rawGameList.gameList.game[gameIndex];

        var xml = builder.buildObject(rawGameList);

        fs.writeFileSync(utils.getSystemGamelistPath(system), xml);
      }

      this.body = 'OK';
    } catch (error) {
      this.throw('Unable to delete the ROM "' + romName + '".');
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
