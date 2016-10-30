module.exports = function () {
  var config = require('./utils').getConfig().recalbox;
  var execSync = require('child_process').execSync;

  return {
    load: function (key) {
      return execSync(config.systemSettingsCommand + " -command load -key " + key).toString().trim();
    },

    save: function (key, value) {
      execSync(config.systemSettingsCommand + " -command save -key " + key + " -value " + value);
    },

    launchGame: function *(system, rom) {
      yield require('co-request').post('http://' + config.ip + ':' + config.port + '/systems/' + system + '/launcher', { body: rom });
    }
  };
};
