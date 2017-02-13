import React, { PropTypes } from 'react';
import { translate } from 'react-i18next';
import { Glyphicon, Button } from 'react-bootstrap';

class FormActions extends React.Component {
  static propTypes = {
    t: PropTypes.func.isRequired,
    reset: PropTypes.func.isRequired,
    isSaving: PropTypes.bool.isRequired,
  }

  static defaultProps = {
    isSaving: false,
  };

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
