import express from 'express';
import config from 'config';
import { exec, execSync } from 'child_process';

const router = express.Router();

router.post('/', (req, res) => {
  for (const key in req.body) {
    execSync(`${config.get('recalbox.systemSettingsCommand')} -command save -key ${key} -value ${req.body[key]}`);
  }

  if (undefined !== req.body['audio.volume'] && 'production' === req.app.get('env')) {
    // Set volume
    exec(`${config.get('recalbox.configScript')} volume ${req.body['audio.volume']}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
      }
    });
  }

  res.json({ success: true });
});

export default router;
