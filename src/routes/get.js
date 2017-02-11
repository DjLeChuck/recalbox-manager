import express from 'express';
import config from 'config';
import fs from 'fs';
import path from 'path';
import { handleBiosLine } from '../lib/utils';

const router = express.Router();

router.get('/', (req, res) => {
  const option = req.query.option;
  const param = req.query.param || {};
  let data;
  let srcpath;

  switch (option) {
    case 'serverAddress':
      data = {
        ip: req.ip,
        port: req.app.get('port'),
      }
      break;
    case 'romsDirectories':
      srcpath = config.get('recalbox.romsPath');
      data = fs.readdirSync(srcpath).filter((file) => {
        return fs.statSync(path.join(srcpath, file)).isDirectory();
      });

      // add favorites "virtual" folder
      if ('addFavorites' === param) {
        data.push('favorites');
      }

      data.sort();
      break;
    case 'readFile':
      data = fs.readFileSync(param).toString();
      break;
    case 'biosList':
      const contents = fs.readFileSync(config.get('recalbox.biosFilePath'), 'utf8');
      data = [];

      contents.split("\n").forEach((line) => {
        let lineResult = handleBiosLine(line);

        if (null !== lineResult) {
          data.push(lineResult);
        }
      });
      break;
    case 'screenshotsList':
      srcpath = config.get('recalbox.screenshotsPath');
      data = fs.readdirSync(srcpath).filter((file) => {
        return fs.statSync(path.join(srcpath, file)).isFile() && '.png' === path.extname(file);
      });
      break;
    default:
      throw new Error(`Option "${option}" unknown`);
  }

  res.json({ success: true, data: { [option]: data }});
});

export default router;
