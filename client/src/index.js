import React from 'react';
import ReactDOM from 'react-dom';
import { I18nextProvider } from 'react-i18next';
import entries from 'object.entries';
import AppRoutes from './components/AppRoutes';
import i18n from './i18n';
import './dependencies/css/bootstrap.min.css';
import './dependencies/css/theme.css';
import './index.css';

if (!Object.entries) {
  entries.shim();
}

ReactDOM.render(
  <I18nextProvider i18n={i18n}>
    <AppRoutes />
  </I18nextProvider>,
  document.getElementById('root')
);
