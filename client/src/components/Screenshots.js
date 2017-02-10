import React, { PropTypes } from 'react';
import Loader from 'react-loader';
import { translate } from 'react-i18next';
import { Row, Col, Form, Panel, Button, Glyphicon, Modal } from 'react-bootstrap';
import reactStringReplace from 'react-string-replace';
import { conf, get, post } from '../api';

class Screenshots extends React.Component {
  static propTypes = {
    t: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);

    this.state = {
      isLoaded: false,
      screenshotsList: [],
    };
  }

  componentWillMount() {
    const promises = [];

    promises.push(conf(['recalbox.screenshotsPath']));
    promises.push(get('serverAddress'));
    promises.push(get('screenshotsList'));

    Promise.all(promises).then((values) => {
      let newState = { isLoaded: true, showModal: false };

      for (const value of values) {
        Object.assign(newState, value);
      }

      this.setState(newState);
    }).catch((err) => {
      console.error(err);
    });
  }

  takeScreenshot = (e) => {
    e.preventDefault();

    this.setState({ isTakingScreenshot: true });

    post('takeScreenshot').then((response) => {
      let screenshots = [...this.state.screenshotsList];

      screenshots.push(response.data);

      this.setState({
        isTakingScreenshot: false,
        screenshotsList: screenshots,
      });
    }).catch((err) => {
      console.error(err);
    });
  }

  askBeforeDeleteScreenshot = (e) => {
    e.preventDefault();

    const target = e.currentTarget;

    this.setState({
      screenshotToDelete: target.dataset.name,
      showModal: true,
    });
  }

  deleteScreenshot = (e) => {
    e.preventDefault();

    this.setState({ isDeletingScreenshot: true });

    const toDeleteName = this.state.screenshotToDelete;

    post('deleteScreenshot', {
      file: toDeleteName,
    }).then(() => {
      let screenshots = [...this.state.screenshotsList];
      const deletedIndex = screenshots.findIndex((s) => s === toDeleteName);

      screenshots.splice(deletedIndex, 1);

      this.setState({
        isDeletingScreenshot: false,
        screenshotsList: screenshots,
      });
    }).catch((err) => {
      console.error(err);
    });

    this.closeModal();
  }

  closeModal = () => {
    this.setState({ showModal: false });
  }

  render() {
    const { t } = this.props;
    const screenshotPath = reactStringReplace(t('Le résultat sera sauvegardé dans le dossier %s.'), '%s', (match, i) => (
      <code key={i}>{this.state['recalbox.screenshotsPath']}</code>
    ));
    const deleteConfirmation = reactStringReplace(t('Voulez-vous vraiment supprimer %s ?'), '%s', (match, i) => (
      <strong key={i}>{this.state.screenshotToDelete}</strong>
    ));

    return (
      <div>
        <div className="page-header"><h1>{t("Gestion des screenshots")}</h1></div>

        <Form onSubmit={this.takeScreenshot}>
          <Panel header={<h3>{t("Effectuer une capture d'écran")}</h3>}>
            <p>{t("Le bouton ci-dessous vous permet de prendre une capture d'écran de l'affichage actuel de recalbox.")}</p>
            <p>{screenshotPath}</p>

            <p>
              <Button bsStyle="success" type="submit" name="screenshot">
                {this.state.isTakingScreenshot &&
                  <Glyphicon glyph="refresh" className="glyphicon-spin" />
                } {t("Faire une capture")}
              </Button>
            </p>
          </Panel>
        </Form>

        <Loader loaded={this.state.isLoaded}>
          <Row className="is-flex">
          {this.state.screenshotsList.map((screenshot, index) => {
            return (
              <Col key={index} md={3} xs={6}>
                <Panel>
                  <div className="pull-left relative text-center">
                    <div className="top-right">
                      <Button bsStyle="danger" bsSize="small"
                        data-name={screenshot}
                        onClick={this.askBeforeDeleteScreenshot}>
                        <Glyphicon glyph="trash" />
                      </Button><br />

                      <a href={`//${this.state.serverAddress.ip}:${this.state.serverAddress.port}/screenshots/view/${screenshot}`}
                        target="_blank" className="btn btn-success btn-sm">
                        <Glyphicon glyph="search" />
                      </a>
                    </div>
                    <img src={`/screenshots/view/${screenshot}`} alt={screenshot}
                      className="img-responsive img-thumbnail" />
                  </div>
                </Panel>
              </Col>
            );
          })}
          </Row>
        </Loader>

        <Modal show={this.state.showModal} onHide={this.closeModal}>
          <div>
            <div className="modal-header">
              <Button className="close" onClick={this.closeModal}>
                <span aria-hidden="true">&times;</span>
              </Button>
              <h4 className="modal-title">{t("Attention")}</h4>
            </div>
            <div className="modal-body">
              <p>{deleteConfirmation}</p>
            </div>
            <div className="modal-footer">
              <Button bsStyle="default" onClick={this.closeModal}>
                {t("Non")}
              </Button>
              <Button bsStyle="warning" onClick={this.deleteScreenshot}>
                {this.state.isDeleting &&
                  <Glyphicon glyph="refresh" className="glyphicon-spin" />
                } {t("Oui")}
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

export default translate()(Screenshots);
