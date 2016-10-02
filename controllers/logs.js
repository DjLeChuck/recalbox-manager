module.exports.index = function * () {
  this.state.logs = {
    path: this.state.config.recalbox.logsPath,
    content: yield require('../lib/utils').readFile(this.state.config.recalbox.logsPath)
  };

  this.state.activePage = 'logs';

  yield this.render('logs');
};
