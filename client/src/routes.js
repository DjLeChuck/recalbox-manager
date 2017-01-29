import React from 'react'
import { Route, IndexRoute } from 'react-router'
import Layout from './components/Layout';
import Index from './components/Index';
import Audio from './components/Audio';
import NotFound from './components/NotFound';

const routes = (
  <Route path="/" component={Layout}>
    <IndexRoute component={Index}/>
    <Route path="/audio" component={Audio}/>
    <Route path="*" component={NotFound}/>
  </Route>
);

export default routes;
