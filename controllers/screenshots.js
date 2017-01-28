module.exports = {
  index: function *() {
    const utils = require('../lib/utils');
    this.state.screenshots = utils.getScreenshots();

    this.state.activePage = 'screenshots';

    this.state.deleteConfirmation = this.state.gt.gettext("Voulez-vous vraiment supprimer %s ?");
    this.state.deleteConfirmation = this.state.deleteConfirmation.replace("%s", "<strong data-name></strong>");

    yield this.render('screenshots');
  },

  delete: function * () {
    var path = require('path');
    var screenshotName = this.request.fields.screenshot;

    if (!screenshotName) {
      this.throw('Unable to delete the screenshot.');
    }

    var screenshotFullPath = path.join(this.state.config.recalbox.screenshotsPath, screenshotName);

    if (!screenshotFullPath) {
      this.throw('Unable to delete the screenshot "' + screenshotName + '".');
    }

    var fs = require('fs');

    try {
      fs.unlinkSync(screenshotFullPath);

      this.body = 'OK';
    } catch (error) {
      this.throw('Unable to delete the screenshot "' + screenshotName + '".');
    }
  }
};
