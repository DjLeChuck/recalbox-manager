var _ = require('koa-route');
var koa = require('koa');
var render = require('koa-ejs');
var path = require('path');
var fs = require('fs');
var body = require('koa-better-body');
var serve = require('koa-static');
var session = require('koa-session');
var flash = require('koa-flash');
var locale = require('koa-locale');
var Gettext = require('node-gettext');

// Controllers
var home = require('./controllers/home');
var monitoring = require('./controllers/monitoring');
var audio = require('./controllers/audio');
var bios = require('./controllers/bios');
var configuration = require('./controllers/configuration');
var controllers = require('./controllers/controllers');
var systems = require('./controllers/systems');
var logs = require('./controllers/logs');
var recalboxConf = require('./controllers/recalbox-conf');
var help = require('./controllers/help');
var roms = require('./controllers/roms');
var screenshots = require('./controllers/screenshots');
var isDev = 'development' === (process.env.NODE_ENV || 'production');

var app = koa();

locale(app);

app.keys = ['The cake is a lie!'];

app.use(serve(path.join(__dirname, '/assets')));
app.use(serve('/recalbox/share/roms'));
app.use(serve('/recalbox/share/screenshots'));
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
  let managerLocale = 'en-US';
  let localeQuery = this.request.getLocaleFromQuery();

  if (localeQuery) {
    managerLocale = localeQuery;
  } else {
    let localeCookie = this.request.getLocaleFromCookie();

    if (localeCookie) {
      managerLocale = localeCookie;
    } else {
      managerLocale = this.request.getLocaleFromHeader();
    }
  }

  this.cookies.set('locale', managerLocale);

  var gt = new Gettext();
  var locale = managerLocale.replace('-', '_');
  var moFile = `config/locales/${locale}.mo`;
  moFile = fs.existsSync(moFile) ? moFile : 'config/locales/en_US.mo';
  var fileContents = require('fs').readFileSync(moFile);
  gt.addTextdomain(locale, fileContents);

  this.state.gt = gt;

  yield next;
});

app.use(function *(next) {
  // Define empty flash message container if not exists
  this.state.flash = this.state.flash || {};

  this.state.config = require('./lib/utils').getConfig(this.state.gt);
  this.state.api = require('./lib/api')();
  this.state.currentUrl = this.request.path.replace(/\/+$/g,"");

  yield next;
});

// Routes
app.use(_.get('/', home.index));
app.use(_.get('/monitoring', monitoring.index));
app.use(_.get('/audio', audio.index));
app.use(_.post('/audio', audio.save));
app.use(_.get('/bios', bios.index));
app.use(_.post('/bios/upload', bios.upload));
app.use(_.post('/bios/delete', bios.delete));
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
app.use(_.get('/screenshots', screenshots.index));
app.use(_.post('/screenshots/delete', screenshots.delete));

app.listen(process.env.PORT || 3000);
