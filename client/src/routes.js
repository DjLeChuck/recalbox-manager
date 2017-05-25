import React from 'react';
import { Route, IndexRoute } from 'react-router';
import Layout from './components/Layout';
import Home from './components/home/Container';
import Audio from './components/audio/Container';
import Bios from './components/bios/Container';
import Configuration from './components/configuration/Container';
import Controllers from './components/controllers/Container';
import Help from './components/Help';
import Logs from './components/Logs';
import Monitoring from './components/monitoring/Container';
import RecalboxConf from './components/RecalboxConf';
import RomsList from './components/roms/List';
import RomsView from './components/roms/View';
import Screenshots from './components/Screenshots';
import Systems from './components/systems/Container';
import NotFound from './components/NotFound';

const routes = (
  <Route path="/" component={Layout}>
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
    <Route path="*" component={NotFound} />
  </Route>
);

export default routes;
