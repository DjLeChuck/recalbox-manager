var _ = require('koa-route');
var koa = require('koa');
var render = require('koa-ejs');
var path = require('path');
var bodyParser = require('koa-bodyparser');
var serve = require('koa-static');
var session = require('koa-session');
var flash = require('koa-flash');

// Controllers
var home = require('./controllers/home');
var monitoring = require('./controllers/monitoring');
var audio = require('./controllers/audio');
var configuration = require('./controllers/configuration');
var controllers = require('./controllers/controllers');
var systems = require('./controllers/systems');
var logs = require('./controllers/logs');
var recalboxConf = require('./controllers/recalbox-conf');
var support = require('./controllers/support');

var app = koa();

app.keys = ['The cake is a lie!'];

app.use(serve(path.join(__dirname, '/assets')));
app.use(session(app));
app.use(flash());
app.use(bodyParser());
app.use(function *(next) {
  this.state.config = require('./lib/utils').getConfig();
  this.state.api = require('./lib/api');

  yield next;
});

// Configure ejs
render(app, {
  root: path.join(__dirname, 'views'),
  viewExt: 'ejs',
  cache: false,
  debug: true
});

app.use(function *(next) {
  this.state.flash = this.state.flash || {};

  yield next;
});

// Routes
app.use(_.get('/', home.index));
app.use(_.get('/monitoring', monitoring.index));
app.use(_.get('/audio', audio.index));
app.use(_.post('/audio', audio.save));
app.use(_.get('/configuration', configuration.index));
app.use(_.post('/configuration', configuration.save));
app.use(_.get('/controllers', controllers.index));
app.use(_.post('/controllers', controllers.save));
app.use(_.get('/systems', systems.index));
app.use(_.post('/systems', systems.save));
app.use(_.get('/logs', logs.index));
app.use(_.post('/logs', logs.index));
app.use(_.get('/recalbox-conf', recalboxConf.index));
app.use(_.post('/recalbox-conf', recalboxConf.save));
app.use(_.get('/support', support.index));
app.use(_.post('/support', support.sendReport));

app.listen(3000);
