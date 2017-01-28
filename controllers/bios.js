module.exports = {
  index: function * () {
    this.state.activePage = 'bios';

    const md5Rule = /^[a-f0-9]{32}$/i;
    const fs = require('fs');
    const path = require('path');
    const md5File = require('md5-file');
    const contents = fs.readFileSync(this.state.config.recalbox.biosFilePath, 'utf8');
    let bios = [];
    this.state.biosPath = this.state.config.recalbox.biosPath;

    contents.split("\n").forEach((line) => {
      let parts = line.split(' ');

      if (!parts[0].match(md5Rule)) {
        return;
      }

      parts = parts.filter(Boolean);
      const md5 = parts.shift();
      const name = parts.join(' ');
      const thisBiosPath = path.join(this.state.biosPath, name);

      bios.push({
        md5: md5,
        name: name,
        valid: fs.existsSync(thisBiosPath) ? md5 === md5File.sync(thisBiosPath) : null
      });
    });

    this.state.biosList = bios;

    this.state.uploadError = this.state.gt.gettext("Erreur lors de l'upload.");
    this.state.deleteConfirmation = this.state.gt.gettext("Voulez-vous vraiment supprimer %s ?");
    this.state.deleteConfirmation = this.state.deleteConfirmation.replace("%s", "<strong data-name></strong>");

    yield this.render('bios');
  },

  delete: function * () {
    var path = require('path');
    var biosName = this.request.fields.bios;

    if (!biosName) {
      this.throw('Unable to delete the BIOS.');
    }

    var biosFullPath = path.join(this.state.config.recalbox.biosPath, biosName);

    if (!biosFullPath) {
      this.throw('Unable to delete the BIOS "' + biosName + '".');
    }

    var fs = require('fs');

    try {
      fs.unlinkSync(biosFullPath);

      this.body = 'OK';
    } catch (error) {
      this.throw('Unable to delete the BIOS "' + biosName + '".');
    }
  },

  upload: function * () {
    var path = require('path');
    var fs = require('fs');
    var uploadPath = this.state.config.recalbox.biosPath;

    for (var i = 0; i < this.request.files.length; i++) {
      var file = this.request.files[i];

      fs.readFile(file.path, function (err, data) {
        fs.writeFileSync(path.join(uploadPath, file.name), data);
      });
    }

    this.body = 'OK';
  }
};
