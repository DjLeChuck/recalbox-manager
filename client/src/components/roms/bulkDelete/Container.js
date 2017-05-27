import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import Button from 'react-bootstrap/lib/Button';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import Modal from 'react-bootstrap/lib/Modal';
import RomsBulkDelete from './BulkDelete';
import { post } from '../../../api';

class RomsBulkDeleteContainer extends Component {
  static propTypes = {
    t: PropTypes.func.isRequired,
    system: PropTypes.string.isRequired,
    list: PropTypes.array.isRequired,
    onSuccess: PropTypes.func.isRequired,
    onError: PropTypes.func.isRequired,
  };

  static defaultProps = {
    list: [],
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
    const { system, list, onSuccess, onError } = this.props;

    this.setState({ deleting: true });

    post('deleteRom', {
      files: list,
      system,
    }).then(
      () => onSuccess(list),
      () => onError()
    ).then(() => {
      this.setState({ deleting: false });
      this.close();
    });
  };

  render() {
    const { t, list } = this.props;
    const { showModal, deleting } = this.state;
    const show = 0 < list.length;

    return (
      <div>
        <RomsBulkDelete show={show} onClick={this.open} />

        <Modal show={showModal} onHide={this.close}>
          <Modal.Header closeButton>
            <Modal.Title>{t('Attention')}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p>{t('Voulez-vous vraiment supprimer toutes ces ROMs ?')}</p>
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

export default translate()(RomsBulkDeleteContainer);
