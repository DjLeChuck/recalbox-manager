import React from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import Loader from 'react-loader';
import StickyAlert from '../utils/StickyAlert';
import SystemsForm from '../forms/Systems';

let stickyContainer;

const Systems = ({ t, loaded, stickyStyle, stickyContent, ...rest }) => (
  <div ref={el => stickyContainer = el}>
    <div className="page-header"><h1>{t('Système')}</h1></div>

    <p className="important">
      {t('Cette page permet de gérer les différents réglages système de recalbox.')}
    </p>

    <StickyAlert bsStyle={stickyStyle} container={stickyContainer}>
      {stickyContent}
    </StickyAlert>

    <Loader loaded={loaded}>
      <SystemsForm {...rest} />
    </Loader>
  </div>
);

Systems.propTypes = {
  t: PropTypes.func.isRequired,
  loaded: PropTypes.bool.isRequired,
  stickyStyle: PropTypes.string,
  stickyContent: PropTypes.string,
};

export default translate()(Systems);
