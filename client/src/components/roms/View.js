import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { LinkContainer } from 'react-router-bootstrap';
import Loader from 'react-loader';
import { translate } from 'react-i18next';
import {
  Alert, Button, Collapse, Well, Glyphicon, Panel, Row, Col,
  OverlayTrigger, Tooltip, Breadcrumb
} from 'react-bootstrap';
import DropzoneComponent from 'react-dropzone-component';
import { get, grep } from '../../api';

class View extends React.Component {
  static propTypes = {
    t: PropTypes.func.isRequired,
    params: PropTypes.object,
  }

  constructor(props) {
    super(props);

    this.name = '';
    this.state = {
      isLoaded: false,
      isDeleting: false,
      showModal: false,
      romName: '',
      romsList: [],
      directoryListing: [],
      breadcrumb: [],
    };
    this.componentConfig = { postUrl: '/upload/roms' };
    this.handlers = {
      success: (file, result) => {
        console.log(result);
        // if (result.name) {
        //   delete result.success;
        //
        //   let romIndex = this.state.biosList.findIndex((item) => {
        //     return item.name === result.name;
        //   });
        //   const list = [...this.state.biosList];
        //   list[romIndex] = result;
        //
        //   this.setState({ romsList: list });
        // }
      },
      error: (file, err) => {
        console.error(file, err);
      }
    };
    const t = this.props.t;
    this.djsConfig = {
      dictDefaultMessage: t('Déposer des fichiers ici pour les uploader.'),
      dictResponseError: t("Erreur lors de l'upload."),
      addRemoveLinks: true,
      dictCancelUpload: t("Annuler l'upload"),
      dictCancelUploadConfirmation: t('Êtes-vous sûr de vouloir annuler cet upload ?'),
      dictRemoveFile: t('Retirer le fichier'),
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

  render() {
    const { t } = this.props;
    const toTopTooltip = <Tooltip placement="left" className="in"
      id="tooltip-left">
      {t('Cliquez pour retourner en haut de la page')}
    </Tooltip>;
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
                              <Button bsStyle="success">
                                <Glyphicon glyph="refresh"
                                  className="glyphicon-spin" />
                                <Glyphicon glyph="play" />
                              </Button>
                            }
                            <Button bsStyle="danger">
                              <Glyphicon glyph="trash" />
                            </Button>
                            <Button bsStyle="primary">
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

      this.setState(newState);
    }).catch((err) => {
      console.error(err);
    });
  }
}

export default translate()(View);
