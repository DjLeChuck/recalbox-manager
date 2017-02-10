import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import config from 'config';
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
app.use('/screenshots/view', express.static(config.get('recalbox.screenshotsPath')));

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

// handles all routes so you do not get a not found error
app.get('/*', (req, res) => {
  res.sendFile(path.resolve('client/build/index.html'));
});

// start the server
app.listen(app.get('port'), '127.0.0.1', (err) => {
  if (err) {
    return console.error(err);
  }

  console.log(`Find the server at: http://localhost:${app.get('port')}/`); // eslint-disable-line no-console
});
