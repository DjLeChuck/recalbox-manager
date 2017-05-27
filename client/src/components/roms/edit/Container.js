import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import Modal from 'react-bootstrap/lib/Modal';
import RomsEdit from './Edit';
import RomsEditForm from '../../forms/RomsEdit';
import { post } from '../../../api';

class RomsEditContainer extends Component {
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
      editing: false,
      showModal: false,
    };
  }

  open = () => this.setState({ showModal: true });

  close = () => this.setState({ showModal: false });

  edit = (gameData) => {
    const { system, onSuccess, onError } = this.props;

    this.setState({ editing: true });

    post('editRom', {
      gameData,
      system,
    }).then(
      ({ data }) => onSuccess(data),
      () => onError()
    ).then(() => {
      this.setState({ editing: false });
      this.close();
    });
  };

  render() {
    const { rom, rom: { name }, ...rest } = this.props;
    const { showModal, editing } = this.state;

    return (
      <div>
        <RomsEdit onClick={this.open} />

        <Modal show={showModal} onHide={this.close}>
          <Modal.Header closeButton>
            <Modal.Title>{name}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <RomsEditForm {...rest} saving={editing} defaultValues={{ ...rom }}
              onSubmit={this.edit} close={this.close} rom={rom} />
          </Modal.Body>
        </Modal>
      </div>
    );
  }
}

export default translate()(RomsEditContainer);
