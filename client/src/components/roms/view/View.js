import React from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import { Link } from 'react-router';
import { LinkContainer } from 'react-router-bootstrap';
import Loader from 'react-loader';
import Alert from 'react-bootstrap/lib/Alert';
import Breadcrumb from 'react-bootstrap/lib/Breadcrumb';
import Button from 'react-bootstrap/lib/Button';
import Col from 'react-bootstrap/lib/Col';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import OverlayTrigger from 'react-bootstrap/lib/OverlayTrigger';
import Panel from 'react-bootstrap/lib/Panel';
import Row from 'react-bootstrap/lib/Row';
import Tooltip from 'react-bootstrap/lib/Tooltip';
import PostActionButton from '../../utils/PostActionButton';
import ESActions from '../../utils/ESActions/Container';
import StickyAlert from '../../utils/StickyAlert';
import RomsBulkDelete from '../bulkDelete/Container';
import RomsDelete from '../delete/Container';
import RomsEdit from '../edit/Container';
import RomsUpload from '../upload/Container';

const RomsView = ({
  t,
  loaded,
  stickyStyle,
  stickyContent,
  breadcrumb,
  systemFullname,
  romsList,
  directoryListing,
  subpath,
  displayBackToTop,
  apiEnabled,
  system,
  splat,
  onUploadSuccess,
  onEditSuccess,
  onEditError,
  onDeleteSuccess,
  onDeleteError,
  onBulkDeleteSuccess,
  onBulkDeleteError,
  onImageUpload,
  onBulkDeleteClick,
  bulkList,
}) => {
  let stickyContainer;

  // Breadcrumb
  const passedPath = [];
  const renderedBreadcrumb = <Breadcrumb>
    {breadcrumb.map((item, i) => {
      let path, name, link;
      const isLast = breadcrumb.length === (i + 1);

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
    <Loader loaded={loaded} ref={el => stickyContainer = el}>
      <div className="page-header">
        <h1>{t('Gestion des ROMs')} - {systemFullname} </h1>
      </div>

      {renderedBreadcrumb}

      <p>
        {t('Nombre total de ROMs :')}{' '}
        <strong>{romsList.length}</strong>
      </p>

      <StickyAlert bsStyle={stickyStyle} container={stickyContainer}>
        {stickyContent}
      </StickyAlert>

      <Row>
        <Col md={6}>
          <Alert bsStyle="warning">
            {t("Supprimer ou ajouter des ROMs nécessite qu'EmulationStation soit redémarré pour prendre en compte les modifications.")}
          </Alert>

          <Alert bsStyle="danger">
            {t('Il faut arrêter EmulationStation avant de modifier des ROMs.')}
          </Alert>
        </Col>
        <Col md={6}>
          <ESActions />

          <RomsUpload onSuccess={onUploadSuccess} dzParams={{
            path: splat,
            system,
          }} />

          <RomsBulkDelete list={bulkList} system={system}
            onSuccess={onBulkDeleteSuccess} onError={onBulkDeleteError} />
        </Col>
      </Row>

      {directoryListing &&
        <Row>
          {directoryListing.map((directory, index) => (
            <Col key={index} sm={6} md={3}>
              <Panel className="text-center" footer={
                <Link to={`/roms/${subpath}/${directory}`}>
                  {directory}
                </Link>
              }>
                <Link to={`/roms/${subpath}/${directory}`}>
                  <Glyphicon glyph="folder-open" className="big-glyphicon" />
                </Link>
              </Panel>
            </Col>
          ))}
        </Row>
      }

      {romsList &&
        <Row>
          {romsList.map((rom, index) => {
            const { name, image, path } = rom;

            return (
              <Col key={index} sm={6} md={3}>
                <Panel footer={
                  <div className="checkbox checkbox-primary">
                    <input type="checkbox" id={`rom-${index}`}
                      onClick={e => onBulkDeleteClick(e.target.checked, path)}
                    />
                    <label htmlFor={`rom-${index}`}>
                      <strong>{name}</strong>
                    </label>
                  </div>
                }>
                  <Row className="text-center">
                    <Col md={7} lg={9}>
                      {image &&
                        <img src={`/viewer/roms/${image}`} alt={name}
                          className="img-responsive img-thumbnail" />
                      }
                      {!image &&
                        <Glyphicon glyph="picture"
                          className="big-glyphicon rom-image" />
                      }
                    </Col>

                    <Col md={5} lg={3} className="center-block">
                      {apiEnabled &&
                        <PostActionButton bsStyle="success" hideContentOnAction
                          action="launch-rom" body={{ file: path }}>
                          <Glyphicon glyph="play" />
                        </PostActionButton>
                      }
                      <RomsDelete rom={rom} system={system}
                        onSuccess={onDeleteSuccess} onError={onDeleteError} />
                      <RomsEdit rom={rom} system={system}
                        onSuccess={onEditSuccess} onError={onEditError}
                        onImageUpload={onImageUpload} dzParams={{
                          path: splat,
                          gamePath: path,
                          system,
                        }}
                      />
                    </Col>
                  </Row>
                </Panel>
              </Col>
            );
          })}
        </Row>
      }

      {displayBackToTop &&
        <OverlayTrigger placement="left" overlay={
          <Tooltip placement="left" className="in"
            id="tooltip-left">
            {t('Cliquez pour retourner en haut de la page')}
          </Tooltip>
        }>
          <Button bsStyle="primary" bsSize="large" className="back-to-top"
            onClick={() => window.scrollTo(0, 0) }>
            <Glyphicon glyph="chevron-up" />
          </Button>
        </OverlayTrigger>
      }
    </Loader>
  );
};

RomsView.propTypes = {
  t: PropTypes.func.isRequired,
  loaded: PropTypes.bool.isRequired,
  stickyStyle: PropTypes.string,
  stickyContent: PropTypes.string,
  breadcrumb: PropTypes.array.isRequired,
  systemFullname: PropTypes.string,
  romsList: PropTypes.array.isRequired,
  directoryListing: PropTypes.array.isRequired,
  subpath: PropTypes.string,
  displayBackToTop: PropTypes.bool.isRequired,
  apiEnabled: PropTypes.bool.isRequired,
  system: PropTypes.string,
  splat: PropTypes.string,
  onUploadSuccess: PropTypes.func,
  onEditSuccess: PropTypes.func,
  onEditError: PropTypes.func,
  onDeleteSuccess: PropTypes.func,
  onDeleteError: PropTypes.func,
  onBulkDeleteSuccess: PropTypes.func,
  onBulkDeleteError: PropTypes.func,
  onImageUpload: PropTypes.func,
  onBulkDeleteClick: PropTypes.func,
  bulkList: PropTypes.array,
};

RomsView.defaultProps = {
  apiEnabled: false,
};

export default translate()(RomsView);
