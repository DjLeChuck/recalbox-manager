import express from 'express';
import config from 'config';
import multer from 'multer';
import path from 'path';
import { execSync } from 'child_process';
import { handleBiosLine } from '../lib/utils';

const router = express.Router();

const storage = multer.diskStorage({
  // destination: config.get('recalbox.biosPath'),
  destination: (req, file, cb) => {
    switch (req.body.type) {
      case 'bios':
        cb(null, config.get('recalbox.biosPath'));
        break;
      case 'rom':
        cb(null, path.resolve(config.get('recalbox.romsPath'), req.body.system, req.body.path));
        break;
    }
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
      return res.status(500).json({ success: false });
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
      } catch (e) {}
    }

    res.json({ success: true });
  });
});

router.post('/roms', (req, res, next) => {
  upload(req, res, function (err) {
    if (err) {
      // An error occurred when uploading
      return res.status(500).json({ success: false });
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

export default router;
