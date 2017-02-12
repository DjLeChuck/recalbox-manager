import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { LinkContainer } from 'react-router-bootstrap';
import Loader from 'react-loader';
import { translate } from 'react-i18next';
import {
  Alert, Button, Collapse, Well, Glyphicon, Panel, Row, Col,
  OverlayTrigger, Tooltip, Breadcrumb, Modal, Form, FormGroup, FormControl,
  ControlLabel
} from 'react-bootstrap';
import reactStringReplace from 'react-string-replace';
import DropzoneComponent from 'react-dropzone-component';
import PostActionButton from '../utils/PostActionButton';
import FieldGroup from '../utils/FieldGroup';
import { get, grep, post } from '../../api';

import 'react-dropzone-component/styles/filepicker.css';
import 'dropzone/dist/min/dropzone.min.css';

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
      romName: '',
      romsList: [],
      directoryListing: [],
      breadcrumb: [],
      editedGame: { releasedate: {}},
    };
    this.componentConfig = { postUrl: '/upload/roms' };
    this.handlers = {
      success: (file, result) => {
        let list = [...this.state.romsList];

        list.push(result.gameData);
        list.sort((a, b) => {
          return a.name < b.name;
        });

        this.setState({
          romsList: list,
        });
      },
      error: (file, err) => {
        console.error(file, err);
      }
    };
  }

  componentWillMount() {
    this._loadRoms(this.props.params);
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
    const editedGame = this.state.editedGame;

    if (0 === name.indexOf('releasedate.')) {
      editedGame['releasedate'][name.replace('releasedate.', '')] = target.value;
    } else {
      editedGame[name] = target.value;
    }

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
      });
    }).catch((err) => {
      console.error(err);
    });

    this.closeModal();
  }

  showEditModal = (e) => {
    e.preventDefault();

    const target = e.currentTarget;

    this.setState({
      editedGame: this.state.romsList[target.dataset.index],
      showEditModal: true,
    });
  }

  edit = () => {
    post('editRom', {
      gameData: this.state.editedGame,
      system: this.state.system,
      path: this.state.splat,
    }).then(() => {
      //
    }).catch((err) => {
      console.error(err);
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

          <Alert bsStyle="warning">
            {t("Supprimer ou modifier des ROMs nécessite qu'EmulationStation soit redémarré pour prendre en compte les modifications.")}
          </Alert>

          <Button bsStyle="primary"
            onClick={ () => this.setState({ open: !this.state.open })}>
            {t("Uploader des ROMs")}
          </Button>
          <Collapse in={this.state.open}>
            <div>
              <Well>
                <DropzoneComponent config={this.componentConfig}
                  djsConfig={this.djsConfig} eventHandlers={this.handlers} />
            </Well>
          </div>
          </Collapse>

          <br />
          <br />

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
                            <img src={rom.image} alt={rom.name}
                              className="rom-image" />
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

          <OverlayTrigger placement="left" overlay={toTopTooltip}>
            <Button bsStyle="primary" bsSize="large" className="back-to-top">
              <Glyphicon glyph="chevron-up" />
            </Button>
          </OverlayTrigger>
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

                <FieldGroup type="text" label={t('Genre')}
                  id="genre" name="genre"
                  labelColMd={3} componentColMd={9}
                  value={this.state.editedGame.genre || ''}
                  onChange={this.handleInputChange}
                />

                <FieldGroup type="text" label={t('Joueurs')}
                  id="players" name="players"
                  labelColMd={3} componentColMd={9}
                  value={this.state.editedGame.players || ''}
                  onChange={this.handleInputChange}
                />

                <FormGroup controlId="rating">
                  <Col componentClass={ControlLabel} md={3}>{t('Note')}</Col>
                  <Col md={9}>
                    <div data-rating-div></div>
                    <FormControl type="hidden" name="rating"
                      value={this.state.editedGame.rating || '0'}
                      onChange={this.handleInputChange}
                    />
                  </Col>
                </FormGroup>

                <FieldGroup type="text" label={t('Description')}
                  id="desc" name="desc"
                  labelColMd={3} componentColMd={9}
                  componentClass="textarea" rows={10}
                  value={this.state.editedGame.desc || ''}
                  onChange={this.handleInputChange}
                />
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

  _loadRoms(params) {
    const promises = [];
    const system = params.system;
    const splat = params.splat || '';
    const subpath = splat ? `${system}/${splat}` : system;

    promises.push(get('romsList', `system=${system},subpath=${splat}`));
    promises.push(get('directoryListing', `subpath=${subpath}`));
    promises.push(get('systemFullname', `system=${system}`));
    promises.push(grep(['system.api.enabled']));

    Promise.all(promises).then((values) => {
      let newState = {
        isLoaded: true,
        system: system,
        subpath: subpath,
      };

      for (const value of values) {
        Object.assign(newState, value);
      }

      let breadcrumb = [
        ['', this.props.t('Accueil')],
        ['roms', this.props.t('ROMs')],
        [system, newState.systemFullname],
      ];

      if ("" !== splat) {
        breadcrumb = breadcrumb.concat(splat.split('/'));
      }

      newState.breadcrumb = breadcrumb;

      const t = this.props.t;
      this.djsConfig = {
        dictDefaultMessage: t('Déposer des fichiers ici pour les uploader.'),
        dictResponseError: t("Erreur lors de l'upload."),
        addRemoveLinks: true,
        dictCancelUpload: t("Annuler l'upload"),
        dictCancelUploadConfirmation: t('Êtes-vous sûr de vouloir annuler cet upload ?'),
        dictRemoveFile: t('Retirer le fichier'),
        params: {
          type: 'rom',
          system: newState.system,
          path: splat,
        }
      };

      this.setState(newState);
    }).catch((err) => {
      console.error(err);
    });
  }
}

export default translate()(View);
