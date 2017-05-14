import React from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import Loader from 'react-loader';
import StickyAlert from '../utils/StickyAlert';
import ConfigurationForm from '../forms/Configuration';

let stickyContainer;

const Configuration = ({ t, loaded, stickyStyle, stickyContent, ...rest }) => (
  <div ref={el => stickyContainer = el}>
    <div className="page-header"><h1>{t('Configuration')}</h1></div>

    <p className="important">
      {t('Cette page permet de gérer différentes configurations de recalbox tel que les paramètres Wi-Fi, la timezone, la locale, etc.')}
    </p>

    <StickyAlert bsStyle={stickyStyle} container={stickyContainer}>
      {stickyContent}
    </StickyAlert>

    <Loader loaded={loaded}>
      <ConfigurationForm {...rest} />
    </Loader>
  </div>
);

Configuration.propTypes = {
  t: PropTypes.func.isRequired,
  loaded: PropTypes.bool.isRequired,
  stickyStyle: PropTypes.string,
  stickyContent: PropTypes.string,
};

export default translate()(Configuration);
