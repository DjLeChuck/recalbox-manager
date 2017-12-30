import React from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import Button from 'react-bootstrap/lib/Button';
import Col from 'react-bootstrap/lib/Col';
import Glyphicon from 'react-bootstrap/lib/Glyphicon';
import Panel from 'react-bootstrap/lib/Panel';
import Row from 'react-bootstrap/lib/Row';
import PostActionButton from '../utils/PostActionButton';
import StickyAlert from '../utils/StickyAlert';
import ESActions from '../utils/ESActions/Container';

let stickyContainer;

const renderLink = (item, index) => (
  <li key={index}>{item.label} <a href={item.link}>{item.link}</a></li>
);

const Help = ({
  t,
  stickyContent,
  links,
  supportSentence,
  callSupport,
  callingSupport,
  downloadUrl,
}) => (
  <div ref={el => stickyContainer = el}>
    <div className="page-header">
      <h1>{t("Dépannage")}</h1>
    </div>

    <StickyAlert bsStyle="danger" container={stickyContainer}>
      {stickyContent}
    </StickyAlert>

    <p>{t("Pour toute demandes générales, techniques ou besoin d'aide, vous avez plusieurs choix :")}</p>

    <ul>
      {links.map(renderLink)}
    </ul>

    <br />

    <Panel header={<h3>{t("Exécution de recalbox-support.sh")}</h3>}>
      <p>{supportSentence}</p>
      <p>{t("Vous obtiendrez alors un lien de téléchargement qu'il vous suffira de copier / coller sur le forum.")}</p>

      <p>
        <Button bsStyle="success" onClick={callSupport}>
          {callingSupport &&
            <Glyphicon glyph="refresh" className="glyphicon-spin" />
          } {t("Exécuter le script")}
        </Button>
      </p>

      {downloadUrl &&
        <p>
          {t('Lien de téléchargement à donner :')}{' '}
          <a href={downloadUrl} target="_blank">{downloadUrl}</a>
        </p>
      }
    </Panel>

    <Row>
      <Col md={6}>
        <ESActions />
      </Col>
      <Col md={6}>
        <Panel bsStyle="danger"
          header={<h3>{t("Redémarrage et arrêt du système")}</h3>}>
          <PostActionButton bsStyle="warning" action="reboot-os">
            {t('Redémarer le système')}
          </PostActionButton>{' '}

          <PostActionButton bsStyle="danger" action="shutdown-os">
            {t('Arrêter le système')}
          </PostActionButton>
        </Panel>
      </Col>
      <Col md={6}>
        <Panel
          header={<h3>{t("Activer / désactiver l'écran")}</h3>}>
          <PostActionButton bsStyle="success" action="screen-on">
            {t('Allumer l\'écran')}
          </PostActionButton>

          <PostActionButton bsStyle="warning" action="screen-off">
            {t('Eteindre l\'écran')}
          </PostActionButton>{' '}
        </Panel>
      </Col>
    </Row>
  </div>
);

Help.propTypes = {
  t: PropTypes.func.isRequired,
  stickyContent: PropTypes.string,
  links: PropTypes.array.isRequired,
  supportSentence: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.array,
  ]).isRequired,
  callSupport: PropTypes.func.isRequired,
  callingSupport: PropTypes.bool.isRequired,
  downloadUrl: PropTypes.string,
};

Help.defaultProps = {
  callingSupport: false,
  callSupport: () => {},
};

export default translate()(Help);
