import express from 'express';
import config from 'config';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import xml2js from 'xml2js';
import { execSync } from 'child_process';
import { handleBiosLine, getSystemGamelist, getSystemGamelistPath } from '../lib/utils';

const router = express.Router(); // eslint-disable-line babel/new-cap

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let dir;

    switch (req.body.type) {
      case 'bios':
        dir = config.get('recalbox.biosPath');
        break;
      case 'roms':
        dir = path.resolve(config.get('recalbox.romsPath'), req.body.system, req.body.path);
        break;
      case 'romImage':
        dir = path.resolve(config.get('recalbox.romsPath'), req.body.system, 'downloaded_images');
        break;
    }

    if (fs.existsSync(dir)) {
      return cb(null, dir);
    }

    fs.mkdir(dir, err => cb(err, dir));
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});
const uploadMulter = multer({ storage: storage });
const upload = uploadMulter.single('file');

router.post('/bios', (req, res, next) => {
  upload(req, res, function (err) {
    if (err) {
      // An error occurred when uploading
      return next(err);
    }

    // Everything went fine
    if (req.file && req.file.originalname) {
      try {
        let data = execSync(`grep -w "${req.file.originalname}" ${config.recalbox.biosFilePath}`);
        let lineResult = handleBiosLine(data.toString());

        if (null !== lineResult) {
          lineResult.success = true;

          return res.json(lineResult);
        }
      } catch (e) {} // eslint-disable-line no-empty
    }

    res.json({ success: true });
  });
});

router.post('/roms', (req, res, next) => {
  upload(req, res, function (err) {
    if (err) {
      // An error occurred when uploading
      return next(err);
    }

    // Everything went fine
    if (req.file && req.file.originalname) {
      return res.json({
        success: true,
        gameData: {
          path: path.join(req.body.path, req.file.originalname),
          name: req.file.originalname,
          releasedate: {},
        }
      });
    }

    res.json({ success: true });
  });
});

router.post('/romImage', (req, res, next) => {
  upload(req, res, async function (err) {
    if (err) {
      // An error occurred when uploading
      return next(err);
    }

    // Everything went fine
    if (req.file && req.file.originalname) {
      const body = req.body;

      let rawGameList = await getSystemGamelist(body.system, true);
      const searchedPath = `./${body.gamePath}`;
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
      gameData.image = `./downloaded_images/${req.file.filename}`;

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

        return res.json({
          success: true,
          image: path.join(body.system, 'downloaded_images', req.file.filename),
        });
      } catch (error) {
        throw new Error(`Unable to update the ROM.`);
      }

      // return res.json({ success: true });
    }

    res.json({ success: true });
  });
});

export default router;
