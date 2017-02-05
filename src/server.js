import express from 'express';
import path from 'path';
import fs from 'fs';
import bodyParser from 'body-parser';
import config from 'config';
import { exec, execSync } from 'child_process';

const app = express();

app.set('port', (process.env.PORT || 3001));

// express only serves static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
}

// locales
app.use('/locales', express.static('locales'));

// parse application/json
app.use(bodyParser.json());

// api routes and others
app.get('/get', (req, res) => {
  const option = req.query.option;
  let data;

  switch (option) {
    case 'romsDirectories':
      const srcpath = config.recalbox.romsPath;
      data = fs.readdirSync(srcpath).filter((file) => {
        return fs.statSync(path.join(srcpath, file)).isDirectory();
      });

      // add favorites "virtual" folder
      data.push('favorites');

      data.sort();
      break;
    default:
      throw new Error(`Option "${option}" unknown`);
  }

  res.json({ success: true, data: { [option]: data }});
});

app.get('/conf', (req, res) => {
  let result = {};

  req.query.keys.split(',').forEach((key) => {
    result[key] = config.get(key);
  });

  res.json(result);
});

app.get('/grep', (req, res) => {
  const keys = req.query.keys.replace(/\./g, '\\.');
  let data = execSync(`egrep -w "${keys}" ${config.recalbox.confPath}`);
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
});

app.post('/save', (req, res) => {
  for (const key in req.body) {
    execSync(`${config.get('recalbox.systemSettingsCommand')} -command save -key ${key} -value ${req.body[key]}`);
  }

  if (undefined !== req.body['audio.volume']) {
    // Set volume
    exec(`${config.get('recalbox.configScript')} volume ${req.body['audio.volume']}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`exec error: ${error}`);
      }
    });
  }

  res.json({ success: true });
});

// handles all routes so you do not get a not found error
app.get('/*', function (req, res){
  res.sendFile(path.resolve('client/build/index.html'));
});

// start the server
app.listen(app.get('port'),  (err) => {
  if (err) {
    return console.error(err);
  }

  console.log(`Find the server at: http://localhost:${app.get('port')}/`); // eslint-disable-line no-console
});
