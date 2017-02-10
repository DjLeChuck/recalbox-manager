var config = {};

config.recalbox = {
  ip: '192.168.0.18',
  logsPaths: [
    '/var/log/messages',
    '/var/www/development/Node.js/recalbox/recalbox/share/system/logs/recalbox.log',
  ],
  esSystemsCfgPath: '/var/www/development/Node.js/recalbox/recalbox/share/system/.emulationstation/es_systems.cfg',
  confPath: '/var/www/development/Node.js/recalbox/recalbox/share/system/recalbox.conf',
  systemSettingsCommand: 'python /var/www/development/Node.js/recalbox/recalbox/scripts/recalboxSettings.py',
  screenshotsPath: '/var/www/development/Node.js/recalbox/recalbox/share/screenshots',
  romsPath: '/var/www/development/Node.js/recalbox/recalbox/share/roms',
  biosPath: '/var/www/development/Node.js/recalbox/recalbox/share/bios/',
  biosFilePath: '/var/www/development/Node.js/recalbox/recalbox/share/bios/readme.txt',
};

module.exports = config;
