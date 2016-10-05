module.exports= {
  list: function * () {
    var fs = require('fs');
    var xml2js = require('xml2js');
    var parser = new xml2js.Parser({
      trim: true,
      explicitArray: false
    });
    var systems = [];

    // Dossiers de ROMs existants
    var currentSystems = require('../lib/utils').getDirectories(this.state.config.recalbox.romsPath);

    // Systèmes connus par le manifest.xml
    parser.parseString(fs.readFileSync(this.state.config.recalbox.manifest), function (err, result) {
      var systemsList = result.systems.system;

      // Recherche des "noms complets" dans le manifest
      for (var i = 0; i < currentSystems.length; i++) {
        systems[i] = {
          name: currentSystems[i],
          fullname: currentSystems[i]
        };

        for (var j = 0; j < systemsList.length; j++) {
          if (currentSystems[i] === systemsList[j].$.key) {
            systems[i].fullname = systemsList[j].$.name;
          }
        }
      }
    });

    this.state.systems = systems;

    this.state.activePage = 'roms';

    yield this.render('roms-list');
  },

  view: function * (name) {
    this.state.activePage = 'roms';

    yield this.render('roms-view');
  }
};
