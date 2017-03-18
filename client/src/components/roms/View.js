import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { LinkContainer } from 'react-router-bootstrap';
import Loader from 'react-loader';
import Rating from 'react-rating';
import { translate } from 'react-i18next';
import Alert from 'react-bootstrap/lib/Alert';
import Breadcrumb from 'react-bootstrap/lib/Breadcrumb';
import Button from 'react-bootstrap/lib/Button';
import Collapse from 'react-bootstrap/lib/Collapse';
import Col from 'react-bootstrap/lib/Col';
import ControlLabel from 'react-bootstrap/lib/ControlLabel';
import Clearfix from 'react-bootstrap/lib/Clearfix';
import Form from 'react-bootstrap/lib/Form';
import FormControl from 'react-bootstrap/lib/FormControl';
import FormGroup from 'react-bootstrap/lib/FormGroup';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import Modal from 'react-bootstrap/lib/Modal';
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';
import Panel from 'react-bootstrap/lib/Panel';
import Row from 'react-bootstrap/lib/Row';
import Tooltip from 'react-bootstrap/lib/Tooltip';
import Well from 'react-bootstrap/lib/Well';
import reactStringReplace from 'react-string-replace';
import CustomDropzone from '../utils/Dropzone';
import PostActionButton from '../utils/PostActionButton';
import StickyAlert from '../utils/StickyAlert';
import ESActions from '../utils/ESActions';
import FieldGroup from '../utils/FieldGroup';
import { get, grep, post } from '../../api';
import { promisifyData, cancelPromises } from '../../utils';

class View extends React.Component {
  static propTypes = {
    t: PropTypes.func.isRequired,
    params: PropTypes.object,
  }

  constructor(props) {
    super(props);

    this.state = {
      isLoaded: false,
      showDeleteModal: false,
      showEditModal: false,
      displayBackToTop: false,
      romName: '',
      romsList: [],
      directoryListing: [],
      breadcrumb: [],
      editedGame: { releasedate: {}},
      stickyContent: null,
      stickyStyle: 'danger',
    };
  }

