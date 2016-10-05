module.exports = {
  index: function * () {
    this.state.downloadUrl = this.session.downloadUrl || undefined;

    this.session.downloadUrl = undefined;

    this.state.activePage = 'help';

    yield this.render('help');
  },

  post: function * () {
    var post = this.request.body;

    // Gestion du redémarrage / arrêt
    if (undefined !== post.shutdown) {
      var spawn = require('child_process').spawn;

      switch (post.shutdown) {
        case 'reboot':
          // @todo Wait for reboot. The manager will be unreachable for a while.
          spawn('reboot');
          break;
        case 'halt':
          // @todo What to do? The manager will become unreachable.
          spawn('shutdown', ['now']);
          break;
        default:
          this.throw('Unknown shutdown action.');
      }
    // Gestion du recalbox-support.sh
    } else if (undefined !== post.support) {
      var execSync = require('child_process').execSync;
      var uniqid = require('uniqid');
      var returnPath = '/recalbox/recalbox-support-' + uniqid() + '.tar.gz';
      var request = require('co-request');
      var fs = require('fs');
      var smartFile = this.state.config.smartFile;

      // Création de l'archive
      execSync(this.state.config.recalbox.supportScript + ' ' + returnPath);

      // Upload file
      var uploadFileResult = yield request.post(smartFile.url + smartFile.api.upload + smartFile.folderName, {
        auth: {
          user: smartFile.keys.public,
          pass: smartFile.keys.private
        },
        formData: {
          file: fs.createReadStream(returnPath)
        }
      });

      // Link file
      var filePath = JSON.parse(uploadFileResult.body)[0].path;
      var linkFileResult = yield request.post(smartFile.url + smartFile.api.link, {
        auth: {
          user: smartFile.keys.public,
          pass: smartFile.keys.private
        },
        form: {
          path: filePath,
          read: true,
          list: true
        }
      });

      // Remove local file
      fs.unlinkSync(returnPath);

      this.session.downloadUrl = JSON.parse(linkFileResult.body).href;
    }

    this.redirect('back');
  }
};
