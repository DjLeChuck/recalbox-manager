var _ = require('koa-route');
var koa = require('koa');
var render = require('koa-ejs');
var path = require('path');
var bodyParser = require('koa-bodyparser');
var serve = require('koa-static');

// Controllers
var main = require('./controllers/main');
var audio = require('./controllers/audio');
var configuration = require('./controllers/configuration');
var controllers = require('./controllers/controllers');
var systems = require('./controllers/systems');

var app = koa();

app.use(bodyParser());
app.use(serve(path.join(__dirname, '/assets')));

// Configure ejs
render(app, {
  root: path.join(__dirname, 'views'),
  viewExt: 'ejs',
  cache: false,
  debug: true
});

// Routes
app.use(_.get('/', main.home));
app.use(_.get('/audio', audio.index));
app.use(_.post('/audio', audio.save));
app.use(_.get('/configuration', configuration.index));
app.use(_.post('/configuration', configuration.save));
app.use(_.get('/controllers', controllers.index));
app.use(_.post('/controllers', controllers.save));
app.use(_.get('/systems', systems.index));
app.use(_.post('/systems', systems.save));

app.listen(3000);