  componentWillMount() {
    this._loadRoms(this.props.params);
  }

  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);

    cancelPromises();
  }

  handleScroll = (event) => {
    const scrollTop = event.srcElement.body.scrollTop;

    this.setState({ displayBackToTop: (scrollTop > 50) });
  }

  componentWillReceiveProps(nextProps) {
    if (
      this.props.params.system !== nextProps.params.system ||
      this.props.params.splat !== nextProps.params.splat
    ) {
      this._loadRoms(nextProps.params);
    }
  }

  handleInputChange = (e) => {
    const target = e.target;
    const name = target.name;
    const { editedGame } = this.state;

    if (0 === name.indexOf('releasedate.')) {
      editedGame['releasedate'][name.replace('releasedate.', '')] = target.value;
    } else {
      editedGame[name] = target.value;
    }

    this.setState({ editedGame });
  }

  onUploadSuccess = (result) => {
    let list = [...this.state.romsList];

    list.push(result.gameData);
    list.sort((a, b) => {
      return a.name < b.name;
    });

    this.setState({
      romsList: list,
    });
  }

  onImageUploadSuccess = (result) => {
    const { editedGame } = this.state;
    editedGame.image = result.image;

    this.setState({ editedGame });
  }

  onRate = (rating) => {
    const { editedGame } = this.state;
    editedGame.rating = rating;

    this.setState({ editedGame });
  }

  askBeforeDelete = (e) => {
    e.preventDefault();

    const target = e.currentTarget;

    this.setState({
      romToDelete: target.dataset.name,
      romToDeletePath: target.dataset.path,
      showDeleteModal: true,
    });
  }

  delete = () => {
    const toDeletePath = this.state.romToDeletePath;

    post('deleteRom', {
      file: toDeletePath,
      system: this.state.system,
    }).then(() => {
      let list = [...this.state.romsList];
      const deletedIndex = list.findIndex((r) => r.path === toDeletePath);

      list.splice(deletedIndex, 1);

      this.setState({
        romsList: list,
        stickyContent: this.props.t("Votre ROM a bien été supprimée !"),
        stickyStyle: 'success',
      });
    }, () => {
      this.setState({
        stickyContent: this.props.t("Il semble que votre ROM n'ait pas été supprimée."),
        stickyStyle: 'danger',
      });
    });

    this.closeModal();
  }

  showEditModal = (e) => {
    e.preventDefault();

    const target = e.currentTarget;
    const editedGame = this.state.romsList[target.dataset.index];
    const { dropzoneParams } = this.state;

    dropzoneParams.gamePath = editedGame.path;

    this.setState({
      editedGame: editedGame,
      showEditModal: true,
      dropzoneParams
    });
  }

  edit = () => {
    post('editRom', {
      gameData: this.state.editedGame,
      system: this.state.system,
      path: this.state.splat,
    }).then(() => {
      this.setState({
        stickyContent: this.props.t('Les données de votre ROM ont bien été mises à jour !'),
        stickyStyle: 'success',
      });
    }, () => {
      this.setState({
        stickyContent: this.props.t("Il semble que les données de votre ROM n'aient pas été mises à jour."),
        stickyStyle: 'danger',
      });
    });

    this.closeModal();
  }

  closeModal = () => {
    this.setState({
      showDeleteModal: false,
      showEditModal: false,
    });
  }

  render() {
    const { t } = this.props;
    const toTopTooltip = <Tooltip placement="left" className="in"
      id="tooltip-left">
      {t('Cliquez pour retourner en haut de la page')}
    </Tooltip>;

    const deleteConfirmation = reactStringReplace(t('Voulez-vous vraiment supprimer %s ?'), '%s', (match, i) => (
      <strong key={i}>{this.state.romToDelete}</strong>
    ));

    // Selects de date de jeu
    let daysList = [];
    let monthsList = [];

    for (let x = 1; x < 32; x++) {
      daysList.push(
        <option key={x} value={("0" + x).slice(-2)}>
          {("0" + x).slice(-2)}
        </option>
      );
    }

    for (let x = 1; x < 13; x++) {
      monthsList.push(
        <option key={x} value={("0" + x).slice(-2)}>
          {("0" + x).slice(-2)}
        </option>
      );
    }

    // Breadcrumb
    let passedPath = [];
    let breadcrumb = <Breadcrumb>
      {this.state.breadcrumb.map((item, i) => {
        let path, name, link;
        const isLast = this.state.breadcrumb.length === (i + 1);

        if (Array.isArray(item)) {
          path = item[0];
          name = item[1];
        } else {
          path = name = item;
        }

        if (isLast) {
          link = <Breadcrumb.Item active key={i}>{name}</Breadcrumb.Item>;
        } else {
          link = <LinkContainer key={i} active={false}
            to={`${passedPath.join('/')}/${path}`}>
            <Breadcrumb.Item>{name}</Breadcrumb.Item>
          </LinkContainer>;
        }

        passedPath.push(path);

        return link;
      })}
    </Breadcrumb>;

    return (
      <div>
        <Loader loaded={this.state.isLoaded}>
          <div className="page-header">
            <h1>{t("Gestion des ROMs")} - {this.state.systemFullname} </h1>
          </div>

          {breadcrumb}

          <p>
            {t("Nombre total de ROMs :")}{' '}
            <strong>{this.state.romsList.length}</strong>
          </p>

          <StickyAlert bsStyle={this.state.stickyStyle} container={this}>
            {this.state.stickyContent}
          </StickyAlert>

          <Row>
            <Col md={6}>
              <Alert bsStyle="warning">
                {t("Supprimer ou ajouter des ROMs nécessite qu'EmulationStation soit redémarré pour prendre en compte les modifications.")}
              </Alert>

              <Alert bsStyle="danger">
                {t("Il faut arrêter EmulationStation avant de modifier des ROMs.")}
              </Alert>
            </Col>
            <Col md={6}>
              <ESActions />

              <Button bsStyle="primary"
                onClick={ () => this.setState({ open: !this.state.open })}>
                {t("Uploader des ROMs")}
              </Button>
              <Collapse in={this.state.open}>
                <div>
                  <Well>
                    <CustomDropzone type="roms"
                      params={this.state.dropzoneParams}
                      onSuccess={this.onUploadSuccess}
                    />
                </Well>
              </div>
              </Collapse>
            </Col>
          </Row>

          {this.state.directoryListing &&
            <Row>
              {this.state.directoryListing.map((directory, index) => {
                return (
                  <Col key={index} sm={6} md={3}>
                    <Panel className="text-center"
                      footer={
                        <Link to={`/roms/${this.state.subpath}/${directory}`}>
                          {directory}
                        </Link>
                    }>
                      <Link to={`/roms/${this.state.subpath}/${directory}`}>
                        <Glyphicon glyph="folder-open"
                          className="big-glyphicon" />
                      </Link>
                    </Panel>
                  </Col>
                );
              })}
            </Row>
          }

          {this.state.romsList &&
            <Row>
              {this.state.romsList.map((rom, index) => {
                return (
                  <Col key={index} sm={6} md={3}>
                    <Panel footer={<strong>{rom.name}</strong>}>
                      <Row className="text-center">
                        <Col md={7} lg={9}>
                          {rom.image &&
                            <img src={`/viewer/roms/${rom.image}`} alt={rom.name}
                              className="img-responsive img-thumbnail" />
                          }
                          {!rom.image &&
                            <Glyphicon glyph="picture"
                              className="big-glyphicon rom-image" />
                          }
                        </Col>

                        <Col md={5} lg={3} className="center-block">
                          {1 === parseInt(this.state['system.api.enabled'], 10) &&
                            <PostActionButton bsStyle="success" hideContentOnAction
                              action="launch-rom"
                              body={{file: rom.path}}>
                              <Glyphicon glyph="play" />
                            </PostActionButton>
                          }
                          <Button bsStyle="danger" data-name={rom.name}
                            data-path={rom.path}
                            onClick={this.askBeforeDelete}>
                            <Glyphicon glyph="trash" />
                          </Button>
                          <Button bsStyle="primary" onClick={this.showEditModal}
                            data-index={index}>
                            <Glyphicon glyph="pencil" />
                          </Button>
                        </Col>
                      </Row>
                    </Panel>
                  </Col>
                );
              })}
            </Row>
          }

          {this.state.displayBackToTop &&
            <OverlayTrigger placement="left" overlay={toTopTooltip}>
              <Button bsStyle="primary" bsSize="large" className="back-to-top"
                onClick={() => window.scrollTo(0, 0) }>
                <Glyphicon glyph="chevron-up" />
              </Button>
            </OverlayTrigger>
          }
        </Loader>

        <Modal show={this.state.showDeleteModal} onHide={this.closeModal}>
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
              <Button bsStyle="warning" onClick={this.delete}>
                {t("Oui")}
              </Button>
            </div>
          </div>
        </Modal>

        <Modal show={this.state.showEditModal} onHide={this.closeModal}>
          <div>
            <div className="modal-header">
              <Button className="close" onClick={this.closeModal}>
                <span aria-hidden="true">&times;</span>
              </Button>
              <h4 className="modal-title">
                <strong>{this.state.editedGame.name}</strong>
              </h4>
            </div>
            <div className="modal-body">
              <Form horizontal>
                <Col md={4}>
                  {this.state.editedGame.image &&
                    <img src={`/viewer/roms/${this.state.editedGame.image}`}
                      alt={this.state.editedGame.name}
                      style={{ marginBottom: 10 }}
                      className="img-responsive img-thumbnail" />
                  }
                  {!this.state.editedGame.image &&
                    <Glyphicon glyph="picture"
                      className="big-glyphicon rom-image" />
                  }

                  <div className="dropzone-image-upload">
                    <CustomDropzone type="romImage"
                      params={this.state.dropzoneParams}
                      onSuccess={this.onImageUploadSuccess}
                      dropLabel={t('Nouvelle image')}
                    />
                  </div>
                </Col>
                <Col md={8}>
                  <FieldGroup type="text" label={t('Nom')}
                    id="name" name="name"
                    labelColMd={3} componentColMd={9}
                    value={this.state.editedGame.name || ''}
                    onChange={this.handleInputChange}
                  />

                  <FieldGroup type="text" label={t('Éditeur')}
                    id="publisher" name="publisher"
                    labelColMd={3} componentColMd={9}
                    value={this.state.editedGame.publisher || ''}
                    onChange={this.handleInputChange}
                  />

                  <FieldGroup type="text" label={t('Développeur')}
                    id="developer" name="developer"
                    labelColMd={3} componentColMd={9}
                    value={this.state.editedGame.developer || ''}
                    onChange={this.handleInputChange}
                  />
                </Col>

                <Col md={12}>
                  <FormGroup>
                    <Row>
                      <Col componentClass={ControlLabel} md={3}>
                        {t('Date de sortie')}
                      </Col>
                      <Col md={9}>
                        <Col xs={3}>
                          <FormControl componentClass="select"
                            id="releasedate-day" name="releasedate.day"
                            value={this.state.editedGame.releasedate.day || '00'}
                            onChange={this.handleInputChange}>
                            <option value="00">{t('Jour')}</option>
                            {daysList}
                          </FormControl>
                        </Col>
                        <Col xs={4}>
                          <FormControl componentClass="select"
                            id="releasedate-month" name="releasedate.month"
                            value={this.state.editedGame.releasedate.month || '00'}
                            onChange={this.handleInputChange}>
                            <option value="00">{t('Mois')}</option>
                            {monthsList}
                          </FormControl>
                        </Col>
                        <Col xs={5}>
                          <FormControl type="number" placeholder={t('Année')}
                            id="releasedate-year" name="releasedate.year"
                            value={this.state.editedGame.releasedate.year || '0000'}
                            onChange={this.handleInputChange}
                          />
                        </Col>
                      </Col>
                    </Row>
                  </FormGroup>
                </Col>

                <Col md={6}>
                  <FieldGroup type="text" label={t('Genre')}
                    id="genre" name="genre"
                    labelColMd={3} componentColMd={9}
                    value={this.state.editedGame.genre || ''}
                    onChange={this.handleInputChange}
                  />
                </Col>
                <Col md={6}>
                  <FieldGroup type="text" label={t('Joueurs')}
                    id="players" name="players"
                    labelColMd={3} componentColMd={9}
                    value={this.state.editedGame.players || ''}
                    onChange={this.handleInputChange}
                  />
                </Col>

                <Col md={12}>
                  <FormGroup controlId="rating">
                    <Col componentClass={ControlLabel} md={3}>{t('Note')}</Col>
                    <Col md={9}>
                      <Rating stop={1} step={.2} fractions={2}
                        initialRate={parseFloat(this.state.editedGame.rating)}
                        empty="glyphicon glyphicon-star-empty big-glyphicon rating"
                        full="glyphicon glyphicon-star big-glyphicon rating"
                        onClick={this.onRate} />
                    </Col>
                  </FormGroup>
                </Col>

                <Col md={12}>
                  <FieldGroup type="text" label={t('Description')}
                    id="desc" name="desc"
                    labelColMd={3} componentColMd={9}
                    componentClass="textarea" rows={10}
                    value={this.state.editedGame.desc || ''}
                    onChange={this.handleInputChange}
                  />
                </Col>
                <Clearfix />
              </Form>
            </div>
            <div className="modal-footer">
              <Button bsStyle="default" onClick={this.closeModal}>
                {t('Fermer')}
              </Button>
              <Button bsStyle="primary" onClick={this.edit}>
                {t('Valider')}
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    );
  }

  async _loadRoms(params) {
    const system = params.system;
    const splat = params.splat || '';
    const subpath = splat ? `${system}/${splat}` : system;
    const state = await promisifyData(
      get('romsList', `system=${system},subpath=${splat}`),
      get('directoryListing', `subpath=${subpath}`),
      get('systemFullname', `system=${system}`),
      grep(['system.api.enabled'])
    );

    state.isLoaded = true;
    state.system = system;
    state.subpath = subpath;

    let breadcrumb = [
      ['', this.props.t('Accueil')],
      ['roms', this.props.t('ROMs')],
      [system, state.systemFullname],
    ];

    if ("" !== splat) {
      breadcrumb = breadcrumb.concat(splat.split('/'));
    }

    state.breadcrumb = breadcrumb;
    state.dropzoneParams = {
      system: state.system,
      path: splat,
    };

    this.setState(state);
  }
}

export default translate()(View);
