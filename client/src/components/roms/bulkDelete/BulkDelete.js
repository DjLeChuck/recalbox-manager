import React from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import Button from 'react-bootstrap/lib/Button';

const RomsBulkDelete = ({ t, show, onClick }) => (
  !show ?
    null :
    <Button bsStyle="danger" onClick={onClick}>
      {t('Supprimer les ROMs sélectionnées')}
    </Button>
);

RomsBulkDelete.propTypes = {
  t: PropTypes.func.isRequired,
  show: PropTypes.bool.isRequired,
  onClick: PropTypes.func,
};

export default translate()(RomsBulkDelete);
