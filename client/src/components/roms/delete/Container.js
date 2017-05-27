import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import reactStringReplace from 'react-string-replace';
import Button from 'react-bootstrap/lib/Button';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import Modal from 'react-bootstrap/lib/Modal';
import RomsDelete from './Delete';
import { post } from '../../../api';

class RomsDeleteContainer extends Component {
  static propTypes = {
    t: PropTypes.func.isRequired,
    system: PropTypes.string.isRequired,
    rom: PropTypes.shape({
      name: PropTypes.string.isRequired,
      path: PropTypes.string.isRequired,
    }).isRequired,
    onSuccess: PropTypes.func.isRequired,
    onError: PropTypes.func.isRequired,
  };

  static defaultProps = {
    onSuccess: () => {},
    onError: () => {},
  };

  constructor(props) {
    super(props);

    this.state = {
      deleting: false,
      showModal: false,
    };
  }

  open = () => this.setState({ showModal: true });

  close = () => this.setState({ showModal: false });

  delete = () => {
    const { system, rom: { path }, onSuccess, onError } = this.props;

    this.setState({ deleting: true });

    post('deleteRom', {
      files: [path],
      system,
    }).then(
      () => onSuccess(path),
      () => onError()
    ).then(() => {
      this.setState({ deleting: false });
      this.close();
    });
  };

  render() {
    const { t, rom: { name } } = this.props;
    const { showModal, deleting } = this.state;

    return (
      <div>
        <RomsDelete onClick={this.open} />

        <Modal show={showModal} onHide={this.close}>
          <Modal.Header closeButton>
            <Modal.Title>{t('Attention')}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>
              {reactStringReplace(t('Voulez-vous vraiment supprimer %s ?'), '%s', (match, i) => (
                <strong key={i}>{name}</strong>
              ))}
            </p>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.close}>{t('Non')}</Button>
            <Button bsStyle="warning" onClick={this.delete}>
              {deleting &&
                <Glyphicon glyph="refresh" className="glyphicon-spin" />
              } {t('Oui')}
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default translate()(RomsDeleteContainer);
