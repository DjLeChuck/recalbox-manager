import React from 'react';
import { Route, IndexRoute } from 'react-router';
import AnonymousLayout from './components/AnonymousLayout';
import Layout from './components/Layout';
import Login from './components/login/Container';
import Home from './components/home/Container';
import Audio from './components/audio/Container';
import Bios from './components/bios/Container';
import Configuration from './components/configuration/Container';
import Controllers from './components/controllers/Container';
import Help from './components/help/Container';
import Logs from './components/logs/Container';
import Monitoring from './components/monitoring/Container';
import RecalboxConf from './components/recalboxConf/Container';
import RomsList from './components/roms/list/Container';
import RomsView from './components/roms/view/Container';
import Screenshots from './components/screenshots/Container';
import Systems from './components/systems/Container';
import Security from './components/security/Container';
import NotFound from './components/NotFound';
import { get } from './api';

const Auth = async (nextState, replace, callback) => {
  const { needAuth } = await get('needAuth');

  if (needAuth) {
    return callback(replace('/login'));
  }

  callback();
};

const logOut = async (nextState, replace, callback) => {
  await get('logout');

  return callback(replace('/login'));
};

const routes = (
  <Route>
    <Route path="/login" component={AnonymousLayout}>
      <IndexRoute component={Login} />
    </Route>
    <Route component={Layout} path="/" onEnter={Auth}>
      <IndexRoute component={Home} />
      <Route path="audio" component={Audio} />
      <Route path="bios" component={Bios} />
      <Route path="configuration" component={Configuration} />
      <Route path="controllers" component={Controllers} />
      <Route path="help" component={Help} />
      <Route path="logs" component={Logs} />
      <Route path="monitoring" component={Monitoring} />
      <Route path="recalbox-conf" component={RecalboxConf} />
      <Route path="roms">
        <IndexRoute component={RomsList} />
        <Route path=":system" component={RomsView}>
          <Route path="**" />
        </Route>
      </Route>
      <Route path="screenshots" component={Screenshots} />
      <Route path="systems" component={Systems} />
      <Route path="security" component={Security} />
      <Route path="logout" onEnter={logOut} />
      <Route path="*" component={NotFound} />
    </Route>
  </Route>
);

export default routes;
