import express from 'express';
import config from 'config';
import fs from 'fs';
import path from 'path';
import { execSync, spawn } from 'child_process';

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
    default:
      throw new Error(`Action "${action}" unknown`);
  }

  res.json({ success: true, data: data });
});

export default router;
