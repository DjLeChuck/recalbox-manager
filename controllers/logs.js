module.exports.index = function * () {
  this.state.logs = this.state.config.recalbox.logsPaths;

  var logPath = this.request.fields ? this.request.fields.log_path : undefined;

  if (undefined !== logPath && "" !== logPath) {
    this.state.currentLog = {
      path: logPath,
      content: require('fs').readFileSync(logPath)
    };
  }

  this.state.activePage = 'logs';

  yield this.render('logs');
};
