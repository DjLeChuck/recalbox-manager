import React from 'react';
import PropTypes from 'prop-types';
import Loader from 'react-loader';
import { translate } from 'react-i18next';
import reactStringReplace from 'react-string-replace';
import Button from 'react-bootstrap/lib/Button';
import Col from 'react-bootstrap/lib/Col';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import Panel from 'react-bootstrap/lib/Panel';
import Row from 'react-bootstrap/lib/Row';
import StickyAlert from '../utils/StickyAlert';
import TakeScreenshot from './takeButton/Container';

let stickyContainer;

const renderScreenshot = (screenshot, index, hostname, onDelete) => (
  <Col key={index} md={3} xs={6}>
    <Panel>
      <div className="pull-left relative text-center">
        <div className="top-right">
          <Button bsStyle="danger" bsSize="small"
            data-name={screenshot}
            onClick={() => onDelete(screenshot)}>
            <Glyphicon glyph="trash" />
          </Button><br />

          <a href={`//${hostname}/viewer/screenshots/${screenshot}`}
            target="_blank" className="btn btn-success btn-sm">
            <Glyphicon glyph="search" />
          </a>
        </div>

        <img src={`/viewer/screenshots/${screenshot}`}
          alt={screenshot} className="img-responsive img-thumbnail" />
      </div>
    </Panel>
  </Col>
);

const Screenshots = ({
  t,
  loaded,
  stickyStyle,
  stickyContent,
  screenshotsPath,
  screenshotsList,
  canTakeScreenshots,
  hostname,
  onDelete,
  screenshotOnSuccess,
  screenshotOnError,
}) => {
  const screenshotsPathStr = reactStringReplace(t('Le résultat sera sauvegardé dans le dossier %s.'), '%s', (match, i) => (
    <code key={i}>{screenshotsPath}</code>
  ));

  return (
    <div ref={el => stickyContainer = el}>
      <div className="page-header">
        <h1>{t("Gestion des screenshots")}</h1>
      </div>

      <StickyAlert bsStyle={stickyStyle} container={stickyContainer}>
        {stickyContent}
      </StickyAlert>

      {canTakeScreenshots &&
        <Panel header={<h3>{t("Effectuer une capture d'écran")}</h3>}>
          <p>{t("Le bouton ci-dessous vous permet de prendre une capture d'écran de l'affichage actuel de recalbox.")}</p>
          <p>{screenshotsPathStr}</p>

          <p>
            <TakeScreenshot onSuccess={screenshotOnSuccess}
              onError={screenshotOnError} />
          </p>
        </Panel>
      }

      <Loader loaded={loaded}>
        <Row className="is-flex">
          {screenshotsList.map(
            (screenshot, index) => renderScreenshot(
              screenshot, index, hostname, onDelete
            )
          )}
        </Row>
      </Loader>
    </div>
  );
};

Screenshots.propTypes = {
  t: PropTypes.func.isRequired,
  loaded: PropTypes.bool.isRequired,
  stickyStyle: PropTypes.string,
  stickyContent: PropTypes.string,
  screenshotsPath: PropTypes.string,
  screenshotsList: PropTypes.array.isRequired,
  canTakeScreenshots: PropTypes.bool.isRequired,
  hostname: PropTypes.string,
  onDelete: PropTypes.func.isRequired,
  screenshotOnSuccess: PropTypes.func.isRequired,
  screenshotOnError: PropTypes.func.isRequired,
};

Screenshots.defaultProps = {
  canTakeScreenshots: false,
  onDelete: () => {},
  screenshotOnSuccess: () => {},
  screenshotOnError: () => {},
};

export default translate()(Screenshots);
