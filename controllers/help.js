module.exports = {
  index: function * () {
    this.state.downloadUrl = this.session.downloadUrl || undefined;
    this.session.downloadUrl = undefined;

    this.state.screenshotPath = this.session.screenshotPath || undefined;
    this.session.screenshotPath = undefined;

    this.state.activePage = 'help';

    this.state.screenshotSavePath = this.state.gt.gettext("Le résultat sera sauvegardé dans le dossier %s.");
    this.state.screenshotSavePath = this.state.screenshotSavePath.replace("%s", "<code>" + this.state.config.recalbox.raspi2png.savePath + "</code>");
    this.state.recalboxSupportSavePath = this.state.gt.gettext("Si on vous demande d'envoyer le résultat du script %s, vous pouvez le faire automatiquement ci-dessous.");
    this.state.recalboxSupportSavePath = this.state.recalboxSupportSavePath.replace("%s", "<code>recalbox-support.sh</code>");
    this.state.links = {
      forum: this.state.gt.gettext("https://forum.recalbox.com/"),
      irc: this.state.gt.gettext("https://kiwiirc.com/client/irc.freenode.net/#recalbox"),
      wiki: this.state.gt.gettext("https://github.com/recalbox/recalbox-os/wiki/Home-(FR)"),
    };

    yield this.render('help');
  },

  post: function * () {
    var post = this.request.fields;
    var isAjax = (this.request.get('X-Requested-With') === 'XMLHttpRequest');

    // Gestion du redémarrage / arrêt du système
    if (undefined !== post.system) {
      var spawn = require('child_process').spawn;

      switch (post.system) {
        case 'reboot':
          // @todo Wait for reboot. The manager will be unreachable for a while.
          spawn('reboot');
          break;
        case 'shutdown':
          // @todo What to do? The manager will become unreachable.
          spawn('shutdown', ['-h', 'now']);
          break;
        default:
          this.throw('Unknown system action.');
      }

      this.redirect('back');
    // Gestion du redémarrage / arrêt d'EmulationStation
    } else if (undefined !== post.es) {
      var spawn = require('child_process').spawn;

      switch (post.es) {
        case 'restart':
        case 'stop':
        case 'start':
          spawn(this.state.config.recalbox.emulationStationPath, [post.es]);

          if (isAjax) {
            this.body = { success: true };
          } else {
            this.redirect('back');
          }
          break;
        default:
          this.throw('Unknown ES action.');
      }
    // Gestion du recalbox-support.sh
    } else if (undefined !== post.support) {
      var execSync = require('child_process').execSync;
      var uniqid = new Date().getTime();
      var returnPath = '/recalbox/share/saves/recalbox-support-' + uniqid + '.tar.gz';
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

      if (isAjax) {
        this.body = {
          success: true,
          value: JSON.parse(linkFileResult.body).href
        };
      } else {
        this.session.downloadUrl = JSON.parse(linkFileResult.body).href;

        this.redirect('back');
      }
    // Gestion de la capture d'écran raspi2png
    } else if (undefined !== post.screenshot) {
      var moment = require('moment');
      var execSync = require('child_process').execSync;
      var raspi2png = this.state.config.recalbox.raspi2png;
      var screenshotName = "screenshot-" + moment().format("YYYY-MM-DD_HH-mm-ss-SSS") + ".png";
      var returnPath = raspi2png.savePath + "/" + screenshotName;

      execSync(raspi2png.command + " " + returnPath);

      if (isAjax) {
        this.body = {
          success: true,
          value: "//recalbox/" + screenshotName
        };
      } else {
        this.session.screenshotName = "//recalbox/" + screenshotName;

        this.redirect('back');
      }
    }
  }
};
