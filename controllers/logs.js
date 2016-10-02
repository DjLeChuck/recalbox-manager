module.exports.index = function * () {
  var fs = require('fs');

  var readFileThunk = function(src) {
    return new Promise(function (resolve, reject) {
      fs.readFile(src, {'encoding': 'utf8'}, function (err, data) {
        if(err) return reject(err);
        resolve(data);
      });
    });
  }

  this.state.logs = {
    path: this.state.config.recalbox.logsPath,
    content: yield readFileThunk(this.state.config.recalbox.logsPath)
  };

  this.state.activePage = 'logs';

  yield this.render('logs');
};
