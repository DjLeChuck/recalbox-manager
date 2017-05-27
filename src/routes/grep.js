import express from 'express';
import config from 'config';
import { execSync } from 'child_process';

const router = express.Router(); // eslint-disable-line babel/new-cap

router.get('/', (req, res, next) => {
  try {
    const keys = req.query.keys.replace(/\./g, '\\.');
    let data = execSync(`egrep -w "${keys}" ${config.get('recalbox.confPath')}`);
    data = data.toString().trim().split('\n');
    let result = {};

    data.forEach((line) => {
      const parts = line.split('=');
      let name = parts.shift();
      let disabled;

      if (';' === name[0]) {
        name = name.substring(1);
        disabled = true;
      } else {
        disabled = false;
      }

      result[name] = {
        value: parts.join('='),
        disabled: disabled,
      };
    });

    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
});

export default router;
