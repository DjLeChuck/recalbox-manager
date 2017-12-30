import express from 'express';
import config from 'config';
import fs from 'fs';
import path from 'path';
import xml2js from 'xml2js';
import crypto from 'crypto';
import { execSync, spawn } from 'child_process';
import { getSystemGamelist, getSystemGamelistPath } from '../lib/utils';

const router = express.Router(); // eslint-disable-line babel/new-cap

/* eslint-disable no-case-declarations */

router.post('/', async (req, res, next) => {
  try {
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
        const screenshotName = `screenshot-${new Date().toISOString().replace(/[:\.]/g, '-')}.png`;
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
            break;
          case 'shutdown-es':
            esAction = 'stop';
            break;
          case 'start-es':
            esAction = 'start';
            break;
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
      case 'screen-on':
        // @todo Wait for reboot. The manager will be unreachable for a while.
        spawn('vcgencmd',['display_power 1']);
        break;

      case 'screen-off':
        // @todo Wait for reboot. The manager will be unreachable for a while.
        spawn('vcgencmd',['display_power 0']);
        break;

      case 'deleteRom':
        deleteRom(body);

        break;
      case 'editRom':
        let rawGameList = await getSystemGamelist(body.system, true);
        const basePath = body.gameData.path;
        const searchedPath = `./${basePath}`;
        let gameData = { path: searchedPath };
        let gameIndex;

        if (rawGameList.gameList.game) {
          if (!Array.isArray(rawGameList.gameList.game)) {
            rawGameList.gameList.game = [rawGameList.gameList.game];
          }

          gameIndex = rawGameList.gameList.game.findIndex(
            x => x.path === searchedPath
          );
          gameData = -1 !== gameIndex ?
            rawGameList.gameList.game[gameIndex] :
            gameData;
        } else {
          rawGameList.gameList = { game: [] };
        }

        // Update game data
        const year = body.gameData.releasedate.year || '0000';
        const month = body.gameData.releasedate.month || '00';
        const day = body.gameData.releasedate.day || '00';

        delete body.gameData.releasedate;
        delete body.gameData.path;
        delete body.gameData.image;

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

          gameData.path = basePath;
          data = gameData;
        } catch (error) {
          throw new Error(`Unable to update the ROM "${body.gameData.name}".`);
        }
        break;
      case 'login':
        try {
          const authFile = config.get('auth');
          const credentials = JSON.parse(fs.readFileSync(authFile).toString());

          if (
            credentials.login !== body.login ||
            credentials.password !== body.password
          ) {
            throw new Error('Bad credentials.');
          }

          setSessionCredentials(req, credentials);
        } catch (error) {
          throw new Error('Bad credentials.');
        }

        break;
      case 'security':
        const { needAuth, ...securityRest } = body;
        const authFile = config.get('auth');

        try {
          if (!needAuth) {
            if (fs.existsSync(authFile)) {
              fs.unlinkSync(authFile);

              req.session = null;
            }
          } else {
            const securityCredentials = { ...securityRest };
            const content = JSON.stringify(securityCredentials);

            fs.writeFileSync(authFile, content);

            setSessionCredentials(req, securityCredentials);
          }
        } catch (error) {
          throw new Error('Error while saving security credentials.');
        }

        break;
      default:
        throw new Error(`Action "${action}" unknown.`);
    }

    res.json({ success: true, data: data });
  } catch (err) {
    next(err);
  }
});

function setSessionCredentials(req, credentials) {
  const hashedCredentials = crypto.createHash('sha256')
    .update(`${credentials.login}\n${credentials.password}`, 'utf8')
    .digest().toString();

  req.session.isAuthenticated = hashedCredentials;
}

async function deleteRom(payload) {
  // Delete ROM file
  for (let i = 0; i <= payload.files.length; i++) {
    const file = payload.files[i];
    const romPath = path.resolve(config.get('recalbox.romsPath'), payload.system, file);

    fs.unlinkSync(romPath);
  }

  // Remove ROM data from gamelist.xml
  let rawGameList = await getSystemGamelist(payload.system, true);

  for (let i = 0; i <= payload.files.length; i++) {
    const file = payload.files[i];
    const searchedPath = `./${file}`;
    let gameIndex;

    if (!rawGameList.gameList.game) {
      continue;
    }

    if (!Array.isArray(rawGameList.gameList.game)) {
      rawGameList.gameList.game = [rawGameList.gameList.game];
    }

    gameIndex = rawGameList.gameList.game.findIndex(
      x => x.path === searchedPath
    );

    if (-1 === gameIndex) {
      continue;
    }

    // remove image
    fs.unlinkSync(path.resolve(
      config.get('recalbox.romsPath'),
      payload.system,
      rawGameList.gameList.game[gameIndex].image
    ));

    // Remove entry
    delete rawGameList.gameList.game[gameIndex];
  }

  const builder = new xml2js.Builder();
  const xml = builder.buildObject(rawGameList);

  fs.writeFileSync(getSystemGamelistPath(payload.system), xml);
}

export default router;
