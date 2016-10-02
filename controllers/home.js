module.exports.index = function *() {
  this.state.activePage = 'home';

  yield this.render('home');
};
