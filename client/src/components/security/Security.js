import React from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import Loader from 'react-loader';
import StickyAlert from '../utils/StickyAlert';
import SecurityForm from '../forms/Security';

let stickyContainer;

const Security = ({ t, loaded, stickyStyle, stickyContent, ...rest }) => (
  <div ref={el => stickyContainer = el}>
    <div className="page-header"><h1>{t('Sécurité')}</h1></div>

    <p className="important">
      {t("Cette page permet de sécuriser l'accès à Recalbox Manager grâce à un identifiant et un mot de passe.")}
    </p>

    <StickyAlert bsStyle={stickyStyle} container={stickyContainer}>
      {stickyContent}
    </StickyAlert>

    <Loader loaded={loaded}>
      <SecurityForm {...rest} />
    </Loader>
  </div>
);

Security.propTypes = {
  t: PropTypes.func.isRequired,
  loaded: PropTypes.bool.isRequired,
  stickyStyle: PropTypes.string,
  stickyContent: PropTypes.string,
};

export default translate()(Security);
