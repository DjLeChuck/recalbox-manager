import React from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import Button from 'react-bootstrap/lib/Button';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';

const TakeButton = ({ t, working, onClick }) => (
  <Button bsStyle="success" onClick={onClick}>
    {working &&
      <Glyphicon glyph="refresh" className="glyphicon-spin" />
    } {t('Faire une capture')}
  </Button>
);

TakeButton.propTypes = {
  t: PropTypes.func.isRequired,
  working: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired,
};

TakeButton.defaultProps = {
  onClick: () => {},
};

export default translate()(TakeButton);
