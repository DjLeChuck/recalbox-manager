import React from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import reactStringReplace from 'react-string-replace';
import Button from 'react-bootstrap/lib/Button';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import Modal from 'react-bootstrap/lib/Modal';
import { conf, get, post } from '../../api';
import { promisifyData, cancelPromises } from '../../utils';
import Bios from './Bios';

class BiosContainer extends React.Component {
  static propTypes = {
    t: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);

    this.name = '';
    this.state = {
      loaded: false,
      deleting: false,
      showModal: false,
      biosName: '',
      biosPath: '',
      biosList: [],
      stickyContent: null,
      stickyStyle: 'danger',
    };
  }

  async componentWillMount() {
    const state = await promisifyData(
      conf(['recalbox.biosPath']),
      get('biosList')
    );

    state.loaded = true;

    this.setState(state);
  }

  componentWillUnmount() {
    cancelPromises();
  }

  onBiosUploaded = (result) => {
    if (result.name) {
      const { biosList } = this.state;
      let biosIndex = biosList.findIndex(x => x.name === result.name);
      const list = [...biosList];
      list[biosIndex] = result;

      this.setState({ biosList: list });
    }
  }

  close = () => this.setState({ showModal: false })

  open = biosName => (
    this.setState({
      showModal: true,
      biosName,
    })
  )

  delete = () => {
    this.setState({ deleting: true });

    const { biosName, biosList } = this.state;
    const { t } = this.props;

    post('deleteBios', {
      file: biosName,
    }).then(() => {
      let biosData = biosList.find(x => x.name === biosName);

      biosData.valid = null;

      this.setState({
        deleting: false,
        stickyContent: t('Votre BIOS a bien été supprimé !'),
        stickyStyle: 'success',
        biosData,
      });
    }, () => {
      this.setState({
        deleting: false,
        stickyContent: t("Il semble que votre BIOS n'ait pas été supprimé."),
        stickyStyle: 'danger',
      });
    });

    this.close();
  }

  render() {
    const { t } = this.props;
    const { biosName, showModal, deleting, ...rest } = this.state;

    const modalBody = reactStringReplace(t('Voulez-vous vraiment supprimer %s ?'), '%s', (match, i) => (
      <strong key={i}>{biosName}</strong>
    ));

    return (
      <div>
        <Bios {...rest} biosPath={this.state['recalbox.biosPath']}
          onClick={this.open} onBiosUploaded={this.onBiosUploaded} />

        <Modal show={showModal} onHide={this.close}>
          <Modal.Header closeButton>
            <Modal.Title>{t('Attention')}</Modal.Title>
          </Modal.Header>
          <Modal.Body><p>{modalBody}</p></Modal.Body>
          <Modal.Footer>
            <Button onClick={this.close}>Non</Button>
            <Button bsStyle="warning" onClick={this.delete}>
              {deleting &&
                <Glyphicon glyph="refresh" className="glyphicon-spin" />
              } Oui
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default translate()(BiosContainer);
