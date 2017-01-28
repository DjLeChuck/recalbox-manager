module.exports.index = function *() {
  this.state.activePage = 'home';

  this.state.hostname = this.request.hostname;

  yield this.render('home');
};
