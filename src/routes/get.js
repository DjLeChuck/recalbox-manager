import express from 'express';
import config from 'config';
import fs from 'fs';
import path from 'path';
import {
  handleBiosLine, getEsSystems, getRoms, getSystemGamelist,
  parseGameReleaseDate
} from '../lib/utils';

const router = express.Router();

router.get('/', async (req, res) => {
  const option = req.query.option;
  const params = {};
  const queryParams = req.query.params || '';

  queryParams.split(',').map((param) => {
    const parts = param.split('=');

    params[[parts[0]]] = parts[1];
  });
  let data;
  let srcpath;

  switch (option) {
    case 'serverAddress':
      data = {
        ip: req.ip,
        port: req.app.get('port'),
      }
      break;
    case 'directoryListing':
      let directoryPath = path.join(config.get('recalbox.romsPath'), params.subpath || '');
      data = fs.readdirSync(directoryPath).filter((file) => {
        return fs.statSync(path.join(directoryPath, file)).isDirectory();
      });

      // add favorites "virtual" folder
      if (params.addFavorites) {
        data.push('favorites');
      }

      data.sort();
      break;
    case 'readFile':
      data = fs.readFileSync(params.file).toString();
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
    case 'systemFullname':
      const paramSystem = params.system;
      const esSystems = await getEsSystems();
      const systemData = esSystems.find((s) => s.name === paramSystem);
      data = systemData ? systemData.fullname : paramSystem;
      break;
    case 'romsList':
      const system = params.system;
      const subpath = params.subpath || '';
      const roms = await getRoms(system, subpath);
      const gamelist = await getSystemGamelist(system);
      let list = [];
      const seekableFields = [
        'releasedate', 'name', 'image', 'desc', 'genre', 'developer',
        'publisher', 'players', 'rating',
      ];

      roms.forEach((romName) => {
        const filepath = path.join(subpath, romName);
        let fullname = romName;
        let romData = {
          path: filepath,
          name: romName,
          releasedate: {},
        };

        if (gamelist[filepath]) {
          const gamelistData = gamelist[filepath];

          seekableFields.forEach((field) => {
            if (gamelistData[field]) {
              let value = gamelistData[field];

              if ('releasedate' === field) {
                value = parseGameReleaseDate(value);
              } else if ('image' === field) {
                value = path.join('/', system, value);
              }

              romData[field] = value;
            }
          });
        }

        list.push(romData);
      });

      data = list;
      break;
    case 'esSystems':
      data = await getEsSystems();
      break;
    default:
      throw new Error(`Option "${option}" unknown`);
  }

  res.json({ success: true, data: { [option]: data }});
});

export default router;
