import express from 'express';
import config from 'config';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import {
  handleBiosLine, getEsSystems, getRoms, getSystemGamelist,
  parseGameReleaseDate
} from '../lib/utils';

const osutils = require('../lib/osutils');

const router = express.Router(); // eslint-disable-line babel/new-cap

/* eslint-disable no-case-declarations */

router.get('/', async (req, res, next) => {
  try {
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
      case 'hostname':
        data = req.hostname;
        break;
      case 'directoryListing':
        const directoryPath = path.join(config.get('recalbox.romsPath'), params.subpath || '');
        const excluded = config.get('recalbox.romsExcludedFolders');
        data = fs.readdirSync(directoryPath).filter((file) => {
          return -1 === excluded.indexOf(file) &&
            fs.statSync(path.join(directoryPath, file)).isDirectory();
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
      case 'canTakeScreenshots':
        data = 'rpi' === execSync(`cat ${config.get('recalbox.arch')}`).toString().substring(0, 3);
        break;
      case 'systemFullname':
        const paramSystem = params.system;
        const esSystems = await getEsSystems();
        const systemData = esSystems.find(x => x.name === paramSystem);
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
      case 'temperature':
        const currentTemp = execSync('cat /sys/class/thermal/thermal_zone0/temp').toString() / 1000;
        const maxTemp = 100;
        const currentPercent = Math.floor(currentTemp * 100 / maxTemp);

        data = {
          current: Math.round(currentTemp, 2),
          current_percent: currentPercent,
          max: Math.round(maxTemp, 2),
          color: currentPercent > 70 ? 'orange' : currentPercent < 30 ? 'green' : ''
        };
        break;
      case 'ram':
        const total = osutils.totalmem();
        const free = osutils.freemem();
        const used = total - free;

        data = {
          total: Math.round(total, 2),
          used: Math.round(used, 2),
          used_percent: Math.floor(used * 100 / total),
          free: Math.round(free, 2)
        };
        break;
      case 'disks':
        data = osutils.listHardDrive();
        break;
      case 'cpus':
        data = osutils.listCPUs();
        break;
      case 'ESStatus':
        const ESPath = config.get('recalbox.emulationStationPath');
        const cmd = `${ESPath} status | cut -d ' ' -f 3`;
        data = 'running' === execSync(cmd).toString() ? 'OK' : 'KO';
        break;
      case 'needAuth':
        data = true;
        break;
      default:
        throw new Error(`Option "${option}" unknown`);
    }

    res.json({ success: true, data: { [option]: data } });
  } catch (err) {
    next(err);
  }
});

export default router;
