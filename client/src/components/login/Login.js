import React from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import StickyAlert from '../utils/StickyAlert';
import LoginForm from '../forms/Login';

let stickyContainer;

const Login = ({ t, stickyStyle, stickyContent, ...rest }) => (
  <div ref={el => stickyContainer = el}>
    <div className="page-header"><h1>{t('Connexion')}</h1></div>

    <StickyAlert bsStyle={stickyStyle} container={stickyContainer}>
      {stickyContent}
    </StickyAlert>

    <LoginForm {...rest} />
  </div>
);

Login.propTypes = {
  t: PropTypes.func.isRequired,
  stickyStyle: PropTypes.string,
  stickyContent: PropTypes.string,
};

export default translate()(Login);
