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

    yield this.render('bios');
  }
};
