import React, { PropTypes } from 'react';
import Loader from 'react-loader';
import { translate } from 'react-i18next';
import Button from 'react-bootstrap/lib/Button';
import Collapse from 'react-bootstrap/lib/Collapse';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import Modal from 'react-bootstrap/lib/Modal';
import Table from 'react-bootstrap/lib/Table';
import Well from 'react-bootstrap/lib/Well';
import reactStringReplace from 'react-string-replace';
import CustomDropzone from './utils/Dropzone';
import StickyAlert from './utils/StickyAlert';
import { conf, get, post } from '../api';
import { promisifyData, cancelPromises } from '../utils';

class Bios extends React.Component {
  static propTypes = {
    t: PropTypes.func.isRequired,
  }

  constructor(props) {
    super(props);

    this.name = '';
    this.state = {
      isLoaded: false,
      isDeleting: false,
      showModal: false,
      biosName: '',
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

    state.isLoaded = true;

    this.setState(state);
  }

  componentWillUnmount() {
    cancelPromises();
  }

  onUploadSuccess = (result) => {
    if (result.name) {
      let biosIndex = this.state.biosList.findIndex((item) => {
        return item.name === result.name;
      });
      const list = [...this.state.biosList];
      list[biosIndex] = result;

      this.setState({ biosList: list });
    }
  }

  close = () => {
    this.setState({ showModal: false });
  }

  open = (e) => {
    this.setState({
      biosName: e.currentTarget.dataset.name,
      showModal: true,
    });
  }

  delete = () => {
    this.setState({ isDeleting: true });

    const biosName = this.state.biosName;

    post('deleteBios', {
      file: biosName,
    }).then(() => {
      let biosData = this.state.biosList.find((item) => {
        return item.name === biosName;
      });

      biosData.valid = null;

      this.setState({
        isDeleting: false,
        biosData,
        stickyContent: this.props.t('Votre BIOS a bien été supprimé !'),
        stickyStyle: 'success',
      });
    }, () => {
      this.setState({
        isDeleting: false,
        stickyContent: this.props.t("Il semble que votre BIOS n'ait pas été supprimé."),
        stickyStyle: 'danger',
      });
    });

    this.close();
  }

  render() {
    const { t } = this.props;

    const biosName = reactStringReplace(t('Voulez-vous vraiment supprimer %s ?'), '%s', (match, i) => (
      <strong key={i}>{this.state.biosName}</strong>
    ));

    return (
      <div>
        <div className="page-header"><h1>{t("BIOS")}</h1></div>

        <StickyAlert bsStyle={this.state.stickyStyle} container={this}>
          {this.state.stickyContent}
        </StickyAlert>

        <p>{t("Voici la liste de l'ensemble des BIOS supportés par recalbox.")}</p>
        <p>{t("Les fichiers se trouvent dans le répertoire suivant :")} <code>{this.state['recalbox.biosPath']}</code></p>
        <p>{t('Grâce à la colonne "Valide" du tableau, vous pouvez voir si les BIOS que vous possédez sont bons ou non.')}</p>

        <Button bsStyle="primary"
          onClick={ () => this.setState({ open: !this.state.open })}>
          {t("Uploader des BIOS")}
        </Button>
        <Collapse in={this.state.open}>
          <div>
            <Well>
              <CustomDropzone type="bios" onSuccess={this.onUploadSuccess} />
            </Well>
          </div>
        </Collapse>

        <Loader loaded={this.state.isLoaded}>
          <Table striped hover className="table-nonfluid">
            <thead>
              <tr>
                <th className="col-md-2">{t("BIOS")}</th>
                <th className="col-md-3">{t("MD5 attendu")}</th>
                <th className="col-md-1">{t("Valide")}</th>
                <th className="col-md-1">{t("Action")}</th>
              </tr>
            </thead>
            <tbody>
            {this.state.biosList.map((item, index) => {
              let validity;
              let deletion = <Button bsStyle="danger" onClick={this.open}
                data-name={item.name} data-index={index}>
                <Glyphicon glyph="trash" aria-hidden="true" />
              </Button>;

              if (true === item.valid) {
                validity = <Glyphicon glyph="ok"
                  className="medium-glyphicon alert alert-success" />
              } else if (false === item.valid) {
                validity = <Glyphicon glyph="remove"
                  className="medium-glyphicon alert alert-danger" />
              } else {
                validity = <Glyphicon glyph="minus"
                  className="medium-glyphicon alert" />
                deletion = undefined;
              }

              return (
                <tr key={index} data-row={index}>
                  <td>{item.name}</td>
                  <td>{item.md5}</td>
                  <td>{validity}</td>
                  <td>{deletion}</td>
                </tr>
              );
            })}
            </tbody>
          </Table>
        </Loader>

        <Modal show={this.state.showModal} onHide={this.close}>
          <Modal.Header closeButton>
            <Modal.Title>{t("Attention")}</Modal.Title>
          </Modal.Header>
          <Modal.Body><p>{biosName}</p></Modal.Body>
          <Modal.Footer>
            <Button onClick={this.close}>Non</Button>
            <Button bsStyle="warning" onClick={this.delete}>
              {this.state.isDeleting &&
                <Glyphicon glyph="refresh" className="glyphicon-spin" />
              } Oui
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default translate()(Bios);
