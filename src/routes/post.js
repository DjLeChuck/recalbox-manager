import express from 'express';
import config from 'config';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const router = express.Router();

router.post('/', (req, res) => {
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
      const returnPath = `${raspi2png.savePath}/${screenshotName}`;

      if ('production' === req.app.get('env')) {
        execSync(`${raspi2png.command} ${returnPath}`);
      }

      data = screenshotName;
      break;
    case 'deleteScreenshot':
      const screenshotPath = path.resolve(config.get('recalbox.screenshotsPath'), body.file);

      fs.unlinkSync(screenshotPath);
      break;
    default:
      throw new Error(`Action "${action}" unknown`);
  }

  res.json({ success: true, data: data });
});

export default router;
