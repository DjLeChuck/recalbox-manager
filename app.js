var _ = require('koa-route');
var koa = require('koa');
var render = require('koa-ejs');
var path = require('path');
var body = require('koa-better-body');
var serve = require('koa-static');
var session = require('koa-session');
var flash = require('koa-flash');
var locale = require('koa-locale');
var i18n = require('koa-i18n');

// Controllers
var home = require('./controllers/home');
var monitoring = require('./controllers/monitoring');
var audio = require('./controllers/audio');
var configuration = require('./controllers/configuration');
var controllers = require('./controllers/controllers');
var systems = require('./controllers/systems');
var logs = require('./controllers/logs');
var recalboxConf = require('./controllers/recalbox-conf');
var help = require('./controllers/help');
var roms = require('./controllers/roms');
var isDev = 'development' === (process.env.NODE_ENV || 'production');

var app = koa();

locale(app);

app.keys = ['The cake is a lie!'];

app.use(serve(path.join(__dirname, '/assets')));
app.use(serve('/recalbox/share/roms'));
app.use(session(app));
app.use(flash());
app.use(body());

// Configure ejs
render(app, {
  root: path.join(__dirname, 'views'),
  viewExt: 'ejs',
  cache: !isDev,
  debug: isDev
});

app.use(function *(next) {
  // Switch locale
  if (this.request.query.locale) {
    this.cookies.set('locale', this.request.query.locale);
  }

  yield next;
});

app.use(i18n(app, {
  directory: './config/locales',
  locales: ['fr', 'en'],
  modes: [
    'query', //  optional detect querystring - `/?locale=en-US`
    'cookie', //  optional detect cookie      - `Cookie: locale=zh-TW`
    'header' //  optional detect header      - `Accept-Language: zh-CN,zh;q=0.5`
  ]
}));

app.use(function *(next) {
  // Define empty flash message container if not exists
  this.state.flash = this.state.flash || {};

  this.state.config = require('./lib/utils').getConfig(this.i18n);
  this.state.api = require('./lib/api')();
  this.state.currentUrl = this.request.path.replace(/\/+$/g,"");

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
app.use(_.get('/help', help.index));
app.use(_.post('/help', help.post));
app.use(_.get('/roms', roms.list));
app.use(_.post('/roms/upload', roms.upload));
app.use(_.post('/roms/launch', roms.launch));
app.use(_.post('/roms/update', roms.update));
app.use(_.post('/roms/delete', roms.delete));
app.use(_.get('/roms/:name/:path*', roms.view));

app.set('port', process.env.PORT || 3000);
