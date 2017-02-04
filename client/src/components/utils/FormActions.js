import React from 'react';
import { translate } from 'react-i18next';
import { Glyphicon, Button } from 'react-bootstrap';

class FormActions extends React.Component {
  render() {
    const { t } = this.props;

    return (
      <p>
        <Button bsStyle="danger" onClick={this.props.reset}>
          {t('Annuler')}
        </Button>{" "}
        <Button bsStyle="success" type="submit" disabled={this.props.isSaving}>
          {this.props.isSaving &&
            <Glyphicon glyph="refresh" className="glyphicon-spin" />
          } {t('Enregistrer')}
        </Button>
      </p>
    );
  }
}

export default translate()(FormActions);
