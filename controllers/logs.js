module.exports.index = function * () {
  this.state.logs = this.state.config.recalbox.logsPaths;

  var logPath = this.request.body.log_path;

  if (undefined !== logPath && "" !== logPath) {
    this.state.currentLog = {
      path: logPath,
      content: yield require('../lib/utils').readFile(logPath)
    };
  }

  this.state.activePage = 'logs';

  yield this.render('logs');
};
