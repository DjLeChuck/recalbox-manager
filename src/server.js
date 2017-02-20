import 'babel-polyfill';
import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import config from 'config';
import request from 'superagent';
import fs from 'fs';
import { execSync } from 'child_process';
import { uniqueID } from './lib/utils';
import uploadRouter from './routes/upload';
import confRouter from './routes/conf';
import grepRouter from './routes/grep';
import saveRouter from './routes/save';
import getRouter from './routes/get';
import postRouter from './routes/post';

const app = express();

app.set('port', (process.env.PORT || 3001));

// express only serves static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
}

// serves screenshots
app.use('/viewer/screenshots', express.static(config.get('recalbox.screenshotsPath')));

// serves roms (form images)
app.use('/viewer/roms', express.static(config.get('recalbox.romsPath')));

// locales
app.use('/locales', express.static('locales'));

// parse application/json
app.use(bodyParser.json());

// Récupération de divers données (liste de répertoires, contenu de fichier, etc.)
app.use('/get', getRouter);

// Actions divers sur des données (écriture de fichier, suppression, etc.)
app.use('/post', postRouter);

// Récupération de valeurs du fichier de config du manager
app.use('/conf', confRouter);

// Récupération de valeurs du fichier recalbox.conf
app.use('/grep', grepRouter);

// Enregistrement de nouvelles valeurs dans le fichier recalbox.conf
app.use('/save', saveRouter);

// Prise en charge des différents uploads (BIOS, ROMs)
app.use('/upload', uploadRouter);

app.get('/recalbox-support', (req, res, next) => {
  const archivePath = `${config.get('recalbox.savesPath')}/recalbox-support-${uniqueID()}.tar.gz`;
  const smartFile = config.get('smartFile');

  // Création de l'archive
  execSync(`${config.get('recalbox.supportScript')} ${archivePath}`);

  // Upload file
  request
    .post(smartFile.url + smartFile.api.upload + smartFile.folderName)
    .auth(smartFile.keys.public, smartFile.keys.private)
    .attach('file', archivePath)
    .then((uploadResponse) => {
      // Link file
      const filePath = uploadResponse.body[0].path;

      request
        .post(smartFile.url + smartFile.api.link)
        .auth(smartFile.keys.public, smartFile.keys.private)
        .send({
          path: filePath,
          read: true,
          list: true
        })
        .then((linkResponse) => {
          // Remove local file
          fs.unlinkSync(archivePath);

          res.json({ url: linkResponse.body.href });
        }).catch((err) => {
          next(err);
        })
    }).catch((err) => {
      next(err);
    });
});

// handles all routes so you do not get a not found error
app.get('/*', (req, res) => {
  res.sendFile(path.resolve('client/build/index.html'));
});

// errors handler
function logErrors(err, req, res, next) {
  console.error(err.stack);

  next(err);
}

function errorsHandler(err, req, res) {
  let error = {};

  error.message = err.message;

  if ('production' !== app.get('env')) {
    error.stack = err.stack;
  }

  error.errors = err.errors || {};

  res.status(500).json(error);
}

app.use(logErrors);
app.use(errorsHandler);

// start the server
app.listen(app.get('port'), (err) => {
  if (err) {
    return console.error(err);
  }

  console.log(`Find the server at: http://localhost:${app.get('port')}/`); // eslint-disable-line no-console
});
