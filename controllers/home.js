module.exports.index = function *() {
  this.state.activePage = 'home';

  this.state.hostname = this.state.api.load('system.hostname');

  yield this.render('home');
};
