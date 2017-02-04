import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import config from 'config';
import { exec, execSync } from 'child_process';

const app = express();

app.set('port', (process.env.PORT || 3001));

// express only serves static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
}

// parse application/json
app.use(bodyParser.json());

// api routes and others
app.get('/conf', (req, res) => {
  let result = {};

  req.query.keys.split(',').forEach((key) => {
    result[key] = config.get(key);
  });

  res.send(result);
});

app.get('/grep', (req, res) => {
  const keys = req.query.keys.replace(/\./g, '\\.');
  let data = execSync(`egrep -w "${keys}" ${config.recalbox.confPath}`);
  data = data.toString().trim().split('\n');
  let result = {};

  data.forEach((line) => {
    const part = line.split('=');
    let name = part[0];
    let disabled;

    if (';' === name[0]) {
      name = name.substring(1);
      disabled = true;
    } else {
      disabled = false;
    }

    result[name] = {
      value: part[1],
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

  res.send({ success: true });
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
