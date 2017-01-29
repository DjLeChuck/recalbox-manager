import express from 'express';

const app = express();

app.set('port', (process.env.PORT || 3001));

// express only serves static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
}

// api routes and others
app.get('/hello', (req, res) => {
  res.json(['Hello world!']);
});

// handles all routes so you do not get a not found error
app.get('/*', function (req, res){
  res.sendFile('client/build/index.html', { root: __dirname })
});

// start the server
app.listen(app.get('port'),  (err) => {
  if (err) {
    return console.error(err);
  }

  console.log(`Find the server at: http://localhost:${app.get('port')}/`); // eslint-disable-line no-console
});
