module.exports.index = function *() {
  var execSync = require('child_process').execSync;
  var osutils = require('../lib/osutils');
  var filesize = require('filesize');

  // Temperature
  var currentTemp = execSync('cat /sys/class/thermal/thermal_zone0/temp').toString() / 1000;
  var maxTemp = execSync('cat /sys/class/thermal/thermal_zone0/trip_point_0_temp').toString() / 1000;
  var currentPercent = Math.floor(currentTemp * 100 / maxTemp);

  this.state.temperature = {
    current: Math.round(currentTemp, 2),
    current_percent: currentPercent,
    max: Math.round(maxTemp, 2),
    color: currentPercent > 70 ? 'orange' : currentPercent < 30 ? 'green' : ''
  };

  // RAM
  var total = osutils.totalmem();
  var free = osutils.freemem();
  var used = total - free;

  this.state.ram = {
    total: Math.round(total, 2),
    used: Math.round(used, 2),
    used_percent: Math.floor(used * 100 / total),
    free: Math.round(free, 2)
  };

  // Disks
  this.state.disks = osutils.listHardDrive();

  // CPU
  this.state.cpus = osutils.listCPUs();

  // View helper
  this.state.helpers = {};
  this.state.helpers.fileSizeFormat = function (size) {
    return filesize(size);
  };

  this.state.activePage = 'monitoring';

  yield this.render('monitoring');
};
