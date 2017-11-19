import React from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import Button from 'react-bootstrap/lib/Button';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';

const ActionsButtons = ({ t, /*resetForm,*/ saving }) => (
  <p>
    {/* {resetForm &&
      <span>
        <Button bsStyle="danger" onClick={resetForm}>
          {t('Annuler')}
        </Button>{" "}
      </span>
    } */}
    <Button bsStyle="success" type="submit" disabled={saving}>
      {saving &&
        <Glyphicon glyph="refresh" className="glyphicon-spin" />
      } {t('Enregistrer')}
    </Button>
  </p>
);

ActionsButtons.propTypes = {
  t: PropTypes.func.isRequired,
  resetForm: PropTypes.func,
  saving: PropTypes.bool.isRequired,
};

ActionsButtons.defaultProps = {
  saving: false,
};

export default translate()(ActionsButtons);
