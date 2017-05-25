import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import Button from 'react-bootstrap/lib/Button';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import Modal from 'react-bootstrap/lib/Modal';
import reactStringReplace from 'react-string-replace';
import { conf, get, post } from '../../api';
import { promisifyData, cancelPromises } from '../../utils';
import Screenshots from './Screenshots';

class ScreenshotsContainer extends Component {
  static propTypes = {
    t: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);

    this.state = {
      loaded: false,
      screenshotsList: [],
      stickyContent: null,
      stickyStyle: 'danger',
    };
  }

  async componentWillMount() {
    const state = await promisifyData(
      conf(['recalbox.screenshotsPath']),
      get('hostname'),
      get('screenshotsList'),
      get('canTakeScreenshots')
    );

    state.loaded = true;
    state.showModal = false;

    this.setState(state);
  }

  componentWillUnmount() {
    cancelPromises();
  }

  askBeforeDeleteScreenshot = screenshotToDelete => (
    this.setState({
      showModal: true,
      screenshotToDelete,
    })
  );

  deleteScreenshot = (e) => {
    e.preventDefault();

    this.setState({ isDeletingScreenshot: true });

    const toDeleteName = this.state.screenshotToDelete;

    post('deleteScreenshot', {
      file: toDeleteName,
    }).then(() => {
      let screenshots = [...this.state.screenshotsList];
      const deletedIndex = screenshots.findIndex(x => x === toDeleteName);

      screenshots.splice(deletedIndex, 1);

      this.setState({
        isDeletingScreenshot: false,
        screenshotsList: screenshots,
        stickyContent: this.props.t('Votre screenshot a bien été supprimé !'),
        stickyStyle: 'success',
      });
    }, () => (
      this.setState({
        isDeletingScreenshot: false,
        stickyContent: this.props.t("Il semble que votre screenshot n'ait pas été supprimé."),
        stickyStyle: 'danger',
      })
    ));

    this.closeModal();
  };

  closeModal = () => this.setState({ showModal: false });

  screenshotAction = (success, data) => {
    if (success) {
      const screenshotsList = [...this.state.screenshotsList];

      screenshotsList.push(data);

      this.setState({
        stickyContent: null,
        screenshotsList,
      });
    } else {
      this.setState({ stickyContent: data.message });
    }
  };

  render() {
    const { t } = this.props;
    const { deleting, showModal, screenshotToDelete, ...rest } = this.state;
    const deleteConfirmation = reactStringReplace(t('Voulez-vous vraiment supprimer %s ?'), '%s', (match, i) => (
      <strong key={i}>{screenshotToDelete}</strong>
    ));

    return (
      <div>
        <Screenshots {...rest} onDelete={this.askBeforeDeleteScreenshot}
          screenshotsPath={this.state['recalbox.screenshotsPath']}
          screenshotOnSuccess={data => this.screenshotAction(true, data)}
          screenshotOnError={err => this.screenshotAction(false, err)} />

        <Modal show={showModal} onHide={this.closeModal}>
          <Modal.Header closeButton>
            <Modal.Title>{t("Attention")}</Modal.Title>
          </Modal.Header>

          <Modal.Body><p>{deleteConfirmation}</p></Modal.Body>

          <Modal.Footer>
            <Button bsStyle="default" onClick={this.closeModal}>
              {t('Non')}
            </Button>
            <Button bsStyle="warning" onClick={this.deleteScreenshot}>
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

export default translate()(ScreenshotsContainer);
