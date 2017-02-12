import express from 'express';
import config from 'config';
import fs from 'fs';
import path from 'path';
import xml2js from 'xml2js';
import { execSync, spawn } from 'child_process';
import { getSystemGamelist, getSystemGamelistPath } from '../lib/utils';

const router = express.Router();

router.post('/', async (req, res) => {
  const action = req.query.action;
  const body = req.body;
  let data;

  switch (action) {
    case 'writeFile':
      data = fs.writeFileSync(body.file, body.data);
      break;
    case 'deleteBios':
      const biosPath = path.resolve(config.get('recalbox.biosPath'), body.file);

      fs.unlinkSync(biosPath);
      break;
    case 'takeScreenshot':
      const raspi2png = config.get('recalbox.raspi2png');
      const screenshotName = `screenshot-${new Date().toISOString()}.png`;
      const screenPath = `${raspi2png.savePath}/${screenshotName}`;

      if ('production' === req.app.get('env')) {
        execSync(`${raspi2png.command} ${screenPath}`);
      }

      data = screenshotName;
      break;
    case 'deleteScreenshot':
      const screenshotPath = path.resolve(config.get('recalbox.screenshotsPath'), body.file);

      fs.unlinkSync(screenshotPath);
      break;
    case 'reboot-es':
      // cascade
    case 'shutdown-es':
      // cascade
    case 'start-es':
      let esAction;

      switch (action) {
        case 'reboot-es':
          esAction = 'restart';
        case 'shutdown-es':
          esAction = 'stop';
        case 'start-es':
          esAction = 'start';
      }

      spawn(config.get('recalbox.emulationStationPath'), [esAction], {
        stdio: 'ignore', // piping all stdio to /dev/null
        detached: true
      }).unref();
      break;
    case 'reboot-os':
      // @todo Wait for reboot. The manager will be unreachable for a while.
      spawn('reboot');
      break;
    case 'shutdown-os':
      // @todo What to do? The manager will become unreachable.
      spawn('shutdown', ['-h', 'now']);
      break;
      case 'deleteRom':
        const romPath = path.resolve(config.get('recalbox.romsPath'), body.system, body.file);

        fs.unlinkSync(romPath);
        break;
      case 'editRom':
        let rawGameList = await getSystemGamelist(body.system, true);
        const editedRomPath = path.join(body.path || '', body.gameData.path);
        const searchedPath = `./${editedRomPath}`;
        let gameData = { path: searchedPath };
        let gameIndex;

        if (rawGameList.gameList.game) {
          if (!Array.isArray(rawGameList.gameList.game)) {
            rawGameList.gameList.game = [rawGameList.gameList.game];
          }

          gameIndex = rawGameList.gameList.game.findIndex((i) => i.path === searchedPath);
          gameData = -1 !== gameIndex ? rawGameList.gameList.game[gameIndex] : gameData;
        } else {
          rawGameList.gameList = { game: [] };
        }

        // Update game data
        const year = body.gameData.releasedate.year || '0000';
        const month = body.gameData.releasedate.month || '00';
        const day = body.gameData.releasedate.day || '00';

        delete body.gameData.releasedate;
        delete body.gameData.path;

        Object.assign(gameData, body.gameData);

        gameData.desc = (gameData.desc || '').replace(/(\r\n|\r)/gm,"\n");
        gameData.releasedate = year + month + day + 'T000000';

        // Save change
        if (undefined !== gameIndex) {
          // Replace existing entry
          rawGameList.gameList.game[gameIndex] = gameData;
        } else {
          // Add new entry
          rawGameList.gameList.game.push(gameData);
        }

        const builder = new xml2js.Builder();
        const xml = builder.buildObject(rawGameList);

        try {
          fs.writeFileSync(getSystemGamelistPath(body.system), xml);
        } catch (error) {
          throw new Error(`Unable to update the ROM "${body.gameData.name}".`);
        }
        break;
    default:
      throw new Error(`Action "${action}" unknown`);
  }

  res.json({ success: true, data: data });
});

export default router;
