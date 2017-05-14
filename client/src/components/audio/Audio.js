import React from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import Loader from 'react-loader';
import StickyAlert from '../utils/StickyAlert';
import AudioForm from '../forms/Audio';

let stickyContainer;

const Audio = ({ t, loaded, stickyStyle, stickyContent, ...rest }) => (
  <div ref={el => stickyContainer = el}>
    <div className="page-header"><h1>{t('Audio')}</h1></div>

    <p className="important">
      {t('Cette page permet de gérer la partie audio de recalbox.')}
    </p>

    <StickyAlert bsStyle={stickyStyle} container={stickyContainer}>
      {stickyContent}
    </StickyAlert>

    <Loader loaded={loaded}>
      <AudioForm {...rest} />
    </Loader>
  </div>
);

Audio.propTypes = {
  t: PropTypes.func.isRequired,
  loaded: PropTypes.bool.isRequired,
  saving: PropTypes.bool.isRequired,
  stickyStyle: PropTypes.string,
  stickyContent: PropTypes.string,
};

export default translate()(Audio);
